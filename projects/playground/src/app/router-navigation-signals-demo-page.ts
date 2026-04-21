import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Navigation, Router, RouterLink } from '@angular/router';
import { map, startWith } from 'rxjs';

type DemoPane = 'overview' | 'metrics' | 'activity';

interface PaneOption {
  id: DemoPane;
  label: string;
  accent: string;
  summary: string;
}

interface NavigationSummary {
  id: number;
  trigger: string;
  sourceUrl: string;
  targetUrl: string;
  extrasStateKeys: string;
}

const paneOptions: readonly PaneOption[] = [
  {
    id: 'overview',
    label: 'Overview pane',
    accent: 'text-cyan-600',
    summary: 'Shallow same-route navigation with a compact state payload.',
  },
  {
    id: 'metrics',
    label: 'Metrics pane',
    accent: 'text-emerald-600',
    summary: 'A second URL target shows how the latest successful navigation updates.',
  },
  {
    id: 'activity',
    label: 'Activity pane',
    accent: 'text-fuchsia-600',
    summary: 'Another same-route navigation with different state and fragment values.',
  },
];

@Component({
  selector: 'app-router-navigation-signals-demo-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <main
      class="min-h-dvh bg-[radial-gradient(circle_at_top_left,#dbeafe_0,transparent_24%),linear-gradient(180deg,#f0f9ff_0%,#ffffff_28%,#f8fafc_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8"
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
            class="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700"
          >
            /demo/router-navigation-signals
          </span>
        </div>

        <section
          class="rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_28px_90px_-40px_rgba(15,23,42,0.35)] backdrop-blur lg:p-10"
        >
          <div class="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)] lg:items-start">
            <div>
              <div
                class="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700"
              >
                Router signals
              </div>
              <h1
                class="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.08em] text-slate-950 sm:text-5xl lg:text-[3.55rem] lg:leading-[0.94]"
              >
                Inspect <span class="text-cyan-600">currentNavigation</span> and
                <span class="text-sky-600">lastSuccessfulNavigation</span>
              </h1>
              <p class="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                This demo keeps the same component mounted and navigates by changing query params.
                That makes it easy to watch the router signals update for an in-flight navigation
                and compare them with the most recent successful one.
              </p>

              <div class="mt-8 grid gap-4 sm:grid-cols-3">
                <article class="rounded-2xl border border-cyan-200 bg-cyan-50/70 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                    currentNavigation
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    Non-null only while the router is actively processing a navigation. It resets to
                    <span class="font-semibold text-slate-900">null</span> once navigation finishes.
                  </p>
                </article>
                <article class="rounded-2xl border border-sky-200 bg-sky-50/70 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                    lastSuccessfulNavigation
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    Holds onto the latest completed navigation so you can inspect what most recently
                    won after the router goes idle.
                  </p>
                </article>
                <article class="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Signal-friendly logging
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    The page samples each non-null current navigation so you can inspect the
                    transient value after it has already cleared.
                  </p>
                </article>
              </div>
            </div>

            <aside class="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Demo controls
              </p>
              <p class="mt-3 text-lg font-semibold tracking-[-0.03em] text-slate-950">
                {{ activePane().label }}
              </p>
              <p class="mt-2 text-sm leading-6 text-slate-600">
                {{ activePane().summary }}
              </p>

              <div class="mt-5 flex flex-wrap gap-2">
                @for (pane of panes; track pane.id) {
                  <button
                    type="button"
                    class="rounded-full border px-4 py-2 text-sm font-medium transition-colors"
                    [class]="
                      selectedPane() === pane.id
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-100'
                    "
                    (click)="goToPane(pane)"
                  >
                    {{ pane.label }}
                  </button>
                }
              </div>

              <div class="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Current URL
                </p>
                <p class="mt-2 break-all text-sm font-medium text-slate-900">{{ currentUrl() }}</p>
              </div>

              <div class="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  What to notice
                </p>
                <p class="mt-2 text-sm leading-6 text-slate-600">
                  Click a pane button to trigger same-route navigation. The live signal usually
                  returns to idle immediately, but the log below samples
                  <span class="font-semibold text-slate-900">currentNavigation()</span> during
                  router events so the in-flight state is still visible.
                </p>
              </div>
            </aside>
          </div>

          <section class="mt-8 grid gap-5 xl:grid-cols-2">
            <article class="rounded-[1.75rem] border border-cyan-200 bg-cyan-50/70 p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                currentNavigation()
              </p>
              <h2 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Live in-flight navigation
              </h2>

              @if (currentNavigationSummary()) {
                <div
                  class="mt-5 space-y-3 rounded-2xl border border-cyan-200 bg-white p-4 text-sm text-slate-700"
                >
                  <p>
                    <span class="font-semibold text-slate-950">id:</span>
                    {{ currentNavigationSummary()!.id }}
                  </p>
                  <p>
                    <span class="font-semibold text-slate-950">trigger:</span>
                    {{ currentNavigationSummary()!.trigger }}
                  </p>
                  <p>
                    <span class="font-semibold text-slate-950">from:</span>
                    {{ currentNavigationSummary()!.sourceUrl }}
                  </p>
                  <p>
                    <span class="font-semibold text-slate-950">to:</span>
                    {{ currentNavigationSummary()!.targetUrl }}
                  </p>
                  <p>
                    <span class="font-semibold text-slate-950">extras.state keys:</span>
                    {{ currentNavigationSummary()!.extrasStateKeys }}
                  </p>
                </div>
              } @else {
                <div
                  class="mt-5 rounded-2xl border border-cyan-200 bg-white p-4 text-sm leading-6 text-slate-600"
                >
                  The router is idle right now, so
                  <span class="font-semibold text-slate-900">currentNavigation()</span> is
                  <span class="font-semibold text-slate-900">null</span>.
                </div>
              }
            </article>

            <article class="rounded-[1.75rem] border border-sky-200 bg-sky-50/70 p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                lastSuccessfulNavigation()
              </p>
              <h2 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Most recent completed navigation
              </h2>

              @if (lastSuccessfulNavigationSummary()) {
                <div
                  class="mt-5 space-y-3 rounded-2xl border border-sky-200 bg-white p-4 text-sm text-slate-700"
                >
                  <p>
                    <span class="font-semibold text-slate-950">id:</span>
                    {{ lastSuccessfulNavigationSummary()!.id }}
                  </p>
                  <p>
                    <span class="font-semibold text-slate-950">trigger:</span>
                    {{ lastSuccessfulNavigationSummary()!.trigger }}
                  </p>
                  <p>
                    <span class="font-semibold text-slate-950">from:</span>
                    {{ lastSuccessfulNavigationSummary()!.sourceUrl }}
                  </p>
                  <p>
                    <span class="font-semibold text-slate-950">to:</span>
                    {{ lastSuccessfulNavigationSummary()!.targetUrl }}
                  </p>
                  <p>
                    <span class="font-semibold text-slate-950">extras.state keys:</span>
                    {{ lastSuccessfulNavigationSummary()!.extrasStateKeys }}
                  </p>
                </div>
              } @else {
                <div
                  class="mt-5 rounded-2xl border border-sky-200 bg-white p-4 text-sm leading-6 text-slate-600"
                >
                  No successful navigation has been recorded yet.
                </div>
              }
            </article>
          </section>

          <section class="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Captured currentNavigation snapshots
                </p>
                <p class="mt-2 text-sm leading-6 text-slate-600">
                  These entries are sampled during router events whenever
                  <span class="font-semibold text-slate-900">currentNavigation()</span>
                  becomes non-null.
                </p>
              </div>
              <button
                type="button"
                class="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100"
                (click)="clearLog()"
              >
                Clear log
              </button>
            </div>

            <div class="mt-5 grid gap-4 lg:grid-cols-3">
              @for (entry of navigationLog(); track entry.id) {
                <article
                  class="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700"
                >
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Navigation {{ entry.id }}
                  </p>
                  <p class="mt-3">
                    <span class="font-semibold text-slate-950">trigger:</span> {{ entry.trigger }}
                  </p>
                  <p class="mt-2 break-all">
                    <span class="font-semibold text-slate-950">from:</span> {{ entry.sourceUrl }}
                  </p>
                  <p class="mt-2 break-all">
                    <span class="font-semibold text-slate-950">to:</span> {{ entry.targetUrl }}
                  </p>
                  <p class="mt-2">
                    <span class="font-semibold text-slate-950">state keys:</span>
                    {{ entry.extrasStateKeys }}
                  </p>
                </article>
              } @empty {
                <article
                  class="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600 lg:col-span-3"
                >
                  Trigger a few navigations to capture snapshots of the transient in-flight signal.
                </article>
              }
            </div>
          </section>
        </section>
      </div>
    </main>
  `,
})
export class RouterNavigationSignalsDemoPage {
  panes = paneOptions;
  navigationLog = signal<readonly NavigationSummary[]>([]);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private paneParam = toSignal(this.route.queryParamMap.pipe(map((params) => params.get('pane'))), {
    initialValue: this.route.snapshot.queryParamMap.get('pane'),
  });

  selectedPane = computed<DemoPane>(() => {
    const pane = this.paneParam();
    return this.isPane(pane) ? pane : 'overview';
  });
  activePane = computed(() => this.findPane(this.selectedPane()));
  currentUrl = toSignal(
    this.router.events.pipe(
      startWith(null),
      map(() => this.router.url),
    ),
    {
      initialValue: this.router.url,
    },
  );
  currentNavigationSummary = computed(() =>
    this.describeNavigation(this.router.currentNavigation()),
  );
  lastSuccessfulNavigationSummary = computed(() =>
    this.describeNavigation(this.router.lastSuccessfulNavigation()),
  );

  constructor() {
    this.router.events
      .pipe(
        startWith(null),
        map(() => this.describeNavigation(this.router.currentNavigation())),
        takeUntilDestroyed(),
      )
      .subscribe((summary) => {
        if (!summary) {
          return;
        }

        this.navigationLog.update((entries) => {
          if (entries[0]?.id === summary.id) {
            return entries;
          }

          return [summary, ...entries].slice(0, 6);
        });
      });
  }

  async goToPane(pane: PaneOption): Promise<void> {
    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { pane: pane.id },
      queryParamsHandling: 'merge',
      state: {
        source: 'router-navigation-signals-demo',
        pane: pane.id,
      },
    });
  }

  clearLog(): void {
    this.navigationLog.set([]);
  }

  private describeNavigation(navigation: Navigation | null): NavigationSummary | null {
    if (!navigation) {
      return null;
    }

    return {
      id: navigation.id,
      trigger: navigation.trigger,
      sourceUrl: this.serializeNavigationUrl(
        navigation.previousNavigation?.finalUrl ??
          navigation.previousNavigation?.extractedUrl ??
          navigation.previousNavigation?.initialUrl ??
          null,
      ),
      targetUrl: this.serializeNavigationUrl(
        navigation.finalUrl ?? navigation.extractedUrl ?? navigation.initialUrl,
      ),
      extrasStateKeys: this.describeStateKeys(navigation),
    };
  }

  private serializeNavigationUrl(url: ReturnType<Router['parseUrl']> | null): string {
    return url ? this.router.serializeUrl(url) : 'n/a';
  }

  private describeStateKeys(navigation: Navigation): string {
    const keys = Object.keys(navigation.extras.state ?? {}).filter((key) => key !== 'navigationId');
    return keys.length > 0 ? keys.join(', ') : 'none';
  }

  private isPane(value: string | null): value is DemoPane {
    return value === 'overview' || value === 'metrics' || value === 'activity';
  }

  private findPane(id: DemoPane): PaneOption {
    return this.panes.find((pane) => pane.id === id) ?? this.panes[0];
  }
}
