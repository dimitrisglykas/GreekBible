import { createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLibrary } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/prosefchi")({
  head: () => ({
    meta: [
      { title: "Προσευχή — Μίλησε στον Θεό με δικά σου λόγια" },
      {
        name: "description",
        content:
          "Δεν χρειάζεσαι τέλειες λέξεις. Γράψε τι σε απασχολεί, για τι είσαι ευγνώμων και για ποιον προσεύχεσαι — ιδιωτικά.",
      },
      { property: "og:title", content: "Μίλησε στον Θεό" },
      {
        property: "og:description",
        content: "Η προσευχή μπορεί να ξεκινήσει απλά, όπως μια ειλικρινής συζήτηση.",
      },
    ],
  }),
  component: PrayerPage,
});

const PROMPTS = [
  "Για τι είμαι ευγνώμων;",
  "Τι με απασχολεί;",
  "Για ποιον θέλω να προσευχηθώ;",
  "Τι θέλω να πω στον Θεό;",
];

function PrayerPage() {
  const { data, addPrayer, removePrayer } = useLibrary();
  const [prompt, setPrompt] = useState<string | null>(null);
  const [body, setBody] = useState("");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:px-6 md:py-14">
      <h1 className="font-serif text-3xl font-semibold md:text-4xl">Μίλησε στον Θεό</h1>
      <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
        Δεν χρειάζεσαι τέλειες λέξεις. Η προσευχή μπορεί να ξεκινήσει απλά, όπως μια ειλικρινής
        συζήτηση.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {PROMPTS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPrompt(prompt === p ? null : p)}
            aria-pressed={prompt === p}
            className={cn(
              "rounded-full border border-border bg-card px-3.5 py-2 text-sm transition-colors",
              prompt === p ? "bg-primary text-primary-foreground" : "text-muted-foreground",
            )}
          >
            {p}
          </button>
        ))}
      </div>

      <form
        className="surface-card mt-6 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!body.trim()) return;
          addPrayer(prompt, body);
          setBody("");
          toast.success("Καταγράφηκε. Μόνο εσύ το βλέπεις.");
        }}
      >
        <label htmlFor="prayer" className="text-sm font-medium">
          {prompt ?? "Γράψε ελεύθερα"}
        </label>
        <Textarea
          id="prayer"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          placeholder="Θεέ μου, σήμερα…"
          className="mt-2 resize-none"
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Οι προσευχές σου μένουν ιδιωτικές, στη συσκευή σου.
          </p>
          <Button type="submit" className="rounded-full" disabled={!body.trim()}>
            Αποθήκευση
          </Button>
        </div>
      </form>

      {data.prayers.length > 0 && (
        <section className="mt-10">
          <h2 className="font-serif text-xl font-semibold">Το ημερολόγιό μου</h2>
          <ul className="mt-4 space-y-3">
            {data.prayers.map((p) => (
              <li key={p.id} className="surface-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {p.prompt && <p className="text-xs font-semibold text-primary">{p.prompt}</p>}
                    <p className="mt-1 leading-relaxed whitespace-pre-wrap">{p.body}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(p.createdAt).toLocaleDateString("el-GR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Διαγραφή"
                    onClick={() => removePrayer(p.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
