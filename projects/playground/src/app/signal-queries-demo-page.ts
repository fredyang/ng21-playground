import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  computed,
  contentChild,
  contentChildren,
  input,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { RouterLink } from '@angular/router';

interface ProjectedResource {
  id: number;
  label: string;
}

@Directive({
  selector: '[appQueryChip]',
})
export class QueryChipDirective {
  readonly appQueryChip = input.required<string>();
}

@Component({
  selector: 'app-view-queries-playground',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [QueryChipDirective],
  template: `
    <section class="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Child component
          </p>
          <h2 #headline class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
            viewChild() and viewChildren() read the component template
          </h2>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            These queries watch elements and directives declared inside this component’s own view.
            Toggling template content updates the query signals automatically.
          </p>
        </div>
        <button
          type="button"
          class="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100"
          (click)="toggleBonusAction()"
        >
          {{ showBonusAction() ? 'Hide' : 'Show' }} bonus action
        </button>
      </div>

      <div class="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          [appQueryChip]="'Inspect headline'"
          class="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700"
        >
          Inspect headline
        </button>
        <button
          type="button"
          [appQueryChip]="'Count action chips'"
          class="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700"
        >
          Count action chips
        </button>
        @if (showBonusAction()) {
          <button
            type="button"
            [appQueryChip]="'Bonus action'"
            class="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700"
          >
            Bonus action
          </button>
        }
      </div>

      <div class="mt-6 grid gap-4 sm:grid-cols-3">
        <article class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            viewChild()
          </p>
          <p class="mt-2 text-sm text-slate-600">Current headline text:</p>
          <p class="mt-2 text-sm font-semibold text-slate-950">{{ headlineText() }}</p>
        </article>
        <article class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            viewChildren()
          </p>
          <p class="mt-2 text-sm text-slate-600">Visible action chips: {{ actionCount() }}</p>
          <p class="mt-2 text-sm font-semibold text-slate-950">{{ actionLabelsText() }}</p>
        </article>
        <article class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Reactive update
          </p>
          <p class="mt-2 text-sm text-slate-600">
            {{
              showBonusAction()
                ? 'The bonus chip is present, so viewChildren() includes it.'
                : 'The bonus chip is removed, so viewChildren() immediately shrinks.'
            }}
          </p>
        </article>
      </div>
    </section>
  `,
})
export class ViewQueriesPlayground {
  readonly showBonusAction = signal(true);

  private readonly headline = viewChild<ElementRef<HTMLHeadingElement>>('headline');
  private readonly actionChips = viewChildren(QueryChipDirective);

  readonly headlineText = computed(
    () => this.headline()?.nativeElement.textContent?.trim() ?? 'Headline unavailable',
  );
  readonly actionCount = computed(() => this.actionChips().length);
  readonly actionLabelsText = computed(() => {
    const labels = this.actionChips().map((chip) => chip.appQueryChip());
    return labels.join(' · ');
  });

  toggleBonusAction(): void {
    this.showBonusAction.update((value) => !value);
  }
}

