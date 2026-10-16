import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { cn } from "../utils/cn";

/* --------------------------- CopyButton --------------------------- */

export function CopyButton({ text, label = "نسخ", className }: { text: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      onClick={doCopy}
      className={cn(
        "group relative inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all",
        copied
          ? "bg-mint/15 text-mint border border-mint/40"
          : "bg-white/5 text-fog-2 border border-white/10 hover:bg-white/10 hover:text-fog hover:border-white/20",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span key="ok" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} className="flex items-center gap-2">
            <Check size={14} strokeWidth={3} />
            تنسخت
          </motion.span>
        ) : (
          <motion.span key="cp" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} className="flex items-center gap-2">
            <Copy size={14} />
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

/* --------------------------- Segmented ---------------------------- */

export interface SegOption<T extends string> {
  value: T;
  label: string;
  tone?: "good" | "bad" | "warn" | "neutral";
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T | null;
  onChange: (v: T) => void;
  options: SegOption<T>[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt.value;
        const tone =
          opt.tone === "good"
            ? "text-mint border-mint/50 bg-mint/10"
            : opt.tone === "bad"
              ? "text-rose border-rose/50 bg-rose/10"
              : opt.tone === "warn"
                ? "text-gold border-gold/50 bg-gold/10"
                : "text-fog border-white/30 bg-white/10";
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-xl px-3.5 py-2 text-xs font-semibold border transition-all duration-200",
              active ? tone : "border-white/10 bg-white/[0.03] text-fog-3 hover:text-fog-2 hover:border-white/20"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* --------------------------- Field label -------------------------- */

export function FieldLabel({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <label className="mb-2 flex items-baseline gap-2 text-[13px] font-semibold text-fog-2">
      {children}
      {hint && <span className="text-[11px] font-normal text-fog-3">{hint}</span>}
    </label>
  );
}

/* --------------------------- Group card --------------------------- */

export function GroupCard({
  step,
  icon,
  title,
  desc,
  children,
}: {
  step: string;
  icon: ReactNode;
  title: string;
  desc: string;
  children: ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8"
    >
      <div className="pointer-events-none absolute -top-20 -left-20 h-48 w-48 rounded-full bg-mint/10 blur-3xl" />
      <div className="relative mb-6 flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-mint/12 text-mint border border-mint/25">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-latin text-[10px] font-bold tracking-[0.22em] text-mint/80">{step}</span>
            <h3 className="text-lg font-bold text-fog">{title}</h3>
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-fog-3">{desc}</p>
        </div>
      </div>
      <div className="relative">{children}</div>
    </motion.section>
  );
}
