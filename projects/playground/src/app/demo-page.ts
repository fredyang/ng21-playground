import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { demoCatalog, findDemoBySlug } from './demo-catalog';

@Component({
  selector: 'app-demo-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgComponentOutlet, RouterLink],
  template: `
    @if (selectedDemo()) {
      <ng-container *ngComponentOutlet="selectedDemo()!.component" />
    } @else {
      <main class="min-h-dvh bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div
          class="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm"
        >
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Demo not found
          </p>
          <h1 class="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
            No demo exists for “{{ slug() }}”.
          </h1>
          <p class="mt-4 text-base leading-7 text-slate-600">
            This route is handled by a single dynamic matcher. Add a new slug and page component,
            and it will fit the same URL pattern.
          </p>
          <div class="mt-6 flex flex-wrap gap-2">
            @for (demo of demos; track demo.slug) {
              <a
                [routerLink]="['/demo', demo.slug]"
                class="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100"
              >
                {{ demo.slug }}
              </a>
            }
          </div>
          <a
            routerLink="/"
            class="mt-8 inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Back to demo index
          </a>
        </div>
      </main>
    }
  `,
})
export class DemoPage {
  protected readonly demos = demoCatalog;

  private readonly route = inject(ActivatedRoute);
  private readonly routeSlug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('slug') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('slug') ?? '' },
  );

  protected readonly slug = computed(() => this.routeSlug());
  protected readonly selectedDemo = computed(() => findDemoBySlug(this.slug()));
}
