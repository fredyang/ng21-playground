import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { map, startWith } from 'rxjs';

type SupportPriority = 'low' | 'normal' | 'high' | 'urgent';
type ProductArea = 'ui-platform' | 'design-system' | 'checkout' | 'operations';

interface SupportRequest {
  requester: string;
  email: string;
  productArea: ProductArea;
  priority: SupportPriority;
  summary: string;
  details: string;
  shareLogs: boolean;
  needsA11yReview: boolean;
  notifyOnUpdate: boolean;
}

interface SubmittedRequest extends SupportRequest {
  submittedAt: string;
}

@Component({
  selector: 'app-angular-material-form-demo-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
  ],
  template: `
    <main
      class="min-h-dvh bg-[radial-gradient(circle_at_top_left,#dbeafe_0,transparent_26%),radial-gradient(circle_at_bottom_right,#dcfce7_0,transparent_24%),linear-gradient(180deg,#f8fafc_0%,#ffffff_28%,#eef2ff_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8"
    >
      <div class="mx-auto max-w-7xl">
        <div class="mb-6 flex items-center justify-between gap-4">
          <a
            routerLink="/"
            class="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100"
          >
            Back to demo index
          </a>
          <span
            class="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700"
          >
            /demo/angular-material-form
          </span>
        </div>

        <section
          class="rounded-[2rem] border border-white/80 bg-white/88 p-6 shadow-[0_28px_90px_-42px_rgba(15,23,42,0.35)] backdrop-blur lg:p-10"
        >
          <div
            class="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(21rem,0.85fr)] lg:items-start"
          >
            <div>
              <div
                class="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700"
              >
                Tailwind + Angular Material
              </div>
              <h1
                class="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.08em] text-slate-950 sm:text-5xl lg:text-[3.55rem] lg:leading-[0.94]"
              >
                A practical Angular Material form inside a Tailwind-driven page shell
              </h1>
              <p class="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                The outer layout, spacing, and page composition use Tailwind. The interactive form
                controls, validation chrome, progress bar, and feedback use Angular Material. This
                is the cleanest way to mix the two libraries in a real app.
              </p>

              <div class="mt-8 grid gap-4 sm:grid-cols-3">
                <article class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Material does
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    Accessible form controls, validation messages, focus styles, and snack-bar
                    feedback.
                  </p>
                </article>
                <article class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Tailwind does
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    Page layout, responsive spacing, visual framing, and supporting content blocks.
                  </p>
                </article>
                <article class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Good split
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    Avoids fighting Material internals while keeping the surrounding UI flexible.
                  </p>
                </article>
              </div>
            </div>

            <mat-card
              class="!rounded-[1.75rem] !border !border-slate-200 !bg-slate-50/80 !shadow-none"
            >
              <mat-card-content class="!p-6">
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Live state
                </p>
                <p class="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                  {{ completionPercent() }}% ready
                </p>
                <p class="mt-2 text-sm leading-6 text-slate-600">
                  {{ readinessMessage() }}
                </p>

                <mat-progress-bar class="mt-5" mode="determinate" [value]="completionPercent()" />

                <div class="mt-6 grid gap-4">
                  <div class="rounded-2xl border border-slate-200 bg-white p-4">
                    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Routing summary
                    </p>
                    <p class="mt-2 text-base font-semibold text-slate-950">
                      {{ previewHeadline() }}
                    </p>
                    <p class="mt-1 text-sm text-slate-600">{{ previewSubhead() }}</p>
                  </div>

                  <div class="rounded-2xl border border-slate-200 bg-white p-4">
                    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Handling notes
                    </p>
                    <ul class="mt-2 space-y-2 text-sm leading-6 text-slate-600">
                      <li>{{ logCaptureMessage() }}</li>
                      <li>{{ accessibilityMessage() }}</li>
                      <li>{{ notificationMessage() }}</li>
                    </ul>
                  </div>

                  @if (lastSubmission()) {
                    <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                        Last demo submission
                      </p>
                      <p class="mt-2 text-base font-semibold text-slate-950">
                        {{ lastSubmission()!.summary }}
                      </p>
                      <p class="mt-1 text-sm text-slate-600">
                        {{ lastSubmission()!.requester }} · {{ lastSubmission()!.submittedAt }}
                      </p>
                    </div>
                  }
                </div>
              </mat-card-content>
            </mat-card>
          </div>

          <div
            class="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)] xl:items-start"
          >
            <mat-card class="!rounded-[1.75rem] !border !border-slate-200 !shadow-none">
              <mat-card-content class="!p-6 lg:!p-7">
                <div class="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Demo form
                    </p>
                    <h2 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                      Product support intake
                    </h2>
                  </div>
                  <button type="button" mat-stroked-button (click)="loadExample()">
                    Load sample issue
                  </button>
                </div>

                <form
                  class="mt-6 grid gap-5"
                  [formGroup]="requestForm"
                  (ngSubmit)="submitRequest()"
                >
                  <div class="grid gap-4 sm:grid-cols-2">
                    <mat-form-field subscriptSizing="dynamic">
                      <mat-label>Requester</mat-label>
                      <input matInput formControlName="requester" autocomplete="name" />
                      @if (
                        formControls.requester.touched &&
                        formControls.requester.hasError('required')
                      ) {
                        <mat-error>Enter the request owner.</mat-error>
                      } @else if (
                        formControls.requester.touched &&
                        formControls.requester.hasError('minlength')
                      ) {
                        <mat-error>Use at least 2 characters.</mat-error>
                      }
                    </mat-form-field>

                    <mat-form-field subscriptSizing="dynamic">
                      <mat-label>Email</mat-label>
                      <input matInput formControlName="email" autocomplete="email" />
                      @if (formControls.email.touched && formControls.email.hasError('required')) {
                        <mat-error>Add a contact email.</mat-error>
                      } @else if (
                        formControls.email.touched && formControls.email.hasError('email')
                      ) {
                        <mat-error>Use a valid email address.</mat-error>
                      }
                    </mat-form-field>

                    <mat-form-field subscriptSizing="dynamic">
                      <mat-label>Product area</mat-label>
                      <mat-select formControlName="productArea">
                        @for (area of productAreas; track area.value) {
                          <mat-option [value]="area.value">{{ area.label }}</mat-option>
                        }
                      </mat-select>
                    </mat-form-field>

                    <mat-form-field subscriptSizing="dynamic">
                      <mat-label>Priority</mat-label>
                      <mat-select formControlName="priority">
                        @for (priority of priorities; track priority.value) {
                          <mat-option [value]="priority.value">{{ priority.label }}</mat-option>
                        }
                      </mat-select>
                    </mat-form-field>

                    <mat-form-field class="sm:col-span-2" subscriptSizing="dynamic">
                      <mat-label>Summary</mat-label>
                      <input matInput formControlName="summary" maxlength="80" />
                      <mat-hint align="end">{{ formValue().summary.length }}/80</mat-hint>
                      @if (
                        formControls.summary.touched && formControls.summary.hasError('required')
                      ) {
                        <mat-error>Summarize the issue in one line.</mat-error>
                      }
                    </mat-form-field>

                    <mat-form-field class="sm:col-span-2" subscriptSizing="dynamic">
                      <mat-label>Details</mat-label>
                      <textarea matInput rows="6" formControlName="details"></textarea>
                      @if (
                        formControls.details.touched && formControls.details.hasError('required')
                      ) {
                        <mat-error>Describe the problem clearly.</mat-error>
                      } @else if (
                        formControls.details.touched && formControls.details.hasError('minlength')
                      ) {
                        <mat-error>Provide at least 20 characters of detail.</mat-error>
                      }
                    </mat-form-field>
                  </div>

                  <div class="rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-4">
                    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Escalation options
                    </p>
                    <div class="mt-4 grid gap-3">
                      <mat-checkbox formControlName="shareLogs">
                        Include browser console and network logs
                      </mat-checkbox>
                      <mat-checkbox formControlName="needsA11yReview">
                        Flag this request for accessibility review
                      </mat-checkbox>
                      <mat-slide-toggle formControlName="notifyOnUpdate">
                        Notify me when status changes
                      </mat-slide-toggle>
                    </div>
                  </div>

                  <div class="flex flex-wrap items-center justify-between gap-3">
                    <button type="button" mat-button (click)="resetForm()">Reset</button>
                    <div class="flex flex-wrap items-center gap-3">
                      <span class="text-sm text-slate-600">{{ formStatusText() }}</span>
                      <button type="submit" mat-flat-button>Submit request</button>
                    </div>
                  </div>
                </form>
              </mat-card-content>
            </mat-card>

            <div class="grid gap-5">
              <mat-card class="!rounded-[1.75rem] !border !border-slate-200 !shadow-none">
                <mat-card-content class="!p-6">
                  <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Why this demo matters
                  </p>
                  <div class="mt-4 grid gap-4 text-sm leading-6 text-slate-600">
                    <div>
                      <p class="font-semibold text-slate-950">Keep Material focused on controls</p>
                      <p class="mt-1">
                        Use Material where behavior, accessibility, and interaction states matter.
                      </p>
                    </div>
                    <mat-divider />
                    <div>
                      <p class="font-semibold text-slate-950">Keep Tailwind around the edges</p>
                      <p class="mt-1">
                        Use Tailwind for the responsive shell, the spacing system, and supporting
                        marketing or dashboard framing.
                      </p>
                    </div>
                    <mat-divider />
                    <div>
                      <p class="font-semibold text-slate-950">Theme once, then compose</p>
                      <p class="mt-1">
                        Material components read from the global theme, while the surrounding layout
                        remains your own design language.
                      </p>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>

              <mat-card class="!rounded-[1.75rem] !border !border-slate-200 !shadow-none">
                <mat-card-content class="!p-6">
                  <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Preview payload
                  </p>
                  <pre
                    class="mt-4 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs leading-6 text-slate-100"
                    >{{ payloadPreview() }}</pre
                  >
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </section>
      </div>
    </main>
  `,
})
export class AngularMaterialFormDemoPage {
  readonly priorities = [
    { value: 'low' as const, label: 'Low' },
    { value: 'normal' as const, label: 'Normal' },
    { value: 'high' as const, label: 'High' },
    { value: 'urgent' as const, label: 'Urgent' },
  ];

