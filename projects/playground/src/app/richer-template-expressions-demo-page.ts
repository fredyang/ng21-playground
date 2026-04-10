import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface ExpressionTrack {
  readonly id: number;
  readonly title: string;
  readonly family: string;
  readonly minutes: number;
  readonly selected: boolean;
}

abstract class DemoArtifact {
  constructor(readonly name: string) {}
}

class ReleaseNotesArtifact extends DemoArtifact {
  constructor(
    name: string,
    readonly highlightCount: number,
  ) {
    super(name);
  }
}

class MigrationGuideArtifact extends DemoArtifact {
  constructor(
    name: string,
    readonly checklistCount: number,
  ) {
    super(name);
  }
}

@Component({
  selector: 'app-richer-template-expressions-demo-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JsonPipe, RouterLink],
  template: `
    <main
      class="min-h-dvh bg-[radial-gradient(circle_at_top_right,#dbeafe_0,transparent_22%),linear-gradient(180deg,#f8fbff_0%,#ffffff_26%,#f8fafc_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8"
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
            class="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700"
          >
            /demo/richer-template-expressions
          </span>
        </div>

        <section
          class="rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_28px_90px_-40px_rgba(15,23,42,0.35)] backdrop-blur lg:p-10"
        >
          <div class="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(21rem,0.9fr)] lg:items-start">
            <div>
              <div
                class="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700"
              >
                Angular template expressions
              </div>
              <h1
                class="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.08em] text-slate-950 sm:text-5xl lg:text-[3.55rem] lg:leading-[0.94]"
              >
                Richer template expressions make inline
                <span class="text-sky-600">view logic</span> much more capable
              </h1>
              <p class="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                This demo keeps the state simple and pushes the interesting work into the template
                itself: arrow functions inside array methods, spread in arrays and objects, spread
                into rest-parameter helpers, regex literals, and <strong>instanceof</strong> checks.
              </p>

              <div class="mt-8 grid gap-4 sm:grid-cols-3">
                <article class="rounded-2xl border border-sky-200 bg-sky-50/70 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                    More expressive
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    You can shape data inline instead of creating tiny one-off helpers just to feed
                    the view.
                  </p>
                </article>
                <article class="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700">
                    Still reactive
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    Signals drive the state, while the template uses richer expressions to project
                    and summarize it.
                  </p>
                </article>
                <article class="rounded-2xl border border-teal-200 bg-teal-50/70 p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                    Best use
                  </p>
                  <p class="mt-2 text-sm leading-6 text-slate-700">
                    Good for light projection and formatting. Keep heavier data transforms in
                    computed state or services.
                  </p>
                </article>
              </div>
            </div>

            <aside class="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Playground controls
              </p>
              <p class="mt-3 text-lg font-semibold tracking-[-0.03em] text-slate-950">
                {{ selectedCount() }} of {{ tracks().length }} tracks selected
              </p>
              <p class="mt-2 text-sm leading-6 text-slate-600">
                Toggle tracks, swap artifacts, and type a keyword to make the template expressions
                recompute in place.
              </p>

              <label class="mt-5 block text-sm font-medium text-slate-700" for="regex-keyword"
                >Regex keyword</label
              >
              <input
                id="regex-keyword"
                class="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-sky-500"
                type="text"
                [value]="keyword()"
                (input)="keyword.set(($any($event.target).value ?? '').trim())"
              />
              <p class="mt-2 text-sm text-slate-600">Try values like signal, regex, or router.</p>

              <div class="mt-5 flex flex-wrap gap-2">
                @for (track of tracks(); track track.id) {
                  <button
                    type="button"
                    class="rounded-full border px-3 py-2 text-sm font-medium transition-colors"
                    [class.border-sky-300]="track.selected"
                    [class.bg-sky-100]="track.selected"
                    [class.text-sky-900]="track.selected"
                    [class.border-slate-300]="!track.selected"
                    [class.bg-white]="!track.selected"
                    [class.text-slate-700]="!track.selected"
                    (click)="toggleTrack(track.id)"
                  >
                    {{ track.title }}
                  </button>
                }
              </div>

              <div class="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  class="rounded-full border px-3 py-2 text-sm font-medium transition-colors"
                  [class.border-indigo-300]="artifactMode() === 'release'"
                  [class.bg-indigo-100]="artifactMode() === 'release'"
                  [class.text-indigo-900]="artifactMode() === 'release'"
                  [class.border-slate-300]="artifactMode() !== 'release'"
                  [class.bg-white]="artifactMode() !== 'release'"
                  [class.text-slate-700]="artifactMode() !== 'release'"
                  (click)="artifactMode.set('release')"
                >
                  Release notes artifact
                </button>
                <button
                  type="button"
                  class="rounded-full border px-3 py-2 text-sm font-medium transition-colors"
                  [class.border-teal-300]="artifactMode() === 'migration'"
                  [class.bg-teal-100]="artifactMode() === 'migration'"
                  [class.text-teal-900]="artifactMode() === 'migration'"
                  [class.border-slate-300]="artifactMode() !== 'migration'"
                  [class.bg-white]="artifactMode() !== 'migration'"
                  [class.text-slate-700]="artifactMode() !== 'migration'"
                  (click)="artifactMode.set('migration')"
                >
                  Migration guide artifact
                </button>
              </div>
            </aside>
          </div>

          <section class="mt-8 grid gap-5 xl:grid-cols-2">
            <article class="rounded-[1.75rem] border border-sky-200 bg-sky-50/70 p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                Arrow functions
              </p>
              <h2 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                filter() and map() directly in the template
              </h2>
              <p class="mt-4 text-sm leading-6 text-slate-700">
                This list is built with inline arrow functions over the selected tracks.
              </p>
              <div class="mt-5 rounded-2xl border border-sky-200 bg-white p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Selected titles
                </p>
                <p class="mt-2 text-lg font-semibold text-slate-950">
                  {{ tracks().filter((track) => track.selected).map((track) => track.title).join(', ') || 'None selected' }}
                </p>
              </div>
            </article>

            <article class="rounded-[1.75rem] border border-indigo-200 bg-indigo-50/70 p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700">
                Array spread
              </p>
              <h2 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Build arrays inline with spread elements
              </h2>
              <p class="mt-4 text-sm leading-6 text-slate-700">
                The chip row mixes a fixed label, the current artifact mode, and projected track
                families from the selected rows.
              </p>
              <div
                class="mt-5 flex flex-wrap gap-2 rounded-2xl border border-indigo-200 bg-white p-4"
              >
                @for (
                  label of ['template-expr', artifactMode(), ...tracks().filter((track) => track.selected).map((track) => track.family)];
                  track $index
                ) {
                  <span
                    class="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-900"
                  >
                    {{ label }}
                  </span>
                }
              </div>
            </article>

            <article class="rounded-[1.75rem] border border-teal-200 bg-teal-50/70 p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                Object spread
              </p>
              <h2 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Compose an object literal inside interpolation
              </h2>
              <p class="mt-4 text-sm leading-6 text-slate-700">
                The JSON below comes from an object spread expression in the template, not from a
                component method.
              </p>
              <pre
                class="mt-5 overflow-x-auto rounded-2xl border border-teal-200 bg-white p-4 text-sm leading-6 text-slate-700"
                >{{ { ...basePreview(), mode: artifactMode(), selectedTitles: tracks().filter((track) => track.selected).map((track) => track.title), totalMinutes: sumMinutes(...tracks().filter((track) => track.selected).map((track) => track.minutes)) } | json }}</pre
              >
            </article>

            <article class="rounded-[1.75rem] border border-amber-200 bg-amber-50/70 p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                Rest args in function calls
              </p>
              <h2 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Spread selected minutes into a rest-parameter helper
              </h2>
              <p class="mt-4 text-sm leading-6 text-slate-700">
                Angular now accepts spread arguments in function calls, so the template can pass a
                projected list directly into a helper with rest parameters.
              </p>
              <div class="mt-5 rounded-2xl border border-amber-200 bg-white p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Runtime summary
                </p>
                <p class="mt-2 text-lg font-semibold text-slate-950">
                  {{ describeMinutes('Selected runtime', ...tracks().filter((track) => track.selected).map((track) => track.minutes)) }}
                </p>
              </div>
            </article>

            <article class="rounded-[1.75rem] border border-rose-200 bg-rose-50/70 p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                Regex literals
              </p>
              <h2 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Evaluate a regex directly in the template
              </h2>
              <p class="mt-4 text-sm leading-6 text-slate-700">
                The current keyword is tested against a literal regex inside interpolation.
              </p>
              <div class="mt-5 rounded-2xl border border-rose-200 bg-white p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Regex verdict
                </p>
                <p class="mt-2 text-lg font-semibold text-slate-950">
                  {{
                    /signal|router|template|regex/i.test(keyword())
                      ? 'Matches one of the spotlight terms.'
                      : 'No spotlight match yet.'
                  }}
                </p>
              </div>
            </article>

            <article class="rounded-[1.75rem] border border-cyan-200 bg-cyan-50/70 p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                instanceof
              </p>
              <h2 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                Branch on a class type directly in the template
              </h2>
              <p class="mt-4 text-sm leading-6 text-slate-700">
                The active artifact is a class instance. The template can inspect its runtime type
                without a special adapter property.
              </p>
              <div class="mt-5 rounded-2xl border border-cyan-200 bg-white p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Active artifact
                </p>
                <p class="mt-2 text-lg font-semibold text-slate-950">{{ activeArtifact().name }}</p>
                <p class="mt-2 text-sm text-slate-600">
                  Template instanceof result:
                  {{ activeArtifact() instanceof ReleaseNotesArtifact ? 'ReleaseNotesArtifact' : 'MigrationGuideArtifact' }}
                </p>
                @if (releaseArtifact()) {
                  <p class="mt-2 text-sm text-slate-600">
                    Release notes with {{ releaseArtifact()!.highlightCount }} launch highlights.
                  </p>
                } @else if (migrationArtifact()) {
                  <p class="mt-2 text-sm text-slate-600">
                    Migration guide with {{ migrationArtifact()!.checklistCount }} checklist
                    sections.
                  </p>
                }
              </div>
            </article>
          </section>
        </section>
      </div>
    </main>
  `,
})
export class RicherTemplateExpressionsDemoPage {
  readonly ReleaseNotesArtifact = ReleaseNotesArtifact;
  readonly MigrationGuideArtifact = MigrationGuideArtifact;

