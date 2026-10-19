/**
 * A small QR Code encoder — byte mode, versions 1–10, error correction
 * levels M and L. It exists so the project has no runtime dependency
 * beyond React: a table tent and an order ticket both need a real,
 * scannable code, and that is all this file does.
 *
 * Follows ISO/IEC 18004. Structure (field arithmetic, format/version
 * BCH, zig-zag placement) is the textbook one.
 */

export type EccLevel = 'L' | 'M';

/** `modules[y][x]` — true means a dark module. No quiet zone included. */
export type QrMatrix = boolean[][];

export interface QrCode {
  version: number;
  size: number;
  ecc: EccLevel;
  mask: number;
  modules: QrMatrix;
}

/* ------------------------------------------------------------------ */
/* GF(256) arithmetic, primitive polynomial x^8 + x^4 + x^3 + x^2 + 1  */
/* ------------------------------------------------------------------ */

const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);

{
  let x = 1;
  for (let i = 0; i < 255; i += 1) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i += 1) EXP[i] = EXP[i - 255]!;
}

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return EXP[LOG[a]! + LOG[b]!]!;
}

/** Generator polynomial of degree `degree`, coefficients high-order first. */
function generatorPoly(degree: number): Uint8Array {
  let poly = new Uint8Array([1]);
  for (let i = 0; i < degree; i += 1) {
    const next = new Uint8Array(poly.length + 1);
    for (let j = 0; j < poly.length; j += 1) {
      next[j] = next[j]! ^ poly[j]!;
      next[j + 1] = next[j + 1]! ^ gfMul(poly[j]!, EXP[i]!);
    }
    poly = next;
  }
  return poly;
}

/** Reed–Solomon remainder for one block. */
function eccFor(data: Uint8Array, degree: number): Uint8Array {
  const gen = generatorPoly(degree);
  const buffer = new Uint8Array(data.length + degree);
  buffer.set(data);
  for (let i = 0; i < data.length; i += 1) {
    const factor = buffer[i]!;
    if (factor === 0) continue;
    for (let j = 0; j < gen.length; j += 1) {
      buffer[i + j] = buffer[i + j]! ^ gfMul(gen[j]!, factor);
    }
  }
  return buffer.slice(data.length);
}

/* ------------------------------------------------------------------ */
/* Version tables (versions 1–10)                                      */
/* ------------------------------------------------------------------ */

interface BlockSpec {
  /** Error-correction codewords per block. */
  ecc: number;
  /** [block count, data codewords per block] for group 1 and group 2. */
  group1: [number, number];
  group2: [number, number] | null;
}

const SPECS: Record<EccLevel, Record<number, BlockSpec>> = {
  M: {
    1: { ecc: 10, group1: [1, 16], group2: null },
    2: { ecc: 16, group1: [1, 28], group2: null },
    3: { ecc: 26, group1: [1, 44], group2: null },
    4: { ecc: 18, group1: [2, 32], group2: null },
    5: { ecc: 24, group1: [2, 43], group2: null },
    6: { ecc: 16, group1: [4, 27], group2: null },
    7: { ecc: 18, group1: [4, 31], group2: null },
    8: { ecc: 22, group1: [2, 38], group2: [2, 39] },
    9: { ecc: 22, group1: [3, 36], group2: [2, 37] },
    10: { ecc: 26, group1: [4, 43], group2: [1, 44] },
  },
  L: {
    1: { ecc: 7, group1: [1, 19], group2: null },
    2: { ecc: 10, group1: [1, 34], group2: null },
    3: { ecc: 15, group1: [1, 55], group2: null },
    4: { ecc: 20, group1: [1, 80], group2: null },
    5: { ecc: 26, group1: [1, 108], group2: null },
    6: { ecc: 18, group1: [2, 68], group2: null },
    7: { ecc: 20, group1: [2, 78], group2: null },
    8: { ecc: 24, group1: [2, 97], group2: null },
    9: { ecc: 30, group1: [2, 116], group2: null },
    10: { ecc: 18, group1: [2, 68], group2: [2, 69] },
  },
};

const ALIGNMENT: Record<number, number[]> = {
  1: [],
  2: [6, 18],
  3: [6, 22],
  4: [6, 26],
  5: [6, 30],
  6: [6, 34],
  7: [6, 22, 38],
  8: [6, 24, 42],
  9: [6, 26, 46],
  10: [6, 28, 50],
};

const MAX_VERSION = 10;

/** Format-information bits for the two error-correction levels we support. */
const ECC_FORMAT_BITS: Record<EccLevel, number> = { L: 0b01, M: 0b00 };

