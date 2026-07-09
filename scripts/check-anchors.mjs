#!/usr/bin/env node
// Verifies every docLink/sectionLink in docs/src/data/question-bank.json points at
// a real page and heading anchor in the built site. The Docusaurus build only
// validates links inside markdown — JSON data is invisible to it, so run this
// after `npm run build` whenever questions or headings change.
//
// Run from docs/: npm run check:anchors

import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const buildDir = join(repoRoot, "docs", "build");

if (!existsSync(buildDir)) {
  console.error("check-anchors: docs/build not found — run `npm run build` first.");
  process.exit(1);
}

const bank = JSON.parse(
  readFileSync(join(repoRoot, "docs", "src", "data", "question-bank.json"), "utf8")
);

const links = [];
for (const phase of bank.phases) {
  for (const mod of phase.modules) {
    links.push({ id: `module ${mod.number} docLink`, link: mod.docLink });
    for (const q of mod.questions) links.push({ id: q.id, link: q.sectionLink });
  }
}

let failures = 0;
for (const { id, link } of links) {
  const [path, anchor] = link.split("#");
  const htmlPath = join(buildDir, path, "index.html");
  if (!existsSync(htmlPath)) {
    console.error(`MISSING PAGE    ${id}: ${path}`);
    failures++;
    continue;
  }
  if (anchor) {
    const html = readFileSync(htmlPath, "utf8");
    if (!html.includes(`id="${anchor}"`)) {
      console.error(`MISSING ANCHOR  ${id}: ${link}`);
      failures++;
    }
  }
}

if (failures) {
  console.error(`check-anchors: ${failures} broken link(s) in question-bank.json`);
  process.exit(1);
}
console.log(`check-anchors: all ${links.length} question-bank links/anchors OK`);