  readonly productAreas = [
    { value: 'ui-platform' as const, label: 'UI platform' },
    { value: 'design-system' as const, label: 'Design system' },
    { value: 'checkout' as const, label: 'Checkout flow' },
    { value: 'operations' as const, label: 'Operations tooling' },
  ];

  private readonly formBuilder = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  readonly requestForm = this.formBuilder.nonNullable.group({
    requester: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    productArea: ['ui-platform' as ProductArea, Validators.required],
    priority: ['normal' as SupportPriority, Validators.required],
    summary: ['', [Validators.required]],
    details: ['', [Validators.required, Validators.minLength(20)]],
    shareLogs: true,
    needsA11yReview: false,
    notifyOnUpdate: true,
  });

  readonly formControls = this.requestForm.controls;
  readonly lastSubmission = signal<SubmittedRequest | null>(null);

  readonly formValue = toSignal(
    this.requestForm.valueChanges.pipe(
      map(() => this.requestForm.getRawValue()),
      startWith(this.requestForm.getRawValue()),
    ),
    { initialValue: this.requestForm.getRawValue() },
  );

  private readonly formStatus = toSignal(
    this.requestForm.statusChanges.pipe(startWith(this.requestForm.status)),
    { initialValue: this.requestForm.status },
  );

  readonly completionPercent = computed(() => {
    const value = this.formValue();
    const steps = [
      value.requester.trim().length >= 2,
      /.+@.+\..+/.test(value.email),
      value.summary.trim().length > 0,
      value.details.trim().length >= 20,
      value.productArea.length > 0,
      value.priority.length > 0,
    ];

    return Math.round((steps.filter(Boolean).length / steps.length) * 100);
  });

