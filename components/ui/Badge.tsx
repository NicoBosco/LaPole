import { cn } from "@/lib/utils/cn";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "team";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  style?: React.CSSProperties;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)] border border-[var(--color-border)]",
  success: "bg-green-500/10 text-green-400 border border-green-500/20",
  warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  danger:  "bg-red-500/10  text-red-400  border border-red-500/20",
  info:    "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  team:    "", // usa su propio estilo mediante props
};

export function Badge({ children, variant = "default", className, style }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
      style={style}
    >
      {children}
    </span>
  );
}
