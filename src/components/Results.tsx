import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Users,
  Camera,
  Share2,
  Award,
  TrendingUp,
  Globe,
  Image as ImageIcon,
  Clock,
  MessageSquare,
  Video,
  AlertTriangle,
  Flame,
  CheckCircle2,
  XCircle,
  Lightbulb,
  MessageCircle,
  Send,
  Zap,
  FileCode2,
  ClipboardList,
  RotateCcw,
  FileCheck2,
} from "lucide-react";
import { CopyButton } from "./ui";
import type { AuditResult, ClinicData, IconKey, Messages } from "../lib/engine";
import { buildFullReport } from "../lib/engine";
import { cn } from "../utils/cn";

/* ------------------------- icon map ------------------------- */

const ICONS: Record<IconKey, React.ReactNode> = {
  star: <Star size={15} />,
  users: <Users size={15} />,
  camera: <Camera size={15} />,
  share: <Share2 size={15} />,
  award: <Award size={15} />,
  trend: <TrendingUp size={15} />,
  globe: <Globe size={15} />,
  image: <ImageIcon size={15} />,
  clock: <Clock size={15} />,
  message: <MessageSquare size={15} />,
  video: <Video size={15} />,
  alert: <AlertTriangle size={15} />,
  flame: <Flame size={15} />,
};

/* ------------------------- score ring ------------------------- */

function ScoreRing({ score }: { score: number }) {
  const R = 52;
  const C = 2 * Math.PI * R;
  return (
    <div className="relative h-36 w-36">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="9" />
        <motion.circle
          cx="60" cy="60" r={R} fill="none"
          stroke="url(#scoreGrad)" strokeWidth="9" strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          whileInView={{ strokeDashoffset: C - (C * score) / 100 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f2707a" />
            <stop offset="55%" stopColor="#f0c46c" />
            <stop offset="100%" stopColor="#2fe6b0" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="font-latin text-4xl font-bold leading-none"
        >
          {score}
        </motion.span>
        <span className="mt-1 font-latin text-[10px] tracking-widest text-fog-3">/ 100</span>
      </div>
    </div>
  );
}

/* ------------------------- message card ------------------------- */

function MessageCard({
  icon,
  toneClass,
  chipClass,
  title,
  subtitle,
  body,
  index,
}: {
  icon: React.ReactNode;
  toneClass: string;
  chipClass: string;
  title: string;
  subtitle: string;
  body: string;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.55, ease: "easeOut" }}
      className="glass overflow-hidden rounded-3xl"
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/6 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl border", toneClass)}>{icon}</div>
          <div>
            <div className="text-[15px] font-bold">{title}</div>
            <div className="text-[11px] text-fog-3">{subtitle}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("hidden rounded-full px-2.5 py-1 text-[10px] font-bold sm:inline", chipClass)}>
            {body.length} حرف
          </span>
          <CopyButton text={body} label="نسخ الرسالة" />
        </div>
      </div>
      <div className="px-5 py-5 sm:px-6">
        <p className="whitespace-pre-wrap rounded-2xl bg-black/25 border border-white/5 p-5 text-[14px] leading-8 text-fog">
          {body}
        </p>
      </div>
    </motion.article>
  );
}

/* --------------------------- main --------------------------- */

type Tab = "audit" | "messages" | "prompt";

