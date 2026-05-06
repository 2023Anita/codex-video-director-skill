#!/usr/bin/env python3
from pathlib import Path
import json
import sys

ROOT = Path(__file__).resolve().parents[1]

REQUIRED = [
    "README.md",
    "package.json",
    "skills/codex-video-director/SKILL.md",
    "skills/codex-video-director/references/storyboard-spec.md",
    "skills/codex-video-director/references/image-prompt-patterns.md",
    "skills/codex-video-director/references/codex-motion-prompts.md",
    "skills/codex-video-director/references/plugin-routing.md",
    "skills/codex-video-director/references/factual-story-video.md",
    "demo/american-saas/storyboard.md",
    "demo/american-saas/scene-plan.json",
    "demo/american-saas/assets/prompts.md",
    "demo/japanese-editorial/storyboard.md",
    "demo/japanese-editorial/scene-plan.json",
    "demo/japanese-editorial/assets/prompts.md",
    "scripts/render-demo.mjs",
    "scripts/render-case-studies.mjs",
    "scripts/package_skill.py",
    "index.html",
    "hyperframes/index.html",
    "docs/research/github-project-references.md",
    "docs/research/factual-sources.md",
    "docs/design-system/cinematic-case-studies.md",
]

CASE_STUDIES = [
    "case-studies/iphone-evolution",
    "case-studies/spacex-ascent",
    "case-studies/ai-interface-futures",
]


def fail(message: str) -> int:
    print(message)
    return 1


def main() -> int:
    missing = [item for item in REQUIRED if not (ROOT / item).exists()]
    if missing:
        print("Missing required files:")
        for item in missing:
            print(f"- {item}")
        return 1

    for rel in ["demo/american-saas/scene-plan.json", "demo/japanese-editorial/scene-plan.json"]:
        try:
            data = json.loads((ROOT / rel).read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            return fail(f"Invalid JSON in {rel}: {exc}")
        if data.get("durationSeconds", 0) < 30:
            return fail(f"{rel} must target at least 30 seconds")
        if len(data.get("scenes", [])) < 4:
            return fail(f"{rel} must contain at least four scenes")

    for study in CASE_STUDIES:
        for name in [
            "timeline.story.json",
            "storyboard.md",
            "sources.md",
            "figma-brief.md",
            "hyperframes/DESIGN.md",
            "hyperframes/index.html",
            "remotion/TimelineVideo.tsx",
            "remotion/index.tsx",
            "README.md",
        ]:
            path = ROOT / study / name
            if not path.exists():
                return fail(f"Missing case study file: {study}/{name}")

        data = json.loads((ROOT / study / "timeline.story.json").read_text(encoding="utf-8"))
        if data.get("durationSeconds", 0) < 45:
            return fail(f"{study}/timeline.story.json must target at least 45 seconds")
        if len(data.get("milestones", [])) < 5:
            return fail(f"{study}/timeline.story.json must contain at least five milestones")
        sources = (ROOT / study / "sources.md").read_text(encoding="utf-8")
        if sources.count("https://") < 3:
            return fail(f"{study}/sources.md must contain at least three source URLs")

    skill = (ROOT / "skills/codex-video-director/SKILL.md").read_text(encoding="utf-8")
    for needle in ["Storyboard first", "Generate reference images", "Route the production tools", "Verify visually and export"]:
        if needle not in skill:
            return fail(f"SKILL.md missing workflow phrase: {needle}")

    print("Repository validation OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
