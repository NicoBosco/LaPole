// Utilidad simple para className — evita depender de clsx/tailwind-merge
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
