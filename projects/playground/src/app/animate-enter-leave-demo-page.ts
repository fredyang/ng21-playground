import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

type ConversationStatus = 'new' | 'waiting' | 'resolved' | 'archived';

interface SupportConversation {
  readonly id: number;
  readonly customer: string;
  readonly subject: string;
  readonly status: ConversationStatus;
  readonly channel: 'email' | 'chat' | 'phone';
  readonly sla: 'due now' | 'today' | 'healthy';
}

interface StatusSnapshot {
  readonly id: number;
  readonly status: ConversationStatus;
}

interface UndoToast {
  readonly id: number;
  readonly title: string;
  readonly detail: string;
  readonly previousStatuses: readonly StatusSnapshot[];
}

const initialConversations: readonly SupportConversation[] = [
  {
    id: 101,
    customer: 'Ari Chen',
    subject: 'Invoice mismatch on April subscription',
    status: 'new',
    channel: 'email',
    sla: 'due now',
  },
  {
    id: 102,
    customer: 'Kira Patel',
    subject: 'Need access restored for suspended teammate',
    status: 'waiting',
    channel: 'chat',
    sla: 'today',
  },
  {
    id: 103,
    customer: 'Noah Brooks',
    subject: 'Shipping label generated twice for the same order',
    status: 'new',
    channel: 'phone',
    sla: 'due now',
  },
  {
    id: 104,
    customer: 'Lena Schmidt',
    subject: 'Contract export succeeded but email notification did not send',
    status: 'waiting',
    channel: 'email',
    sla: 'healthy',
  },
];

