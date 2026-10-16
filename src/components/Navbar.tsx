import { motion } from "framer-motion";
import { Stethoscope, ArrowDown } from "lucide-react";

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 inset-x-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="glass-strong mt-4 flex items-center justify-between rounded-2xl px-4 py-3 sm:px-5">
          <a href="#top" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-mint to-mint-2 text-ink shadow-[0_8px_20px_-6px_rgba(47,230,176,0.6)]">
              <Stethoscope size={18} strokeWidth={2.4} />
            </div>
            <div className="leading-tight">
              <div className="text-[15px] font-bold text-fog">طبيب كيت</div>
              <div className="font-latin text-[9px] font-semibold tracking-[0.3em] text-fog-3">TABIBKIT</div>
            </div>
          </a>

          <nav className="hidden items-center gap-6 text-[13px] font-medium text-fog-2 md:flex">
            {[
              ["البيانات", "#form"],
              ["التقرير", "#results"],
              ["البرومبت", "#results"],
            ].map(([label, href]) => (
              <a key={href + label} href={href} className="transition-colors hover:text-mint">
                {label}
              </a>
            ))}
          </nav>

          <a
            href="#form"
            className="btn-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-bold"
          >
            بدا التحليل
            <ArrowDown size={15} strokeWidth={2.6} />
          </a>
        </div>
      </div>
    </motion.header>
  );
}
