import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  linkHref?: string;
  linkLabel?: string;
}

export function SectionHeader({
  title,
  subtitle,
  linkHref,
  linkLabel = "Ver todo",
}: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-4 mb-5">
      <div>
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
            {subtitle}
          </p>
        )}
      </div>
      {linkHref && (
        <Link
          href={linkHref}
          className="shrink-0 text-sm font-medium text-[var(--color-f1-red)] hover:text-[var(--color-f1-red-light)] transition-colors"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
