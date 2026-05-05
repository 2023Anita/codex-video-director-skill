# Codex Motion Prompts

Use these prompts after a reference image exists.

## Single Scene Implementation

```text
Strictly use the uploaded reference frame as visual direction for one coded motion scene.

Before writing code, do three things:
1. Analyze the frame layout, hierarchy, color system, and spacing.
2. List the main components needed.
3. Confirm the animation order.

Then implement only this scene:
- Recreate text, metrics, cards, charts, and UI in code.
- Use the image only for background, texture, mood, or illustration layers.
- Match the reference frame's composition, color balance, scale, and density.
- Add motion in this order: [paste storyboard motion order].
- Use [tech stack].
- Do not modify unrelated files.
```

## Visual QA Request

```text
Compare the current scene against the reference frame and storyboard.
Report only concrete differences in:
- layout and spacing
- text fit and hierarchy
- colors and contrast
- motion timing
- asset usage

Then make the smallest code change that fixes the top 1-3 issues.
```

## Export Request

```text
Export the demo as MP4 and a README-friendly GIF or preview image.
Verify that asset paths resolve, text is readable, animation is not blank, and the first frame works as a GitHub preview.
```
