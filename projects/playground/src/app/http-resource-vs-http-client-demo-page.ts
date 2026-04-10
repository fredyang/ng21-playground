import { AsyncPipe } from '@angular/common';
import { HttpClient, httpResource } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, map, of, startWith, switchMap } from 'rxjs';

interface DemoUser {
  readonly id: number;
  readonly name: string;
  readonly role: string;
  readonly focus: string;
}

interface HttpClientViewState {
  readonly loading: boolean;
  readonly users: readonly DemoUser[];
  readonly error: string | null;
}

type Dataset = 'alpha' | 'beta';

@Component({
  selector: 'app-http-resource-vs-http-client-demo-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, RouterLink],
  template: `
    <main
      class="min-h-dvh bg-[radial-gradient(circle_at_top_left,#dcfce7_0,transparent_22%),linear-gradient(180deg,#f7fff9_0%,#ffffff_24%,#f8fafc_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8"
    >
      <div class="mx-auto max-w-6xl">
        <div class="mb-6 flex items-center justify-between gap-4">
          <a
            routerLink="/"
            class="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100"
          >
            Back to demo index
          </a>
          <span
            class="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700"
          >
            /demo/http-resource-vs-http-client
          </span>
        </div>

        <section
          class="rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_28px_90px_-40px_rgba(15,23,42,0.35)] backdrop-blur lg:p-10"
        >
          <div
            class="grid gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(21rem,0.88fr)] lg:items-start"
          >
            <div>
              <div
                class="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700"
              >
                Angular HTTP APIs
              </div>
              <h1
                class="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.08em] text-slate-950 sm:text-5xl lg:text-[3.45rem] lg:leading-[0.94]"
              >
                <span class="text-emerald-600">httpResource</span> vs
                <span class="text-sky-600">HttpClient</span>
              </h1>
              <p class="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Both use the same HTTP backend. The difference is orchestration:
                <strong>httpResource</strong> fetches eagerly when reactive inputs change, while
                <strong>HttpClient</strong> starts only when your code subscribes.
              </p>

              <div class="mt-8 grid gap-4 sm:grid-cols-3">
                <article class="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Resource model
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    Gives status and data as signals: loading, error, hasValue, and value.
                  </p>
                </article>
                <article class="rounded-2xl border border-sky-200 bg-sky-50/70 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                    Observable model
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    Full control over when requests start, retry, debounce, and cancellation.
                  </p>
                </article>
                <article class="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                    Mutation note
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    Keep writes like POST and PUT on HttpClient; resource is best for reactive
                    reads.
                  </p>
                </article>
              </div>
            </div>

            <aside class="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Shared controls
              </p>
              <p class="mt-3 text-lg font-semibold tracking-[-0.03em] text-slate-950">
                Active dataset: {{ dataset().toUpperCase() }}
              </p>
              <p class="mt-2 text-sm leading-6 text-slate-600">
                Switch the dataset to see httpResource refetch automatically while HttpClient waits
                for explicit action.
              </p>

              <div class="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  class="rounded-full border px-4 py-2 text-sm font-medium transition-colors"
                  [class.border-emerald-300]="dataset() === 'alpha'"
                  [class.bg-emerald-100]="dataset() === 'alpha'"
                  [class.text-emerald-900]="dataset() === 'alpha'"
                  [class.border-slate-300]="dataset() !== 'alpha'"
                  [class.bg-white]="dataset() !== 'alpha'"
                  [class.text-slate-700]="dataset() !== 'alpha'"
                  (click)="setDataset('alpha')"
                >
                  Dataset alpha
                </button>
                <button
                  type="button"
                  class="rounded-full border px-4 py-2 text-sm font-medium transition-colors"
                  [class.border-emerald-300]="dataset() === 'beta'"
                  [class.bg-emerald-100]="dataset() === 'beta'"
                  [class.text-emerald-900]="dataset() === 'beta'"
                  [class.border-slate-300]="dataset() !== 'beta'"
                  [class.bg-white]="dataset() !== 'beta'"
                  [class.text-slate-700]="dataset() !== 'beta'"
                  (click)="setDataset('beta')"
                >
                  Dataset beta
                </button>
              </div>

              <div class="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Request count
                </p>
                <p class="mt-2 text-sm text-slate-700">httpResource: {{ resourceRequests() }}</p>
                <p class="mt-1 text-sm text-slate-700">HttpClient: {{ clientRequests() }}</p>
              </div>
            </aside>
          </div>

          <section class="mt-8 grid gap-5 xl:grid-cols-2">
            <article class="rounded-[1.75rem] border border-emerald-200 bg-emerald-50/70 p-5">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    httpResource
                  </p>
                  <h2 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                    Reactive and eager
                  </h2>
                </div>
                <span
                  class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700"
                >
                  Auto-fetch
                </span>
              </div>
              <p class="mt-4 text-sm leading-6 text-slate-700">
                The resource tracks the dataset signal in its request factory. When dataset changes,
                it cancels in-flight work and issues a new request.
              </p>

              <div class="mt-5 rounded-2xl border border-emerald-200 bg-white p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Status
                </p>
                @if (usersResource.isLoading()) {
                  <p class="mt-2 text-sm font-medium text-emerald-700">
                    Loading from {{ resourceUrl() }}
                  </p>
                } @else if (usersResource.error()) {
                  <p class="mt-2 text-sm font-medium text-rose-700">{{ usersResource.error() }}</p>
                } @else if (usersResource.hasValue()) {
                  <p class="mt-2 text-sm font-medium text-emerald-700">
                    Loaded {{ usersResource.value().length }} users from {{ resourceUrl() }}
                  </p>
                }
              </div>

              <div class="mt-4 space-y-2">
                @if (usersResource.hasValue()) {
                  @for (user of usersResource.value(); track user.id) {
                    <div class="rounded-2xl border border-emerald-200 bg-white p-3">
                      <p class="text-sm font-semibold text-slate-950">{{ user.name }}</p>
                      <p class="mt-1 text-sm text-slate-600">{{ user.role }} · {{ user.focus }}</p>
                    </div>
                  }
                }
              </div>
            </article>

            <article class="rounded-[1.75rem] border border-sky-200 bg-sky-50/70 p-5">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                    HttpClient
                  </p>
                  <h2 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                    Explicit subscription boundary
                  </h2>
                </div>
                <span class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-sky-700">
                  Manual fetch
                </span>
              </div>
              <p class="mt-4 text-sm leading-6 text-slate-700">
                This stream only requests when you click Reload HttpClient data. It demonstrates the
                lazy Observable behavior from HttpClient.
              </p>

              <div class="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  class="inline-flex items-center rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  (click)="reloadClientData()"
                >
                  Reload HttpClient data
                </button>
                <p class="text-sm text-slate-600">Current URL: {{ resourceUrl() }}</p>
              </div>

              @if (clientState$ | async; as state) {
                <div class="mt-5 rounded-2xl border border-sky-200 bg-white p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Status
                  </p>
                  @if (state.loading) {
                    <p class="mt-2 text-sm font-medium text-sky-700">Loading...</p>
                  } @else if (state.error) {
                    <p class="mt-2 text-sm font-medium text-rose-700">{{ state.error }}</p>
                  } @else {
                    <p class="mt-2 text-sm font-medium text-sky-700">
                      Loaded {{ state.users.length }} users from explicit fetch
                    </p>
                  }
                </div>

                <div class="mt-4 space-y-2">
                  @for (user of state.users; track user.id) {
                    <div class="rounded-2xl border border-sky-200 bg-white p-3">
                      <p class="text-sm font-semibold text-slate-950">{{ user.name }}</p>
                      <p class="mt-1 text-sm text-slate-600">{{ user.role }} · {{ user.focus }}</p>
                    </div>
                  }
                </div>
              }
            </article>
          </section>

          <section class="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Comparison summary
            </p>
            <p class="mt-3 text-sm leading-7 text-slate-700">{{ summary() }}</p>
          </section>
        </section>
      </div>
    </main>
  `,
})
export class HttpResourceVsHttpClientDemoPage {
  readonly dataset = signal<Dataset>('alpha');
  readonly reloadTick = signal(0);
  readonly resourceRequests = signal(0);
  readonly clientRequests = signal(0);
  readonly resourceUrl = computed(() => `/http-users-${this.dataset()}.json`);

