// Joins class names, dropping falsy entries from conditional `flag && "class"` expressions.
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
