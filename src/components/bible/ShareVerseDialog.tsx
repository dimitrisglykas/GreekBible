import { Download, Share2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { reference, type Verse } from "@/lib/bible";
import { useLibrary } from "@/lib/store";
import { cn } from "@/lib/utils";

type Style = "cream" | "olive" | "night";

const STYLES: { id: Style; label: string; bg: [string, string]; fg: string; accent: string }[] = [
  { id: "cream", label: "Κρεμ", bg: ["#faf6ee", "#f0e6d4"], fg: "#38332b", accent: "#8a6d3b" },
  { id: "olive", label: "Ελιά", bg: ["#4a5540", "#2f3729"], fg: "#f4f1e8", accent: "#d9c48b" },
  { id: "night", label: "Νύχτα", bg: ["#26241f", "#15140f"], fg: "#f2efe6", accent: "#d9c48b" },
];

/** Instagram-Stories-friendly verse card (1080x1920) rendered on canvas. */
export function ShareVerseDialog({ verse, onClose }: { verse: Verse; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [style, setStyle] = useState<Style>("cream");
  const { data, toggleBookmark } = useLibrary();
  const ref = reference(verse.bookName, verse.chapter, verse.verse);
  const saved = data.bookmarks.some((b) => b.id === verse.id);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = STYLES.find((x) => x.id === style)!;
    const W = 1080;
    const H = 1920;
    canvas.width = W;
    canvas.height = H;

    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, s.bg[0]);
    grad.addColorStop(1, s.bg[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = s.accent;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 3;
    ctx.strokeRect(56, 56, W - 112, H - 112);
    ctx.globalAlpha = 1;

    // verse text, wrapped
    const words = verse.text.replace(/\s+/g, " ").trim().split(" ");
    const maxWidth = W - 260;
    const size = verse.text.length > 260 ? 50 : verse.text.length > 150 ? 58 : 66;
    ctx.font = `italic ${size}px Literata, Georgia, serif`;
    ctx.fillStyle = s.fg;
    ctx.textAlign = "center";

    const lines: string[] = [];
    let line = "";
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = w;
      } else line = test;
    }
    if (line) lines.push(line);

    const lineHeight = size * 1.55;
    let y = H / 2 - (lines.length * lineHeight) / 2;
    ctx.fillText("“", W / 2, y - lineHeight * 0.9);
    for (const l of lines) {
      ctx.fillText(l, W / 2, y);
      y += lineHeight;
    }

    ctx.font = "600 44px Commissioner, system-ui, sans-serif";
    ctx.fillStyle = s.accent;
    ctx.fillText(ref, W / 2, y + 70);

    ctx.font = "500 34px Commissioner, system-ui, sans-serif";
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = s.fg;
    ctx.fillText("Ελληνική Βίβλος · Γνώρισε τον Λόγο", W / 2, H - 130);
    ctx.globalAlpha = 1;
  }, [style, verse.text, ref]);

  useEffect(() => {
    draw();
    if (typeof document !== "undefined" && "fonts" in document) {
      (document as Document & { fonts: FontFaceSet }).fonts.ready.then(draw).catch(() => {});
    }
  }, [draw]);

  const download = () => {
    const url = canvasRef.current?.toDataURL("image/png");
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = `${ref.replace(/[^\p{L}\p{N}]+/gu, "-")}.png`;
    a.click();
  };

  const share = async () => {
    const text = `«${verse.text}»\n— ${ref}`;
    try {
      if (navigator.share) await navigator.share({ title: ref, text });
      else {
        await navigator.clipboard.writeText(text);
        toast.success("Αντιγράφηκε — έτοιμο για κοινοποίηση");
      }
    } catch {
      /* cancelled */
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Κλείσιμο"
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-label="Κάρτα εδαφίου"
        className="relative w-full max-w-sm rounded-3xl bg-card p-4 shadow-lifted animate-rise"
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold">Κάρτα εδαφίου</p>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Κλείσιμο">
            <X className="size-4" />
          </Button>
        </div>

        <canvas
          ref={canvasRef}
          className="mx-auto aspect-[9/16] w-full max-w-[240px] rounded-2xl border border-border"
          aria-label={`Εικόνα με το εδάφιο ${ref}`}
        />

        <div className="mt-3 flex justify-center gap-2">
          {STYLES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStyle(s.id)}
              className={cn(
                "rounded-full border border-border px-3 py-1.5 text-xs font-medium",
                style === s.id && "border-primary bg-primary/10 text-primary",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-2">
          <Button className="rounded-full" onClick={share}>
            <Share2 className="mr-2 size-4" /> Κοινοποίηση
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => {
                toggleBookmark({
                  id: verse.id,
                  bookId: verse.bookId,
                  bookName: verse.bookName,
                  chapter: verse.chapter,
                  verse: verse.verse,
                  text: verse.text,
                });
                toast.success(saved ? "Αφαιρέθηκε" : "Αποθηκεύτηκε");
              }}
            >
              {saved ? "Αποθηκευμένο" : "Αποθήκευση"}
            </Button>
            <Button variant="outline" className="rounded-full" onClick={download}>
              <Download className="mr-2 size-4" /> Λήψη
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
