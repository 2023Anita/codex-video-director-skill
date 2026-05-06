#!/usr/bin/env python3
"""Package a Codex skill directory as a .skill zip archive."""

from __future__ import annotations

import re
import sys
import zipfile
from pathlib import Path


def fail(message: str) -> int:
    print(f"Error: {message}", file=sys.stderr)
    return 1


def validate_skill(skill_path: Path) -> tuple[bool, str]:
    skill_md = skill_path / "SKILL.md"
    if not skill_md.exists():
        return False, "SKILL.md not found"

    content = skill_md.read_text(encoding="utf-8")
    match = re.match(r"^---\n(.*?)\n---", content, re.DOTALL)
    if not match:
        return False, "SKILL.md must start with YAML frontmatter"

    frontmatter = match.group(1)
    fields: dict[str, str] = {}
    for line in frontmatter.splitlines():
        if not line.strip() or line.startswith(" "):
            continue
        if ":" not in line:
            return False, f"Invalid frontmatter line: {line}"
        key, value = line.split(":", 1)
        fields[key.strip()] = value.strip().strip("\"'")

    name = fields.get("name", "")
    description = fields.get("description", "")
    if not name:
        return False, "Missing frontmatter name"
    if not description:
        return False, "Missing frontmatter description"
    if not re.match(r"^[a-z0-9-]+$", name):
        return False, "Skill name must be lowercase hyphen-case"
    if len(description) > 1024:
        return False, "Description is longer than 1024 characters"

    return True, "Skill is valid"


def package_skill(skill_path: Path, output_dir: Path) -> Path:
    output_dir.mkdir(parents=True, exist_ok=True)
    output_file = output_dir / f"{skill_path.name}.skill"

    with zipfile.ZipFile(output_file, "w", zipfile.ZIP_DEFLATED) as archive:
        for file_path in sorted(skill_path.rglob("*")):
            if file_path.is_file():
                archive.write(file_path, file_path.relative_to(skill_path.parent))

    return output_file


def main() -> int:
    if len(sys.argv) < 2:
        return fail("Usage: python3 scripts/package_skill.py <skill-folder> [output-dir]")

    skill_path = Path(sys.argv[1]).resolve()
    output_dir = Path(sys.argv[2]).resolve() if len(sys.argv) > 2 else Path.cwd()
    if not skill_path.is_dir():
        return fail(f"Skill folder not found: {skill_path}")

    valid, message = validate_skill(skill_path)
    if not valid:
        return fail(message)

    output_file = package_skill(skill_path, output_dir)
    print(message)
    print(f"Packaged {output_file}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
