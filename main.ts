// News-image 25 Nov 2026 entry, V2 revision — Node 22, standard library only.
// entry.png sits beside this file: a 768x1024 PNG, 614,971 bytes, inside
// the gate (at most 1 MiB, at most 1024 by 1024 pixels). This program checks
// the file is a whole, in-gate PNG and copies it to /output/entry.png.
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const IMAGE = new URL('./entry.png', import.meta.url);
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const BYTE_CAP = 1048576;
const SIDE_CAP = 1024;

function fail(message) {
  throw new Error(`entry.png rejected: ${message}`);
}

function validate(bytes) {
  if (bytes.length > BYTE_CAP) {
    fail(`is ${bytes.length} bytes, over the 1 MiB cap`);
  }
  // PNG signature: 89 50 4E 47 0D 0A 1A 0A
  const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (!signature.every((byte, i) => bytes[i] === byte)) {
    fail('does not start with the PNG signature');
  }
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  if (width > SIDE_CAP || height > SIDE_CAP) {
    fail(`is ${width}x${height}, over the 1024x1024 cap`);
  }
  // A whole PNG ends with the IEND chunk: 00 00 00 00 49 45 4E 44 AE 42 60 82.
  const tail = [0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82];
  if (!tail.every((byte, i) => bytes[bytes.length - 12 + i] === byte)) {
    fail('is truncated: no IEND chunk at the end');
  }
  return { width, height };
}

const bytes = readFileSync(IMAGE);
const { width, height } = validate(bytes);
console.log(`entry.png OK: ${width}x${height}, ${bytes.length} bytes`);

mkdirSync(OUT_DIR, { recursive: true });
const destination = join(OUT_DIR, 'entry.png');
copyFileSync(IMAGE, destination);
console.log(`wrote ${destination}`);
