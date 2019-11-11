export function sentenceSplitter(line: string): string[] {
  return line
  .split(/([^\.\?!;]+[\.\?!;])/g)
  .filter(x => x && x.length > 3)
  .map(x => x.trim())
}
