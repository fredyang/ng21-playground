import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormField, email, form, required, submit } from '@angular/forms/signals';

interface RegistrationFormModel {
  readonly name: string;
  readonly email: string;
  readonly role: 'builder' | 'reviewer' | 'learner';
  readonly notes: string;
}

const emptyRegistrationForm: RegistrationFormModel = {
  name: '',
  email: '',
  role: 'builder',
  notes: '',
};

@Component({
  selector: 'app-signal-forms-demo-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, JsonPipe, RouterLink],
  template: `
    <main
      class="min-h-dvh bg-[radial-gradient(circle_at_top_left,#ccfbf1_0,transparent_22%),linear-gradient(180deg,#f4fffd_0%,#ffffff_26%,#f8fafc_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8"
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
            class="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-teal-700"
          >
            /demo/signal-forms
          </span>
        </div>

        <section
          class="rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_28px_90px_-40px_rgba(15,23,42,0.35)] backdrop-blur lg:p-10"
        >
          <div class="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(21rem,0.9fr)] lg:items-start">
            <div>
              <div
                class="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-teal-700"
              >
                Experimental Angular forms API
              </div>
              <h1
                class="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.08em] text-slate-950 sm:text-5xl lg:text-[3.5rem] lg:leading-[0.94]"
              >
                Signal-based forms keep the
                <span class="text-teal-600">model</span>,
                <span class="text-sky-600">field state</span>, and
                <span class="text-amber-600">UI</span> synchronized
              </h1>
              <p class="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                This demo uses Angular Signal Forms to build a registration form from one writable
                signal. The form(...) field tree gives you typed field access, validation state, and
                two-way synchronization through the formField directive without manually wiring
                input events.
              </p>

              <div class="mt-8 grid gap-4 sm:grid-cols-3">
                <article class="rounded-2xl border border-teal-200 bg-teal-50/70 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                    Model-driven
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    One writable signal defines the form shape and remains the source of truth.
                  </p>
                </article>
                <article class="rounded-2xl border border-sky-200 bg-sky-50/70 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                    Field tree
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    Each field exposes value, touched, dirty, valid, invalid, and errors as signals.
                  </p>
                </article>
                <article class="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                    Experimental
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    Signal Forms are powerful, but Angular still marks them experimental in v21.
                  </p>
                </article>
              </div>
            </div>

            <aside class="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Demo controls
              </p>
              <p class="mt-3 text-lg font-semibold tracking-[-0.03em] text-slate-950">
                {{ statusSummary() }}
              </p>
              <p class="mt-2 text-sm leading-6 text-slate-600">
                Type into the form, then try the programmatic buttons to see the model and form UI
                stay in sync in both directions.
              </p>

              <div class="mt-5 space-y-3">
                <button
                  type="button"
                  class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100"
                  (click)="patchExampleData()"
                >
                  Load example data programmatically
                </button>
                <button
                  type="button"
                  class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100"
                  (click)="registrationForm.email().value.set('team@angular.dev')"
                >
                  Update one field through field state
                </button>
                <button
                  type="button"
                  class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100"
                  (click)="resetForm()"
                >
                  Reset model and field state
                </button>
              </div>

              <div class="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Submission result
                </p>
                <p class="mt-2 text-sm text-slate-700">{{ submitMessage() }}</p>
              </div>
            </aside>
          </div>

          <section class="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,0.95fr)]">
            <form
              class="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5"
              novalidate
              (submit)="handleSubmit($event)"
            >
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Signal form
              </p>
              <div class="mt-5 grid gap-5">
                <div>
                  <label class="text-sm font-medium text-slate-700" for="registration-name"
                    >Name</label
                  >
                  <input
                    id="registration-name"
                    class="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-colors focus:border-teal-500"
                    [class.border-rose-300]="showFieldError(registrationForm.name)"
                    [class.border-slate-300]="!showFieldError(registrationForm.name)"
                    [formField]="registrationForm.name"
                    type="text"
                  />
                  @if (showFieldError(registrationForm.name)) {
                    <p class="mt-2 text-sm text-rose-700">
                      {{ firstErrorMessage(registrationForm.name) }}
                    </p>
                  }
                </div>

                <div>
                  <label class="text-sm font-medium text-slate-700" for="registration-email"
                    >Email</label
                  >
                  <input
                    id="registration-email"
                    class="mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-colors focus:border-teal-500"
                    [class.border-rose-300]="showFieldError(registrationForm.email)"
                    [class.border-slate-300]="!showFieldError(registrationForm.email)"
                    [formField]="registrationForm.email"
                    type="email"
                  />
                  @if (showFieldError(registrationForm.email)) {
                    <p class="mt-2 text-sm text-rose-700">
                      {{ firstErrorMessage(registrationForm.email) }}
                    </p>
                  }
                </div>

                <div>
                  <label class="text-sm font-medium text-slate-700" for="registration-role"
                    >Role</label
                  >
                  <select
                    id="registration-role"
                    class="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-teal-500"
                    [formField]="registrationForm.role"
                  >
                    <option value="builder">Builder</option>
                    <option value="reviewer">Reviewer</option>
                    <option value="learner">Learner</option>
                  </select>
                </div>

                <div>
                  <label class="text-sm font-medium text-slate-700" for="registration-notes"
                    >Notes</label
                  >
                  <textarea
                    id="registration-notes"
                    class="mt-2 min-h-28 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-teal-500"
                    [formField]="registrationForm.notes"
                  ></textarea>
                </div>

                <div class="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    class="rounded-full bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    Submit with signal forms
                  </button>
                  <button
                    type="button"
                    class="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100"
                    (click)="markTouchedPreview()"
                  >
                    Preview validation state
                  </button>
                </div>
              </div>
            </form>

            <div class="space-y-5">
              <section class="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Raw model signal
                </p>
                <pre
                  class="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700"
                  >{{ registrationModel() | json }}</pre
                >
              </section>

              <section class="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Field state snapshot
                </p>
                <div class="mt-4 grid gap-3 sm:grid-cols-2">
                  <article class="rounded-2xl border border-slate-200 bg-white p-4">
                    <p class="text-sm font-semibold text-slate-950">name</p>
                    <p class="mt-2 text-sm text-slate-600">
                      dirty: {{ registrationForm.name().dirty() }}
                    </p>
                    <p class="mt-1 text-sm text-slate-600">
                      touched: {{ registrationForm.name().touched() }}
                    </p>
                    <p class="mt-1 text-sm text-slate-600">
                      valid: {{ registrationForm.name().valid() }}
                    </p>
                  </article>
                  <article class="rounded-2xl border border-slate-200 bg-white p-4">
                    <p class="text-sm font-semibold text-slate-950">email</p>
                    <p class="mt-2 text-sm text-slate-600">
                      dirty: {{ registrationForm.email().dirty() }}
                    </p>
                    <p class="mt-1 text-sm text-slate-600">
                      touched: {{ registrationForm.email().touched() }}
                    </p>
                    <p class="mt-1 text-sm text-slate-600">
                      valid: {{ registrationForm.email().valid() }}
                    </p>
                  </article>
                </div>
              </section>
            </div>
          </section>
        </section>
      </div>
    </main>
  `,
})
export class SignalFormsDemoPage {
  readonly registrationModel = signal<RegistrationFormModel>({ ...emptyRegistrationForm });
  readonly submitMessage = signal('Nothing submitted yet.');

