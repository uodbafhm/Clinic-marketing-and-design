import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Camera,
  Share2,
  StickyNote,
  Wand2,
  ClipboardPaste,
  Star,
  Music2,
  Sparkles,
} from "lucide-react";

/* أيقونات المنصات (محيدات من lucide فالنسخ الجديدة) */
const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
import { GroupCard, FieldLabel, Segmented } from "./ui";
import { smartParse, type ClinicData, type ParsedHints, type SocialPresence } from "../lib/engine";

interface Props {
  data: ClinicData;
  onChange: (d: ClinicData) => void;
  onGenerate: () => void;
  onExample: () => void;
}

const SPECIALTIES = [
  "طب وتجميل الأسنان",
  "طب الجلدية والتجميل",
  "زراعة الشعر",
  "طب العيون",
  "النساء والتوليد",
  "طب الأطفال",
  "الطب النفسي",
  "أخصائي الترويض",
  "طب القلب",
  "الطب العام",
];

function SocialRow({
  icon,
  label,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: SocialPresence;
  onChange: (v: SocialPresence) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-sm font-bold text-fog">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-fog-2">{icon}</span>
          {label}
        </div>
        <Segmented
          value={value.exists ? "yes" : "no"}
          onChange={(v) => onChange({ exists: v === "yes", activity: v === "yes" ? (value.activity ?? "weak") : null })}
          options={[
            { value: "yes", label: "موجود", tone: "good" },
            { value: "no", label: "غير موجود", tone: "bad" },
          ]}
        />
      </div>
      {value.exists && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3.5 flex flex-wrap items-center gap-3 border-t border-white/5 pt-3.5"
        >
          <span className="text-xs text-fog-3">النشاط والتفاعل:</span>
          <Segmented
            value={value.activity}
            onChange={(a) => onChange({ ...value, activity: a })}
            options={[
              { value: "active", label: "نشيط ومتفاعل", tone: "good" },
              { value: "weak", label: "ضعيف / عشوائي", tone: "warn" },
              { value: "dead", label: "ميت — بلا منشورات", tone: "bad" },
            ]}
          />
        </motion.div>
      )}
    </div>
  );
}