  readonly tracks = signal<readonly ExpressionTrack[]>([
    { id: 1, title: 'Signal helpers', family: 'signals', minutes: 9, selected: true },
    { id: 2, title: 'Router data', family: 'router', minutes: 7, selected: true },
    { id: 3, title: 'Regex guards', family: 'templates', minutes: 6, selected: false },
    { id: 4, title: 'Expression parser', family: 'compiler', minutes: 11, selected: false },
  ]);
  readonly keyword = signal('signal');
  readonly artifactMode = signal<'release' | 'migration'>('release');
  readonly selectedCount = computed(() => this.tracks().filter((track) => track.selected).length);
  readonly activeArtifact = computed<DemoArtifact>(() => {
    if (this.artifactMode() === 'release') {
      return new ReleaseNotesArtifact('Angular template refresh', 5);
    }

    return new MigrationGuideArtifact('Template upgrade checklist', 8);
  });
  readonly releaseArtifact = computed(() => {
    const artifact = this.activeArtifact();
    return artifact instanceof ReleaseNotesArtifact ? artifact : null;
  });
  readonly migrationArtifact = computed(() => {
    const artifact = this.activeArtifact();
    return artifact instanceof MigrationGuideArtifact ? artifact : null;
  });

  toggleTrack(trackId: number): void {
    this.tracks.update((tracks) =>
      tracks.map((track) =>
        track.id === trackId ? { ...track, selected: !track.selected } : track,
      ),
    );
  }

  describeMinutes(label: string, ...minutes: number[]): string {
    if (minutes.length === 0) {
      return `${label}: nothing selected yet`;
    }

    return `${label}: ${this.sumMinutes(...minutes)} min`;
  }

  sumMinutes(...minutes: number[]): number {
    return minutes.reduce((total, value) => total + value, 0);
  }

  basePreview(): { readonly focus: string; readonly version: string } {
    return {
      focus: 'template-expressions',
      version: 'v21',
    };
  }
}
