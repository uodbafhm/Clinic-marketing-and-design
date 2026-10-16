/* ------------------------------------------------------------------ */
/*  TabibKit — Outreach Kit Engine                                     */
/*  منطق التحليل وتوليد الرسائل والبرومبت من بيانات العيادة              */
/* ------------------------------------------------------------------ */

export type SocialActivity = "active" | "weak" | "dead" | null;
export type PhotoQuality = "excellent" | "good" | "average" | "poor" | "outdated" | null;
export type PhotoFreshness = "recent" | "occasional" | "old" | "never" | null;
export type WebsiteStatus = "yes" | "no" | "unknown";

export interface SocialPresence {
  exists: boolean;
  activity: SocialActivity;
}

export interface ClinicData {
  clinicName: string;
  doctorName: string;
  specialty: string;
  city: string;
  phone: string;
  rating: string;
  reviewsCount: string;
  website: WebsiteStatus;
  photosQuality: PhotoQuality;
  photosFreshness: PhotoFreshness;
  instagram: SocialPresence;
  facebook: SocialPresence;
  tiktok: SocialPresence;
  notes: string;
  senderName: string;
}

/* ----------------------------- المثال ----------------------------- */

export const emptyClinic: ClinicData = {
  clinicName: "",
  doctorName: "",
  specialty: "",
  city: "",
  phone: "",
  rating: "",
  reviewsCount: "",
  website: "unknown",
  photosQuality: null,
  photosFreshness: null,
  instagram: { exists: false, activity: null },
  facebook: { exists: false, activity: null },
  tiktok: { exists: false, activity: null },
  notes: "",
  senderName: "",
};

export const exampleClinic: ClinicData = {
  clinicName: "عيادة ابن سينا لطب وتجميل الأسنان",
  doctorName: "الدكتور يوسف العلوي",
  specialty: "طب وتجميل الأسنان",
  city: "الدار البيضاء — المعاريف",
  phone: "+212 6 61 23 45 67",
  rating: "4.9",
  reviewsCount: "214",
  website: "no",
  photosQuality: "average",
  photosFreshness: "old",
  instagram: { exists: true, activity: "dead" },
  facebook: { exists: true, activity: "weak" },
  tiktok: { exists: false, activity: null },
  notes: "العيادة عامرة ومعروفة بالمواعيد الكثيرة فالتليفون، الديكور داخلها نقي ولكن الصور المنشورة قديمة وما كتبينش الواقع.",
  senderName: "ياسين",
};

/* -------------------------- Smart Paste --------------------------- */

export interface ParsedHints {
  clinicName?: string;
  rating?: string;
  reviewsCount?: string;
  phone?: string;
}

export function smartParse(raw: string): ParsedHints {
  const hints: ParsedHints = {};
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);

  // الاسم: أول سطر قصير بلا أرقام كثيرة
  const nameLine = lines.find((l) => l.length > 3 && l.length < 70 && !/(https?:|www\.)/.test(l) && (l.match(/\d/g) || []).length < 3);
  if (nameLine) hints.clinicName = nameLine;

  // التقييم
  const ratingMatch = raw.match(/([0-5][.,]\d)\s*(?:نجوم|نجمة|★|étoiles|stars)?/);
  if (ratingMatch) hints.rating = ratingMatch[1].replace(",", ".");

  // عدد التقييمات
  const revMatch = raw.match(/(\d[\d\s.,]*)\s*(?:تقييم|تقييمات|آراء|مراجعات|review|avis)/i);
  if (revMatch) hints.reviewsCount = revMatch[1].replace(/[\s.,]/g, "");

  // التليفون
  const phoneMatch = raw.match(/(\+?\d[\d\s-]{8,}\d)/);
  if (phoneMatch) hints.phone = phoneMatch[1].replace(/-/g, " ").trim();

  return hints;
}

/* --------------------------- التخصصات ---------------------------- */

interface SpecialtyConfig {
  key: string;
  english: string;
  mood: string;
  palette: string;
  services: string;
  beforeAfter: boolean;
}

