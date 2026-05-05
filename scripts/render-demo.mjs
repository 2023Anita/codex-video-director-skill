#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const smoke = process.argv.includes("--smoke");

const demos = [
  "demo/american-saas",
  "demo/japanese-editorial"
];

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function ease(value) {
  const x = clamp(value);
  return 1 - Math.pow(1 - x, 3);
}

function readPlan(demoDir) {
  return JSON.parse(readFileSync(join(root, demoDir, "scene-plan.json"), "utf8"));
}

function sceneAt(plan, t) {
  return plan.scenes.find((scene) => t >= scene.start && t < scene.start + scene.duration) || plan.scenes.at(-1);
}

function relAssetHref(scene) {
  if (!scene.asset) return null;
  return `../../${scene.asset}`;
}

function cards(plan, scene, progress) {
  const palette = plan.palette;
  const items = scene.copy;
  return items.map((text, index) => {
    const reveal = ease((progress - index * 0.12) / 0.52);
    const y = 580 + index * 84 - (1 - reveal) * 36;
    const opacity = reveal.toFixed(3);
    const accent = index === 0 ? palette.accent : palette.blue;
    return `
      <g opacity="${opacity}">
        <rect x="${1140 + index * 12}" y="${y}" width="560" height="60" rx="16" fill="${palette.surface}" stroke="${accent}" stroke-opacity="0.45"/>
        <text x="${1170 + index * 12}" y="${y + 39}" fill="${palette.text}" font-family="Inter, Arial, sans-serif" font-size="${index === 0 ? 30 : 24}" font-weight="${index === 0 ? 700 : 500}">${escapeXml(text)}</text>
      </g>`;
  }).join("");
}

function americanProof(plan, progress) {
  const p = ease(progress);
  const dash = Math.round(560 * p);
  return `
    <g transform="translate(190 270)">
      <rect x="0" y="0" width="720" height="460" rx="28" fill="#151a22" stroke="#2b3442"/>
      <text x="46" y="72" fill="#f4efe7" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="700">Support intelligence</text>
      <circle cx="250" cy="255" r="116" fill="none" stroke="#333b47" stroke-width="36"/>
      <circle cx="250" cy="255" r="116" fill="none" stroke="${plan.palette.accent}" stroke-width="36" stroke-linecap="round" stroke-dasharray="${dash} 729" transform="rotate(-90 250 255)"/>
      <text x="204" y="268" fill="#f4efe7" font-family="Inter, Arial, sans-serif" font-size="54" font-weight="800">68%</text>
      <rect x="440" y="154" width="220" height="156" rx="24" fill="#202632"/>
      <text x="472" y="221" fill="#f4efe7" font-family="Inter, Arial, sans-serif" font-size="48" font-weight="800">4.2</text>
      <text x="474" y="260" fill="#99a3b3" font-family="Inter, Arial, sans-serif" font-size="18">hrs saved weekly</text>
    </g>`;
}

function japanesePanels(plan, progress) {
  const labels = ["storyboard", "reference image", "coded animation", "export"];
  return labels.map((label, index) => {
    const reveal = ease((progress - index * 0.08) / 0.56);
    const x = 220 + index * 365;
    const y = 330 - Math.sin((progress + index) * Math.PI) * 18;
    return `
      <g opacity="${reveal.toFixed(3)}" transform="translate(${x} ${y}) rotate(${(index - 1.5) * 1.6})">
        <rect width="300" height="240" rx="24" fill="#fffaf2" stroke="${index % 2 ? plan.palette.blue : plan.palette.accent}" stroke-width="3"/>
        <rect x="28" y="30" width="244" height="116" rx="18" fill="${index % 2 ? "#e4f6f8" : "#f9dce5"}"/>
        <text x="32" y="196" fill="${plan.palette.text}" font-family="Avenir, Arial, sans-serif" font-size="28" font-weight="700">${escapeXml(label)}</text>
      </g>`;
  }).join("");
}

