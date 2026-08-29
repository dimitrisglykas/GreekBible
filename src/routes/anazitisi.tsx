import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Loader2, Search } from "lucide-react";
import { useCallback, useState } from "react";

import { AskAssistantButton } from "@/components/assistant/AssistantProvider";
import { VerseActions } from "@/components/bible/VerseActions";
import { Button } from "@/components/ui/button";
import {
  booksQuery,
  fetchBook,
  getChapter,
  normalizeGreek,
  parseReferenceQuery,
  reference,
  type BookMeta,
  type Verse,
} from "@/lib/bible";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/anazitisi")({
  head: () => ({
    meta: [
      { title: "Αναζήτηση στη Βίβλο — λέξεις, εδάφια, ερωτήσεις" },
      {
        name: "description",
        content:
          "Ψάξε στη Βίβλο με λέξεις όπως «αγάπη» ή «φόβος», με παραπομπές όπως «Ιωάννης 3:16» ή με μια ερώτηση.",
      },
      { property: "og:title", content: "Αναζήτηση στη Βίβλο" },
      {
        property: "og:description",
        content: "Βρες εδάφια για ό,τι ψάχνεις — και ρώτησε τον Βοηθό για ό,τι δεν καταλαβαίνεις.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(booksQuery),
  component: SearchPage,
});

const EXAMPLES = ["αγάπη", "πίστη", "Ιωάννης 3:16", "συγχώρεση", "όταν φοβάμαι", "ελπίδα"];
const STOPWORDS = new Set([
  "τι",
  "για",
  "την",
  "τον",
  "το",
  "τα",
  "της",
  "του",
  "και",
  "λεει",
  "βιβλος",
  "η",
  "ο",
  "μια",
  "ενα",
  "οταν",
  "στη",
  "στο",
  "με",
  "μου",
  "σου",
  "ειναι",
  "πως",
  "γιατι",
]);

function SearchPage() {
  const { data: books } = useQuery(booksQuery);
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<"nt" | "all">("nt");
  const [results, setResults] = useState<Verse[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [refHit, setRefHit] = useState<{ book: BookMeta; chapter: number; verse?: number } | null>(
    null,
  );
  const [selected, setSelected] = useState<Verse | null>(null);

  const run = useCallback(
    async (raw: string) => {
      if (!books) return;
      const q = raw.trim();
      if (!q) return;
      setLoading(true);
      setResults(null);
      setRefHit(parseReferenceQuery(q, books));

      const terms = normalizeGreek(q)
        .split(" ")
        .filter((t) => t.length > 2 && !STOPWORDS.has(t));

      if (!terms.length) {
        setResults([]);
        setLoading(false);
        return;
      }

      const scoped = books.filter((b) => (scope === "nt" ? b.testament === "nt" : true));
      const found: Verse[] = [];

      for (let i = 0; i < scoped.length && found.length < 120; i += 6) {
        const batch = await Promise.all(scoped.slice(i, i + 6).map((b) => fetchBook(b.id)));
        for (const bookData of batch) {
          for (const ch of bookData.chapters) {
            for (const verse of getChapter(bookData, ch.c)) {
              const hay = normalizeGreek(verse.text);
              if (terms.every((t) => hay.includes(t))) {
                found.push(verse);
                if (found.length >= 120) break;
              }
            }
            if (found.length >= 120) break;
          }
        }
      }

      setResults(found);
      setLoading(false);
    },
    [books, scope],
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <h1 className="font-serif text-3xl font-semibold md:text-4xl">Αναζήτηση</h1>
      <p className="mt-2 text-muted-foreground">
        Γράψε μια λέξη, μια παραπομπή ή απλά αυτό που σκέφτεσαι.
      </p>

      <form
        className="mt-6 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void run(query);
        }}
      >
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Τι ψάχνεις στη Βίβλο;"
            aria-label="Τι ψάχνεις στη Βίβλο;"
            className="h-12 w-full rounded-full border border-input bg-card pr-4 pl-11 text-base outline-none"
          />
        </div>
        <Button type="submit" size="lg" className="rounded-full" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Ψάξε"}
        </Button>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => {
              setQuery(ex);
              void run(ex);
            }}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {ex}
          </button>
        ))}
      </div>

      <div className="mt-4 inline-flex rounded-full border border-border bg-card p-1 text-sm">
        {(
          [
            ["nt", "Καινή Διαθήκη"],
            ["all", "Όλη η Βίβλος"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setScope(value)}
            aria-pressed={scope === value}
            className={cn(
              "rounded-full px-3 py-1.5 font-medium transition-colors",
              scope === value ? "bg-primary text-primary-foreground" : "text-muted-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {refHit && (
        <Link
          to="/vivlos/$book/$chapter"
          params={{ book: refHit.book.id, chapter: String(refHit.chapter) }}
          className="surface-card mt-8 flex items-center justify-between p-5 transition-transform hover:-translate-y-0.5"
        >
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
              Παραπομπή
            </p>
            <p className="mt-1 font-serif text-lg font-semibold">
              {reference(refHit.book.name, refHit.chapter, refHit.verse)}
            </p>
          </div>
          <ArrowUpRight className="size-5 text-primary" aria-hidden />
        </Link>
      )}

      {loading && (
        <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden /> Ψάχνω στα κείμενα…
        </p>
      )}

      {results && !loading && (
        <section className="mt-8 space-y-3" aria-live="polite">
          <p className="text-sm text-muted-foreground">
            {results.length
              ? `${results.length} εδάφια${results.length >= 120 ? "+" : ""}`
              : "Δεν βρήκα εδάφια. Δοκίμασε μια πιο απλή λέξη."}
          </p>
          {results.map((v) => (
            <article key={v.id} className="surface-card p-5">
              <p className="text-xs font-semibold text-primary">
                {reference(v.bookName, v.chapter, v.verse)}
              </p>
              <p className="scripture mt-2">{v.text}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm" className="rounded-full">
                  <Link
                    to="/vivlos/$book/$chapter"
                    params={{ book: v.bookId, chapter: String(v.chapter) }}
                  >
                    Άνοιξε το χωρίο
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => setSelected(v)}
                >
                  Επιλογές
                </Button>
                <AskAssistantButton
                  reference={reference(v.bookName, v.chapter, v.verse)}
                  text={v.text}
                  className="h-8 px-3 text-xs"
                />
              </div>
            </article>
          ))}
        </section>
      )}

      {!results && !loading && (
        <div className="surface-card mt-8 p-6 text-sm text-muted-foreground">
          Μπορείς επίσης να ρωτήσεις κάτι με δικά σου λόγια, όπως «τι λέει η Βίβλος για την αγάπη;».
          Ο Βοηθός θα σε βοηθήσει να καταλάβεις.
        </div>
      )}

      {selected && (
        <VerseActions verse={selected} onClose={() => setSelected(null)} showContextLink />
      )}
    </div>
  );
}
