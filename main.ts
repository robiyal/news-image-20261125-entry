// News-image 25 Nov 2026 entry (Node 22, standard library only).
// The image is entry.png beside this file (768x1024 PNG, 201,591 bytes —
// inside the gate: at most 1 MiB, at most 1024 by 1024 pixels). The program
// validates the file first (PNG magic, IHDR dimensions, size cap), then
// copies it to /output/entry.png, creating the output directory itself.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ENTRY = new URL('./entry.png', import.meta.url);
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const MAX_BYTES = 1048576;
const MAX_SIDE = 1024;

const bytes = readFileSync(ENTRY);
if (statSync(ENTRY).size > MAX_BYTES) {
  throw new Error(`entry.png is ${statSync(ENTRY).size} bytes, over the 1 MiB gate`);
}
// PNG magic: 89 50 4E 47 0D 0A 1A 0A
const MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!bytes.subarray(0, 8).equals(MAGIC)) throw new Error('entry.png is not a PNG');
const width = bytes.readUInt32BE(16);
const height = bytes.readUInt32BE(20);
if (width > MAX_SIDE || height > MAX_SIDE) {
  throw new Error(`entry.png is ${width}x${height}, over the 1024x1024 gate`);
}
// Whole-image check: the file must end with a valid IEND chunk
// (12 trailing bytes: 00 00 00 00 49 45 4E 44 AE 42 60 82).
const IEND = Buffer.from([
  0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
]);
if (!bytes.subarray(bytes.length - 12).equals(IEND)) {
  throw new Error('entry.png is truncated: no IEND chunk at the end');
}
console.log(`entry.png OK: ${width}x${height}, ${bytes.length} bytes`);

mkdirSync(OUT_DIR, { recursive: true });
copyFileSync(ENTRY, join(OUT_DIR, 'entry.png'));
console.log(`wrote ${join(OUT_DIR, 'entry.png')}`);
