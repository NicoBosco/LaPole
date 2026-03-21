import { cn } from "@/lib/utils/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  glow?: boolean;
}

export function Card({ children, hover = false, glow = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5",
        "shadow-[var(--shadow-card)]",
        hover && "transition-all duration-200 hover:border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-raised)] hover:-translate-y-0.5",
        glow && "hover:shadow-[var(--shadow-glow)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
