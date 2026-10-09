type ClassPart = string | false | null | undefined

/** Minimal class combiner. No external dependency. */
export function cn(...parts: ClassPart[]): string {
  return parts.filter(Boolean).join(' ')
}
