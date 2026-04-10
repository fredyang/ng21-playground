import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

interface TriggerDefinition {
  readonly label: string;
  readonly detail: string;
}

@Component({
  selector: 'app-zoneless-change-detection-demo-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <main
      class="min-h-dvh bg-[radial-gradient(circle_at_top_left,#fef3c7_0,transparent_24%),linear-gradient(180deg,#fffdf5_0%,#ffffff_26%,#f8fafc_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8"
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
            class="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-700"
          >
            /demo/zoneless-change-detection
          </span>
        </div>

        <section
          class="rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_28px_90px_-40px_rgba(15,23,42,0.35)] backdrop-blur lg:p-10"
        >
          <div
            class="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(21rem,0.85fr)] lg:items-start"
          >
            <div>
              <div
                class="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-700"
              >
                Angular 21 zoneless defaults
              </div>
              <h1
                class="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.08em] text-slate-950 sm:text-5xl lg:text-[3.55rem] lg:leading-[0.94]"
              >
                Zoneless change detection only refreshes when Angular gets a real
                <span class="text-amber-600">notification</span>
              </h1>
              <p class="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Angular 21 apps are zoneless by default. This page demonstrates the three most
                practical signals you reach for in normal code: updating a template-read signal,
                mutating state inside a bound event handler, and calling
                <strong>markForCheck()</strong> after an external async callback changes plain
                component fields.
              </p>

              <div class="mt-8 grid gap-4 sm:grid-cols-3">
                <article class="rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                    Angular 21
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    Zoneless is already the default. There is no provider in app config because
                    nothing needs to opt in.
                  </p>
                </article>
                <article class="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Angular 20
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    Add provideZonelessChangeDetection() at bootstrap if you want the same runtime
                    model.
                  </p>
                </article>
                <article class="rounded-2xl border border-sky-200 bg-sky-50/80 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                    OnPush fit
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    OnPush is not mandatory, but it pushes components toward the exact notification
                    APIs zoneless mode depends on.
                  </p>
                </article>
              </div>

              <section class="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  What Angular listens for
                </p>
                <div class="mt-4 grid gap-3 sm:grid-cols-2">
                  @for (trigger of triggers; track trigger.label) {
                    <article class="rounded-2xl border border-slate-200 bg-white p-4">
                      <p class="text-sm font-semibold text-slate-950">{{ trigger.label }}</p>
                      <p class="mt-2 text-sm leading-6 text-slate-600">{{ trigger.detail }}</p>
                    </article>
                  }
                </div>
              </section>
            </div>

            <aside class="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Demo status
              </p>
              <p class="mt-3 text-lg font-semibold tracking-[-0.03em] text-slate-950">
                {{ dashboardSummary() }}
              </p>
              <p class="mt-2 text-sm leading-6 text-slate-600">
                Trigger the panels below and watch which updates need Angular help and which ones
                already carry their own notification.
              </p>

              <div class="mt-5 space-y-4">
                <div class="rounded-2xl border border-slate-200 bg-white p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Signal-driven async work
                  </p>
                  <p class="mt-2 text-sm text-slate-600">
                    Pending jobs:
                    <span class="font-semibold text-slate-900">{{ signalPending() }}</span>
                  </p>
                </div>
                <div class="rounded-2xl border border-slate-200 bg-white p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Event callbacks
                  </p>
                  <p class="mt-2 text-sm text-slate-600">
                    Clicks recorded without any manual API:
                    <span class="font-semibold text-slate-900">{{ eventCount }}</span>
                  </p>
                </div>
                <div class="rounded-2xl border border-slate-200 bg-white p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    External async callbacks
                  </p>
                  <p class="mt-2 text-sm text-slate-600">{{ manualStatus }}</p>
                </div>
              </div>
            </aside>
          </div>

          <section class="mt-8 grid gap-5 xl:grid-cols-3">
            <article class="rounded-[1.75rem] border border-amber-200 bg-amber-50/70 p-5">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                    1. Signal update
                  </p>
                  <h2 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                    Async callback updates a signal
                  </h2>
                </div>
                <span class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-amber-700">
                  Auto refresh
                </span>
              </div>
              <p class="mt-4 text-sm leading-6 text-slate-700">
                The timeout itself is not a zoneless trigger. The refresh happens because the
                timeout updates a signal that this template reads.
              </p>
              <div class="mt-5 rounded-2xl border border-amber-200 bg-white p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Signal value
                </p>
                <p class="mt-2 text-3xl font-semibold text-slate-950">{{ signalCount() }}</p>
                <p class="mt-2 text-sm text-slate-600">{{ signalMessage() }}</p>
              </div>
              <button
                type="button"
                class="mt-5 inline-flex items-center rounded-full bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                (click)="queueSignalUpdate()"
              >
                Queue signal update
              </button>
            </article>

            <article class="rounded-[1.75rem] border border-sky-200 bg-sky-50/70 p-5">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                    2. Event callback
                  </p>
                  <h2 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                    Template listener mutates a field
                  </h2>
                </div>
                <span class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-sky-700">
                  Auto refresh
                </span>
              </div>
              <p class="mt-4 text-sm leading-6 text-slate-700">
                Bound event handlers are also a zoneless notification. This counter is a plain class
                field, not a signal, and still updates because the click itself notifies Angular.
              </p>
              <div class="mt-5 rounded-2xl border border-sky-200 bg-white p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Event count
                </p>
                <p class="mt-2 text-3xl font-semibold text-slate-950">{{ eventCount }}</p>
                <p class="mt-2 text-sm text-slate-600">{{ eventMessage }}</p>
              </div>
              <button
                type="button"
                class="mt-5 inline-flex items-center rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                (click)="recordEventCallback()"
              >
                Trigger template event
              </button>
            </article>

            <article class="rounded-[1.75rem] border border-emerald-200 bg-emerald-50/70 p-5">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    3. markForCheck()
                  </p>
                  <h2 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                    External async callback mutates plain fields
                  </h2>
                </div>
                <span
                  class="rounded-full bg-white px-3 py-1 text-xs font-semibold"
                  [class.text-emerald-700]="!manualPending"
                  [class.text-amber-700]="manualPending"
                >
                  {{ manualPending ? 'Needs markForCheck()' : 'Refreshed manually' }}
                </span>
              </div>
              <p class="mt-4 text-sm leading-6 text-slate-700">
                This timeout changes ordinary component fields. The callback finishes by calling
                markForCheck(), which gives Angular the notification it needs in zoneless mode.
              </p>
              <div class="mt-5 rounded-2xl border border-emerald-200 bg-white p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Manual count
                </p>
                <p class="mt-2 text-3xl font-semibold text-slate-950">{{ manualCount }}</p>
                <p class="mt-2 text-sm text-slate-600">{{ manualStatus }}</p>
              </div>
              <button
                type="button"
                class="mt-5 inline-flex items-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                (click)="queueManualUpdate()"
                [disabled]="manualPending"
              >
                {{ manualPending ? 'Waiting for callback...' : 'Queue manual refresh' }}
              </button>
            </article>
          </section>
        </section>
      </div>
    </main>
  `,
})
export class ZonelessChangeDetectionDemoPage {
  protected readonly triggers: readonly TriggerDefinition[] = [
    {
      label: 'Updating a signal read by the template',
      detail:
        'Signals schedule the refresh themselves, even when the update comes from a timer or promise callback.',
    },
    {
      label: 'Bound host or template listeners',
      detail:
        'Click, input, and other Angular-bound events are direct change-detection notifications.',
    },
    {
      label: 'ChangeDetectorRef.markForCheck()',
      detail:
        'Use this when plain fields are changed by external async work that Angular does not automatically observe.',
    },
    {
      label: 'ComponentRef.setInput and AsyncPipe',
      detail:
        'Input updates and AsyncPipe also notify Angular. AsyncPipe internally marks views for check.',
    },
  ];

  protected readonly signalCount = signal(0);
  protected readonly signalPending = signal(0);
  protected readonly signalMessage = computed(() => {
    const pending = this.signalPending();
    if (pending > 0) {
      return `Waiting for ${pending} async signal update${pending === 1 ? '' : 's'} to land.`;
    }

    return 'Latest change came from a timeout that updated a signal.';
  });

  protected eventCount = 0;
  protected eventMessage = 'A bound click handler can update plain fields without extra APIs.';
  protected manualCount = 0;
  protected manualPending = false;
  protected manualStatus = 'Idle. Queue an external callback to see markForCheck() in action.';
  protected readonly dashboardSummary = computed(
    () =>
      `${this.signalCount()} signal updates, ${this.eventCount} event callbacks, ${this.manualCount} manual refreshes`,
  );

  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly timeoutIds = new Set<number>();

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.timeoutIds.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      this.timeoutIds.clear();
    });
  }

  protected queueSignalUpdate(): void {
    this.signalPending.update((pending) => pending + 1);

    const timeoutId = window.setTimeout(() => {
      this.timeoutIds.delete(timeoutId);
      this.signalCount.update((count) => count + 1);
      this.signalPending.update((pending) => Math.max(0, pending - 1));
    }, 900);

    this.timeoutIds.add(timeoutId);
  }

  protected recordEventCallback(): void {
    this.eventCount += 1;
    this.eventMessage = `Click ${this.eventCount} was rendered because the template event itself notified Angular.`;
  }

  protected queueManualUpdate(): void {
    this.manualPending = true;
    this.manualStatus = 'Timeout scheduled. Angular will need markForCheck() when it finishes.';

    const timeoutId = window.setTimeout(() => {
      this.timeoutIds.delete(timeoutId);
      this.manualCount += 1;
      this.manualPending = false;
      this.manualStatus = `Callback ${this.manualCount} completed and then called markForCheck().`;
      this.changeDetectorRef.markForCheck();
    }, 1200);

    this.timeoutIds.add(timeoutId);
  }
}
