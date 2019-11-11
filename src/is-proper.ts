export function isProper(word: string): boolean {
  return /$[A-Z]/.test(word)
}