@Component({
  selector: 'app-content-queries-playground',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Child component
        </p>
        <h2 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
          contentChild() and contentChildren() read projected content
        </h2>
        <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          The parent controls the projected chips. This child discovers the first projected chip and
          the full projected collection through signal queries.
        </p>
      </div>

      <div class="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Projected slot
        </p>
        <div class="mt-3 flex flex-wrap gap-3">
          <ng-content />
        </div>
      </div>

      <div class="mt-6 grid gap-4 sm:grid-cols-3">
        <article class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            contentChild()
          </p>
          <p class="mt-2 text-sm text-slate-600">First projected chip:</p>
          <p class="mt-2 text-sm font-semibold text-slate-950">{{ featuredChipLabel() }}</p>
        </article>
        <article class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            contentChildren()
          </p>
          <p class="mt-2 text-sm text-slate-600">
            Projected chip count: {{ projectedChipCount() }}
          </p>
          <p class="mt-2 text-sm font-semibold text-slate-950">{{ projectedChipLabels() }}</p>
        </article>
        <article class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Reactive update
          </p>
          <p class="mt-2 text-sm text-slate-600">
            Reordering or adding chips in the parent changes these query signals without decorators.
          </p>
        </article>
      </div>
    </section>
  `,
})
export class ContentQueriesPlayground {
  private readonly featuredChip = contentChild(QueryChipDirective);
  private readonly projectedChips = contentChildren(QueryChipDirective);

  readonly featuredChipLabel = computed(
    () => this.featuredChip()?.appQueryChip() ?? 'No projected chip available',
  );
  readonly projectedChipCount = computed(() => this.projectedChips().length);
  readonly projectedChipLabels = computed(() => {
    const labels = this.projectedChips().map((chip) => chip.appQueryChip());
    return labels.join(' · ');
  });
}

@Component({
  selector: 'app-signal-queries-demo-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, QueryChipDirective, ViewQueriesPlayground, ContentQueriesPlayground],
  template: `
    <main
      class="min-h-dvh bg-[linear-gradient(180deg,#ecfeff_0%,#fff_22%,#f8fafc_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8"
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
            /demo/signal-queries
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
                class="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700"
              >
                Stable signal queries
              </div>
              <h1
                class="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.08em] text-slate-950 sm:text-5xl lg:text-[3.6rem] lg:leading-[0.94]"
              >
                Demoing <span class="text-cyan-600">viewChild()</span>,
                <span class="text-cyan-700">viewChildren()</span>,
                <span class="text-sky-600">contentChild()</span>, and
                <span class="text-sky-700">contentChildren()</span>
              </h1>
              <p class="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Signal queries let a component read its own template and projected content through
                reactive query signals instead of decorator fields.
              </p>

              <div class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <article class="rounded-2xl border border-cyan-200 bg-cyan-50/70 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                    viewChild()
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    Read one element or directive from the component’s own view.
                  </p>
                </article>
                <article class="rounded-2xl border border-cyan-200 bg-cyan-50/70 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                    viewChildren()
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    Track a reactive list of directives or elements in the local template.
                  </p>
                </article>
                <article class="rounded-2xl border border-sky-200 bg-sky-50/70 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                    contentChild()
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    Read the first projected item provided through content projection.
                  </p>
                </article>
                <article class="rounded-2xl border border-sky-200 bg-sky-50/70 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                    contentChildren()
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    Track the full projected collection as the parent updates it.
                  </p>
                </article>
              </div>
            </div>

            <aside class="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Parent controls
              </p>
              <p class="mt-3 text-lg font-semibold tracking-[-0.03em] text-slate-950">
                {{ projectedSummary() }}
              </p>
              <p class="mt-2 text-sm leading-6 text-slate-600">
                These buttons change the content projected into the second child component.
              </p>

              <div class="mt-5 space-y-4">
                <button
                  type="button"
                  class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100"
                  (click)="rotateProjectedResources()"
                >
                  Rotate projected order
                </button>
                <button
                  type="button"
                  class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100"
                  (click)="toggleBonusResource()"
                >
                  {{ hasBonusResource() ? 'Remove' : 'Add' }} bonus projected chip
                </button>

                <div class="rounded-2xl border border-slate-200 bg-white p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Current projected labels
                  </p>
                  <p class="mt-2 text-sm text-slate-700">{{ projectedLabelsText() }}</p>
                </div>
              </div>
            </aside>
          </div>

          <div class="mt-8 space-y-6">
            <app-view-queries-playground />

            <app-content-queries-playground>
              @for (resource of projectedResources(); track resource.id) {
                <span
                  [appQueryChip]="resource.label"
                  class="inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700"
                >
                  {{ resource.label }}
                </span>
              }
            </app-content-queries-playground>
          </div>
        </section>
      </div>
    </main>
  `,
})
export class SignalQueriesDemoPage {
  private readonly baseProjectedResources: readonly ProjectedResource[] = [
    { id: 1, label: 'API reference' },
    { id: 2, label: 'Migration guide' },
    { id: 3, label: 'Component examples' },
  ];
  private readonly bonusProjectedResource: ProjectedResource = {
    id: 4,
    label: 'Bonus projected chip',
  };

  readonly projectedResources = signal<ProjectedResource[]>([...this.baseProjectedResources]);
  readonly hasBonusResource = computed(() =>
    this.projectedResources().some((resource) => resource.id === this.bonusProjectedResource.id),
  );
  readonly projectedSummary = computed(() => {
    const resources = this.projectedResources();
    const firstLabel = resources[0]?.label ?? 'none';
    return `${resources.length} projected chips · first chip: ${firstLabel}`;
  });
  readonly projectedLabelsText = computed(() =>
    this.projectedResources()
      .map((resource) => resource.label)
      .join(' · '),
  );

  rotateProjectedResources(): void {
    this.projectedResources.update((resources) => {
      if (resources.length < 2) {
        return resources;
      }

      return [...resources.slice(1), resources[0]];
    });
  }

  toggleBonusResource(): void {
    this.projectedResources.update((resources) => {
      const hasBonus = resources.some((resource) => resource.id === this.bonusProjectedResource.id);

      if (hasBonus) {
        return resources.filter((resource) => resource.id !== this.bonusProjectedResource.id);
      }

      return [...resources, this.bonusProjectedResource];
    });
  }
}
