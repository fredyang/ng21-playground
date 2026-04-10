import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { ROUTER_OUTLET_DATA, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface OutletContext {
  sectionTitle: string;
  layout: 'sidebar' | 'stacked';
  density: 'comfortable' | 'compact';
  accent: 'amber' | 'sky';
}

const defaultContext: OutletContext = {
  sectionTitle: 'Context unavailable',
  layout: 'sidebar',
  density: 'comfortable',
  accent: 'amber',
};

@Component({
  selector: 'app-router-outlet-context-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Routed child component
          </p>
          <h2 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
            {{ heading() }}
          </h2>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {{ description() }}
          </p>
        </div>
        <span
          class="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
          [class]="accentBadgeClass()"
        >
          {{ context().accent }} accent
        </span>
      </div>

      <div class="mt-6 grid gap-4 sm:grid-cols-3">
        <article class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Section title
          </p>
          <p class="mt-2 text-sm font-semibold text-slate-950">{{ context().sectionTitle }}</p>
        </article>
        <article class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Layout mode
          </p>
          <p class="mt-2 text-sm font-semibold text-slate-950">{{ context().layout }}</p>
        </article>
        <article class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Density</p>
          <p class="mt-2 text-sm font-semibold text-slate-950">{{ context().density }}</p>
        </article>
      </div>

      <div class="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <span class="font-semibold text-slate-950">Why this matters:</span>
        This child component gets contextual data from the parent outlet without adding anything to
        the route definition or reaching for a shared service.
      </div>
    </article>
  `,
})
export class RouterOutletContextCard {
  readonly heading = input('Context card');
  readonly description = input(
    'The routed child reads outlet context through the ROUTER_OUTLET_DATA token.',
  );

  private readonly outletData = inject(ROUTER_OUTLET_DATA) as Signal<OutletContext | null>;

  readonly context = computed(() => this.outletData() ?? defaultContext);
  readonly accentBadgeClass = computed(() =>
    this.context().accent === 'amber' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700',
  );
}

@Component({
  selector: 'app-router-outlet-summary-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutletContextCard],
  template: `
    <app-router-outlet-context-card
      [heading]="'Summary panel'"
      [description]="'This route demonstrates the high-level layout configuration received from the enclosing RouterOutlet.'"
    />
  `,
})
export class RouterOutletSummaryPanel extends RouterOutletContextCard {}

@Component({
  selector: 'app-router-outlet-inspector-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutletContextCard],
  template: `
    <app-router-outlet-context-card
      [heading]="'Inspector panel'"
      [description]="'This route can switch visuals and interaction density based on contextual outlet data without changing route configuration.'"
    />
  `,
})
export class RouterOutletInspectorPanel extends RouterOutletContextCard {}

@Component({
  selector: 'app-router-outlet-activity-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutletContextCard],
  template: `
    <app-router-outlet-context-card
      [heading]="'Activity panel'"
      [description]="'A different child route reads the same outlet data signal, so the parent can coordinate all routed children from one place.'"
    />
  `,
})
export class RouterOutletActivityPanel extends RouterOutletContextCard {}

@Component({
  selector: 'app-router-outlet-data-demo-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <main
      class="min-h-dvh bg-[linear-gradient(180deg,#fffbeb_0%,#fff_22%,#f8fafc_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8"
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
            /demo/router-outlet-data
          </span>
        </div>

        <section
          class="rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-[0_28px_90px_-40px_rgba(15,23,42,0.35)] backdrop-blur lg:p-10"
        >
          <div
            class="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(21rem,0.85fr)] lg:items-start"
          >
            <div>
              <div
                class="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-700"
              >
                RouterOutlet context
              </div>
              <h1
                class="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.08em] text-slate-950 sm:text-5xl lg:text-[3.6rem] lg:leading-[0.94]"
              >
                Demoing <span class="text-amber-600">routerOutletData</span> on
                <span class="text-orange-600">RouterOutlet</span>
              </h1>
              <p class="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                A parent route can pass contextual data into the active routed child through the
                outlet itself, and the child reads it as a signal with
                <span class="font-semibold text-slate-900">ROUTER_OUTLET_DATA</span>.
              </p>

              <div class="mt-8 grid gap-4 sm:grid-cols-3">
                <article class="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                    No route config churn
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    Parent-specific context stays next to the outlet instead of being spread through
                    route definitions.
                  </p>
                </article>
                <article class="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                    Signal-based consumption
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    Routed children inject a signal and react immediately when outlet context
                    changes.
                  </p>
                </article>
                <article class="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                    Great for layouts
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    Useful for layout mode, panel titles, density, feature toggles, and other
                    route-driven UI context.
                  </p>
                </article>
              </div>
            </div>

            <aside class="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Outlet controls
              </p>
              <p class="mt-3 text-lg font-semibold tracking-[-0.03em] text-slate-950">
                {{ outletSummary() }}
              </p>
              <p class="mt-2 text-sm leading-6 text-slate-600">
                Changing these controls updates the data passed into the nested RouterOutlet.
              </p>

              <div class="mt-5 space-y-5">
                <div>
                  <p class="text-sm font-medium text-slate-700">Section title</p>
                  <input
                    class="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 transition-colors focus:border-amber-400"
                    [value]="sectionTitle()"
                    (input)="sectionTitle.set($any($event.target).value)"
                  />
                </div>

                <div>
                  <p class="text-sm font-medium text-slate-700">Layout</p>
                  <div class="mt-2 flex flex-wrap gap-2">
                    @for (layout of layouts; track layout) {
                      <button
                        type="button"
                        class="rounded-full border px-4 py-2 text-sm font-medium capitalize transition-colors"
                        [class]="
                          layoutMode() === layout
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-100'
                        "
                        (click)="layoutMode.set(layout)"
                      >
                        {{ layout }}
                      </button>
                    }
                  </div>
                </div>

                <div>
                  <p class="text-sm font-medium text-slate-700">Density</p>
                  <div class="mt-2 flex flex-wrap gap-2">
                    @for (density of densities; track density) {
                      <button
                        type="button"
                        class="rounded-full border px-4 py-2 text-sm font-medium capitalize transition-colors"
                        [class]="
                          densityMode() === density
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-100'
                        "
                        (click)="densityMode.set(density)"
                      >
                        {{ density }}
                      </button>
                    }
                  </div>
                </div>

                <div>
                  <p class="text-sm font-medium text-slate-700">Accent</p>
                  <div class="mt-2 flex flex-wrap gap-2">
                    @for (accent of accents; track accent) {
                      <button
                        type="button"
                        class="rounded-full border px-4 py-2 text-sm font-medium capitalize transition-colors"
                        [class]="
                          accentMode() === accent
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-100'
                        "
                        (click)="accentMode.set(accent)"
                      >
                        {{ accent }}
                      </button>
                    }
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <div class="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <nav class="flex flex-wrap gap-2" aria-label="Outlet demo sections">
              @for (panel of panels; track panel.path) {
                <a
                  [routerLink]="[panel.path]"
                  routerLinkActive="!border-amber-300 !bg-amber-100 !text-slate-950"
                  [routerLinkActiveOptions]="{ exact: true }"
                  class="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100"
                >
                  {{ panel.label }}
                </a>
              }
            </nav>

            <div class="mt-5">
              <router-outlet [routerOutletData]="outletContext()" />
            </div>
          </div>
        </section>
      </div>
    </main>
  `,
})
export class RouterOutletDataDemoPage {
  readonly layouts: readonly OutletContext['layout'][] = ['sidebar', 'stacked'];
  readonly densities: readonly OutletContext['density'][] = ['comfortable', 'compact'];
  readonly accents: readonly OutletContext['accent'][] = ['amber', 'sky'];
  readonly panels = [
    { path: 'summary', label: 'Summary' },
    { path: 'inspector', label: 'Inspector' },
    { path: 'activity', label: 'Activity' },
  ] as const;

  readonly sectionTitle = signal('Analytics workspace');
  readonly layoutMode = signal<OutletContext['layout']>('sidebar');
  readonly densityMode = signal<OutletContext['density']>('comfortable');
  readonly accentMode = signal<OutletContext['accent']>('amber');
  readonly outletContext = computed<OutletContext>(() => ({
    sectionTitle: this.sectionTitle(),
    layout: this.layoutMode(),
    density: this.densityMode(),
    accent: this.accentMode(),
  }));
  readonly outletSummary = computed(
    () =>
      `${this.sectionTitle()} · ${this.layoutMode()} · ${this.densityMode()} · ${this.accentMode()}`,
  );
}