function dataCodewords(spec: BlockSpec): number {
  const [count1, size1] = spec.group1;
  const group2 = spec.group2;
  return count1 * size1 + (group2 ? group2[0] * group2[1] : 0);
}

/** Byte-mode character-count indicator is 8 bits up to version 9, then 16. */
function charCountBits(version: number): number {
  return version <= 9 ? 8 : 16;
}

/* ------------------------------------------------------------------ */
/* Bit buffer                                                          */
/* ------------------------------------------------------------------ */

class BitBuffer {
  private readonly bits: number[] = [];

  push(value: number, length: number): void {
    for (let i = length - 1; i >= 0; i -= 1) this.bits.push((value >>> i) & 1);
  }

  get length(): number {
    return this.bits.length;
  }

  toBytes(byteLength: number): Uint8Array {
    const bytes = new Uint8Array(byteLength);
    for (let i = 0; i < this.bits.length; i += 1) {
      if (this.bits[i] === 1) bytes[i >>> 3] = bytes[i >>> 3]! | (0x80 >>> (i & 7));
    }
    return bytes;
  }
}

/* ------------------------------------------------------------------ */
/* Encoding                                                            */
/* ------------------------------------------------------------------ */

function chooseVersion(byteLength: number, ecc: EccLevel): number | null {
  for (let version = 1; version <= MAX_VERSION; version += 1) {
    const spec = SPECS[ecc][version]!;
    const capacityBits = dataCodewords(spec) * 8;
    const needed = 4 + charCountBits(version) + byteLength * 8;
    if (needed <= capacityBits) return version;
  }
  return null;
}

function buildCodewords(data: Uint8Array, version: number, ecc: EccLevel): Uint8Array {
  const spec = SPECS[ecc][version]!;
  const capacity = dataCodewords(spec);

  const buffer = new BitBuffer();
  buffer.push(0b0100, 4); // byte mode
  buffer.push(data.length, charCountBits(version));
  for (const byte of data) buffer.push(byte, 8);

  // Terminator, then pad to a whole byte, then alternating pad bytes.
  const terminator = Math.min(4, capacity * 8 - buffer.length);
  buffer.push(0, terminator);
  if (buffer.length % 8 !== 0) buffer.push(0, 8 - (buffer.length % 8));

  const bytes = buffer.toBytes(capacity);
  const padPattern = [0xec, 0x11];
  for (let i = buffer.length / 8, p = 0; i < capacity; i += 1, p += 1) {
    bytes[i] = padPattern[p % 2]!;
  }

  // Split into blocks, compute ECC, then interleave.
  const blocks: Uint8Array[] = [];
  const eccBlocks: Uint8Array[] = [];
  let offset = 0;
  const groups: Array<[number, number]> = spec.group2 ? [spec.group1, spec.group2] : [spec.group1];
  for (const [count, size] of groups) {
    for (let i = 0; i < count; i += 1) {
      const block = bytes.slice(offset, offset + size);
      offset += size;
      blocks.push(block);
      eccBlocks.push(eccFor(block, spec.ecc));
    }
  }

  const result: number[] = [];
  const longest = Math.max(...blocks.map((block) => block.length));
  for (let i = 0; i < longest; i += 1) {
    for (const block of blocks) if (i < block.length) result.push(block[i]!);
  }
  for (let i = 0; i < spec.ecc; i += 1) {
    for (const block of eccBlocks) result.push(block[i]!);
  }
  return Uint8Array.from(result);
}

/* ------------------------------------------------------------------ */
/* Matrix                                                              */
/* ------------------------------------------------------------------ */

class Canvas {
  readonly size: number;
  readonly modules: boolean[][];
  readonly reserved: boolean[][];

  constructor(readonly version: number) {
    this.size = version * 4 + 17;
    this.modules = Array.from({ length: this.size }, () => new Array<boolean>(this.size).fill(false));
    this.reserved = Array.from({ length: this.size }, () => new Array<boolean>(this.size).fill(false));
  }

  set(x: number, y: number, dark: boolean): void {
    this.modules[y]![x] = dark;
    this.reserved[y]![x] = true;
  }

  isReserved(x: number, y: number): boolean {
    return this.reserved[y]![x]!;
  }

  private drawFinder(cx: number, cy: number): void {
    for (let dy = -4; dy <= 4; dy += 1) {
      for (let dx = -4; dx <= 4; dx += 1) {
        const x = cx + dx;
        const y = cy + dy;
        if (x < 0 || x >= this.size || y < 0 || y >= this.size) continue;
        const distance = Math.max(Math.abs(dx), Math.abs(dy));
        this.set(x, y, distance !== 2 && distance <= 3);
      }
    }
  }

