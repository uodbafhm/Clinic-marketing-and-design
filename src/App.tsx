import { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ClinicForm from "./components/ClinicForm";
import GeneratingOverlay from "./components/GeneratingOverlay";
import Results from "./components/Results";
import { Stethoscope } from "lucide-react";
import {
  emptyClinic,
  exampleClinic,
  generateAudit,
  generateMessages,
  generatePrompt,
  type AuditResult,
  type ClinicData,
  type Messages,
} from "./lib/engine";

interface Kit {
  audit: AuditResult;
  messages: Messages;
  prompt: string;
}

export default function App() {
  const [data, setData] = useState<ClinicData>(exampleClinic);
  const [kit, setKit] = useState<Kit | null>(null);
  const [generating, setGenerating] = useState(false);
  const booted = useRef(false);

  const buildKit = useCallback((d: ClinicData): Kit => {
    return {
      audit: generateAudit(d),
      messages: generateMessages(d),
      prompt: generatePrompt(d),
    };
  }, []);

  /* توليد صامت عند التحميل باش الصفحة تبان حية */
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    setKit(buildKit(exampleClinic));
  }, [buildKit]);

  const handleGenerate = () => {
    if (generating) return;
    setGenerating(true);
    window.setTimeout(() => {
      setKit(buildKit(data));
      setGenerating(false);
      window.setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    }, 2500);
  };

  const handleExample = () => {
    setData(exampleClinic);
    setKit(buildKit(exampleClinic));
    document.getElementById("form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleReset = () => {
    setData(emptyClinic);
    setKit(null);
    document.getElementById("form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="noise relative min-h-screen">
      <Navbar />

      <main id="top">
        <Hero onExample={handleExample} />

        <ClinicForm data={data} onChange={setData} onGenerate={handleGenerate} onExample={handleExample} />

        {kit && (
          <Results data={data} audit={kit.audit} messages={kit.messages} prompt={kit.prompt} onReset={handleReset} />
        )}
      </main>

      <footer className="border-t border-white/5 py-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-mint to-mint-2 text-ink">
              <Stethoscope size={15} strokeWidth={2.4} />
            </div>
            <div className="text-[13px] font-bold text-fog-2">
              طبيب كيت <span className="font-latin text-[10px] tracking-[0.25em] text-fog-3">TABIBKIT</span>
            </div>
          </div>
          <p className="text-[12px] text-fog-3">
            من Google Maps… للصفقة. صُنع بعناية للمسوقين والوكالات فالمغرب.
          </p>
        </div>
      </footer>

      <GeneratingOverlay show={generating} />
    </div>
  );
}
