"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Bot, FileSearch, LayoutDashboard, Mic, Moon, SunMedium } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/shared/lib/utils";
import { useAppStore } from "@/frontend/store/appStore";

const navigation = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chat", label: "AI Assistant", icon: Bot },
  { href: "/documents", label: "Document Analysis", icon: FileSearch },
  { href: "/portfolio", label: "Portfolio Analyzer", icon: BarChart3 },
  { href: "/market", label: "Market Insights", icon: SunMedium },
  { href: "/voice", label: "Voice Mode", icon: Mic }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);

  return (
    <div className="min-h-screen bg-[image:var(--app-bg)] text-slate-900 transition-colors dark:text-slate-100">
      <div className="min-h-screen bg-mesh">
        <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:px-6">
          <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-72 shrink-0 rounded-[32px] border border-white/10 bg-white/60 p-5 shadow-glass backdrop-blur-xl dark:bg-panel lg:flex lg:flex-col">
            <div className="mb-8">
              <div className="text-xs uppercase tracking-[0.32em] text-cyan-700 dark:text-cyanGlow">
                FinInsight AI
              </div>
              <h1 className="mt-3 text-2xl font-semibold">Market Intelligence Workspace</h1>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                Educational analytics, grounded RAG answers, portfolio diagnostics, and voice workflows.
              </p>
            </div>

            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    className={cn(
                      "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                      active
                        ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                        : "text-slate-700 hover:bg-white/70 dark:text-slate-200 dark:hover:bg-white/10"
                    )}
                    href={item.href}
                    key={item.href}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <motion.button
              whileTap={{ scale: 0.98 }}
              className="mt-auto flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white dark:bg-white dark:text-slate-950"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              type="button"
            >
              <span>{theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}</span>
              {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </motion.button>
          </aside>

          <main className="flex-1 rounded-[32px] border border-white/10 bg-white/70 p-4 shadow-glass backdrop-blur-2xl dark:bg-slate-950/60 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