  private drawAlignment(cx: number, cy: number): void {
    for (let dy = -2; dy <= 2; dy += 1) {
      for (let dx = -2; dx <= 2; dx += 1) {
        this.set(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
      }
    }
  }

  drawFunctionPatterns(): void {
    this.drawFinder(3, 3);
    this.drawFinder(this.size - 4, 3);
    this.drawFinder(3, this.size - 4);

    // Timing patterns.
    for (let i = 8; i < this.size - 8; i += 1) {
      this.set(i, 6, i % 2 === 0);
      this.set(6, i, i % 2 === 0);
    }

    // Alignment patterns, skipping the three that collide with finders.
    const centres = ALIGNMENT[this.version] ?? [];
    const last = centres.length - 1;
    for (let i = 0; i < centres.length; i += 1) {
      for (let j = 0; j < centres.length; j += 1) {
        const corner =
          (i === 0 && j === 0) || (i === 0 && j === last) || (i === last && j === 0);
        if (!corner) this.drawAlignment(centres[j]!, centres[i]!);
      }
    }

    // The format-information strips are reserved by drawFormatInfo, which
    // runs before any data is placed — they skip row/column 6 (timing), so
    // reserving them here with a plain loop would overwrite timing modules.

    if (this.version >= 7) {
      for (let i = 0; i < 18; i += 1) {
        const a = this.size - 11 + (i % 3);
        const b = Math.floor(i / 3);
        this.set(a, b, false);
        this.set(b, a, false);
      }
    }
  }

  drawVersionInfo(): void {
    if (this.version < 7) return;
    let remainder = this.version;
    for (let i = 0; i < 12; i += 1) {
      remainder = (remainder << 1) ^ ((remainder >>> 11) * 0x1f25);
    }
    const bits = ((this.version << 12) | remainder) >>> 0;
    for (let i = 0; i < 18; i += 1) {
      const dark = ((bits >>> i) & 1) === 1;
      const a = this.size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      this.set(a, b, dark);
      this.set(b, a, dark);
    }
  }

  drawFormatInfo(ecc: EccLevel, mask: number): void {
    const value = (ECC_FORMAT_BITS[ecc] << 3) | mask;
    let remainder = value;
    for (let i = 0; i < 10; i += 1) {
      remainder = (remainder << 1) ^ ((remainder >>> 9) * 0x537);
    }
    const bits = (((value << 10) | remainder) ^ 0x5412) >>> 0;
    const bit = (index: number) => ((bits >>> index) & 1) === 1;

    for (let i = 0; i <= 5; i += 1) this.set(8, i, bit(i));
    this.set(8, 7, bit(6));
    this.set(8, 8, bit(7));
    this.set(7, 8, bit(8));
    for (let i = 9; i < 15; i += 1) this.set(14 - i, 8, bit(i));

    for (let i = 0; i < 8; i += 1) this.set(this.size - 1 - i, 8, bit(i));
    for (let i = 8; i < 15; i += 1) this.set(8, this.size - 15 + i, bit(i));
    this.set(8, this.size - 8, true);
  }

  placeData(codewords: Uint8Array): void {
    let index = 0;
    const totalBits = codewords.length * 8;
    for (let right = this.size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (let vertical = 0; vertical < this.size; vertical += 1) {
        for (let j = 0; j < 2; j += 1) {
          const x = right - j;
          const upward = ((right + 1) & 2) === 0;
          const y = upward ? this.size - 1 - vertical : vertical;
          if (this.isReserved(x, y)) continue;
          if (index < totalBits) {
            const byte = codewords[index >>> 3]!;
            this.modules[y]![x] = ((byte >>> (7 - (index & 7))) & 1) === 1;
            index += 1;
          }
          // Remaining modules stay light; the spec calls them remainder bits.
        }
      }
    }
  }

  applyMask(mask: number): void {
    for (let y = 0; y < this.size; y += 1) {
      for (let x = 0; x < this.size; x += 1) {
        if (this.isReserved(x, y)) continue;
        if (maskCondition(mask, x, y)) this.modules[y]![x] = !this.modules[y]![x];
      }
    }
  }
}

function maskCondition(mask: number, x: number, y: number): boolean {
  switch (mask) {
    case 0:
      return (x + y) % 2 === 0;
    case 1:
      return y % 2 === 0;
    case 2:
      return x % 3 === 0;
    case 3:
      return (x + y) % 3 === 0;
    case 4:
      return (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0;
    case 5:
      return ((x * y) % 2) + ((x * y) % 3) === 0;
    case 6:
      return (((x * y) % 2) + ((x * y) % 3)) % 2 === 0;
    case 7:
      return (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
    default:
      throw new Error(`Unknown mask ${mask}`);
  }
}

/* ------------------------------------------------------------------ */
/* Mask penalty (ISO/IEC 18004 §8.8.2)                                 */
/* ------------------------------------------------------------------ */

function penalty(modules: boolean[][], size: number): number {
  let score = 0;

  // Rule 1 — runs of five or more same-coloured modules in a row/column.
  for (let i = 0; i < size; i += 1) {
    for (const horizontal of [true, false]) {
      let runColour = false;
      let runLength = 0;
      for (let j = 0; j < size; j += 1) {
        const dark = horizontal ? modules[i]![j]! : modules[j]![i]!;
        if (dark === runColour) {
          runLength += 1;
          if (runLength === 5) score += 3;
          else if (runLength > 5) score += 1;
        } else {
          runColour = dark;
          runLength = 1;
        }
      }
    }
  }

  // Rule 2 — 2×2 blocks of one colour.
  for (let y = 0; y < size - 1; y += 1) {
    for (let x = 0; x < size - 1; x += 1) {
      const colour = modules[y]![x]!;
      if (
        colour === modules[y]![x + 1]! &&
        colour === modules[y + 1]![x]! &&
        colour === modules[y + 1]![x + 1]!
      ) {
        score += 3;
      }
    }
  }

  // Rule 3 — finder-like 1:1:3:1:1 patterns with four light modules beside.
  const pattern = [true, false, true, true, true, false, true];
  const quiet = [false, false, false, false];
  const matches = (line: boolean[], at: number, needle: boolean[]): boolean =>
    needle.every((value, offset) => line[at + offset] === value);

  for (let i = 0; i < size; i += 1) {
    const row: boolean[] = [];
    const column: boolean[] = [];
    for (let j = 0; j < size; j += 1) {
      row.push(modules[i]![j]!);
      column.push(modules[j]![i]!);
    }
    for (const line of [row, column]) {
      for (let j = 0; j + 7 <= size; j += 1) {
        if (!matches(line, j, pattern)) continue;
        const before = j >= 4 && matches(line, j - 4, quiet);
        const after = j + 11 <= size && matches(line, j + 7, quiet);
        if (before || after) score += 40;
      }
    }
  }

  // Rule 4 — deviation from an even split of dark and light.
  let dark = 0;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) if (modules[y]![x]) dark += 1;
  }
  const percent = (dark * 100) / (size * size);
  score += Math.floor(Math.abs(percent - 50) / 5) * 10;

  return score;
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export class QrTooLongError extends Error {
  constructor(byteLength: number) {
    super(`Payload of ${byteLength} bytes does not fit in a version-${MAX_VERSION} QR code`);
    this.name = 'QrTooLongError';
  }
}

/**
 * Encode `text` as a QR code, choosing the smallest version that fits.
 * Prefers error-correction level M; falls back to L for longer payloads.
 */
export function encodeQr(text: string): QrCode {
  const data = new TextEncoder().encode(text);

  let ecc: EccLevel = 'M';
  let version = chooseVersion(data.length, ecc);
  if (version === null) {
    ecc = 'L';
    version = chooseVersion(data.length, ecc);
  }
  if (version === null) throw new QrTooLongError(data.length);

  const codewords = buildCodewords(data, version, ecc);

  let best: Canvas | null = null;
  let bestMask = 0;
  let bestScore = Number.POSITIVE_INFINITY;

  for (let mask = 0; mask < 8; mask += 1) {
    const canvas = new Canvas(version);
    canvas.drawFunctionPatterns();
    canvas.drawVersionInfo();
    canvas.drawFormatInfo(ecc, mask);
    canvas.placeData(codewords);
    canvas.applyMask(mask);
    const score = penalty(canvas.modules, canvas.size);
    if (score < bestScore) {
      bestScore = score;
      best = canvas;
      bestMask = mask;
    }
  }

  const canvas = best!;
  return {
    version,
    size: canvas.size,
    ecc,
    mask: bestMask,
    modules: canvas.modules,
  };
}

/** Render a QR code as a standalone SVG path string (one path, all modules). */
export function qrToSvgPath(code: QrCode): string {
  const parts: string[] = [];
  for (let y = 0; y < code.size; y += 1) {
    for (let x = 0; x < code.size; x += 1) {
      if (code.modules[y]![x]) parts.push(`M${x} ${y}h1v1h-1z`);
    }
  }
  return parts.join('');
}
