import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { BookOpen, Copy, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AskAssistantButton } from "@/components/assistant/AssistantProvider";
import { ShareVerseDialog } from "@/components/bible/ShareVerseDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { bookQuery, getChapter, reference } from "@/lib/bible";
import { DAILY_VERSES, dailyIndex } from "@/data/content";
import { useLibrary } from "@/lib/store";

export function DailyVerseCard({ showThought = true }: { showThought?: boolean }) {
  const entry = DAILY_VERSES[dailyIndex()]!;
  const { data } = useQuery(bookQuery(entry.ref.book));
  const { data: user, toggleBookmark } = useLibrary();
  const [share, setShare] = useState(false);

  const verses = data ? getChapter(data, entry.ref.chapter) : [];
  const from = entry.ref.from ?? 1;
  const to = entry.ref.to ?? from;
  const selection = verses.filter((v) => v.verse >= from && v.verse <= to);
  const text = selection.map((v) => v.text).join(" ");
  const ref = data ? reference(data.name, entry.ref.chapter, from, to) : "";
  const first = selection[0];
  const saved = first ? user.bookmarks.some((b) => b.id === first.id) : false;

  return (
    <section className="surface-card overflow-hidden">
      <div className="bg-dawn px-6 py-7 md:px-8 md:py-9">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          Στίχος της ημέρας
        </p>
        {first ? (
          <>
            <blockquote className="scripture mt-4 text-xl md:text-2xl">«{text}»</blockquote>
            <p className="mt-3 text-sm font-semibold text-foreground/80">{ref}</p>
          </>
        ) : (
          <div className="mt-4 space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-10/12" />
          </div>
        )}
      </div>

      <div className="space-y-4 px-6 py-5 md:px-8">
        <p className="text-sm text-muted-foreground">{entry.reflection}</p>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="rounded-full"
            disabled={!first}
            onClick={() => {
              if (!first) return;
              toggleBookmark({
                id: first.id,
                bookId: first.bookId,
                bookName: first.bookName,
                chapter: first.chapter,
                verse: first.verse,
                text,
              });
              toast.success(saved ? "Αφαιρέθηκε" : "Αποθηκεύτηκε");
            }}
          >
            {saved ? "Αποθηκευμένο" : "Αποθήκευση"}
          </Button>
          <Button
            variant="outline"
            className="rounded-full"
            disabled={!first}
            onClick={() => setShare(true)}
          >
            <Share2 className="mr-2 size-4" /> Κοινοποίηση
          </Button>
          <Button
            variant="outline"
            className="rounded-full"
            disabled={!first}
            onClick={async () => {
              await navigator.clipboard?.writeText(`«${text}»\n— ${ref}`);
              toast.success("Αντιγράφηκε");
            }}
          >
            <Copy className="mr-2 size-4" /> Αντιγραφή
          </Button>
          <Button variant="outline" className="rounded-full" asChild>
            <Link
              to="/vivlos/$book/$chapter"
              params={{ book: entry.ref.book, chapter: String(entry.ref.chapter) }}
            >
              <BookOpen className="mr-2 size-4" /> Συμφραζόμενα
            </Link>
          </Button>
          <AskAssistantButton reference={ref} text={text} />
        </div>

        {showThought && (
          <div className="rounded-2xl border border-border bg-muted/50 p-4">
            <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              Μια σκέψη για σήμερα
            </p>
            <p className="mt-2 text-sm leading-relaxed">{entry.thought}</p>
          </div>
        )}
      </div>

      {share && first && (
        <ShareVerseDialog verse={{ ...first, text }} onClose={() => setShare(false)} />
      )}
    </section>
  );
}