  readonly usersResource = httpResource<readonly DemoUser[]>(() => this.resourceUrl());

  readonly clientState$ = toObservable(this.reloadTick).pipe(
    switchMap((tick) => {
      if (tick === 0) {
        return of<HttpClientViewState>({
          loading: false,
          users: this.lastClientUsers(),
          error: null,
        });
      }

      this.clientRequests.update((value) => value + 1);
      return this.httpClient.get<readonly DemoUser[]>(this.resourceUrl()).pipe(
        map(
          (users): HttpClientViewState => ({
            loading: false,
            users,
            error: null,
          }),
        ),
        startWith({
          loading: true,
          users: this.lastClientUsers(),
          error: null,
        }),
        catchError((error: unknown) =>
          of({
            loading: false,
            users: this.lastClientUsers(),
            error: this.describeError(error),
          }),
        ),
      );
    }),
  );

  readonly summary = computed(() => {
    const resourceSide = `httpResource requests: ${this.resourceRequests()}`;
    const clientSide = `HttpClient requests: ${this.clientRequests()}`;
    return `${resourceSide}. ${clientSide}. Resource refetches on dataset change; HttpClient waits for explicit reload.`;
  });

  private readonly httpClient = inject(HttpClient);
  private readonly lastClientUsers = signal<readonly DemoUser[]>([]);
  private readonly lastClientState = toSignal(this.clientState$, {
    initialValue: {
      loading: true,
      users: [] as readonly DemoUser[],
      error: null,
    },
  });

  constructor() {
    let previousLoading = false;
    effect(() => {
      const loading = this.usersResource.isLoading();
      if (loading && !previousLoading) {
        this.resourceRequests.update((value) => value + 1);
      }
      previousLoading = loading;
    });

    effect(() => {
      const state = this.lastClientState();
      if (!state.loading && state.error === null) {
        this.lastClientUsers.set(state.users);
      }
    });
  }

  setDataset(value: Dataset): void {
    this.dataset.set(value);
  }

  reloadClientData(): void {
    this.reloadTick.update((value) => value + 1);
  }

  private describeError(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return 'Request failed';
  }
}