export default function Results({
  data,
  audit,
  messages,
  prompt,
  onReset,
}: {
  data: ClinicData;
  audit: AuditResult;
  messages: Messages;
  prompt: string;
  onReset: () => void;
}) {
  const [tab, setTab] = useState<Tab>("audit");

  const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "audit", label: "تقرير التحليل", icon: <ClipboardList size={15} /> },
    { key: "messages", label: "رسائل التواصل", icon: <MessageCircle size={15} /> },
    { key: "prompt", label: "برومبت الموقع", icon: <FileCode2 size={15} /> },
  ];

  return (
    <div id="results" className="relative mx-auto max-w-5xl px-4 sm:px-6 pt-24 pb-10">
      {/* header */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-latin text-[11px] font-bold tracking-[0.3em] text-mint">STEP 02 — YOUR KIT</div>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              ملف الإقناع ديال <span className="text-gradient-mint">{data.clinicName || "العيادة"}</span>
            </h2>
            <p className="mt-2 text-sm text-fog-3">3 أقسام جاهزين: حلل، صيفط الرسالة، وولّد الموقع. كولشي بضغطة نسخ.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <CopyButton text={buildFullReport(data, { audit, messages, prompt })} label="نسخ الملف كامل" className="!px-4 !py-2.5" />
            <button
              onClick={onReset}
              className="glass inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-fog-2 transition-colors hover:text-fog"
            >
              <RotateCcw size={14} />
              تحليل جديد
            </button>
          </div>
        </div>

        {/* tabs */}
        <div className="mt-7 flex gap-2 overflow-x-auto rounded-2xl border border-white/8 bg-white/[0.02] p-1.5">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "relative flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-3 text-[13px] font-bold transition-colors",
                tab === t.key ? "text-ink" : "text-fog-3 hover:text-fog"
              )}
            >
              {tab === t.key && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-xl bg-gradient-to-l from-mint to-mint-2"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                {t.icon}
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* ============================ AUDIT ============================ */}
        {tab === "audit" && (
          <motion.div key="audit" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }}>
            {/* top stats */}
            <div className="grid gap-5 md:grid-cols-[auto_1fr_1fr]">
              <div className="glass flex items-center gap-5 rounded-3xl p-6">
                <ScoreRing score={audit.score} />
                <div>
                  <div className="text-[13px] font-bold text-fog-2">الجاهزية الرقمية</div>
                  <div className="mt-1.5 max-w-[130px] text-[12px] leading-6 text-fog-3">{audit.scoreLabel}</div>
                </div>
              </div>

              <div className="glass relative overflow-hidden rounded-3xl p-6">
                <div className="pointer-events-none absolute -top-12 -left-12 h-32 w-32 rounded-full bg-rose/15 blur-3xl" />
                <div className="flex items-center gap-2 text-[13px] font-bold text-fog-2">حرارة الفرصة (Lead)</div>
                <div className="mt-3 flex items-center gap-2">
                  {[0, 1, 2].map((i) => {
                    const lit = audit.temp === "hot" || (audit.temp === "warm" && i < 2) || (audit.temp === "cold" && i < 1);
                    return (
                      <motion.span key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.15 }}>
                        <Flame
                          size={26}
                          className={lit ? (audit.temp === "hot" ? "text-rose" : "text-gold") : "text-white/10"}
                          fill={lit ? "currentColor" : "none"}
                        />
                      </motion.span>
                    );
                  })}
                  <span className={cn("mr-1 text-lg font-bold", audit.temp === "hot" ? "text-rose" : audit.temp === "warm" ? "text-gold" : "text-sky")}>
                    {audit.tempLabel}
                  </span>
                </div>
                <p className="mt-3 text-[12.5px] leading-6.5 text-fog-2">{audit.tempNote}</p>
              </div>

              <div className="glass relative overflow-hidden rounded-3xl p-6">
                <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-mint/15 blur-3xl" />
                <div className="flex items-center gap-2 text-[13px] font-bold text-fog-2">
                  <FileCheck2 size={15} className="text-mint" />
                  خلاصة الملف
                </div>
                <ul className="mt-3 space-y-2.5 text-[12.5px] leading-6 text-fog-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="shrink-0 text-mint" />
                    {audit.strengths.length} نقاط قوة كيستعملو كمدخل للمدح
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle size={14} className="shrink-0 text-rose" />
                    {audit.weaknesses.length} ثغرات رقمية كيستعملو كمدخل للبيع
                  </li>
                  <li className="flex items-center gap-2">
                    <Lightbulb size={14} className="shrink-0 text-gold" />
                    زاوية وحدة واضحة: ركز عليها فالهضرة
                  </li>
                </ul>
              </div>
            </div>

            {/* strengths / weaknesses */}
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-3xl p-6">
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-mint/12 text-mint border border-mint/25">
                    <TrendingUp size={16} />
                  </span>
                  <div>
                    <h3 className="text-base font-bold">نقاط القوة</h3>
                    <p className="text-[11px] text-fog-3">ابدا بيها الهضرة — الطبيب كيحب يسمع ما فحالها</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {audit.strengths.map((s, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.07 }}
                      className="flex items-start gap-3 rounded-2xl border border-mint/12 bg-mint/[0.05] p-3.5 text-[13px] leading-6.5 text-fog"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-mint/15 text-mint">{ICONS[s.icon]}</span>
                      {s.text}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass rounded-3xl p-6">
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose/12 text-rose border border-rose/25">
                    <AlertTriangle size={16} />
                  </span>
                  <div>
                    <h3 className="text-base font-bold">نقاط الضعف</h3>
                    <p className="text-[11px] text-fog-3">هادو هوما الأسلحة ديالك — كل ثغرة = خدمة تبيعها</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {audit.weaknesses.length > 0 ? (
                    audit.weaknesses.map((s, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: 14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.07 }}
                        className="flex items-start gap-3 rounded-2xl border border-rose/12 bg-rose/[0.05] p-3.5 text-[13px] leading-6.5 text-fog"
                      >
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-rose/15 text-rose">{ICONS[s.icon]}</span>
                        {s.text}
                      </motion.li>
                    ))
                  ) : (
                    <li className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-[13px] text-fog-3">
                      ما لقيناش ثغرات كبيرة — العيادة خدامة رقمياً. بيع التحسين والتطوير ماشي البناء.
                    </li>
                  )}
                </ul>
              </motion.div>
            </div>

            {/* pitch angle */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="relative mt-5 overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-l from-gold/[0.08] via-transparent to-transparent p-6 sm:p-8"
            >
              <div className="pointer-events-none absolute -top-16 -left-16 h-44 w-44 rounded-full bg-gold/15 blur-3xl pulse-glow" />
              <div className="relative flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold/15 text-gold border border-gold/30">
                  <Lightbulb size={22} />
                </span>
                <div>
                  <div className="font-latin text-[10px] font-bold tracking-[0.3em] text-gold/80">THE PITCH ANGLE</div>
                  <h3 className="mt-1.5 text-xl font-bold text-fog sm:text-2xl">زاوية الإقناع: «{audit.pitchTitle}»</h3>
                  <p className="mt-4 max-w-3xl text-[14.5px] leading-8.5 text-fog">{audit.pitchBody}</p>
                  <p className="mt-3 max-w-3xl rounded-2xl border border-white/8 bg-black/20 p-4 text-[13px] leading-7 text-fog-2">
                    {audit.pitchSecondary}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* =========================== MESSAGES =========================== */}
        {tab === "messages" && (
          <motion.div key="messages" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }} className="space-y-5">
            <MessageCard
              index={0}
              icon={<MessageCircle size={18} />}
              toneClass="bg-mint/12 text-mint border-mint/30"
              chipClass="bg-mint/10 text-mint"
              title="الرسالة 1 — WhatsApp"
              subtitle="مفصلة ومبنية على المشكل الرئيسي ديال العيادة — صيفطها من نمرة مهنية"
              body={messages.whatsapp}
            />
            <MessageCard
              index={1}
              icon={<Send size={18} />}
              toneClass="bg-sky/12 text-sky border-sky/30"
              chipClass="bg-sky/10 text-sky"
              title="الرسالة 2 — Instagram / Facebook DM"
              subtitle="مركزة على المحتوى البصري — أقصر وأقرب لستايل الرسائل الخاصة"
              body={messages.instagram}
            />
            <MessageCard
              index={2}
              icon={<Zap size={18} />}
              toneClass="bg-gold/12 text-gold border-gold/30"
              chipClass="bg-gold/10 text-gold"
              title="الرسالة 3 — Short Hook"
              subtitle="سريعة ومباشرة للعيادات المزدحمة — سؤال واحد كيخليه يرد"
              body={messages.short}
            />
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 text-center text-[12px] leading-6 text-fog-3">
              نصيحة: صيفط الرسالة 1 نهار الثلاثاء أو الأربعاء بين 10:00 و 12:00 — الأطباء كيكونو أقل زحمة وأكثر قراءة للرسائل.
            </div>
          </motion.div>
        )}

        {/* ============================ PROMPT ============================ */}
        {tab === "prompt" && (
          <motion.div key="prompt" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }}>
            <div className="glass overflow-hidden rounded-3xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/6 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/30 bg-gold/12 text-gold">
                    <FileCode2 size={18} />
                  </div>
                  <div>
                    <div className="text-[15px] font-bold">برومبت جاهز لـ AI Builders</div>
                    <div className="text-[11px] text-fog-3">بالإنجليزية — لصقو مباشرة فأداة توليد الموقع</div>
                  </div>
                </div>
                <CopyButton text={prompt} label="نسخ البرومبت" />
              </div>

              <div className="flex flex-wrap gap-2 border-b border-white/6 px-5 py-3.5 sm:px-6">
                {["Framer AI", "Relume", "Webflow", "Wix AI", "Lovable", "v0"].map((b) => (
                  <span key={b} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-latin text-[11px] font-semibold text-fog-2">
                    {b}
                  </span>
                ))}
              </div>

              <div className="p-5 sm:p-6">
                <pre
                  dir="ltr"
                  className="max-h-[520px] overflow-auto whitespace-pre-wrap rounded-2xl border border-white/5 bg-[#0a0f16] p-5 text-left font-latin text-[13px] leading-7 text-fog/90"
                >
                  {prompt}
                </pre>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {[
                { t: "1. لصّق البرومبت", d: "فـ Framer AI أو أي Builder — غادي يولد الهيكل والأقسام كاملين." },
                { t: "2. زيد الصور الحقيقية", d: "بدل الصور الوهمية بتصويرة احترافية للعيادة (اقترحها فالعرض)." },
                { t: "3. وريه للطبيب", d: "عرض الموقع شبه الجاهز هو أقوى سلاح بيع كاين." },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }} className="glass rounded-2xl p-4">
                  <div className="text-[13px] font-bold text-mint">{s.t}</div>
                  <div className="mt-1.5 text-[12px] leading-6 text-fog-3">{s.d}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
