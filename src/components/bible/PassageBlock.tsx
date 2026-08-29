import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

import { AskAssistantButton } from "@/components/assistant/AssistantProvider";
import { VerseActions } from "@/components/bible/VerseActions";
import { Skeleton } from "@/components/ui/skeleton";
import { bookQuery, getChapter, reference, type PassageRef, type Verse } from "@/lib/bible";

export function PassageBlock({ passage, compact = false }: { passage: PassageRef; compact?: boolean }) {
  const { data, isPending, isError } = useQuery(bookQuery(passage.book));
  const [selected, setSelected] = useState<Verse | null>(null);

  if (isPending) {
    return (
      <div className="surface-card space-y-3 p-5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-9/12" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="surface-card p-5 text-sm text-muted-foreground">
        Το κείμενο δεν φορτώθηκε. Δοκίμασε ξανά σε λίγο.
      </div>
    );
  }

  const all = getChapter(data, passage.chapter);
  const from = passage.from ?? 1;
  const to = passage.to ?? (passage.from ? passage.from : all.length);
  const verses = all.filter((v) => v.verse >= from && v.verse <= to);
  const ref = reference(data.name, passage.chapter, passage.from, passage.to);

  return (
    <article className="surface-card p-5 md:p-6">
      <header className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-serif text-base font-semibold">{ref}</h3>
        <Link
          to="/vivlos/$book/$chapter"
          params={{ book: passage.book, chapter: String(passage.chapter) }}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Άνοιξε το κεφάλαιο <ArrowUpRight className="size-3.5" aria-hidden />
        </Link>
      </header>

      <div className="scripture space-y-1 text-[1.02rem] md:text-[1.08rem]">
        {(compact ? verses.slice(0, 6) : verses).map((v) => (
          <p key={v.id}>
            <button
              type="button"
              onClick={() => setSelected(v)}
              className="text-left transition-colors hover:bg-accent/60"
              aria-label={`Ενέργειες για ${reference(v.bookName, v.chapter, v.verse)}`}
            >
              <sup className="mr-1 font-sans text-[0.62em] font-semibold text-primary">{v.verse}</sup>
              {v.text}
            </button>
          </p>
        ))}
      </div>

      <div className="mt-4">
        <AskAssistantButton
          reference={ref}
          text={verses.map((v) => v.text).join(" ")}
          label="Ρώτησε τον Βοηθό για αυτό"
          className="text-xs"
        />
      </div>

      {selected && (
        <VerseActions verse={selected} onClose={() => setSelected(null)} showContextLink />
      )}
    </article>
  );
}
