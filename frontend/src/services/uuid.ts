/**
 * Deterministic UUID v5 generator used for stable question identifiers.
 *
 * Uses the Web Crypto API's SHA-1 digest, which is available in modern
 * browsers and in Node.js 20+ through `globalThis.crypto`.
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function isUuid(value: string): boolean {
  return UUID_REGEX.test(value)
}

const DEFAULT_NAMESPACE = '0f5a9f88-8f0e-4f0b-9d3e-1a2b3c4d5e6f'

function uuidToBytes(uuid: string): Uint8Array {
  const hex = uuid.replace(/-/g, '')
  const bytes = new Uint8Array(16)

  for (let i = 0; i < 16; i += 1) {
    bytes[i] = Number.parseInt(hex.substring(i * 2, i * 2 + 2), 16)
  }

  return bytes
}

function stringToBytes(value: string): Uint8Array {
  const bytes: number[] = []

  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i)

    if (code < 0x80) {
      bytes.push(code)
    } else if (code < 0x800) {
      bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f))
    } else {
      bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f))
    }
  }

  return new Uint8Array(bytes)
}

function bytesToUuid(hash: Uint8Array): string {
  const h = Array.from(hash.slice(0, 16))

  h[6] = (h[6] & 0x0f) | 0x50
  h[8] = (h[8] & 0x3f) | 0x80

  const hex = h.map((byte) => byte.toString(16).padStart(2, '0')).join('')

  return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20, 32)}`
}

function rotateLeft(value: number, bits: number): number {
  return ((value << bits) | (value >>> (32 - bits))) >>> 0
}

function sha1(input: Uint8Array): Uint8Array {
  const originalLengthBits = BigInt(input.length * 8)
  const padStart = input.length + 1
  const padZeroCount = (64 - ((padStart + 8) % 64)) % 64
  const paddedLength = padStart + padZeroCount + 8
  const padded = new Uint8Array(paddedLength)

  padded.set(input)
  padded[input.length] = 0x80

  const view = new DataView(padded.buffer)
  view.setBigUint64(paddedLength - 8, originalLengthBits, false)

  const h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0]
  const words = new Uint32Array(80)

  for (let offset = 0; offset < paddedLength; offset += 64) {
    for (let i = 0; i < 16; i += 1) {
      words[i] = view.getUint32(offset + i * 4, false)
    }

    for (let i = 16; i < 80; i += 1) {
      words[i] = rotateLeft(words[i - 3] ^ words[i - 8] ^ words[i - 14] ^ words[i - 16], 1)
    }

    let [a, b, c, d, e] = h

    for (let i = 0; i < 80; i += 1) {
      let f: number
      let k: number

      if (i < 20) {
        f = (b & c) | (~b & d)
        k = 0x5a827999
      } else if (i < 40) {
        f = b ^ c ^ d
        k = 0x6ed9eba1
      } else if (i < 60) {
        f = (b & c) | (b & d) | (c & d)
        k = 0x8f1bbcdc
      } else {
        f = b ^ c ^ d
        k = 0xca62c1d6
      }

      const temp = (rotateLeft(a, 5) + f + e + k + words[i]) >>> 0
      e = d
      d = c
      c = rotateLeft(b, 30)
      b = a
      a = temp
    }

    h[0] = (h[0] + a) >>> 0
    h[1] = (h[1] + b) >>> 0
    h[2] = (h[2] + c) >>> 0
    h[3] = (h[3] + d) >>> 0
    h[4] = (h[4] + e) >>> 0
  }

  const digest = new Uint8Array(20)
  const digestView = new DataView(digest.buffer)

  for (let i = 0; i < 5; i += 1) {
    digestView.setUint32(i * 4, h[i], false)
  }

  return digest
}

export function generateUuidV5(name: string, namespace: string = DEFAULT_NAMESPACE): string {
  const namespaceBytes = uuidToBytes(namespace)
  const nameBytes = stringToBytes(name)
  const combined = new Uint8Array(namespaceBytes.length + nameBytes.length)

  combined.set(namespaceBytes)
  combined.set(nameBytes, namespaceBytes.length)

  const hash = sha1(combined)

  return bytesToUuid(hash)
}