export default function ClinicForm({ data, onChange, onGenerate, onExample }: Props) {
  const [paste, setPaste] = useState("");
  const [hints, setHints] = useState<ParsedHints>({});

  const set = <K extends keyof ClinicData>(key: K, value: ClinicData[K]) => onChange({ ...data, [key]: value });

  const applyParse = (raw: string) => {
    setPaste(raw);
    if (raw.trim().length < 8) return setHints({});
    const h = smartParse(raw);
    setHints(h);
    onChange({
      ...data,
      clinicName: data.clinicName || h.clinicName || data.clinicName,
      rating: data.rating || h.rating || data.rating,
      reviewsCount: data.reviewsCount || h.reviewsCount || data.reviewsCount,
      phone: data.phone || h.phone || data.phone,
    });
  };

  const parsedList = [
    hints.clinicName ? "الاسم" : null,
    hints.rating ? "التقييم" : null,
    hints.reviewsCount ? "عدد التقييمات" : null,
    hints.phone ? "التليفون" : null,
  ].filter(Boolean) as string[];

  const ready = data.clinicName.trim().length > 1;

  return (
    <div id="form" className="relative mx-auto max-w-4xl px-4 sm:px-6 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-10 flex flex-wrap items-end justify-between gap-5"
      >
        <div>
          <div className="font-latin text-[11px] font-bold tracking-[0.3em] text-mint">STEP 01 — INPUT</div>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">دخّل معطيات العيادة</h2>
          <p className="mt-2 max-w-xl text-sm leading-7 text-fog-3">
            نفس القالب ديالك: بيانات الخريطة، تقييم الصور، السوشيال ميديا، والملاحظات. عمر غير اللي عندك — والباقي المحرك كيدبرو.
          </p>
        </div>
        <button
          onClick={onExample}
          className="glass inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-bold text-gold transition-all hover:border-gold/40"
        >
          <Sparkles size={15} />
          عمر بمثال جاهز
        </button>
      </motion.div>

      <div className="space-y-6">
        {/* ---------------- Google Maps ---------------- */}
        <GroupCard
          step="SECTION 01"
          icon={<MapPin size={20} />}
          title="بيانات Google Maps"
          desc="لصّق النص المنسوخ من صفحة العيادة فـ Google Maps والنظام كيتعرف على المعلومات تلقائياً — ولا عمر الخانات يدوياً."
        >
          <div className="mb-6">
            <FieldLabel hint="اختياري — Smart Paste">لصّق البيانات المنسوخة هنا</FieldLabel>
            <div className="relative">
              <textarea
                className="field min-h-[88px] resize-y pl-10"
                placeholder={"مثال: عيادة ابن سينا لطب الأسنان\n4.9 ★ (214 تقييم)\n+212 6 61 23 45 67..."}
                value={paste}
                onChange={(e) => applyParse(e.target.value)}
              />
              <ClipboardPaste size={16} className="absolute left-3.5 top-3.5 text-fog-3" />
            </div>
            {parsedList.length > 0 && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                <span className="text-fog-3">تعرفنا على:</span>
                {parsedList.map((p) => (
                  <span key={p} className="rounded-full border border-mint/30 bg-mint/10 px-2.5 py-1 font-semibold text-mint">
                    {p}
                  </span>
                ))}
              </motion.div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>اسم العيادة</FieldLabel>
              <input className="field" placeholder="عيادة ابن سينا لطب الأسنان" value={data.clinicName} onChange={(e) => set("clinicName", e.target.value)} />
            </div>
            <div>
              <FieldLabel>الطبيب / الطبيبة</FieldLabel>
              <input className="field" placeholder="الدكتور يوسف العلوي" value={data.doctorName} onChange={(e) => set("doctorName", e.target.value)} />
            </div>
            <div>
              <FieldLabel>التخصص</FieldLabel>
              <input className="field" list="specialties" placeholder="طب وتجميل الأسنان" value={data.specialty} onChange={(e) => set("specialty", e.target.value)} />
              <datalist id="specialties">
                {SPECIALTIES.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>
            <div>
              <FieldLabel>المدينة / الحي</FieldLabel>
              <input className="field" placeholder="الدار البيضاء — المعاريف" value={data.city} onChange={(e) => set("city", e.target.value)} />
            </div>
            <div>
              <FieldLabel>التقييم</FieldLabel>
              <div className="relative">
                <input className="field pl-9 font-latin" dir="ltr" placeholder="4.9" inputMode="decimal" value={data.rating} onChange={(e) => set("rating", e.target.value)} />
                <Star size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" fill="currentColor" />
              </div>
            </div>
            <div>
              <FieldLabel>عدد التقييمات</FieldLabel>
              <input className="field font-latin" dir="ltr" placeholder="214" inputMode="numeric" value={data.reviewsCount} onChange={(e) => set("reviewsCount", e.target.value)} />
            </div>
            <div>
              <FieldLabel>التليفون / واتساب</FieldLabel>
              <input className="field font-latin text-left" dir="ltr" placeholder="+212 6 61 23 45 67" value={data.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>
            <div>
              <FieldLabel hint="من Google Maps">الموقع الإلكتروني</FieldLabel>
              <Segmented
                value={data.website}
                onChange={(v) => set("website", v)}
                options={[
                  { value: "yes", label: "كاين موقع", tone: "good" },
                  { value: "no", label: "ماكاينش", tone: "bad" },
                  { value: "unknown", label: "ماشي متأكد" },
                ]}
              />
            </div>
          </div>
        </GroupCard>

        {/* ---------------- Photos ---------------- */}
        <GroupCard
          step="SECTION 02"
          icon={<Camera size={20} />}
          title="تقييم الصور فـ Google Maps"
          desc="الحكم اليدوي ديالك على الصور والفيديوهات منشورة — جودتها وتاريخ آخر تحديث."
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <FieldLabel>جودة الصور والفيديوهات</FieldLabel>
              <Segmented
                value={data.photosQuality}
                onChange={(v) => set("photosQuality", v)}
                options={[
                  { value: "excellent", label: "فخمة", tone: "good" },
                  { value: "good", label: "مزيانة", tone: "good" },
                  { value: "average", label: "متوسطة", tone: "warn" },
                  { value: "poor", label: "ضعيفة / مظلمة", tone: "bad" },
                  { value: "outdated", label: "قديمة", tone: "bad" },
                ]}
              />
            </div>
            <div>
              <FieldLabel>انتظام التحديث</FieldLabel>
              <Segmented
                value={data.photosFreshness}
                onChange={(v) => set("photosFreshness", v)}
                options={[
                  { value: "recent", label: "كيحدثو بانتظام", tone: "good" },
                  { value: "occasional", label: "من حين لحين" },
                  { value: "old", label: "قديمة (+ سنة)", tone: "warn" },
                  { value: "never", label: "أبداً", tone: "bad" },
                ]}
              />
            </div>
          </div>
        </GroupCard>

        {/* ---------------- Social ---------------- */}
        <GroupCard
          step="SECTION 03"
          icon={<Share2 size={20} />}
          title="البحث فـ Social Media"
          desc="واش كاينين الصفحات؟ وإلا كاينين — واش حيين ولا صفحات ميتة؟"
        >
          <div className="space-y-3.5">
            <SocialRow
              icon={<InstagramIcon size={16} />}
              label="Instagram"
              value={data.instagram}
              onChange={(v) => set("instagram", v)}
            />
            <SocialRow
              icon={<FacebookIcon size={16} />}
              label="Facebook"
              value={data.facebook}
              onChange={(v) => set("facebook", v)}
            />
            <SocialRow
              icon={<Music2 size={16} />}
              label="TikTok"
              value={data.tiktok}
              onChange={(v) => set("tiktok", v)}
            />
          </div>
        </GroupCard>

        {/* ---------------- Notes ---------------- */}
        <GroupCard
          step="SECTION 04"
          icon={<StickyNote size={20} />}
          title="ملاحظات خاصة"
          desc="أي حاجة لاحظتيها: الزحام، أسعار، منافس قريب، الديكور الحقيقي... والاسم ديالك باش تسيني الرسائل بيه."
        >
          <div className="grid gap-4 sm:grid-cols-[1fr_240px]">
            <div>
              <FieldLabel>ملاحظاتك</FieldLabel>
              <textarea
                className="field min-h-[96px] resize-y"
                placeholder="مثال: العيادة عامرة والحجز غير بالتليفون، الديكور نقي ولكن الصور قدام..."
                value={data.notes}
                onChange={(e) => set("notes", e.target.value)}
              />
            </div>
            <div>
              <FieldLabel hint="اختياري">الاسم ديالك فالرسائل</FieldLabel>
              <input className="field" placeholder="ياسين" value={data.senderName} onChange={(e) => set("senderName", e.target.value)} />
            </div>
          </div>
        </GroupCard>
      </div>

      {/* ---------------- Generate ---------------- */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="sticky bottom-5 z-30 mt-10"
      >
        <button
          onClick={onGenerate}
          disabled={!ready}
          className="btn-primary group flex w-full items-center justify-center gap-3 rounded-2xl px-8 py-5 text-lg font-bold disabled:cursor-not-allowed disabled:opacity-40 disabled:saturate-50"
        >
          <Wand2 size={21} className="transition-transform group-hover:rotate-12" />
          ولّد ملف الإقناع الكامل
          <span className="rounded-lg bg-ink/15 px-2.5 py-1 text-xs font-bold">تقرير + 3 رسائل + برومبت</span>
        </button>
        {!ready && (
          <p className="mt-2 text-center text-xs text-fog-3">كتب على الأقل اسم العيادة باش يبدا التوليد</p>
        )}
      </motion.div>
    </div>
  );
}
