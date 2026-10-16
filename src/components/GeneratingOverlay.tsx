import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ScanSearch, PenLine, MessageSquareText, FileCode2, Check } from "lucide-react";

const STEPS = [
  { icon: ScanSearch, label: "كنحللو السمعة ونقاط الضعف…" },
  { icon: MessageSquareText, label: "كنصايبو الرسائل بالدارجة…" },
  { icon: PenLine, label: "كنصيغو زاوية الإقناع…" },
  { icon: FileCode2, label: "كنكتبو برومبت الموقع بالإنجليزية…" },
];

export default function GeneratingOverlay({ show }: { show: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!show) return setStep(0);
    const t = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 620);
    return () => clearInterval(t);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.92, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 10 }}
            className="glass-strong relative w-[min(92vw,420px)] overflow-hidden rounded-3xl p-8"
          >
            <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-mint/15 blur-3xl pulse-glow" />

            <div className="relative mx-auto mb-7 flex h-20 w-20 items-center justify-center">
              <div className="spin-slow absolute inset-0 rounded-full border-2 border-dashed border-mint/40" />
              <div className="absolute inset-2 rounded-full border border-white/10" />
              <ScanSearch size={26} className="text-mint" />
            </div>

            <div className="relative text-center">
              <div className="font-latin text-[10px] font-bold tracking-[0.3em] text-mint">ANALYZING</div>
              <div className="mt-2 text-xl font-bold">كنحضرو الملف ديالك…</div>
            </div>

            <div className="relative mt-7 space-y-3">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const done = i < step;
                const active = i === step;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: active || done ? 1 : 0.35, x: 0 }}
                    transition={{ delay: i * 0.12 }}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-[13px] font-semibold transition-colors ${
                      active ? "border-mint/40 bg-mint/10 text-mint" : done ? "border-white/10 bg-white/5 text-fog-2" : "border-white/5 text-fog-3"
                    }`}
                  >
                    <span className="flex h-6 w-6 items-center justify-center">
                      {done ? <Check size={15} className="text-mint" strokeWidth={3} /> : <Icon size={15} />}
                    </span>
                    {s.label}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
