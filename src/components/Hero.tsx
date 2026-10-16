import { motion } from "framer-motion";
import {
  Star,
  MessageCircle,
  Sparkles,
  ArrowDown,
  Play,
  Gauge,
  Flame,
  FileCode2,
  Stethoscope,
  Smile,
  Eye,
  Baby,
  Syringe,
  Brain,
  Bone,
  HeartPulse,
  Zap,
} from "lucide-react";

const fade = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.12 * i, duration: 0.7, ease: "easeOut" as const },
  }),
};

const SPECIALTIES = [
  { icon: Smile, label: "طب وتجميل الأسنان" },
  { icon: Sparkles, label: "الجلدية والتجميل" },
  { icon: Zap, label: "زراعة الشعر" },
  { icon: Eye, label: "طب العيون" },
  { icon: Baby, label: "طب الأطفال" },
  { icon: HeartPulse, label: "النساء والتوليد" },
  { icon: Syringe, label: "التجميل بالحقن" },
  { icon: Brain, label: "الطب النفسي" },
  { icon: Bone, label: "العظام والمفاصل" },
  { icon: Stethoscope, label: "الطب العام" },
];

export default function Hero({ onExample }: { onExample: () => void }) {
  return (
    <div className="relative overflow-hidden">
      <div className="grid-bg absolute inset-0" />
      <div className="pointer-events-none absolute -top-40 right-1/4 h-[30rem] w-[30rem] rounded-full bg-mint/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-40 -left-32 h-[24rem] w-[24rem] rounded-full bg-sky/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-36 pb-16 sm:pt-44 sm:pb-20">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          {/* ---------------- Copy ---------------- */}
          <div>
            <motion.div variants={fade} initial="hidden" animate="show" custom={0}
              className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-mint">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
              </span>
              أداة B2B للمسوقين والوكالات — نسخة العيادات المغربية
            </motion.div>

            <motion.h1
              variants={fade} initial="hidden" animate="show" custom={1}
              className="mt-6 text-[2.6rem] leading-[1.15] font-bold sm:text-6xl sm:leading-[1.12]"
            >
              من بيانات Google Maps
              <br />
              <span className="text-gradient-mint">لصفقة مع الطبيب…</span> فأقل من
              <span className="relative inline-block px-2">
                دقيقة
                <svg className="absolute -bottom-1 right-0 w-full" viewBox="0 0 120 12" fill="none">
                  <path d="M2 9C30 3 70 2 118 8" stroke="#2fe6b0" strokeWidth="3" strokeLinecap="round" className="dash-flow" />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              variants={fade} initial="hidden" animate="show" custom={2}
              className="mt-6 max-w-xl text-base leading-8 text-fog-2 sm:text-lg sm:leading-9"
            >
              دخّل بيانات أي عيادة، والمحرك كيولّد ليك <span className="font-semibold text-fog">تقرير تحليل كامل</span>،
              <span className="font-semibold text-fog"> 3 رسائل تواصل بالدارجة</span> جاهزين للإرسال،
              و <span className="font-semibold text-fog">برومبت احترافي</span> لتوليد الموقع فـ Framer أو أي AI Builder.
            </motion.p>

            <motion.div variants={fade} initial="hidden" animate="show" custom={3} className="mt-9 flex flex-wrap items-center gap-4">
              <a href="#form" className="btn-primary inline-flex items-center gap-2.5 rounded-2xl px-7 py-4 text-base font-bold">
                بدا التحليل دابا
                <ArrowDown size={18} strokeWidth={2.6} />
              </a>
              <button
                onClick={onExample}
                className="glass inline-flex items-center gap-2.5 rounded-2xl px-6 py-4 text-base font-bold text-fog transition-all hover:border-mint/40 hover:text-mint"
              >
                <Play size={17} className="text-mint" />
                جرّب بمثال جاهز
              </button>
            </motion.div>

            <motion.div variants={fade} initial="hidden" animate="show" custom={4} className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[13px] text-fog-3">
              {[
                "بلا تسجيل",
                "دارجة احترافية",
                "نسخ بضغطة وحدة",
              ].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-mint" />
                  {t}
                </div>
              ))}
            </motion.div>
          </div>

          {/* ---------------- Floating preview collage ---------------- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.9, ease: "easeOut" }}
            className="relative hidden h-[440px] lg:block"
          >
            {/* audit card */}
            <div className="float-soft glass-strong absolute top-2 right-0 w-72 rounded-3xl p-5 shadow-2xl shadow-black/40">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-fog-2">الجاهزية الرقمية</span>
                <Gauge size={15} className="text-gold" />
              </div>
              <div className="mt-3 flex items-end gap-2">
                <span className="font-latin text-5xl font-bold text-gradient-mint leading-none">28</span>
                <span className="mb-1 font-latin text-sm text-fog-3">/100</span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "28%" }}
                  transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-l from-mint to-gold"
                />
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-rose">
                <Flame size={13} />
                ليد سخون بزاف — السمعة ذهبية والحضور معدوم
              </div>
            </div>

            {/* whatsapp card */}
            <div className="float-soft glass-strong absolute top-48 left-0 w-64 rounded-3xl p-5 shadow-2xl shadow-black/40" style={{ animationDelay: "1.2s" }}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-mint/15 text-mint">
                  <MessageCircle size={15} />
                </div>
                <div className="text-[11px] font-bold text-fog-2">رسالة WhatsApp جاهزة</div>
              </div>
              <div className="mt-3 space-y-2">
                <div className="h-2 w-11/12 rounded bg-white/10" />
                <div className="h-2 w-9/12 rounded bg-white/10" />
                <div className="h-2 w-10/12 rounded bg-mint/25" />
                <div className="h-2 w-7/12 rounded bg-white/10" />
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px] text-fog-3">
                <span>بالدارجة الاحترافية</span>
                <span className="text-mint">جاهزة للنسخ</span>
              </div>
            </div>

            {/* prompt card */}
            <div className="float-soft glass-strong absolute bottom-0 right-16 w-60 rounded-3xl p-5 shadow-2xl shadow-black/40" style={{ animationDelay: "2.1s" }}>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold/15 text-gold">
                  <FileCode2 size={15} />
                </div>
                <div className="text-[11px] font-bold text-fog-2">AI Builder Prompt</div>
              </div>
              <div dir="ltr" className="mt-3 space-y-1.5 text-left font-latin">
                <div className="h-1.5 w-full rounded bg-white/10" />
                <div className="h-1.5 w-8/12 rounded bg-gold/25" />
                <div className="h-1.5 w-10/12 rounded bg-white/10" />
                <div className="h-1.5 w-6/12 rounded bg-white/10" />
              </div>
              <div className="mt-3 flex items-center gap-1 text-[10px] font-semibold text-gold">
                <Star size={11} fill="currentColor" />
                Framer • Relume • Wix AI
              </div>
            </div>

            {/* glow ring */}
            <div className="spin-slow pointer-events-none absolute top-24 left-32 h-56 w-56 rounded-full border border-dashed border-mint/20" />
          </motion.div>
        </div>
      </div>

      {/* ---------------- Marquee ---------------- */}
      <div className="relative border-y border-white/5 bg-white/[0.015] py-4">
        <div className="flex overflow-hidden" dir="rtl" style={{ maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)" }}>
          <div className="marquee-track flex shrink-0 items-center">
            {[...SPECIALTIES, ...SPECIALTIES].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} dir="rtl" className="glass me-3 flex shrink-0 items-center gap-2.5 rounded-full px-5 py-2.5 text-[13px] font-semibold text-fog-2">
                  <Icon size={15} className="text-mint" />
                  {s.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
