export const encodeBase32 = (buffer: Buffer): string => {
  if ((buffer.length * 8) % 5 !== 0) {
    throw new Error("encodeBase32 does not support generating padding");
  }
  let scratchpad: number = 0;
  let bitCount: number = 0;
  let result: string = "";
  for (let i=0; i < buffer.length; ++i) {
    const byte: number = buffer.readUint8(i);
    scratchpad <<= 8;
    scratchpad |= byte;
    bitCount += 8;
    while (bitCount >= 5) {
      const value: number = (scratchpad >> (bitCount - 5)) & 0b11111;
      const c: string = encodeBase32Char(value);
      result += c;
      bitCount -= 5;
    }
  }
  return result;
};

export const decodeBase32 = (base32: string): Buffer => {
  let scratchpad: number = 0;
  let bitCount: number = 0;
  let byteCount: number = 0;
  const bytes: Buffer = Buffer.alloc(Math.ceil(base32.length * 5 / 8));
  for (let i = base32.length-1; i >= 0; i--) {
    const b: number = decodeBase32Char(base32.charAt(i));
    scratchpad |= (b << bitCount);
    bitCount += 5;
    if (bitCount >= 8) {
      const complete = scratchpad & 0xFF;
      scratchpad >>= 8;
      bitCount -= 8;
      bytes.writeUInt8(complete, byteCount);
      byteCount += 1;
    }
  }
  if (bitCount > 0) {
    const partial = scratchpad & 0xFF;
    bytes.writeUInt8(partial, byteCount);
    byteCount += 1;
  }
  return bytes.reverse();
};

export const decodeBase32Char = (char: string): number => {
  if (char.length !== 1) throw new Error("decodeBase32Char expects a single character");
  const c: number = char.charCodeAt(0);
  if ('A'.charCodeAt(0) <= c && c <= 'Z'.charCodeAt(0)) return c - 'A'.charCodeAt(0);
  if ('2'.charCodeAt(0) <= c && c <= '7'.charCodeAt(0)) return c - '2'.charCodeAt(0) + 26;
  throw new Error("Invalid Base32 character");
};

export const encodeBase32Char = (value: number): string => {
  if (0 <= value && value <= 25) return String.fromCharCode(value + 'A'.charCodeAt(0));
  if (26 <= value && value <= 31) return String.fromCharCode(value - 26 + '2'.charCodeAt(0));
  throw new Error("Invalid value for Base32");
};
