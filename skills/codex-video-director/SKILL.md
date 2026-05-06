---
name: codex-video-director
description: Use when creating coded product videos, factual timeline videos, product history films, tutorial videos, AI workflow demos, launch clips, animated dashboards, or social-ready motion scenes with Codex, ChatGPT image generation, Figma, HyperFrames, Remotion, React/HTML/CSS, browser preview, or video export. Guides the workflow from research and storyboard to visual references, plugin routing, code reconstruction, motion QA, and final delivery.
---

# Codex Video Director

Turn a vague video idea into a coded motion deliverable by separating visual direction from implementation. Use research, Figma-ready storyboards, generated reference frames, HyperFrames cinematic motion, and Remotion data-driven scenes so the result remains factual, editable, and reusable.

## Workflow

1. **Storyboard first**
   - Write one short scene spec per beat: objective, visible elements, exact copy, timing, motion order, and acceptance checks.
   - Use `assets/templates/storyboard.md` and the stricter structure in `references/storyboard-spec.md` when the request is ambiguous.

2. **Generate reference images**
   - Produce reference frames before writing code.
   - Use `references/image-prompt-patterns.md` for American SaaS, Japanese editorial, UI scenes, cutouts, and background textures.
   - Keep generated text out of images unless the user explicitly needs bitmap text. Recreate labels in code.

3. **Split image layer and code layer**
   - Code layer: text, metrics, UI cards, charts, buttons, labels, timing, and transitions.
   - Image layer: backgrounds, editorial illustrations, textures, product mood frames.
   - Do not bake important text or numbers into generated images when the code can render them.

4. **Route the production tools**
   - Use Figma for moodboards, storyboard frames, visual tokens, and README cover direction.
   - Use HyperFrames for cinematic HTML motion, title cards, captions, overlays, and transitions.
   - Use Remotion for data-driven React timelines, charts, milestone cards, and parameterized renders.
   - See `references/plugin-routing.md` before choosing a stack for a serious video.

5. **Ask Codex to analyze before coding**
   - Use the prompts in `references/codex-motion-prompts.md`.
   - Require Codex to first describe layout hierarchy, component list, and motion sequence, then implement one scene at a time.
   - Keep changes scoped to the current scene or template unless the user requests a broader refactor.

6. **Verify visually and export**
   - Preview each scene before combining.
   - Check frame composition, text fit, timing, contrast, asset paths, and video playback.
   - Deliver source files plus an exported MP4/GIF when requested.

## Default Output Structure

For a new project, create:

```text
demo-name/
├── storyboard.md
├── scene-plan.json
├── assets/
│   ├── prompts.md
│   ├── reference-frames/
│   └── generated/
├── src/
│   └── scenes/
└── renders/
```

Use this shape as a default, not a prison. Match the user's existing repo when one exists.

## Quality Bar

- Prefer a few high-control scenes over many vague ones.
- For factual stories, verify claims and keep sources in `sources.md`.
- Make every scene independently previewable.
- Use exact copy and exact numbers in code.
- Recreate charts and UI with code, not screenshots, when editability matters.
- Ask for concrete visual feedback: position, color, timing, scale, contrast, or hierarchy.
- Avoid generic requests like "make it more premium"; translate them into specific changes.

## Resources

- `references/storyboard-spec.md`: scene spec contract and acceptance criteria.
- `references/image-prompt-patterns.md`: prompt patterns for SaaS and Japanese editorial styles.
- `references/codex-motion-prompts.md`: implementation prompts for Codex.
- `references/plugin-routing.md`: Figma, HyperFrames, and Remotion routing rules.
- `references/factual-story-video.md`: workflow for product histories and factual timelines.
- `assets/templates/storyboard.md`: reusable storyboard template.
- `assets/templates/scene.json`: reusable scene timeline template.
- `assets/templates/demo-readme.md`: demo documentation template.
