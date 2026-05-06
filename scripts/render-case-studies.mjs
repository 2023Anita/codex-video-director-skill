#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const smoke = process.argv.includes("--smoke");
const studies = [
  "case-studies/iphone-evolution",
  "case-studies/spacex-ascent",
  "case-studies/ai-interface-futures"
];

const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const ease = (value) => 1 - Math.pow(1 - clamp(value), 3);

function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, stdio: "inherit" });
  if (result.status !== 0) throw new Error(`${command} failed with status ${result.status}`);
}

function requireCommand(command) {
  const result = spawnSync("which", [command], { stdio: "ignore" });
  if (result.status !== 0) throw new Error(`${command} is required`);
}

function storyAt(story, t) {
  const sceneLength = story.durationSeconds / story.milestones.length;
  const index = Math.min(story.milestones.length - 1, Math.floor(t / sceneLength));
  const start = index * sceneLength;
  return { milestone: story.milestones[index], index, progress: clamp((t - start) / sceneLength), sceneLength };
}

function orbitLines(story, frame) {
  const p = frame / (story.durationSeconds * story.fps);
  if (!story.style.includes("mission")) return "";
  return Array.from({ length: 8 }, (_, i) => {
    const offset = i * 38 + p * 280;
    return `<path d="M ${-140 + offset} ${860 - i * 54} C ${470 + offset} ${360 - i * 35}, ${960 + offset} ${220 + i * 28}, ${1890 + offset} ${120 + i * 42}" fill="none" stroke="${i % 2 ? story.palette.secondary : story.palette.accent}" stroke-width="${i === 0 ? 5 : 2}" opacity="${0.12 + i * 0.06}"/>`;
  }).join("");
}

function deviceVisual(story, milestone, progress) {
  if (story.style.includes("museum")) {
    const glow = 0.22 + ease(progress) * 0.35;
    const grid = milestone.label.includes("Retina") ? 28 : 54;
    return `
      <g transform="translate(1120 220)">
        <rect x="0" y="0" width="410" height="660" rx="72" fill="#07090c" stroke="#d8dce2" stroke-opacity="0.35"/>
        <rect x="34" y="56" width="342" height="548" rx="48" fill="#10151c"/>
        ${Array.from({ length: 8 }, (_, i) => `<line x1="${62 + i * grid}" y1="100" x2="${62 + i * grid}" y2="550" stroke="#5b8cff" stroke-opacity="${glow * 0.24}"/>`).join("")}
        ${Array.from({ length: 9 }, (_, i) => `<line x1="64" y1="${116 + i * grid}" x2="346" y2="${116 + i * grid}" stroke="#6dd6a7" stroke-opacity="${glow * 0.20}"/>`).join("")}
        <circle cx="205" cy="330" r="${40 + ease(progress) * 138}" fill="none" stroke="${story.palette.accent}" stroke-opacity="${glow}" stroke-width="4"/>
      </g>`;
  }
  if (story.style.includes("agentic")) {
    return `
      <g transform="translate(1010 210)">
        <rect width="600" height="520" rx="34" fill="#1b1d24" stroke="#f4efe7" stroke-opacity="0.12"/>
        <rect x="40" y="42" width="520" height="78" rx="18" fill="#f8efe2"/>
        <text x="70" y="92" fill="#121317" font-family="Inter, Arial" font-size="28" font-weight="800">${escapeXml(milestone.label)}</text>
        ${Array.from({ length: 5 }, (_, i) => `<rect x="${52 + i * 96}" y="${170 + i * 42}" width="72" height="72" rx="18" fill="${i % 2 ? story.palette.secondary : story.palette.accent}" opacity="${0.35 + ease(progress) * 0.45}"/>`).join("")}
        <path d="M90 425 C220 340, 350 500, 510 390" fill="none" stroke="${story.palette.secondary}" stroke-width="5" opacity="0.75"/>
      </g>`;
  }
  return `
    <g transform="translate(1010 250)">
      <rect x="0" y="0" width="600" height="420" rx="24" fill="#0f1722" stroke="#39d98a" stroke-opacity="0.22"/>
      <path d="M110 330 C210 190, 300 110, 470 48" fill="none" stroke="#f28c38" stroke-width="8" stroke-linecap="round" stroke-dasharray="${Math.round(720 * ease(progress))} 720"/>
      <path d="M130 330 L470 48" stroke="#39d98a" stroke-opacity="0.18"/>
      <rect x="390" y="46" width="70" height="170" rx="34" fill="#f4f7fb" opacity="0.92"/>
      <path d="M425 216 l-36 94 h72z" fill="#f28c38" opacity="${0.45 + ease(progress) * 0.45}"/>
      <circle cx="134" cy="330" r="12" fill="#39d98a"/>
      <circle cx="470" cy="48" r="18" fill="#f28c38"/>
    </g>`;
}

function timelineRail(story, activeIndex) {
  const count = story.milestones.length;
  return story.milestones.map((item, i) => {
    const x = 170 + i * (1560 / Math.max(1, count - 1));
    const active = i <= activeIndex;
    return `
      <g>
        <circle cx="${x}" cy="940" r="${active ? 13 : 8}" fill="${active ? story.palette.accent : story.palette.muted}" opacity="${active ? 1 : 0.42}"/>
        <text x="${x}" y="978" text-anchor="middle" fill="${active ? story.palette.text : story.palette.muted}" font-family="Inter, Arial" font-size="20" font-weight="${active ? 800 : 500}">${escapeXml(item.year)}</text>
      </g>`;
  }).join("");
}

