export function gitignore(input: string): string[] {
    return input.split(/\r?\n/).filter((l) => l.trim() !== '' && l.charAt(0) !== '#')
}
