import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  Directive,
  DestroyRef,
  ViewContainerRef,
  computed,
  input,
  inputBinding,
  inject,
  model,
  output,
  outputBinding,
  signal,
  twoWayBinding,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';

type Tone = 'violet' | 'teal';

@Directive({
  selector: '[appDynamicCardTheme]',
  host: {
    class: 'block rounded-[1.6rem] transition-colors',
    '[attr.data-tone]': 'tone()',
    '[class.ring-2]': 'true',
    '[class.ring-violet-300]': 'tone() === "violet"',
    '[class.ring-teal-300]': 'tone() === "teal"',
    '[class.bg-violet-50/40]': 'tone() === "violet"',
    '[class.bg-teal-50/40]': 'tone() === "teal"',
  },
})
export class DynamicCardThemeDirective {
  readonly tone = input<Tone>('violet');
}

@Component({
  selector: 'app-runtime-promo-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="rounded-[1.45rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Dynamic component instance
          </p>
          <h3 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
            {{ title() }}
          </h3>
        </div>
        <span
          class="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
          [class]="badgeClass()"
        >
          {{ tone() }} tone
        </span>
      </div>

      <p class="mt-4 text-sm leading-6 text-slate-700">{{ detail() }}</p>

      <div class="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          twoWayBinding()
        </p>
        <p class="mt-2 text-sm text-slate-600">Expanded state is shared with the parent signal.</p>
        @if (expanded()) {
          <p class="mt-3 text-sm text-slate-700">
            This panel is open because the parent signal and the child model stay synchronized.
          </p>
        } @else {
          <p class="mt-3 text-sm text-slate-700">
            The panel is collapsed. Use either the child or parent control to reopen it.
          </p>
        }
      </div>

      <div class="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          class="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100"
          (click)="expanded.set(!expanded())"
        >
          {{ expanded() ? 'Collapse inside child' : 'Expand inside child' }}
        </button>
        @if (canDismiss()) {
          <button
            type="button"
            class="rounded-full px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            [class]="dismissButtonClass()"
            (click)="dismissed.emit(title())"
          >
            Emit outputBinding()
          </button>
        }
      </div>
    </section>
  `,
})
export class RuntimePromoCardComponent {
  readonly title = input.required<string>();
  readonly detail = input.required<string>();
  readonly tone = input<Tone>('violet');
  readonly canDismiss = input(true);
  readonly expanded = model(true);
  readonly dismissed = output<string>();

  readonly badgeClass = computed(() =>
    this.tone() === 'violet' ? 'bg-violet-100 text-violet-700' : 'bg-teal-100 text-teal-700',
  );

  readonly dismissButtonClass = computed(() =>
    this.tone() === 'violet' ? 'bg-violet-600' : 'bg-teal-600',
  );
}

@Component({
  selector: 'app-dynamic-component-bindings-demo-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <main
      class="min-h-dvh bg-[radial-gradient(circle_at_top_left,#f5d0fe_0,transparent_24%),linear-gradient(180deg,#fffafe_0%,#ffffff_26%,#f8fafc_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8"
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
            class="rounded-full border border-fuchsia-200 bg-fuchsia-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-fuchsia-700"
          >
            /demo/dynamic-component-bindings
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
                class="inline-flex items-center gap-2 rounded-full border border-fuchsia-200 bg-fuchsia-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-fuchsia-700"
              >
                Programmatic rendering
              </div>
              <h1
                class="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.08em] text-slate-950 sm:text-5xl lg:text-[3.45rem] lg:leading-[0.94]"
              >
                Dynamic component creation with
                <span class="text-fuchsia-600">bindings</span> and
                <span class="text-teal-600">directives</span>
              </h1>
              <p class="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                This demo creates a component with one declarative createComponent(...) call.
                Inputs, a two-way model, an output listener, and a host directive are all wired up
                at creation time instead of being configured imperatively afterwards.
              </p>

              <div class="mt-8 grid gap-4 sm:grid-cols-4">
                <article class="rounded-2xl border border-fuchsia-200 bg-fuchsia-50/70 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-700">
                    inputBinding()
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    Connect parent signals to dynamic inputs.
                  </p>
                </article>
                <article class="rounded-2xl border border-sky-200 bg-sky-50/70 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                    twoWayBinding()
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    Share writable state between parent and child.
                  </p>
                </article>
                <article class="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                    outputBinding()
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    Register output handlers up front.
                  </p>
                </article>
                <article class="rounded-2xl border border-teal-200 bg-teal-50/70 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                    directives
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    Attach host directives to the dynamic host element.
                  </p>
                </article>
              </div>
            </div>

            <aside class="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Parent controls
              </p>
              <p class="mt-3 text-lg font-semibold tracking-[-0.03em] text-slate-950">
                {{ parentSummary() }}
              </p>
              <p class="mt-2 text-sm leading-6 text-slate-600">
                Create the card once, then keep changing these signals. The dynamic child stays in
                sync because the bindings remain connected after creation.
              </p>

              <div class="mt-5 space-y-5">
                <div>
                  <label class="text-sm font-medium text-slate-700" for="dynamic-title"
                    >Title</label
                  >
                  <input
                    id="dynamic-title"
                    class="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-fuchsia-500"
                    type="text"
                    [value]="title()"
                    (input)="
                      title.set(($any($event.target).value ?? '').trim() || 'Runtime promo card')
                    "
                  />
                </div>

                <div>
                  <label class="text-sm font-medium text-slate-700" for="dynamic-detail"
                    >Detail</label
                  >
                  <textarea
                    id="dynamic-detail"
                    class="mt-2 min-h-28 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-fuchsia-500"
                    [value]="detail()"
                    (input)="detail.set(($any($event.target).value ?? '').trim() || defaultDetail)"
                  ></textarea>
                </div>

                <div>
                  <p class="text-sm font-medium text-slate-700">Host directive tone</p>
                  <div class="mt-2 flex flex-wrap gap-2">
                    @for (option of tones; track option) {
                      <button
                        type="button"
                        class="rounded-full border px-4 py-2 text-sm font-medium capitalize transition-colors"
                        [class]="
                          tone() === option
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-100'
                        "
                        (click)="tone.set(option)"
                      >
                        {{ option }}
                      </button>
                    }
                  </div>
                </div>

                <div class="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    class="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100"
                    (click)="expanded.set(!expanded())"
                  >
                    {{ expanded() ? 'Collapse from parent' : 'Expand from parent' }}
                  </button>
                  <button
                    type="button"
                    class="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100"
                    (click)="canDismiss.set(!canDismiss())"
                  >
                    {{ canDismiss() ? 'Hide dismiss action' : 'Show dismiss action' }}
                  </button>
                </div>

                <div class="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    class="rounded-2xl bg-fuchsia-600 px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    (click)="mountCard()"
                  >
                    {{ isMounted() ? 'Recreate dynamic card' : 'Create dynamic card' }}
                  </button>
                  <button
                    type="button"
                    class="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100"
                    (click)="clearCard()"
                    [disabled]="!isMounted()"
                  >
                    Clear host container
                  </button>
                </div>

                <div class="rounded-2xl border border-slate-200 bg-white p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Output events
                  </p>
                  <p class="mt-2 text-sm text-slate-700">{{ lastDismissMessage() }}</p>
                  <p class="mt-1 text-sm text-slate-500">Creations: {{ creationCount() }}</p>
                </div>
              </div>
            </aside>
          </div>

          <section class="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Dynamic host view
            </p>
            <p class="mt-3 text-sm leading-6 text-slate-600">
              The card below is created with ViewContainerRef.createComponent(...). The colored ring
              comes from a host directive attached through the directives option.
            </p>
            <div
              class="mt-5 min-h-56 rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-4"
            >
              <ng-container #dynamicHost />
              @if (!isMounted()) {
                <div
                  class="flex min-h-48 items-center justify-center rounded-[1.4rem] border border-slate-200 bg-slate-50 px-6 text-center text-sm leading-6 text-slate-500"
                >
                  Create the runtime card to see bindings and host directives applied in one call.
                </div>
              }
            </div>
          </section>
        </section>
      </div>
    </main>
  `,
})
export class DynamicComponentBindingsDemoPage {
  readonly tones: readonly Tone[] = ['violet', 'teal'];
  readonly defaultDetail =
    'This card is rendered programmatically, but it still behaves like a template-wired component.';

