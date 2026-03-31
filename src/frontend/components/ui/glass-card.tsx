import { cn } from "@/shared/lib/utils";

export function GlassCard({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/10 bg-white/65 p-5 shadow-glass backdrop-blur-xl dark:bg-slate-900/70",
        className
      )}
    >
      {children}
    </div>
  );
}
