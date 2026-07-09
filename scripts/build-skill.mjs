#!/usr/bin/env node
// Packages the ai-assessment Claude skill:
//   1. Copies docs/src/data/question-bank.json into the skill as questions.json,
//      adding the site URL from docs/docusaurus.config.js (so the skill can emit
//      absolute review links).
//   2. Validates that every question id has a rubric and vice versa.
//   3. Zips skills/ai-assessment/ into docs/static/downloads/ai-assessment-skill.zip.
//
// Run from docs/: npm run build:skill

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const questionBankPath = join(repoRoot, "docs", "src", "data", "question-bank.json");
const skillDir = join(repoRoot, "skills", "ai-assessment");
const rubricsPath = join(skillDir, "rubrics.json");
const questionsOutPath = join(skillDir, "questions.json");
const downloadsDir = join(repoRoot, "docs", "static", "downloads");
const zipPath = join(downloadsDir, "ai-assessment-skill.zip");

function fail(message) {
  console.error(`build-skill: ${message}`);
  process.exit(1);
}

// --- Load inputs ------------------------------------------------------------

const questionBank = JSON.parse(readFileSync(questionBankPath, "utf8"));
const rubrics = JSON.parse(readFileSync(rubricsPath, "utf8"));

// Pull the production site URL out of the Docusaurus config.
const configSource = readFileSync(join(repoRoot, "docs", "docusaurus.config.js"), "utf8");
const urlMatch = configSource.match(/^\s*url:\s*'([^']+)'/m);
if (!urlMatch) fail("couldn't find the site url in docs/docusaurus.config.js");
const siteUrl = urlMatch[1].replace(/\/$/, "");

// --- Validate question/rubric parity ----------------------------------------

const questionIds = questionBank.phases
  .flatMap((phase) => phase.modules)
  .flatMap((mod) => mod.questions)
  .map((q) => q.id);

const rubricIds = Object.keys(rubrics);

const duplicateIds = questionIds.filter((id, i) => questionIds.indexOf(id) !== i);
if (duplicateIds.length) fail(`duplicate question ids in question-bank.json: ${duplicateIds.join(", ")}`);

const missingRubrics = questionIds.filter((id) => !rubricIds.includes(id));
if (missingRubrics.length) fail(`questions with no rubric in rubrics.json: ${missingRubrics.join(", ")}`);

const orphanRubrics = rubricIds.filter((id) => !questionIds.includes(id));
if (orphanRubrics.length) fail(`rubrics with no matching question: ${orphanRubrics.join(", ")}`);

for (const [id, rubric] of Object.entries(rubrics)) {
  for (const key of ["strong", "solid", "developing"]) {
    if (!rubric[key]) fail(`rubric ${id} is missing "${key}"`);
  }
}

// --- Write questions.json into the skill ------------------------------------

writeFileSync(
  questionsOutPath,
  JSON.stringify({ siteUrl, ...questionBank }, null, 2) + "\n"
);

// --- Zip the skill ------------------------------------------------------------

mkdirSync(downloadsDir, { recursive: true });
if (existsSync(zipPath)) rmSync(zipPath);

// Zip the folder itself so the archive contains ai-assessment/SKILL.md etc.
execFileSync("zip", ["-r", zipPath, "ai-assessment", "-x", "*.DS_Store"], {
  cwd: join(repoRoot, "skills"),
  stdio: "inherit",
});

console.log(`\nbuild-skill: OK`);
console.log(`  site url:   ${siteUrl}`);
console.log(`  questions:  ${questionIds.length} (rubrics match)`);
console.log(`  zip:        ${zipPath}`);
