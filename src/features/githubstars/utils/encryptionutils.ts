const rawKey = new Uint8Array([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32
]) // preserved for compatibility, but unused here

const xorKey = 23 // lightweight obfuscation key

export const encrypt = async (text: string): Promise<string> => {
  const obfuscated = Array.from(text).map(char => char.charCodeAt(0) ^ xorKey)
  const base64 = btoa(String.fromCharCode(...obfuscated))
  return JSON.stringify({ encrypted: base64 }) // same structure as before
}

export const decrypt = async (cipherText: string): Promise<string> => {
  const { encrypted } = JSON.parse(cipherText)
  const decoded = atob(encrypted)
  const original = Array.from(decoded).map(char => char.charCodeAt(0) ^ xorKey)
  return String.fromCharCode(...original)
}