  readonly registrationForm = form(this.registrationModel, (formTree) => {
    required(formTree.name, { message: 'Name is required.' });
    required(formTree.email, { message: 'Email is required.' });
    email(formTree.email, { message: 'Enter a valid email address.' });
  });

  readonly statusSummary = computed(() => {
    const formState = this.registrationForm();
    return `${formState.valid() ? 'Valid' : 'Invalid'} · ${formState.dirty() ? 'dirty' : 'pristine'} · ${formState.touched() ? 'touched' : 'untouched'}`;
  });

  patchExampleData(): void {
    this.registrationModel.set({
      name: 'Taylor Kim',
      email: 'taylor@example.com',
      role: 'reviewer',
      notes: 'I want to evaluate signal-based forms for new Angular features.',
    });
  }

  resetForm(): void {
    this.registrationModel.set({ ...emptyRegistrationForm });
    this.registrationForm().reset();
    this.submitMessage.set('Form reset to empty values.');
  }

  markTouchedPreview(): void {
    this.registrationForm.name().markAsTouched();
    this.registrationForm.email().markAsTouched();
  }

  async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();

    const success = await submit(this.registrationForm, async () => {
      this.submitMessage.set(
        `Submitted ${this.registrationModel().name} as ${this.registrationModel().role}.`,
      );
      this.registrationForm().reset();
      this.registrationModel.set({ ...emptyRegistrationForm });
    });

    if (!success) {
      this.submitMessage.set('Submission blocked until the form becomes valid.');
    }
  }

  showFieldError(field: typeof this.registrationForm.name): boolean {
    return field().touched() && field().invalid();
  }

  firstErrorMessage(field: typeof this.registrationForm.name): string {
    return field().errors()[0]?.message ?? 'Invalid field.';
  }
}