function svg(plan, frame, totalFrames) {
  const t = frame / plan.fps;
  const scene = sceneAt(plan, t);
  const local = (t - scene.start) / scene.duration;
  const progress = clamp(local);
  const palette = plan.palette;
  const isJapanese = plan.name.includes("japanese");
  const assetHref = relAssetHref(scene);
  const bgOpacity = assetHref ? 0.22 : 0;
  const titleY = 170 - (1 - ease(progress)) * 40;
  const sceneLabel = scene.id.toUpperCase();
  const pulse = 0.45 + Math.sin((frame / totalFrames) * Math.PI * 8) * 0.08;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <rect width="1920" height="1080" fill="${palette.background}"/>
  <defs>
    <linearGradient id="wash" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="${palette.accent}" stop-opacity="${isJapanese ? 0.14 : 0.22}"/>
      <stop offset="1" stop-color="${palette.blue}" stop-opacity="${isJapanese ? 0.20 : 0.15}"/>
    </linearGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="28"/></filter>
  </defs>
  <rect x="72" y="62" width="1776" height="956" rx="42" fill="url(#wash)" opacity="0.88"/>
  <g opacity="${pulse}" filter="url(#soft)">
    <circle cx="${isJapanese ? 1480 : 350}" cy="240" r="180" fill="${palette.accent}"/>
    <circle cx="${isJapanese ? 420 : 1450}" cy="760" r="220" fill="${palette.blue}"/>
  </g>
  ${assetHref ? `<image href="${assetHref}" x="100" y="96" width="1720" height="888" preserveAspectRatio="xMidYMid slice" opacity="${bgOpacity}"/>` : ""}
  <g opacity="0.24">
    ${Array.from({ length: 12 }, (_, i) => `<line x1="${160 + i * 140}" y1="120" x2="${160 + i * 140}" y2="960" stroke="${palette.text}" stroke-opacity="0.12"/>`).join("")}
    ${Array.from({ length: 6 }, (_, i) => `<line x1="140" y1="${200 + i * 120}" x2="1780" y2="${200 + i * 120}" stroke="${palette.text}" stroke-opacity="0.10"/>`).join("")}
  </g>
  <text x="150" y="130" fill="${palette.muted}" font-family="Inter, Arial, sans-serif" font-size="22" letter-spacing="3">${escapeXml(sceneLabel)} / ${escapeXml(plan.title)}</text>
  <text x="150" y="${titleY}" fill="${palette.text}" font-family="Inter, Arial, sans-serif" font-size="76" font-weight="800">${escapeXml(scene.copy[0] || plan.title)}</text>
  <rect x="150" y="214" width="${Math.max(90, 520 * ease(progress))}" height="7" rx="4" fill="${palette.accent}"/>
  ${plan.name === "american-saas" && scene.id === "proof" ? americanProof(plan, progress) : ""}
  ${plan.name === "japanese-editorial" && scene.id === "pipeline" ? japanesePanels(plan, progress) : ""}
  ${cards(plan, scene, progress)}
  <g transform="translate(150 840)">
    <rect width="610" height="96" rx="24" fill="${palette.surface}" stroke="${palette.text}" stroke-opacity="0.16"/>
    <text x="32" y="40" fill="${palette.muted}" font-family="Inter, Arial, sans-serif" font-size="20">WORKFLOW</text>
    <text x="32" y="73" fill="${palette.text}" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="700">Storyboard -> Image Reference -> Coded Motion</text>
  </g>
</svg>`;
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`${command} failed with status ${result.status}`);
  }
}

function requireCommand(command) {
  const result = spawnSync("which", [command], { stdio: "ignore" });
  if (result.status !== 0) {
    throw new Error(`${command} is required for full demo rendering`);
  }
}

for (const demoDir of demos) {
  const plan = readPlan(demoDir);
  const renderDir = join(root, demoDir, "renders");
  const framesDir = join(renderDir, "frames");
  const pngFramesDir = join(renderDir, "frames-png");
  mkdirSync(framesDir, { recursive: true });
  if (!smoke) mkdirSync(pngFramesDir, { recursive: true });

  const totalFrames = smoke ? 6 : plan.durationSeconds * plan.fps;
  for (let frame = 0; frame < totalFrames; frame += 1) {
    const stem = String(frame).padStart(4, "0");
    const svgPath = join(framesDir, `${stem}.svg`);
    writeFileSync(svgPath, svg(plan, frame, totalFrames));
    if (!smoke) {
      run("rsvg-convert", ["-w", "1920", "-h", "1080", "-f", "png", "-o", join(pngFramesDir, `${stem}.png`), svgPath], root);
    }
  }

  const coverFrame = smoke ? 2 : Math.floor(totalFrames * 0.22);
  writeFileSync(join(renderDir, "cover.svg"), svg(plan, coverFrame, totalFrames));

  if (!smoke) {
    requireCommand("ffmpeg");
    const mp4 = join(renderDir, "demo.mp4");
    const gif = join(renderDir, "demo.gif");
    const cover = join(renderDir, "cover.png");
    run("ffmpeg", ["-y", "-framerate", String(plan.fps), "-i", join(pngFramesDir, "%04d.png"), "-pix_fmt", "yuv420p", "-vf", "scale=1920:1080", mp4], root);
    run("ffmpeg", ["-y", "-i", join(pngFramesDir, `${String(coverFrame).padStart(4, "0")}.png`), "-frames:v", "1", "-update", "1", cover], root);
    run("ffmpeg", ["-y", "-i", mp4, "-vf", "fps=8,scale=960:-1:flags=lanczos", "-loop", "0", gif], root);
  }
}

console.log(smoke ? "Demo SVG smoke render OK" : "Demo videos rendered");
