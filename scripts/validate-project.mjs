import { readFileSync, existsSync } from "node:fs";
import { Script } from "node:vm";

const requiredFiles = [
  "index.html",
  "README.md",
  "setup/windows-setup.ps1",
  ".github/workflows/windows-runner.yml",
];

const failures = [];
const pass = (message) => console.log(`PASS: ${message}`);
const fail = (message) => failures.push(message);

for (const file of requiredFiles) {
  if (existsSync(file)) pass(`required file exists: ${file}`);
  else fail(`required file is missing: ${file}`);
}

if (failures.length) {
  console.error("\nValidation stopped because required files are missing.");
  for (const failure of failures) console.error(`FAIL: ${failure}`);
  process.exit(1);
}

const html = readFileSync("index.html", "utf8");
const readme = readFileSync("README.md", "utf8");
const workflow = readFileSync(".github/workflows/windows-runner.yml", "utf8");
const helper = readFileSync("setup/windows-setup.ps1", "utf8");

const htmlChecks = [
  [/<!doctype html>/i, "HTML5 doctype"],
  [/<html\b[^>]*\blang=/i, "document language"],
  [/<meta\b[^>]*name=["']viewport["']/i, "responsive viewport"],
  [/<title>\s*Ghazaal Cloud PC\s*<\/title>/i, "project page title"],
];

for (const [pattern, label] of htmlChecks) {
  if (pattern.test(html)) pass(`HTML includes ${label}`);
  else fail(`HTML is missing ${label}`);
}

const expectedApps = ["files", "terminal", "browser", "settings", "about"];
for (const app of expectedApps) {
  if (html.includes(`data-open="${app}"`) && html.includes(`${app}:[`)) {
    pass(`desktop app is wired: ${app}`);
  } else {
    fail(`desktop app shortcut/content is missing or disconnected: ${app}`);
  }
}

if (html.includes('id="minBtn"') && /win\.classList\.add\('minimized'\)/.test(html)) {
  pass("desktop window has a minimize control");
} else {
  fail("desktop window minimize control is missing or disconnected");
}

if (/addEventListener\('pointermove'/.test(html) && /win\.style\.left/.test(html)) {
  pass("desktop window supports pointer-based dragging");
} else {
  fail("desktop window dragging behavior is missing");
}

const explorerChecks = [
  [/id="newFolderBtn"/, "new-folder control"],
  [/id="newFileBtn"/, "new-text-file control"],
  [/id="downloadAllBtn"/, "workspace export control"],
  [/id="clearFilesBtn"/, "clear-workspace control"],
  [/localStorage\.getItem\(storageKey\)/, "browser-local file loading"],
  [/localStorage\.setItem\(storageKey/, "browser-local file saving"],
  [/function rename\(item\)/, "file rename action"],
  [/function remove\(item\)/, "file delete action"],
  [/function download\(item\)/, "file download action"],
  [/new Blob\(\[JSON\.stringify/, "workspace backup export"],
];
for (const [pattern, label] of explorerChecks) {
  if (pattern.test(html)) pass("File Explorer includes " + label);
  else fail("File Explorer is missing " + label);
}

const scriptBlocks = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
if (scriptBlocks.length === 0) {
  fail("no inline application script was found");
} else {
  pass(`found ${scriptBlocks.length} inline application script block(s)`);
}

for (let i = 0; i < scriptBlocks.length; i++) {
  const [, attributes, source] = scriptBlocks[i];
  if (/\bsrc\s*=/i.test(attributes)) {
    fail("unexpected externally loaded script; review dependencies before adding one");
    continue;
  }
  try {
    new Script(source, { filename: `index.html:inline-script-${i + 1}` });
    pass(`inline JavaScript block ${i + 1} parses successfully`);
  } catch (error) {
    fail(`inline JavaScript block ${i + 1} has a syntax error: ${error.message}`);
  }
}

const unsafePatterns = [
  [/\beval\s*\(/i, "eval()"],
  [/\bnew\s+Function\s*\(/i, "new Function()"],
  [/\bdocument\.write\s*\(/i, "document.write()"],
];
for (const [pattern, label] of unsafePatterns) {
  if (pattern.test(html)) fail(`avoid dynamic code/document injection pattern: ${label}`);
  else pass(`no ${label} pattern in the page`);
}

const blankTargetLinks = [...html.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/gi)];
for (const [link] of blankTargetLinks) {
  if (!/\brel=["'][^"']*\bnoopener\b/i.test(link)) {
    fail("a link opening a new tab must include rel=\"noopener\"");
  }
}
if (blankTargetLinks.length) pass("new-tab links were checked for noopener protection");

if (/(temporary hosted Windows runner|temporary automation runners)/i.test(readme) &&
    /not a remote desktop/i.test(readme) &&
    /no real cloud storage/i.test(readme)) {
  pass("README clearly documents temporary-runner and prototype limitations");
} else {
  fail("README must clearly explain that the runner is temporary and the UI is not a real cloud desktop");
}

if (/uses:\s*actions\/checkout@v5/.test(workflow)) pass("workflow uses actions/checkout@v5");
else fail("workflow must use actions/checkout@v5");

if (/^permissions:\s*\n\s+contents:\s*read\s*$/m.test(workflow)) {
  pass("workflow keeps repository permissions read-only");
} else {
  fail("workflow permissions should remain least-privilege (contents: read)");
}

if (/workflow_dispatch:/.test(workflow) && /runs-on:\s*windows-2025/.test(workflow)) {
  pass("manual Windows Server 2025 runner configuration is present");
} else {
  fail("manual Windows Server 2025 runner configuration is missing");
}

if (/\b(Invoke-Expression|\biex\b|Start-Process\s+.*(powershell|pwsh))/i.test(helper)) {
  fail("local helper contains a command-execution pattern that needs manual review");
} else {
  pass("local helper contains no flagged command-execution pattern");
}

if (failures.length) {
  console.error(`\nProject validation failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`FAIL: ${failure}`);
  process.exit(1);
}

console.log("\nAll Ghazaal Cloud PC project validation checks passed.");
