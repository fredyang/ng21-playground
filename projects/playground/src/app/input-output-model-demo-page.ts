import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

type AccentTone = 'rose' | 'emerald' | 'blue';

interface SavePayload {
  product: string;
  quantity: number;
}

@Component({
  selector: 'app-signal-api-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Child component
          </p>
          <h2 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
            {{ productName() }}
          </h2>
          <p class="mt-2 max-w-lg text-sm leading-6 text-slate-600">
            This card receives its product name and accent from
            <span class="font-medium text-slate-900">input()</span>, exposes quantity with
            <span class="font-medium text-slate-900">model()</span>, and emits a save action with
            <span class="font-medium text-slate-900">output()</span>.
          </p>
        </div>
        <span
          class="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
          [class]="badgeClass()"
        >
          {{ accent() }} theme
        </span>
      </div>

      <div class="mt-6 grid gap-4 sm:grid-cols-3">
        <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">input()</p>
          <p class="mt-2 text-sm text-slate-600">
            The parent can swap this product and accent without touching child internals.
          </p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">output()</p>
          <p class="mt-2 text-sm text-slate-600">
            app-signal-api-demoClick save and the parent receives a strongly typed payload.
          </p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">model()</p>
          <p class="mt-2 text-sm text-slate-600">
            Quantity stays synchronized between the parent panel and this child control.
          </p>
        </div>
      </div>

      <div class="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-xl text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
          (click)="decrement()"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <div class="min-w-28 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Quantity</p>
          <p class="mt-1 text-2xl font-semibold text-slate-950">{{ quantity() }}</p>
        </div>
        <button
          type="button"
          class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-xl text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
          (click)="increment()"
          aria-label="Increase quantity"
        >
          +
        </button>
        <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Derived total
          </p>
          <p class="mt-1 text-lg font-semibold text-slate-950">{{ totalLabel() }}</p>
        </div>
      </div>

      <button
        type="button"
        class="mt-6 inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        [class]="buttonClass()"
        (click)="saveSelection()"
      >
        Emit output() payload
      </button>
    </section>
  `,
})
export class SignalApiDemo {
  readonly productName = input.required<string>();
  readonly accent = input<AccentTone>('rose');
  readonly quantity = model(1);
  readonly saved = output<SavePayload>();

  readonly totalLabel = computed(() => `$${this.quantity() * 24}`);
  readonly badgeClass = computed(() => this.accentClasses()[this.accent()].badge);
  readonly buttonClass = computed(() => this.accentClasses()[this.accent()].button);

  private readonly accentClasses = computed(() => ({
    rose: {
      badge: 'bg-rose-100 text-rose-700',
      button: 'bg-rose-600',
    },
    emerald: {
      badge: 'bg-emerald-100 text-emerald-700',
      button: 'bg-emerald-600',
    },
    blue: {
      badge: 'bg-blue-100 text-blue-700',
      button: 'bg-blue-600',
    },
  }));

  increment(): void {
    this.quantity.update((value) => value + 1);
  }

  decrement(): void {
    this.quantity.update((value) => Math.max(1, value - 1));
  }

  saveSelection(): void {
    this.saved.emit({
      product: this.productName(),
      quantity: this.quantity(),
    });
  }
}

@Component({
  selector: 'app-input-output-model-demo-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SignalApiDemo],
  template: `
    <main
      class="min-h-dvh bg-[linear-gradient(180deg,#fff7ed_0%,#fff_22%,#f8fafc_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8"
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
            class="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-orange-700"
          >
            /demo/input-output-model
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
                class="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-orange-700"
              >
                Angular signals APIs
              </div>
              <h1
                class="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.08em] text-slate-950 sm:text-5xl lg:text-[3.6rem] lg:leading-[0.94]"
              >
                Demoing <span class="text-orange-600">input()</span>,
                <span class="text-emerald-600">output()</span>, and
                <span class="text-blue-600">model()</span>
              </h1>
              <p class="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                The parent component controls the child with <strong>input()</strong>, the child
                emits a typed event back with <strong>output()</strong>, and quantity stays
                synchronized through <strong>model()</strong>.
              </p>

              <div class="mt-8 grid gap-4 sm:grid-cols-3">
                <article class="rounded-2xl border border-orange-200 bg-orange-50/70 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
                    input()
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    Parent changes flow down into the child as readonly signal inputs.
                  </p>
                </article>
                <article class="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    output()
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    The child emits a typed payload when the save action is triggered.
                  </p>
                </article>
                <article class="rounded-2xl border border-blue-200 bg-blue-50/70 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                    model()
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    Two-way binding keeps parent and child state synchronized with less ceremony.
                  </p>
                </article>
              </div>
            </div>

            <aside class="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Parent state
              </p>
              <p class="mt-3 text-lg font-semibold tracking-[-0.03em] text-slate-950">
                {{ parentSummary() }}
              </p>
              <p class="mt-2 text-sm leading-6 text-slate-600">
                Use these controls to drive the child component below.
              </p>

              <div class="mt-5 space-y-5">
                <div>
                  <label class="text-sm font-medium text-slate-700" for="quantity-range"
                    >Parent quantity</label
                  >
                  <input
                    id="quantity-range"
                    class="mt-2 w-full accent-blue-600"
                    type="range"
                    min="1"
                    max="8"
                    [value]="quantity()"
                    (input)="quantity.set(+$any($event.target).value)"
                  />
                  <p class="mt-2 text-sm text-slate-600">
                    Current shared quantity:
                    <span class="font-semibold text-slate-900">{{ quantity() }}</span>
                  </p>
                </div>

                <div>
                  <p class="text-sm font-medium text-slate-700">Product passed via input()</p>
                  <div class="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      class="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100"
                      (click)="cycleProduct()"
                    >
                      Cycle product
                    </button>
                    @for (product of demoProducts; track product) {
                      <button
                        type="button"
                        class="rounded-full border px-4 py-2 text-sm font-medium transition-colors"
                        [class]="
                          selectedProduct() === product
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-100'
                        "
                        (click)="selectedProduct.set(product)"
                      >
                        {{ product }}
                      </button>
                    }
                  </div>
                </div>

                <div>
                  <p class="text-sm font-medium text-slate-700">Accent passed via input()</p>
                  <div class="mt-2 flex flex-wrap gap-2">
                    @for (tone of accentOptions; track tone) {
                      <button
                        type="button"
                        class="rounded-full border px-4 py-2 text-sm font-medium capitalize transition-colors"
                        [class]="
                          accent() === tone
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-100'
                        "
                        (click)="setAccent(tone)"
                      >
                        {{ tone }}
                      </button>
                    }
                  </div>
                </div>

                <div class="rounded-2xl border border-slate-200 bg-white p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    output() feedback
                  </p>
                  <p class="mt-2 text-sm text-slate-700">{{ lastSavedMessage() }}</p>
                  <p class="mt-1 text-sm text-slate-500">Total save events: {{ saveCount() }}</p>
                </div>
              </div>
            </aside>
          </div>

          <div class="mt-8">
            <app-signal-api-demo
              [productName]="selectedProduct()"
              [accent]="accent()"
              [(quantity)]="quantity"
              (saved)="handleSaved($event)"
            />
          </div>
        </section>
      </div>
    </main>
  `,
})
export class InputOutputModelDemoPage {
  readonly selectedProduct = signal('Angular Signals Starter Kit');
  readonly accent = signal<AccentTone>('rose');
  readonly quantity = signal(2);
  readonly saveCount = signal(0);
  readonly lastSavedMessage = signal('Nothing saved yet.');
  readonly accentOptions: AccentTone[] = ['rose', 'emerald', 'blue'];
  readonly demoProducts = [
    'Angular Signals Starter Kit',
    'Component API Playground',
    'Two-Way Binding Lab',
  ] as const;
  readonly parentSummary = computed(
    () => `${this.selectedProduct()} · qty ${this.quantity()} · ${this.accent()} tone`,
  );

  cycleProduct(): void {
    const currentIndex = this.demoProducts.indexOf(
      this.selectedProduct() as (typeof this.demoProducts)[number],
    );
    const nextIndex = (currentIndex + 1) % this.demoProducts.length;
    this.selectedProduct.set(this.demoProducts[nextIndex]);
  }

  setAccent(accent: AccentTone): void {
    this.accent.set(accent);
  }

  handleSaved(event: SavePayload): void {
    this.saveCount.update((count) => count + 1);
    this.lastSavedMessage.set(`Saved ${event.quantity} × ${event.product}`);
  }
}
