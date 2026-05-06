# Factual Story Video

Use this workflow for product histories, technology timelines, company milestones, cultural explainers, and educational video essays.

## Source Rules

- Start from official or primary sources whenever possible.
- Put source URLs in `sources.md`.
- Do not use logos, official product photos, or trademark-heavy imagery unless the user provides rights or explicitly asks for editorial fair-use review.
- Convert facts into abstract visual metaphors: glass slab, pixel grid, orbit path, launch line, interface layer.

## Story Shape

1. Hook: name the transformation.
2. Origin: show the first milestone.
3. System shift: show the moment the product or platform becomes an ecosystem.
4. Interface shift: show a change in how humans interact with the system.
5. Present tense: show what the system has become now.
6. Close: explain why the workflow can generate this video.

## Case Study File Contract

Each case study should include:

```text
timeline.story.json
storyboard.md
sources.md
figma-brief.md
hyperframes/
remotion/
renders/demo.mp4
renders/cover.png
README.md
```

## JSON Contract

```json
{
  "title": "Case Study Title",
  "durationSeconds": 60,
  "style": "visual-style-name",
  "sourceNotes": ["Official source name"],
  "milestones": [
    {
      "year": "2007",
      "label": "Original iPhone",
      "meaning": "Multi-touch turns the phone into a software canvas",
      "visual": "black glass slab, keynote light, single touch ripple"
    }
  ]
}
```
