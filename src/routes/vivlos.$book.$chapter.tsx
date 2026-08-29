import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Minus, Moon, Plus, Search, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { AskAssistantButton } from "@/components/assistant/AssistantProvider";
import { VerseActions } from "@/components/bible/VerseActions";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { bookQuery, booksQuery, getChapter, reference, type Verse } from "@/lib/bible";
import { HIGHLIGHT_COLORS, useLibrary } from "@/lib/store";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vivlos/$book/$chapter")({
  head: ({ params }) => {
    const title = `Κεφάλαιο ${params.chapter} — Ανάγνωση Αγίας Γραφής`;
    return {
      meta: [
        { title },
        {
          name: "description",
          content:
            "Διάβασε το κεφάλαιο σε ένα ήσυχο περιβάλλον ανάγνωσης: επισήμανε, κράτα σημειώσεις και ρώτησε τον Βοηθό για κάθε εδάφιο.",
        },
        { property: "og:title", content: title },
        {
          property: "og:description",
          content: "Ήσυχη ανάγνωση της Αγίας Γραφής στα ελληνικά.",
        },
      ],
    };
  },
  component: Reader,
});

const FONT_KEY = "greek-bible/font-size";

function Reader() {
  const { book: bookId, chapter: chapterParam } = Route.useParams();
  const chapter = Math.max(1, Number(chapterParam) || 1);
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const { data: books } = useQuery(booksQuery);
  const { data: book } = useQuery(bookQuery(bookId));
  const { data: user, trackReading } = useLibrary();
  const [selected, setSelected] = useState<Verse | null>(null);
  const [fontSize, setFontSize] = useState(2);

  useEffect(() => {
    const stored = Number(window.localStorage.getItem(FONT_KEY));
    if (stored >= 0 && stored <= 4) setFontSize(stored);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(FONT_KEY, String(fontSize));
  }, [fontSize]);

  useEffect(() => {
    if (!book) return;
    trackReading({
      bookId: book.id,
      bookName: book.name,
      chapter,
      chapterCount: book.chapters.length,
    });
    window.scrollTo({ top: 0 });
  }, [book, chapter, trackReading]);

  if (!book || !books) {
    return (
      <div className="mx-auto max-w-2xl space-y-3 px-4 py-12">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-full" />
        ))}
      </div>
    );
  }

  const verses = getChapter(book, chapter);
  const total = book.chapters.length;
  const sizes = ["text-base", "text-lg", "text-xl", "text-2xl", "text-3xl"];

  return (
    <div className="animate-fade">
      <div className="sticky top-16 z-20 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-2 px-4 py-2.5">
          <select
            value={book.id}
            onChange={(e) =>
              navigate({
                to: "/vivlos/$book/$chapter",
                params: { book: e.target.value, chapter: "1" },
              })
            }
            aria-label="Βιβλίο"
            className="h-9 max-w-[10.5rem] rounded-full border border-input bg-card px-3 text-sm font-medium outline-none"
          >
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          <select
            value={chapter}
            onChange={(e) =>
              navigate({
                to: "/vivlos/$book/$chapter",
                params: { book: book.id, chapter: e.target.value },
              })
            }
            aria-label="Κεφάλαιο"
            className="h-9 rounded-full border border-input bg-card px-3 text-sm font-medium outline-none"
          >
            {book.chapters.map((c) => (
              <option key={c.c} value={c.c}>
                Κεφ. {c.c}
              </option>
            ))}
          </select>

          <div className="ml-auto flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Μικρότερο κείμενο"
              onClick={() => setFontSize((s) => Math.max(0, s - 1))}
            >
              <Minus className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Μεγαλύτερο κείμενο"
              onClick={() => setFontSize((s) => Math.min(4, s + 1))}
            >
              <Plus className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={theme === "dark" ? "Φωτεινό θέμα" : "Σκοτεινό θέμα"}
              onClick={toggle}
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <Button variant="ghost" size="icon" asChild aria-label="Αναζήτηση">
              <Link to="/anazitisi">
                <Search className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="h-0.5 w-full bg-muted">
          <div
            className="h-full bg-primary transition-[width]"
            style={{ width: `${(chapter / total) * 100}%` }}
          />
        </div>
      </div>

      <article className="mx-auto max-w-2xl px-4 py-10 md:py-14">
        <header className="mb-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">{book.name}</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold">Κεφάλαιο {chapter}</h1>
          <p className="mt-2 text-xs text-muted-foreground">
            Κεφάλαιο {chapter} από {total} · Πάτα σε ένα εδάφιο για επιλογές
          </p>
        </header>

        <div className={cn("scripture space-y-2", sizes[fontSize])}>
          {verses.map((v) => {
            const highlight = user.highlights.find((h) => h.id === v.id);
            const hl = HIGHLIGHT_COLORS.find((c) => c.value === highlight?.color);
            const bookmarked = user.bookmarks.some((b) => b.id === v.id);
            const note = user.notes.find((n) => n.id === v.id);
            return (
              <p key={v.id} id={`v${v.verse}`}>
                <button
                  type="button"
                  onClick={() => setSelected(v)}
                  className={cn(
                    "rounded-md px-0.5 text-left transition-colors hover:bg-accent/70",
                    hl?.className,
                  )}
                  aria-label={`Επιλογές για ${reference(book.name, chapter, v.verse)}`}
                >
                  <sup className="mr-1 font-sans text-[0.6em] font-semibold text-primary">
                    {v.verse}
                  </sup>
                  {v.text}
                  {bookmarked && (
                    <span className="ml-1 align-middle text-xs text-primary" aria-label="Αποθηκευμένο">
                      ★
                    </span>
                  )}
                  {note && (
                    <span className="ml-1 align-middle text-xs text-gold" aria-label="Έχει σημείωση">
                      ✎
                    </span>
                  )}
                </button>
              </p>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <AskAssistantButton
            reference={reference(book.name, chapter)}
            label="Ρώτησε τον Βοηθό για το κεφάλαιο"
          />
        </div>

        <nav className="mt-10 flex items-center justify-between gap-3" aria-label="Πλοήγηση κεφαλαίων">
          {chapter > 1 ? (
            <Button asChild variant="outline" className="rounded-full">
              <Link
                to="/vivlos/$book/$chapter"
                params={{ book: book.id, chapter: String(chapter - 1) }}
              >
                <ArrowLeft className="mr-1.5 size-4" /> Κεφ. {chapter - 1}
              </Link>
            </Button>
          ) : (
            <span />
          )}
          {chapter < total ? (
            <Button asChild className="rounded-full">
              <Link
                to="/vivlos/$book/$chapter"
                params={{ book: book.id, chapter: String(chapter + 1) }}
              >
                Κεφ. {chapter + 1} <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/vivlos">Όλα τα βιβλία</Link>
            </Button>
          )}
        </nav>
      </article>

      {selected && <VerseActions verse={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
