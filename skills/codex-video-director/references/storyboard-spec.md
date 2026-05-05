# Storyboard Spec

Use this spec before generating images or writing code. Each scene must be small enough to preview and fix independently.

## Scene Contract

```markdown
## Scene [number]: [short name]

Goal:
[What the viewer should understand after this scene.]

Visual reference:
[Reference image path or prompt name.]

Frame:
- Aspect ratio:
- Background:
- Foreground elements:
- Exact text:
- Metrics or labels:

Motion:
1. [First visible action and timestamp]
2. [Second visible action and timestamp]
3. [Exit or transition]

Acceptance checks:
- [Composition check]
- [Text fit check]
- [Timing check]
- [Asset/path check]
```

## Timing Defaults

- Hook scene: 3-5 seconds.
- Product proof scene: 8-12 seconds.
- Workflow scene: 8-12 seconds.
- Close scene: 4-6 seconds.

For GitHub demos, keep the full video between 30 and 45 seconds.

## Copy Rules

- Put important text in code, not in generated images.
- Keep metrics short and legible.
- Use one message per scene.
- Prefer concrete outcomes: "68% already solved by docs" beats "better support automation."
