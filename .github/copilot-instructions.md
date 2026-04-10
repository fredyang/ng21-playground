# Copilot Instructions

Use these conventions when generating or editing Angular code in this workspace.

## Angular component member visibility

- Prefer public-by-default members for anything read or called from the template.
- Use `private` for injected dependencies, helper methods, and internal state that the template should not touch.
- Use `readonly` only when the property reference itself should not be reassigned, such as signals, computed values, resources, inputs, and outputs.
- Avoid `protected` for normal template-facing members. Only use it when there is a real inheritance or subclass contract.

## Keep demo code simple

- Favor the least noisy component API that still communicates intent.
- Do not add extra wrappers or helper methods just to avoid small template expressions.
- For demo pages, optimize for readability over rigid ceremony.