  readonly title = signal('Runtime promo card');
  readonly detail = signal(this.defaultDetail);
  readonly tone = signal<Tone>('violet');
  readonly expanded = signal(true);
  readonly canDismiss = signal(true);
  readonly creationCount = signal(0);
  readonly isMounted = signal(false);
  readonly lastDismissMessage = signal('No output events yet.');
  readonly parentSummary = computed(
    () =>
      `${this.isMounted() ? 'Mounted' : 'Not mounted'} · ${this.tone()} tone · ${this.expanded() ? 'expanded' : 'collapsed'}`,
  );

  // grab the ViewContainerRef from the template to use as the host for dynamic component creation
  private readonly host = viewChild.required('dynamicHost', { read: ViewContainerRef });
  private readonly destroyRef = inject(DestroyRef);
  private cardRef: ComponentRef<RuntimePromoCardComponent> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => this.clearCard());
  }

  mountCard(): void {
    this.clearCard();

    this.cardRef = this.host().createComponent(RuntimePromoCardComponent, {
      bindings: [
        inputBinding('title', this.title),
        inputBinding('detail', this.detail),
        inputBinding('tone', this.tone),
        inputBinding('canDismiss', this.canDismiss),
        twoWayBinding('expanded', this.expanded),
        outputBinding<string>('dismissed', (title) => {
          this.lastDismissMessage.set(`dismissed output fired for: ${title}`);
        }),
      ],
      directives: [
        {
          type: DynamicCardThemeDirective,
          bindings: [inputBinding('tone', this.tone)],
        },
      ],
    });

    this.creationCount.update((count) => count + 1);
    this.isMounted.set(true);
  }

  clearCard(): void {
    this.host().clear();
    this.cardRef?.destroy();
    this.cardRef = null;
    this.isMounted.set(false);
  }
}