const SPECIALTY_MAP: { match: string[]; config: SpecialtyConfig }[] = [
  {
    match: ["أسنان", "سنان", "دنت"],
    config: {
      key: "dentistry",
      english: "Cosmetic & General Dentistry",
      mood: "calm clinical-luxury, bright high-key, trustworthy, premium",
      palette: "warm ivory (#F8F4EC) base, deep teal (#0E4F45) primary, brushed gold (#C9A24B) accents",
      services:
        "Dental implants, Hollywood smile makeovers, invisible orthodontics (Invisalign), laser whitening, ceramic veneers & crowns, root canal treatment",
      beforeAfter: true,
    },
  },
  {
    match: ["جلد", "تجميل", "بشرة", "ليزر", "درما"],
    config: {
      key: "dermatology",
      english: "Dermatology & Aesthetic Medicine",
      mood: "sensual but medical, editorial beauty, serene spa-clinic",
      palette: "soft nude (#F6EFEA) base, deep plum (#3A2233) primary, champagne (#D9B98F) accents",
      services:
        "Laser hair removal, Botox & filler injections, acne & pigmentation treatment, Hydrafacial, skin tightening, chemical peels",
      beforeAfter: true,
    },
  },
  {
    match: ["شعر"],
    config: {
      key: "hair",
      english: "Hair Transplant & Trichology",
      mood: "masculine premium, sharp, confident, clinical",
      palette: "charcoal (#14171C) base, forest green (#1E5B4A) primary, copper (#C08050) accents",
      services: "FUE & DHI hair transplant, PRP plasma sessions, beard & eyebrow transplant, hair-loss treatment programs",
      beforeAfter: true,
    },
  },
  {
    match: ["عين", "نظر", "عيون"],
    config: {
      key: "eye",
      english: "Ophthalmology & Vision Care",
      mood: "crisp, precise, light-filled, high-tech",
      palette: "pure white base, deep navy (#10233F) primary, cyan (#3FC1D4) accents",
      services: "Comprehensive eye exams, LASIK vision correction, cataract surgery, pediatric ophthalmology, dry-eye treatment",
      beforeAfter: false,
    },
  },
  {
    match: ["نسا", "توليد"],
    config: {
      key: "gyneco",
      english: "Gynecology & Women's Health",
      mood: "warm, intimate, reassuring, soft premium",
      palette: "blush cream (#FAF3F1) base, dusty rose (#9A5B66) primary, soft gold (#D4A97A) accents",
      services: "Pregnancy follow-up, 4D ultrasound, fertility consultation, cosmetic gynecology, annual screenings",
      beforeAfter: false,
    },
  },
  {
    match: ["أطفال", "طفل"],
    config: {
      key: "pediatrics",
      english: "Pediatrics",
      mood: "friendly, playful but clean, soft geometry",
      palette: "warm white base, lagoon blue (#2F7E8C) primary, coral (#F0927E) accents",
      services: "Newborn care, vaccination programs, growth & nutrition follow-up, pediatric emergencies",
      beforeAfter: false,
    },
  },
];

const DEFAULT_SPECIALTY: SpecialtyConfig = {
  key: "general",
  english: "General & Specialist Medicine",
  mood: "clean, professional, calm medical premium",
  palette: "off-white (#F7F6F3) base, deep pine (#14463C) primary, muted gold (#C2A05C) accents",
  services: "General consultations, chronic disease follow-up, preventive medicine, minor procedures, diagnostics",
  beforeAfter: false,
};

function resolveSpecialty(specialty: string): SpecialtyConfig {
  const s = specialty || "";
  for (const entry of SPECIALTY_MAP) {
    if (entry.match.some((m) => s.includes(m))) return entry.config;
  }
  return DEFAULT_SPECIALTY;
}

/* ---------------------------- التحليل ----------------------------- */

export type IconKey =
  | "star"
  | "users"
  | "camera"
  | "share"
  | "award"
  | "trend"
  | "globe"
  | "image"
  | "clock"
  | "message"
  | "video"
  | "alert"
  | "flame";

export interface AuditItem {
  icon: IconKey;
  text: string;
}

export interface AuditResult {
  strengths: AuditItem[];
  weaknesses: AuditItem[];
  pitchTitle: string;
  pitchBody: string;
  pitchSecondary: string;
  score: number;
  scoreLabel: string;
  temp: "hot" | "warm" | "cold";
  tempLabel: string;
  tempNote: string;
}

interface Ctx {
  d: ClinicData;
  rating: number | null;
  reviews: number | null;
  spec: SpecialtyConfig;
  shortName: string;
  busy: boolean;
}

