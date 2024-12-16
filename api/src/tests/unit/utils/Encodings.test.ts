import { decodeBase32, decodeBase32Char, encodeBase32, encodeBase32Char } from "../../../utils/Encodings";
import { describe, it, expect } from "vitest";

describe("decodeBase32Char", () => {
  it.each<[string, number]>([
    ['A', 0],
    ['Z', 25],
    ['2', 26],
    ['7', 31],
  ])("Correctly decodes the characters at boundaries of %p", (char: string, expected: number) => {
    expect(decodeBase32Char(char)).toEqual(expected);
  });
});

describe("encodeBase32Char", () => {
  it.each<[number, string]>([
    [0, 'A'],
    [25, 'Z'],
    [26, '2'],
    [31, '7'],
  ])("Correctly encodes the numbers at boundaries of %p", (value: number, expected: string) => {
    expect(encodeBase32Char(value)).toEqual(expected);
  });
});

describe("decodeBase32", () => {
  it.each<[string, Buffer]>([
    ["AAAAAAAA", Buffer.from([0, 0, 0, 0, 0])],
    ["ABCDEFGH", Buffer.from([0x00, 0x44, 0x32, 0x14, 0xC7])],
    ["TRACE765", Buffer.from([0x9C, 0x40, 0x22, 0x7F, 0xDD])],
  ])("Correctly decodes the base32 string to a buffer", (base32: string, expected: Buffer) => {
    expect(decodeBase32(base32)).toEqual(expected);
  })
});

describe("encodeBase32", () => {
  it.each<[Buffer, string]>([
    [Buffer.from([0, 0, 0, 0, 0]), "AAAAAAAA"],
    [Buffer.from([0x00, 0x44, 0x32, 0x14, 0xC7]), "ABCDEFGH"],
    [Buffer.from([0x9C, 0x40, 0x22, 0x7F, 0xDD]), "TRACE765"],
  ])("Correctly encodes the buffer to a base32 string", (buffer: Buffer, expected: string) => {
    expect(encodeBase32(buffer)).toEqual(expected);
  });
});
