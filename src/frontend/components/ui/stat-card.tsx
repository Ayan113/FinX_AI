"use client";

import { motion } from "framer-motion";

import { GlassCard } from "@/frontend/components/ui/glass-card";

export function StatCard({
  label,
  value,
  hint
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <motion.div whileHover={{ y: -4 }}>
      <GlassCard className="h-full">
        <div className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          {label}
        </div>
        <div className="mt-4 text-3xl font-semibold">{value}</div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{hint}</p>
      </GlassCard>
    </motion.div>
  );
}