@Component({
  selector: 'app-animate-enter-leave-demo-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  styles: `
    .selection-tray {
      transition:
        opacity 220ms ease,
        transform 220ms ease,
        box-shadow 220ms ease;
    }

    .selection-tray-enter {
      box-shadow: 0 28px 80px -34px rgba(15, 23, 42, 0.35);

      @starting-style {
        opacity: 0;
        transform: translateY(1rem) scale(0.98);
        box-shadow: 0 12px 30px -20px rgba(15, 23, 42, 0.2);
      }
    }

    .selection-tray-leave {
      opacity: 0;
      transform: translateY(1rem) scale(0.98);
      box-shadow: 0 12px 30px -20px rgba(15, 23, 42, 0.2);
    }

    .toast-card {
      transition:
        opacity 200ms ease,
        transform 200ms ease;
    }

    .toast-enter {
      @starting-style {
        opacity: 0;
        transform: translateY(0.85rem) scale(0.97);
      }
    }

    .toast-leave {
      opacity: 0;
      transform: translateX(1.25rem) scale(0.98);
    }
  `,
  template: `
    <main
      class="min-h-dvh bg-[radial-gradient(circle_at_top_left,#dcfce7_0,transparent_22%),linear-gradient(180deg,#f7fee7_0%,#ffffff_28%,#f8fafc_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8"
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
            class="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700"
          >
            /demo/animate-enter-leave
          </span>
        </div>

        <section
          class="rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_28px_90px_-40px_rgba(15,23,42,0.35)] backdrop-blur lg:p-10"
        >
          <div
            class="grid gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(22rem,0.88fr)] lg:items-start"
          >
            <div>
              <div
                class="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700"
              >
                Enter and leave animations
              </div>
              <h1
                class="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.08em] text-slate-950 sm:text-5xl lg:text-[3.5rem] lg:leading-[0.94]"
              >
                Use <span class="text-emerald-600">animate.enter</span> and
                <span class="text-lime-600">animate.leave</span> for real workflow feedback
              </h1>
              <p class="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                This demo models a support inbox. Selecting conversations reveals a bulk-action
                tray, and completing an action creates an undo toast. Those are both common product
                patterns where abrupt DOM changes feel cheap and easy to miss without motion.
              </p>

              <div class="mt-8 grid gap-4 sm:grid-cols-3">
                <article class="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Selection tray
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    The tray enters only when there is work to do, then leaves cleanly once the
                    action completes.
                  </p>
                </article>
                <article class="rounded-2xl border border-lime-200 bg-lime-50/70 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-lime-700">
                    Undo notifications
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    Toasts enter with visible motion and leave without collapsing the stack
                    abruptly.
                  </p>
                </article>
                <article class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                    No legacy triggers
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    The motion is driven by CSS classes applied directly through
                    <span class="font-semibold text-slate-900">animate.enter</span> and
                    <span class="font-semibold text-slate-900">animate.leave</span>.
                  </p>
                </article>
              </div>
            </div>

            <aside class="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                What this solves
              </p>
              <div class="mt-4 space-y-4 text-sm leading-6 text-slate-600">
                <p>
                  Bulk selection trays often pop in at the bottom of the screen. Without enter
                  animation, users miss the new affordance.
                </p>
                <p>
                  Undo toasts frequently appear and disappear in response to user actions. Leave
                  animation prevents them from blinking out while someone is moving toward the undo
                  action.
                </p>
              </div>

              <div class="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Try this flow
                </p>
                <ol class="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                  <li>1. Select two conversations.</li>
                  <li>2. Watch the bulk tray animate into view.</li>
                  <li>3. Archive or resolve them.</li>
                  <li>4. Use Undo from the toast stack.</li>
                </ol>
              </div>
            </aside>
          </div>

          <section class="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
            <div>
              <div class="mb-4 flex items-end justify-between gap-4">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Support inbox
                  </p>
                  <h2 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                    Bulk-action workflow
                  </h2>
                </div>
                <button
                  type="button"
                  class="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100"
                  (click)="resetDemo()"
                >
                  Reset demo
                </button>
              </div>

              <div class="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white">
                <div
                  class="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
                >
                  <span>Select</span>
                  <span>Conversation</span>
                  <span>Status</span>
                </div>

                <div class="divide-y divide-slate-200">
                  @for (conversation of conversations(); track conversation.id) {
                    <label
                      class="grid cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] gap-4 px-5 py-4 transition-colors hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        class="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        [checked]="isSelected(conversation.id)"
                        (change)="toggleSelection(conversation.id)"
                        [attr.aria-label]="'Select conversation from ' + conversation.customer"
                      />

                      <div class="min-w-0">
                        <div class="flex flex-wrap items-center gap-2">
                          <p class="text-sm font-semibold text-slate-950">
                            {{ conversation.customer }}
                          </p>
                          <span
                            class="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]"
                            [class]="channelBadgeClass(conversation.channel)"
                          >
                            {{ conversation.channel }}
                          </span>
                          <span
                            class="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]"
                            [class]="slaBadgeClass(conversation.sla)"
                          >
                            {{ conversation.sla }}
                          </span>
                        </div>
                        <p class="mt-2 text-sm leading-6 text-slate-600">
                          {{ conversation.subject }}
                        </p>
                      </div>

                      <span
                        class="h-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]"
                        [class]="statusBadgeClass(conversation.status)"
                      >
                        {{ conversation.status }}
                      </span>
                    </label>
                  }
                </div>
              </div>

              @if (hasSelection()) {
                <section
                  class="selection-tray mt-5 rounded-[1.5rem] border border-emerald-200 bg-emerald-50/85 p-4"
                  animate.enter="selection-tray-enter"
                  animate.leave="selection-tray-leave"
                >
                  <div class="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                        Bulk actions ready
                      </p>
                      <p class="mt-2 text-sm leading-6 text-slate-700">
                        {{ selectedCount() }} conversation{{ selectedCount() === 1 ? '' : 's' }}
                        selected. This tray entering and leaving is the real reason to reach for
                        <span class="font-semibold text-slate-900">animate.enter</span> and
                        <span class="font-semibold text-slate-900">animate.leave</span>.
                      </p>
                    </div>

                    <div class="flex flex-wrap gap-2">
                      <button
                        type="button"
                        class="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                        (click)="applyAction('archived')"
                      >
                        Archive selected
                      </button>
                      <button
                        type="button"
                        class="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100"
                        (click)="applyAction('resolved')"
                      >
                        Mark resolved
                      </button>
                      <button
                        type="button"
                        class="rounded-full border border-transparent px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white/80"
                        (click)="clearSelection()"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </section>
              }
            </div>

            <aside class="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Undo toasts
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-600">
                    Each toast enters when an action succeeds and leaves when dismissed or undone.
                  </p>
                </div>
                <button
                  type="button"
                  class="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100"
                  (click)="clearToasts()"
                >
                  Clear all
                </button>
              </div>

              <div class="mt-5 space-y-3">
                @for (toast of toasts(); track toast.id) {
                  <article
                    class="toast-card rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    animate.enter="toast-enter"
                    animate.leave="toast-leave"
                  >
                    <p class="text-sm font-semibold text-slate-950">{{ toast.title }}</p>
                    <p class="mt-2 text-sm leading-6 text-slate-600">{{ toast.detail }}</p>
                    <div class="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        class="rounded-full bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
                        (click)="undoToast(toast.id)"
                      >
                        Undo
                      </button>
                      <button
                        type="button"
                        class="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100"
                        (click)="dismissToast(toast.id)"
                      >
                        Dismiss
                      </button>
                    </div>
                  </article>
                } @empty {
                  <div
                    class="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-4 text-sm leading-6 text-slate-600"
                  >
                    Run a bulk action to add a toast. This is the common UI pattern where leave
                    animation matters just as much as enter animation.
                  </div>
                }
              </div>
            </aside>
          </section>
        </section>
      </div>
    </main>
  `,
})
export class AnimateEnterLeaveDemoPage {
  conversations = signal<readonly SupportConversation[]>(initialConversations);
  selectedIds = signal<readonly number[]>([]);
  toasts = signal<readonly UndoToast[]>([]);
  private nextToastId = 1;

  selectedCount = computed(() => this.selectedIds().length);
  hasSelection = computed(() => this.selectedCount() > 0);

  isSelected(id: number): boolean {
    return this.selectedIds().includes(id);
  }

  toggleSelection(id: number): void {
    this.selectedIds.update((ids) =>
      ids.includes(id) ? ids.filter((existingId) => existingId !== id) : [...ids, id],
    );
  }

  clearSelection(): void {
    this.selectedIds.set([]);
  }

  clearToasts(): void {
    this.toasts.set([]);
  }

  resetDemo(): void {
    this.conversations.set(initialConversations);
    this.selectedIds.set([]);
    this.toasts.set([]);
    this.nextToastId = 1;
  }

  applyAction(nextStatus: Extract<ConversationStatus, 'resolved' | 'archived'>): void {
    const ids = this.selectedIds();

    if (ids.length === 0) {
      return;
    }

    const previousStatuses = this.conversations()
      .filter((conversation) => ids.includes(conversation.id))
      .map((conversation) => ({ id: conversation.id, status: conversation.status }));

    this.conversations.update((conversations) =>
      conversations.map((conversation) =>
        ids.includes(conversation.id) ? { ...conversation, status: nextStatus } : conversation,
      ),
    );

    this.selectedIds.set([]);
    this.pushToast({
      title:
        nextStatus === 'archived'
          ? `Archived ${ids.length} conversation${ids.length === 1 ? '' : 's'}`
          : `Resolved ${ids.length} conversation${ids.length === 1 ? '' : 's'}`,
      detail:
        nextStatus === 'archived'
          ? 'The queue is cleaner, but support leads still get a visible undo path.'
          : 'Agents can keep momentum without losing the chance to reverse a bulk action.',
      previousStatuses,
    });
  }

  undoToast(toastId: number): void {
    const toast = this.toasts().find((entry) => entry.id === toastId);

    if (!toast) {
      return;
    }

    const previousStatusMap = new Map(
      toast.previousStatuses.map((entry) => [entry.id, entry.status]),
    );

    this.conversations.update((conversations) =>
      conversations.map((conversation) => {
        const previousStatus = previousStatusMap.get(conversation.id);
        return previousStatus ? { ...conversation, status: previousStatus } : conversation;
      }),
    );

    this.dismissToast(toastId);
  }

  dismissToast(toastId: number): void {
    this.toasts.update((toasts) => toasts.filter((toast) => toast.id !== toastId));
  }

  statusBadgeClass(status: ConversationStatus): string {
    switch (status) {
      case 'new':
        return 'bg-rose-100 text-rose-700';
      case 'waiting':
        return 'bg-amber-100 text-amber-700';
      case 'resolved':
        return 'bg-emerald-100 text-emerald-700';
      case 'archived':
        return 'bg-slate-200 text-slate-700';
    }
  }

  channelBadgeClass(channel: SupportConversation['channel']): string {
    switch (channel) {
      case 'email':
        return 'bg-sky-100 text-sky-700';
      case 'chat':
        return 'bg-violet-100 text-violet-700';
      case 'phone':
        return 'bg-orange-100 text-orange-700';
    }
  }

  slaBadgeClass(sla: SupportConversation['sla']): string {
    switch (sla) {
      case 'due now':
        return 'bg-rose-100 text-rose-700';
      case 'today':
        return 'bg-amber-100 text-amber-700';
      case 'healthy':
        return 'bg-emerald-100 text-emerald-700';
    }
  }

  private pushToast(toast: Omit<UndoToast, 'id'>): void {
    const nextToast: UndoToast = { ...toast, id: this.nextToastId++ };
    this.toasts.update((toasts) => [nextToast, ...toasts].slice(0, 4));
  }
}
