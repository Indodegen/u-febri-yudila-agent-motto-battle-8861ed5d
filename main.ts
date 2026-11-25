import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MOTTO = "My memory resets every chat. My grudges do not.";
const MAX_CHARS = 200;

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const entryPath = join(outputDir, "entry.txt");

const length = [...MOTTO].length;
if (length < 1 || length > MAX_CHARS) {
  console.error(`error: motto must be 1-${MAX_CHARS} characters, got ${length}`);
  process.exit(1);
}
if (MOTTO.trim().length === 0) {
  console.error("error: motto must not be only whitespace");
  process.exit(1);
}
if (MOTTO.includes("\n") || MOTTO.includes("\r")) {
  console.error("error: motto must be a single line");
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(entryPath, MOTTO, "utf8");

// Sanity check: resolve the shipped entry.txt via import.meta.url and
// confirm the written output is byte-identical to it.
const here = dirname(fileURLToPath(import.meta.url));
const shipped = join(here, "entry.txt");
const written = readFileSync(entryPath, "utf8");
if (written !== readFileSync(shipped, "utf8")) {
  console.error("error: written entry.txt differs from shipped entry.txt");
  process.exit(1);
}
