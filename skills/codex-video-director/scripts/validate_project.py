#!/usr/bin/env python3
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]

REQUIRED = [
    "SKILL.md",
    "references/storyboard-spec.md",
    "references/image-prompt-patterns.md",
    "references/codex-motion-prompts.md",
    "assets/templates/storyboard.md",
    "assets/templates/scene.json",
    "assets/templates/demo-readme.md",
]


def main() -> int:
    missing = [item for item in REQUIRED if not (ROOT / item).exists()]
    if missing:
        print("Missing required files:")
        for item in missing:
            print(f"- {item}")
        return 1

    skill = (ROOT / "SKILL.md").read_text(encoding="utf-8")
    checks = [
        ("name: codex-video-director", "frontmatter name"),
        ("description:", "frontmatter description"),
        ("references/storyboard-spec.md", "storyboard reference"),
        ("references/image-prompt-patterns.md", "image prompt reference"),
        ("references/codex-motion-prompts.md", "motion prompt reference"),
    ]
    failures = [label for needle, label in checks if needle not in skill]
    if failures:
        print("Failed content checks:")
        for label in failures:
            print(f"- {label}")
        return 1

    print("codex-video-director skill structure OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