function num(v: string): number | null {
  const n = parseFloat(v.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function intNum(v: string): number | null {
  const n = parseInt(v.replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : null;
}

function firstName(doctor: string): string {
  const clean = doctor.replace(/^(الدكتور|الدكتورة|دكتور|دكتورة|Dr\.?|Docteur)\s*/i, "").trim();
  return clean.split(" ")[0] || doctor || "دكتور";
}

export function generateAudit(d: ClinicData): AuditResult {
  const rating = num(d.rating);
  const reviews = intNum(d.reviewsCount);
  const spec = resolveSpecialty(d.specialty);
  const name = firstName(d.doctorName);
  const busy = /زحام|عامر|مزدحم|معروف|كثير/.test(d.notes);
  const ctx: Ctx = { d, rating, reviews, spec, shortName: name, busy };

  const strengths: AuditItem[] = [];
  const weaknesses: AuditItem[] = [];

  /* ---- القوة ---- */
  if (rating !== null && rating >= 4.7)
    strengths.push({ icon: "star", text: `تقييم استثنائي: ${fmt(rating)} من 5 — من أعلى التقييمات فـ ${d.city || "المدينة"} فهاد التخصص` });
  else if (rating !== null && rating >= 4.3)
    strengths.push({ icon: "star", text: `تقييم قوي: ${fmt(rating)} من 5 — سمعة طيبة وبنية ثقة حقيقية عند المرضى` });

  if (reviews !== null && reviews >= 150)
    strengths.push({ icon: "users", text: `إثبات اجتماعي ثقيل: أكثر من ${reviews} تقييم فـ Google — هادشي رأس مال رقمي كبير غير مستثمر` });
  else if (reviews !== null && reviews >= 50)
    strengths.push({ icon: "users", text: `عدد تقييمات محترم (${reviews}) — كاين جمهور حقيقي كيتكلم على العيادة` });

  if (d.photosQuality === "excellent")
    strengths.push({ icon: "camera", text: "الصور فـ Google Maps بجودة عالية — الديكور والإضاءة كيبيعو الخدمة قبل ما يهضر الطبيب" });
  if (d.photosQuality === "good")
    strengths.push({ icon: "camera", text: "الصور الحالية نقية ومنظمة — قاعدة بصرية صالحة للزيادة عليها" });

  const activePlatforms: string[] = [];
  if (d.instagram.exists && d.instagram.activity === "active") activePlatforms.push("إنستاگرام");
  if (d.facebook.exists && d.facebook.activity === "active") activePlatforms.push("فايسبوك");
  if (d.tiktok.exists && d.tiktok.activity === "active") activePlatforms.push("تيك توك");
  if (activePlatforms.length)
    strengths.push({ icon: "share", text: `حضور نشيط فـ ${activePlatforms.join(" و ")} — المحتوى خدام وكاين تفاعل حقيقي` });

  if (busy)
    strengths.push({ icon: "trend", text: "إقبال قوي على العيادة — الديماند كاين بالفعل، اللي ناقص غير التنظيم والتحويل الرقمي" });

  strengths.push({
    icon: "award",
    text: `تخصص «${d.specialty || "طبي"}» — عليه طلب كبير فالمغرب والقيمة المادية للمريض الجديد عالية، يعني العائد من أي تحسين رقمي سريع`,
  });

  /* ---- الضعف ---- */
  if (d.website === "no")
    weaknesses.push({ icon: "globe", text: "غياب تام للموقع الإلكتروني — ماشي غير مشكل صورة: كل بحث فـ Google كيكمل بلا وجهة رسمية، والمرضى كيتحولو للمنافسين" });
  if (d.website === "unknown")
    weaknesses.push({ icon: "globe", text: "ماكاين حتى أثر واضح لموقع رسمي — الحضور كيعتمد غير على أدلة مجانية وصفحات تابتة لجهات خارجية" });

  if (d.photosQuality === "poor")
    weaknesses.push({ icon: "image", text: "الصور ضعيفة أو مظلمة — أول انطباع ديال المريض كيتكسر قبل ما يكتشف المستوى الحقيقي ديال الخدمة" });
  if (d.photosQuality === "outdated")
    weaknesses.push({ icon: "image", text: "الصور قديمة — كتعطي صورة مغلوطة على العيادة وما كتعكسش الواقع الحالي" });
  if (d.photosQuality === "average")
    weaknesses.push({ icon: "image", text: "الصور متوسطة — صالحة باش تعدي، ولكن ما كتفرقش العيادة على المنافسين فخرجات البحث" });

  if (d.photosFreshness === "old" || d.photosFreshness === "never")
    weaknesses.push({ icon: "clock", text: "ماكاينش تحديث منتظم للصور — خوارزمية Google كتحب الصفحات الحية، والراكد كيطيح فالترتيب" });

  pushSocialWeakness(weaknesses, "إنستاگرام", d.instagram, "أهم منصة لبناء الثقة فالتخصصات الطبية عندنا");
  pushSocialWeakness(weaknesses, "فايسبوك", d.facebook, "فيه الجمهور الأكبر سناً اللي كياخد قرارات العلاج للعائلة");
  pushSocialWeakness(weaknesses, "تيك توك", d.tiktok, "أكبر مصدر مجاني للوصول دابا — المنافسون كيجنو منو مرضى كل سيمانة");

  if (reviews !== null && reviews < 30)
    weaknesses.push({ icon: "users", text: `عدد التقييمات ضعيف (${reviews}) — المريض كيشك ملي يلقى منافساً عندو 100+ تقييم` });
  if (rating !== null && rating < 4.2)
    weaknesses.push({ icon: "alert", text: `التقييم هابط تحت 4.2 — خاص خطة واضحة لاسترجاع الثقة وتصفية التقييمات السلبية` });

  /* ---- السكور ---- */
  let score = 100;
  if (d.website === "no") score -= 40;
  if (d.website === "unknown") score -= 30;
  if (d.photosQuality === "poor") score -= 15;
  if (d.photosQuality === "outdated") score -= 12;
  if (d.photosQuality === "average") score -= 5;
  if (d.photosFreshness === "old") score -= 8;
  if (d.photosFreshness === "never") score -= 12;
  score -= socialPenalty(d.instagram, 7);
  score -= socialPenalty(d.facebook, 4);
  score -= socialPenalty(d.tiktok, 8);
  if (reviews !== null && reviews < 30) score -= 5;
  score = Math.max(5, Math.min(100, score));

  const hot = score < 40;
  const warm = score >= 40 && score < 70;
  const temp: AuditResult["temp"] = hot ? "hot" : warm ? "warm" : "cold";

  const tempNote =
    temp === "hot"
      ? "السمعة كاينة والحضور الرقمي معدوم — الطبيب محسوس بالفراغ وكيشوف المنافسين كيسبقوه. هادي أجود فرصة للبيع: اضرب دابا."
      : temp === "warm"
        ? "كاين شي عناصر رقمية ولكن فيهم ثغرات واضحة — بيع التحسين والاحترافية ماشي البناء من الصفر."
        : "الحضور الرقمي مزيان نسبياً — ركز فالعرض على التحويل (CRO)، السرعة، والتصميم الفاخر، ماشي على الأساسيات.";

  /* ---- الزاوية ---- */
  const pitch = buildPitch(ctx);

  return {
    strengths: strengths.slice(0, 6),
    weaknesses: weaknesses.slice(0, 7),
    pitchTitle: pitch.title,
    pitchBody: pitch.body,
    pitchSecondary: pitch.secondary,
    score,
    scoreLabel: hot ? "ضعيفة — فرصة ذهبية" : warm ? "متوسطة — كاين مكان للعب" : "قوية — بيع التطوير",
    temp,
    tempLabel: temp === "hot" ? "سخون بزاف" : temp === "warm" ? "متوسط" : "بارد",
    tempNote,
  };
}

function fmt(n: number): string {
  return (Math.round(n * 10) / 10).toString();
}

function socialPenalty(s: SocialPresence, w: number): number {
  if (!s.exists) return w;
  if (s.activity === "dead") return w;
  if (s.activity === "weak") return Math.round(w / 2);
  return 0;
}

function pushSocialWeakness(list: AuditItem[], label: string, s: SocialPresence, why: string) {
  if (!s.exists)
    list.push({ icon: label === "تيك توك" ? "video" : "message", text: `${label} غائب تماماً — وهو ${why}` });
  else if (s.activity === "dead")
    list.push({ icon: label === "تيك توك" ? "video" : "message", text: `${label} ميت — آخر نشاط قديم بزاف، والصفحة المهملة كتعطي انطباعاً أن العيادة سدات` });
  else if (s.activity === "weak")
    list.push({ icon: label === "تيك توك" ? "video" : "message", text: `${label} بلا استراتيجية — نشر عشوائي، بلا هوية بصرية ولا دعوة واضحة للحجز` });
}

function buildPitch(ctx: Ctx): { title: string; body: string; secondary: string } {
  const { d, rating, reviews, shortName } = ctx;
  const ratingStr = rating ? fmt(rating) : "عالي";
  const reviewsStr = reviews ? `${reviews}+` : "عشرات";

  const socialDead =
    (!d.instagram.exists || d.instagram.activity === "dead") &&
    (!d.tiktok.exists || d.tiktok.activity === "dead");

  if (d.website === "no" || d.website === "unknown") {
    return {
      title: "من السمعة الذهبية… لآلة حجوزات",
      body: `الدكتور ${shortName} جالس على ذهب وما مستثمروش: سمعة ${ratingStr} نجمة من ${reviewsStr} تقييم، ولكن أي مريض كيقلب عليه أونلاين كيلقى فراغاً — بلا موقع، بلا نظام حجز، بلا واجهة تليق بالمستوى. فهاد الحالة، المنافس الأقل كفاءة والأكثر حضوراً هو اللي كيشد الموعد. الزاوية ديال البيع: «أنا ما كنصايبش مواقع، كنحول السمعة ديالك لحجوزات مؤكدة». موقع فيه حجز أونلاين بـ 3 ضغطات + تقييمات Google واجدين + معرض قبل/بعد = كل بحث فـ Google كيولي مريض فالكرسي.`,
      secondary: socialDead
        ? "زيد فوقها أن السوشيال ميديا نائمة أو معدومة — يعني الموقع غادي يكون أول واجهة رقمية حقيقية للعيادة، والأثر غادي يبان بسرعة."
        : "السوشيال ميديا كاينة شوية — غادي تولي مصدر ترافيك مباشر للموقع الجديد ونظام الحجز.",
    };
  }

  if (d.photosQuality === "poor" || d.photosQuality === "outdated") {
    return {
      title: "الانطباع الأول مسروق",
      body: `المريض كيحكم على العيادة من الصور قبل ما يجرب الخدمة. حالياً، أول ما كيشوفه الباحث عن دكتور ${shortName} هو صور قديمة وضعيفة ما كتشرفش المستوى. الزاوية: بيع «تجديد الهوية البصرية» — شوط تصوير احترافي + موقع/صفحات كيعرضو العيادة كما هي فالواقع. استعمل مقارنة مباشرة: صورة حالية vs تصور جديد.`,
      secondary: "التحسين البصري أسهل بيع: النتيجة كتبان فأقل من سيمانة والطبيب كيحس بالفرق فالتقييمات وكلام المرضى.",
    };
  }

  return {
    title: "نظام نمو كامل، ماشي غير واجهة",
    body: `الأساس عند الدكتور ${shortName} كاين — سمعة وخدمة مزيانة. الناقص هو النظام اللي كيحول هاد الجودة لتدفق مرضى منتظم بلا مجهود: موقع سريع فيه حجز أونلاين، محتوى قصير منتظم، وربط مباشر مع واتساب. بيع الأتمتة والراحة، ماشي التصميم.`,
    secondary: "لما يكون الحضور الرقمي كاين شوية، ركز فالكلام على «التحويل» — شحال واحد كيدخل وشحال واحد كيحجز.",
  };
}

/* ---------------------------- الرسائل ------------------------------ */

export interface Messages {
  whatsapp: string;
  instagram: string;
  short: string;
}

function mainProblemLine(d: ClinicData): string {
  if (d.website === "no") return "ماكاين حتى موقع رسمي خاص بالعيادة";
  if (d.website === "unknown") return "الحضور ديالكم أونلاين كيعتمد غير على أدلة مجانية، بلا واجهة رسمية";
  if (d.photosQuality === "poor" || d.photosQuality === "outdated") return "الصور ديال العيادة فالبحث قديمة وما كتوصلش المستوى الحقيقي ديال الخدمة";
  const anyDead = (d.instagram.exists && d.instagram.activity === "dead") || (d.facebook.exists && d.facebook.activity === "dead");
  if (anyDead) return "الصفحات ديالكم فالسوشيال ميديا واقفة من مدة طويلة";
  return "نظام الحجز والحضور الرقمي ما زال ما متطورش بما يوازي السمعة ديالكم";
}

export function generateMessages(d: ClinicData): Messages {
  const name = firstName(d.doctorName);
  const rating = num(d.rating);
  const reviews = intNum(d.reviewsCount);
  const ratingStr = rating ? fmt(rating) : null;
  const reviewsStr = reviews ? reviews : null;
  const sender = d.senderName.trim();
  const senderIntro = sender ? `معاك ${sender}، متخصص فبناء المواقع والحضور الرقمي للعيادات الطبية.` : `معاك أحد المتخصصين فبناء المواقع والحضور الرقمي للعيادات الطبية.`;
  const clinicLabel = d.clinicName ? `«${d.clinicName}»` : "العيادة ديالكم";
  const cityStr = d.city ? ` فـ ${d.city}` : "";
  const problem = mainProblemLine(d);
  const busy = /زحام|عامر|مزدحم|معروف|كثير/.test(d.notes);

  const repLine =
    ratingStr && reviewsStr
      ? `التقييم ديالكم ${ratingStr} من أكثر من ${reviewsStr} مريض — هادشي ما كاينش إلا فالعيادات اللي خدامة بجد.`
      : ratingStr
        ? `التقييم ديالكم ${ratingStr} — واضح أن الخدمة عندكم بمستوى عالٍ.`
        : `واضح من التقييمات أن الخدمة عندكم بمستوى عالٍ.`;

  const whatsapp = `السلام عليكم دكتور(ة) ${name}،
${senderIntro}

وصلت لـ ${clinicLabel}${cityStr} من خلال Google Maps — ${repLine}

ولكن بصراحة لاحظت حاجة: ${problem}. والنتيجة؟ مرضى جدد كيقلبو عليكم كل نهار أونلاين وكيتحولو لمنافسين حضورهم الرقمي أحسن — حتى وإلا كانت الخدمة ديالهم أقل من ديالكم.

الحل بسيط: موقع احترافي خاص بالعيادة فيه نظام حجز مواعيد أونلاين بـ 3 ضغطات، معرض قبل/بعد، وتقييمات Google واجدة قدام الزائر — بحال واجهة رقمية كتسوق للعيادة 24/7 حتى وأنتم فالاستشارة.

بغيت نصايب ليكم تصور مجاني (Mockup) ديال الموقع باش تشوفو الشكل قبل أي التزام. واش نصيفطه ليك هنا فالواتساب؟`;

  const visualHook =
    d.photosQuality === "excellent" || d.photosQuality === "good"
      ? `المحتوى البصري ديالكم نقي، ولكن بلا موقع كيجمعو وكيحولو لحجوزات`
      : d.instagram.exists && d.instagram.activity === "dead"
        ? `المحتوى البصري واقف من مدة، وما كيعكسش المستوى الحقيقي ديال العيادة`
        : `الهوية البصرية الحالية ما كتوصلش الحجم الحقيقي ديال السمعة ديالكم`;

  const instagram = `السلام دكتور ${name}، غادي نكون صريح ومحترم معاك:

${clinicLabel} عندها تقييم ${ratingStr ?? "ممتاز"}${reviewsStr ? ` من ${reviewsStr}+ مريض` : ""} — ولكن ${visualHook}.

أنا كنخدم غير مع العيادات الطبية: كنصايب مواقع فيها حجز أونلاين مباشر، معرض قبل/بعد تفاعلي، وتقييمات Google منظمة — وكنوجد المحتوى البصري اللي كيرفع الثقة من أول نظرة.

صايبت ليكم تصور أولي مجاني ديال الصفحة الرئيسية. واش نبعثو ليك باش تشوفو؟`;

  const short = busy
    ? `السلام دكتور ${name}. شفت ${clinicLabel} فجوجل — واضح أن الإقبال كبير والعيادة عامرة.

سؤال بلا ما نطول عليك: شحال من مريض كيتصل وما كيلقاش الرض، أو كيموت فانتظار الموعد؟

عندنا سيستيم حجز أونلاين كيخفف الضغط على التليفون وكيحول البحث فجوجل لمواعيد مؤكدة. 5 دقايق ونوريه ليك؟`
    : `السلام دكتور ${name}. شفت ${clinicLabel} فجوجل — الخدمة واضحة أنها بالمستوى.

سؤال واحد بلا إطالة: شكون كيرد على المرضى اللي كيقلبو عليكم أونلاين وما كيلقاو فين يحجزو؟

عندنا سيستيم بسيط كيحول البحث لحجوزات مباشرة. نوريه ليك فـ 5 دقايق؟`;

  return { whatsapp, instagram, short };
}

/* --------------------------- البرومبت ------------------------------ */

function aestheticLine(q: PhotoQuality): string {
  switch (q) {
    case "excellent":
      return "Photo audit: existing interior photos look premium — modern lighting, clean lines, refined materials. Translate that exact feeling to the web: warm minimalism, soft ivory surfaces, subtle brass details, cinematic light.";
    case "good":
      return "Photo audit: the interior looks modern and tidy. Keep a light, airy, premium-medical visual language that matches — nothing darker than the real space.";
    case "average":
      return "Photo audit: the current interior photos are ordinary — clean but forgettable. The website must ELEVATE the brand beyond the photos: aspirational boutique-clinic look, magazine-grade imagery, warm cinematic grading.";
    case "poor":
      return "Photo audit: current photos are dark, low-resolution and unflattering — do NOT reuse them. The website must reposition the brand as spotless and high-end: bright high-key imagery, generous whitespace, confidence through restraint.";
    case "outdated":
      return "Photo audit: published photos are visibly outdated (old decor, old equipment). Do NOT reuse them. Define a fresh 2025 boutique-clinic identity — assume a renovated, modern version of the space.";
    default:
      return "Photo audit: insufficient/unusable photos online — commission-style art direction needed: bright, calm, spotless premium clinic imagery throughout (warm daylight, soft shadows, real staff energy).";
  }
}

export function generatePrompt(d: ClinicData): string {
  const spec = resolveSpecialty(d.specialty);
  const rating = num(d.rating);
  const reviews = intNum(d.reviewsCount);
  const name = firstName(d.doctorName);
  const clinicName = d.clinicName || "The Clinic";
  const city = d.city || "Morocco";
  const phone = d.phone || "+212 6 00 00 00 00";

  const gaps: string[] = [];
  if (d.website === "no") gaps.push("There is currently NO website — this build establishes the entire digital presence from scratch.");
  if (d.website === "unknown") gaps.push("No official website was found during the audit — treat this as a ground-up brand definition.");
  if (d.photosQuality === "poor" || d.photosQuality === "outdated" || d.photosQuality === "average")
    gaps.push(aestheticLine(d.photosQuality));
  const deadSocials = [
    d.instagram.exists && d.instagram.activity === "dead" ? "Instagram (inactive)" : null,
    !d.instagram.exists ? "Instagram (missing)" : null,
    !d.tiktok.exists ? "TikTok (missing)" : null,
    d.facebook.exists && d.facebook.activity === "dead" ? "Facebook (inactive)" : null,
  ].filter(Boolean);
  if (deadSocials.length) gaps.push(`Weak social presence: ${[...new Set(deadSocials)].join(", ")}. The website becomes the primary brand touchpoint and booking funnel.`);

  const ratingLine =
    rating && reviews
      ? `${fmt(rating)}/5 average from ${reviews}+ verified Google reviews — this is the #1 conversion asset: surface it everywhere.`
      : rating
        ? `${fmt(rating)}/5 on Google — surface this rating prominently.`
        : "Strong word-of-mouth reputation — the site must convert that offline trust into online bookings.";

  const beforeAfterSection = spec.beforeAfter
    ? `5. BEFORE / AFTER — Interactive comparison slider gallery (draggable handle), 6+ real cases with short captions, subtle disclaimer. This is the highest-trust section for ${spec.english.toLowerCase()}.`
    : `5. FACILITY & RESULTS — Elegant gallery of the clinic, equipment and happy patients (no clinical before/after for this specialty). Emphasize comfort and technology.`;

  return `You are a world-class web designer and conversion copywriter. Build a complete, responsive, Awwwards-caliber marketing website for the medical clinic below. Write all copy in professional Moroccan Arabic (polished Darija — warm, respectful, never slangy). Layout is fully RTL.

═══════════════════════════
1. CLINIC INFO
═══════════════════════════
• Name: ${clinicName}
• Lead practitioner: Dr. ${name}${d.doctorName ? ` (${d.doctorName})` : ""}
• Specialization: ${d.specialty || "Medicine"} — ${spec.english}
• Location: ${city}, Morocco
• Phone / WhatsApp: ${phone}
• Reputation: ${ratingLine}

═══════════════════════════
2. CURRENT BRAND GAPS (why this site matters)
═══════════════════════════
${gaps.length ? gaps.map((g) => `• ${g}`).join("\n") : "• Solid offline reputation that deserves an equally strong digital flagship."}

═══════════════════════════
3. BRAND VIBE & VISUAL DIRECTION
═══════════════════════════
• Mood: ${spec.mood}.
• Palette: ${spec.palette}. Maximum 3 colors + neutrals; medical-trust contrast (AA minimum).
• Typography: Arabic-first pairing — a high-character Arabic display face for headlines, clean readable Arabic for body; Space Grotesk (or similar) for Latin/numbers. Large, confident type scale.
• Texture & motion: subtle film grain, soft glassmorphism cards, 20–28px corner radius, generous whitespace; physics-feel micro-interactions, scroll-reveal (never flashy, never slow).
• Imagery: bright, high-key clinic photography — warm lighting, real Moroccan staff/patients, hygiene and technology visible. Subtle parallax in hero only.

═══════════════════════════
4. KEY SECTIONS (in order)
═══════════════════════════
1. HERO — Full-viewport. Headline: outcome-driven Arabic promise + French sub-line. Google rating badge (${rating ? `${fmt(rating)} ★` : "★★★★★"} • ${reviews ? `${reviews}+ reviews` : "verified reviews"}). Dual CTA: primary "احجز موعدك" (scrolls to booking) + WhatsApp button (deep link to ${phone}). Background: softly blurred clinic interior or calm brand gradient with grain.
2. TRUST BAR — Horizontal stat strip: Google rating, years of experience, patients treated, certifications/partners logos.
3. SERVICES — Card grid of the core offer: ${spec.services}. Each card: Lucide-style icon, short benefit-led copy in Darija, "starting from" price hint where culturally appropriate, CTA to book that specific service.
4. ONLINE BOOKING SYSTEM — The core flow: choose service → pick doctor → pick date → pick time slot → confirm name + phone. Mobile-first stepper with progress. On confirm: show success screen AND open a pre-filled WhatsApp message to ${phone}. Include working-hours logic and "أقرب موعد متاح" shortcut.
${beforeAfterSection}
6. REVIEWS — Carousel grid of Google reviews: patient first name + initial, star row, short quote, "من Google" source tag, and a CTA linking to the live Google profile.
7. THE DOCTOR — Portrait, credentials, years of experience, languages spoken (الدارجة / الفرنسية / الإنجليزية), personal philosophy quote.
8. LOCATION & CONTACT — Embedded Google Map${city ? ` (${city} area)` : ""}, hours table (with note about Friday/emergencies), phone tap-to-call, WhatsApp, parking/transport hint, and a floating WhatsApp bubble (fixed, respects RTL corner).

═══════════════════════════
5. TECHNICAL REQUIREMENTS
═══════════════════════════
• 100% RTL Arabic layout (primary); optional FR toggle in the nav.
• SEO: target queries like "${d.specialty || "طبيب"} ${city.split("—")[0].trim()}" — include LocalBusiness ${spec.english.includes("Dent") ? "+ Dentist" : "+ MedicalClinic"} JSON-LD schema with aggregateRating.
• Performance: optimized/next-gen images, lazy-loaded galleries, LCP under 2.5s.
• Accessibility: AA contrast, focus states, tap targets 44px+, alt text in Arabic.
• All forms validate Moroccan phone numbers; every CTA is trackable.
• Use real, specific copy — no lorem ipsum, no stock-looking filler. Tone: calm, expert, reassuring.

Deliver: desktop + mobile, fully responsive, production-ready sections with polished hover/scroll micro-interactions.`;
}

/* ------------------------- نسخ التقرير كامل ------------------------ */

export function buildFullReport(d: ClinicData, kit: { audit: AuditResult; messages: Messages; prompt: string }): string {
  const a = kit.audit;
  return `═══════════════════════
تقرير Outreach — ${d.clinicName || "العيادة"}
═══════════════════════

[1] تقرير التحليل
— نقاط القوة:
${a.strengths.map((s) => `  + ${s.text}`).join("\n")}
— نقاط الضعف:
${a.weaknesses.map((s) => `  - ${s.text}`).join("\n")}
— الجاهزية الرقمية: ${a.score}/100 (${a.scoreLabel})
— حرارة الفرصة: ${a.tempLabel} — ${a.tempNote}
— زاوية الإقناع «${a.pitchTitle}»:
${a.pitchBody}
${a.pitchSecondary}

[2] رسالة WhatsApp
${kit.messages.whatsapp}

[3] رسالة Instagram / Facebook DM
${kit.messages.instagram}

[4] الرسالة السريعة (Short Hook)
${kit.messages.short}

[5] برومبت توليد الموقع (AI Builder)
${kit.prompt}
`;
}