function svg(story, frame, totalFrames) {
  const t = frame / story.fps;
  const { milestone, index, progress } = storyAt(story, t);
  const p = ease(progress);
  const palette = story.palette;
  const dark = story.style.includes("mission") || story.style.includes("agentic");
  const titleColor = palette.text;
  const bg = palette.background;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <rect width="1920" height="1080" fill="${bg}"/>
  <defs>
    <filter id="blur"><feGaussianBlur stdDeviation="36"/></filter>
    <linearGradient id="wash" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="${palette.accent}" stop-opacity="${dark ? 0.24 : 0.18}"/>
      <stop offset="1" stop-color="${palette.secondary}" stop-opacity="${dark ? 0.18 : 0.14}"/>
    </linearGradient>
  </defs>
  <rect x="64" y="54" width="1792" height="972" rx="40" fill="url(#wash)" opacity="0.72"/>
  <g filter="url(#blur)" opacity="0.38">
    <circle cx="${270 + Math.sin(frame / 36) * 48}" cy="260" r="210" fill="${palette.accent}"/>
    <circle cx="${1540 + Math.cos(frame / 42) * 54}" cy="720" r="250" fill="${palette.secondary}"/>
  </g>
  ${orbitLines(story, frame)}
  <text x="138" y="126" fill="${palette.muted}" font-family="Inter, Arial" font-size="22" letter-spacing="4">${escapeXml(story.subtitle.toUpperCase())}</text>
  <text x="138" y="192" fill="${titleColor}" font-family="Inter, Arial" font-size="74" font-weight="850">${escapeXml(story.title)}</text>
  <rect x="138" y="224" width="${240 + p * 540}" height="7" rx="4" fill="${palette.accent}"/>
  <g transform="translate(138 ${340 - (1 - p) * 32})" opacity="${p}">
    <text x="0" y="0" fill="${palette.accent}" font-family="Inter, Arial" font-size="92" font-weight="900">${escapeXml(milestone.year)}</text>
    <text x="0" y="82" fill="${titleColor}" font-family="Inter, Arial" font-size="54" font-weight="850">${escapeXml(milestone.label)}</text>
    <foreignObject x="0" y="116" width="760" height="210">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Inter, Arial, sans-serif; font-size: 34px; line-height: 1.3; color: ${titleColor}; opacity: 0.82;">
        ${escapeXml(milestone.meaning)}
      </div>
    </foreignObject>
    <text x="0" y="382" fill="${palette.muted}" font-family="Inter, Arial" font-size="22">${escapeXml(milestone.visual)}</text>
  </g>
  ${deviceVisual(story, milestone, progress)}
  <line x1="170" y1="940" x2="1730" y2="940" stroke="${palette.muted}" stroke-opacity="0.22" stroke-width="4"/>
  ${timelineRail(story, index)}
  <text x="1510" y="126" fill="${palette.muted}" font-family="Inter, Arial" font-size="20">Figma -> HyperFrames -> Remotion -> Codex</text>
</svg>`;
}

function escapeXml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

for (const studyDir of studies) {
  const story = JSON.parse(readFileSync(join(root, studyDir, "timeline.story.json"), "utf8"));
  const renderDir = join(root, studyDir, "renders");
  const framesDir = join(renderDir, "frames");
  const pngDir = join(renderDir, "frames-png");
  mkdirSync(framesDir, { recursive: true });
  if (!smoke) mkdirSync(pngDir, { recursive: true });
  const totalFrames = smoke ? 8 : story.durationSeconds * story.fps;
  for (let frame = 0; frame < totalFrames; frame += 1) {
    const stem = String(frame).padStart(4, "0");
    const svgPath = join(framesDir, `${stem}.svg`);
    writeFileSync(svgPath, svg(story, frame, totalFrames));
    if (!smoke) run("rsvg-convert", ["-w", "1920", "-h", "1080", "-f", "png", "-o", join(pngDir, `${stem}.png`), svgPath]);
  }
  const coverFrame = smoke ? 3 : Math.floor(totalFrames * 0.32);
  writeFileSync(join(renderDir, "cover.svg"), svg(story, coverFrame, totalFrames));
  if (!smoke) {
    requireCommand("ffmpeg");
    run("ffmpeg", ["-y", "-framerate", String(story.fps), "-i", join(pngDir, "%04d.png"), "-pix_fmt", "yuv420p", "-vf", "scale=1920:1080", join(renderDir, "demo.mp4")]);
    run("ffmpeg", ["-y", "-i", join(pngDir, `${String(coverFrame).padStart(4, "0")}.png`), "-frames:v", "1", "-update", "1", join(renderDir, "cover.png")]);
    run("ffmpeg", ["-y", "-i", join(renderDir, "demo.mp4"), "-vf", "fps=8,scale=960:-1:flags=lanczos", "-loop", "0", join(renderDir, "demo.gif")]);
  }
}

console.log(smoke ? "Case study smoke render OK" : "Case study videos rendered");
