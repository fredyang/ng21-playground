---
name: 'Create Angular Demo'
description: 'Create a new Angular feature demo page in the playground app, register it in the catalog, and keep it consistent with the existing demo pattern.'
argument-hint: 'Feature name and what the demo should teach'
agent: 'agent'
---

Create a new Angular feature demo page for: ${input:Feature name and teaching goal}

Follow the established playground pattern in this workspace:

- Add a dedicated demo page component under [projects/playground/src/app](../../projects/playground/src/app).
- Register the demo in [projects/playground/src/app/demo-catalog.ts](../../projects/playground/src/app/demo-catalog.ts).
- Update [projects/playground/src/app/app.spec.ts](../../projects/playground/src/app/app.spec.ts) so the index-page test expects the new demo title.
- If the feature needs nested child routes or special routing behavior, update [projects/playground/src/app/app.routes.ts](../../projects/playground/src/app/app.routes.ts). Otherwise prefer the existing generic `/demo/:slug` route.

Implementation expectations:

- Use modern Angular patterns already used in this repo: standalone components, `ChangeDetectionStrategy.OnPush`, signals, `computed()`, `input()`, `output()`, `model()` when relevant, and native control flow.
- Keep demo code simple and readable.
- Prefer public-by-default members for anything the template reads or calls.
- Use `private` only for true internals, injected dependencies, and helper methods the template should not touch.
- Use `readonly` only when the property reference itself should not be reassigned.
- Avoid `protected` unless there is a real inheritance reason.
- Match the existing visual style: a dedicated full-page demo with a back link, clear teaching sections, and interactive controls when useful.
- Favor a real, hands-on comparison or behavior-driven demonstration instead of static explanatory text.

Validation expectations:

- Check Angular diagnostics for all touched files.
- Fix any issues introduced by the change.
- If practical, run a focused lint pass for the touched files.

When choosing the structure of the demo:

- Prefer one main page component unless the feature naturally needs supporting child components.
- Use local demo data where possible so the page works without external services.
- Make the difference or benefit of the feature obvious from user interaction.

At the end, summarize:

- what files were added or changed
- what the demo teaches
- any validation that was completed or could not be confirmed
