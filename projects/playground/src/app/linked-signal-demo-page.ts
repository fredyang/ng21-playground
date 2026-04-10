import { ChangeDetectionStrategy, Component, computed, linkedSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface DeliveryOption {
  readonly id: string;
  readonly label: string;
  readonly eta: string;
  readonly note: string;
}

type FulfillmentMode = 'warehouse' | 'cross-border' | 'pickup';

@Component({
  selector: 'app-linked-signal-demo-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <main
      class="min-h-dvh bg-[radial-gradient(circle_at_top_right,#ede9fe_0,transparent_22%),linear-gradient(180deg,#faf7ff_0%,#ffffff_26%,#f8fafc_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8"
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
            class="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-violet-700"
          >
            /demo/linked-signal
          </span>
        </div>

        <section
          class="rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_28px_90px_-40px_rgba(15,23,42,0.35)] backdrop-blur lg:p-10"
        >
          <div class="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(21rem,0.9fr)] lg:items-start">
            <div>
              <div
                class="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-violet-700"
              >
                Dependent state with signals
              </div>
              <h1
                class="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.08em] text-slate-950 sm:text-5xl lg:text-[3.55rem] lg:leading-[0.94]"
              >
                <span class="text-violet-600">linkedSignal()</span> keeps writable state in sync
                with its source
              </h1>
              <p class="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                This page compares three selectors driven by the same list of delivery options. Pick
                an option, then switch fulfillment mode. A plain writable signal can drift stale, a
                basic linkedSignal resets to the first valid item, and the advanced form can
                preserve the previous choice when it still exists.
              </p>

              <div class="mt-8 grid gap-4 sm:grid-cols-3">
                <article class="rounded-2xl border border-rose-200 bg-rose-50/70 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                    Plain signal
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    Writable, but unaware that its source list changed underneath it.
                  </p>
                </article>
                <article class="rounded-2xl border border-violet-200 bg-violet-50/70 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">
                    linkedSignal(() =&gt; ...)
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    Resets to a fresh default whenever the reactive source changes.
                  </p>
                </article>
                <article class="rounded-2xl border border-sky-200 bg-sky-50/70 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                    source + previous
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    Preserves the previous choice if the next source list still contains it.
                  </p>
                </article>
              </div>
            </div>

            <aside class="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Playground controls
              </p>
              <p class="mt-3 text-lg font-semibold tracking-[-0.03em] text-slate-950">
                {{ modeSummary() }}
              </p>
              <p class="mt-2 text-sm leading-6 text-slate-600">
                First pick Express on all three selectors, then swap the fulfillment mode to see how
                each state container reacts.
              </p>

              <div class="mt-5 flex flex-wrap gap-2">
                @for (mode of modes; track mode.id) {
                  <button
                    type="button"
                    class="rounded-full border px-4 py-2 text-sm font-medium transition-colors"
                    [class.border-violet-300]="fulfillmentMode() === mode.id"
                    [class.bg-violet-100]="fulfillmentMode() === mode.id"
                    [class.text-violet-900]="fulfillmentMode() === mode.id"
                    [class.border-slate-300]="fulfillmentMode() !== mode.id"
                    [class.bg-white]="fulfillmentMode() !== mode.id"
                    [class.text-slate-700]="fulfillmentMode() !== mode.id"
                    (click)="setFulfillmentMode(mode.id)"
                  >
                    {{ mode.label }}
                  </button>
                }
              </div>

              <div class="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Current source list
                </p>
                <p class="mt-2 text-sm text-slate-700">{{ optionLabels() }}</p>
              </div>

              <div class="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Teaching point
                </p>
                <p class="mt-2 text-sm leading-6 text-slate-600">{{ teachingPoint() }}</p>
              </div>
            </aside>
          </div>

          <section class="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Select the same option in all three models
            </p>
            <div class="mt-4 flex flex-wrap gap-3">
              @for (option of availableOptions(); track option.id) {
                <button
                  type="button"
                  class="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100"
                  (click)="selectOptionEverywhere(option.id)"
                >
                  Pick {{ option.label }}
                </button>
              }
            </div>
          </section>

          <section class="mt-8 grid gap-5 xl:grid-cols-3">
            <article class="rounded-[1.75rem] border border-rose-200 bg-rose-50/70 p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                Plain signal
              </p>
              <h2 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Can drift stale
              </h2>
              <p class="mt-4 text-sm leading-6 text-slate-700">
                A normal writable signal does not know it is supposed to stay aligned with the
                source list.
              </p>
              <div class="mt-5 rounded-2xl border border-rose-200 bg-white p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Selection
                </p>
                <p class="mt-2 text-lg font-semibold text-slate-950">
                  {{ plainSelection().label }}
                </p>
                <p
                  class="mt-2 text-sm"
                  [class.text-rose-700]="!plainSelectionValid()"
                  [class.text-emerald-700]="plainSelectionValid()"
                >
                  {{
                    plainSelectionValid()
                      ? 'Still valid in the current list.'
                      : 'Stale: this item is no longer in the source list.'
                  }}
                </p>
              </div>
            </article>

            <article class="rounded-[1.75rem] border border-violet-200 bg-violet-50/70 p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">
                linkedSignal(() =&gt; first option)
              </p>
              <h2 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Resets to a valid default
              </h2>
              <p class="mt-4 text-sm leading-6 text-slate-700">
                This variant is writable, but when the source list changes it recomputes to the
                first valid option.
              </p>
              <div class="mt-5 rounded-2xl border border-violet-200 bg-white p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Selection
                </p>
                <p class="mt-2 text-lg font-semibold text-slate-950">
                  {{ resetSelection().label }}
                </p>
                <p class="mt-2 text-sm text-violet-700">
                  Always valid, but can discard the user's choice.
                </p>
              </div>
            </article>

            <article class="rounded-[1.75rem] border border-sky-200 bg-sky-50/70 p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                linkedSignal with previous
              </p>
              <h2 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Preserves when possible
              </h2>
              <p class="mt-4 text-sm leading-6 text-slate-700">
                The computation receives the new source list and the previous linked value, so it
                can keep a still-valid selection instead of always resetting.
              </p>
              <div class="mt-5 rounded-2xl border border-sky-200 bg-white p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Selection
                </p>
                <p class="mt-2 text-lg font-semibold text-slate-950">
                  {{ preservedSelection().label }}
                </p>
                <p class="mt-2 text-sm text-sky-700">
                  Best fit when state depends on a changing source list.
                </p>
              </div>
            </article>
          </section>
        </section>
      </div>
    </main>
  `,
})
export class LinkedSignalDemoPage {
  readonly modes = [
    { id: 'warehouse' as const, label: 'Warehouse shipping' },
    { id: 'cross-border' as const, label: 'Cross-border delivery' },
    { id: 'pickup' as const, label: 'Store pickup' },
  ];

  readonly fulfillmentMode = signal<FulfillmentMode>('warehouse');
  readonly modeCatalog: Record<FulfillmentMode, readonly DeliveryOption[]> = {
    warehouse: [
      {
        id: 'standard',
        label: 'Standard',
        eta: '3-5 days',
        note: 'Low-cost default from the warehouse queue.',
      },
      {
        id: 'express',
        label: 'Express',
        eta: 'Next day',
        note: 'Shared option that also exists in other modes.',
      },
      {
        id: 'freight',
        label: 'Freight',
        eta: '5-7 days',
        note: 'For bulky orders only.',
      },
    ],
    'cross-border': [
      {
        id: 'priority',
        label: 'Priority International',
        eta: '2-4 days',
        note: 'First option in this list, so reset behavior is obvious.',
      },
      {
        id: 'express',
        label: 'Express',
        eta: '3 days',
        note: 'Still available here, but no longer the first item.',
      },
      {
        id: 'customs',
        label: 'Customs Review',
        eta: '4-6 days',
        note: 'For restricted destinations.',
      },
    ],
    pickup: [
      {
        id: 'locker',
        label: 'Locker Pickup',
        eta: 'Same day',
        note: 'Collection from a nearby locker bank.',
      },
      {
        id: 'curbside',
        label: 'Curbside',
        eta: '2 hours',
        note: 'Fast local handoff.',
      },
      {
        id: 'express',
        label: 'Express',
        eta: 'Ready tonight',
        note: 'Still present, but again not first in the list.',
      },
    ],
  };

  readonly availableOptions = computed(() => this.modeCatalog[this.fulfillmentMode()]);
  readonly optionLabels = computed(() =>
    this.availableOptions()
      .map((option) => `${option.label} (${option.eta})`)
      .join(' · '),
  );
  readonly modeSummary = computed(() => {
    const selectedMode = this.modes.find((mode) => mode.id === this.fulfillmentMode());
    return selectedMode?.label ?? 'Unknown mode';
  });

  // does not automatically update when fulfillmentMode changes, so can become stale
  readonly plainSelection = signal<DeliveryOption>(this.modeCatalog.warehouse[0]);

  // always picks the first option in the current list, regardless of previous value
  readonly resetSelection = linkedSignal(() => this.availableOptions()[0]);

  readonly preservedSelection = linkedSignal<readonly DeliveryOption[], DeliveryOption>({
    source: this.availableOptions,
    computation: (options, previous) =>
      // try to keep the same option if it's still in the new list, otherwise reset to the first item
      options.find((option) => option.id === previous?.value.id) ?? options[0],
  });

  readonly plainSelectionValid = computed(() =>
    this.availableOptions().some((option) => option.id === this.plainSelection().id),
  );
  readonly teachingPoint = computed(() => {
    if (!this.plainSelectionValid()) {
      return 'The plain signal is now stale. linkedSignal variants kept themselves aligned with the new source list.';
    }

    if (this.resetSelection().id !== this.preservedSelection().id) {
      return 'Both linked signals are valid, but only the advanced form preserved the previous Express selection.';
    }

    return 'All three selectors are currently aligned. Pick Express, then switch fulfillment mode to see the difference.';
  });

  setFulfillmentMode(mode: FulfillmentMode): void {
    this.fulfillmentMode.set(mode);
  }

  selectOptionEverywhere(optionId: string): void {
    const option = this.availableOptions().find((candidate) => candidate.id === optionId);

    if (!option) {
      return;
    }

    this.plainSelection.set(option);
    this.resetSelection.set(option);
    this.preservedSelection.set(option);
  }
}