  readonly readinessMessage = computed(() => {
    if (this.formStatus() === 'VALID') {
      return 'All required fields are valid. This request is ready to route.';
    }

    return 'Complete the required fields to turn the form into a valid submission.';
  });

  readonly previewHeadline = computed(() => {
    const summary = this.formValue().summary.trim();
    return summary || 'No issue summary yet';
  });

  readonly previewSubhead = computed(() => {
    const value = this.formValue();
    return `${this.labelForProductArea(value.productArea)} · ${this.labelForPriority(value.priority)}`;
  });

  readonly logCaptureMessage = computed(() =>
    this.formValue().shareLogs
      ? 'Logs included, so triage can reproduce without a second round-trip.'
      : 'No logs attached, so the assignee may need follow-up before debugging starts.',
  );

  readonly accessibilityMessage = computed(() =>
    this.formValue().needsA11yReview
      ? 'Accessibility review requested before the fix is considered complete.'
      : 'Standard engineering review flow only.',
  );

  readonly notificationMessage = computed(() =>
    this.formValue().notifyOnUpdate
      ? 'Requester will receive status updates automatically.'
      : 'No status notifications will be sent from this demo submission.',
  );

  readonly formStatusText = computed(() =>
    this.formStatus() === 'VALID' ? 'Validation passed' : 'Validation required',
  );

  readonly payloadPreview = computed(() => JSON.stringify(this.requestForm.getRawValue(), null, 2));

  loadExample(): void {
    this.requestForm.setValue({
      requester: 'Maya Chen',
      email: 'maya.chen@example.com',
      productArea: 'checkout',
      priority: 'high',
      summary: 'Checkout form loses validation state after payment step retry',
      details:
        'When a payment authorization fails and the user retries, the shipping section re-renders with stale control state and clears the inline validation messages.',
      shareLogs: true,
      needsA11yReview: true,
      notifyOnUpdate: true,
    });
  }

  resetForm(): void {
    this.requestForm.reset({
      requester: '',
      email: '',
      productArea: 'ui-platform',
      priority: 'normal',
      summary: '',
      details: '',
      shareLogs: true,
      needsA11yReview: false,
      notifyOnUpdate: true,
    });
    this.requestForm.markAsPristine();
    this.requestForm.markAsUntouched();
  }

  submitRequest(): void {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      this.snackBar.open('Complete the required fields before submitting.', 'Dismiss', {
        duration: 3500,
      });
      return;
    }

    this.lastSubmission.set({
      ...this.requestForm.getRawValue(),
      submittedAt: new Date().toLocaleString(),
    });

    this.snackBar.open('Support request captured in the demo.', 'Dismiss', {
      duration: 3000,
    });
  }

  private labelForPriority(priority: SupportPriority): string {
    return this.priorities.find((option) => option.value === priority)?.label ?? 'Unknown';
  }

  private labelForProductArea(productArea: ProductArea): string {
    return this.productAreas.find((option) => option.value === productArea)?.label ?? 'Unknown';
  }
}
