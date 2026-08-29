import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { booksQuery, BOOK_GROUPS, normalizeGreek, TESTAMENT_LABEL, type Testament } from "@/lib/bible";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vivlos/")({
  head: () => ({
    meta: [
      { title: "Η Βίβλος — 66 βιβλία στα ελληνικά" },
      {
        name: "description",
        content:
          "Περιήγηση σε όλα τα βιβλία της Παλαιάς και της Καινής Διαθήκης. Διάλεξε βιβλίο και κεφάλαιο και ξεκίνα να διαβάζεις.",
      },
      { property: "og:title", content: "Η Βίβλος — 66 βιβλία στα ελληνικά" },
      {
        property: "og:description",
        content: "Παλαιά και Καινή Διαθήκη, με καθαρό και ήσυχο περιβάλλον ανάγνωσης.",
      },
    ],
  }),
  
  component: BibleIndex,
});

function BibleIndex() {
  const { data: books } = useQuery(booksQuery);
  const [testament, setTestament] = useState<Testament>("nt");
  const [filter, setFilter] = useState("");

  const needle = normalizeGreek(filter);
  const groups = BOOK_GROUPS.filter((g) => g.testament === testament);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
      <h1 className="font-serif text-3xl font-semibold md:text-4xl">Η Βίβλος</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Η Βίβλος είναι μια συλλογή 66 βιβλίων. Η Καινή Διαθήκη μιλάει για τον Ιησού — είναι το πιο απλό
        σημείο για να ξεκινήσεις.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="inline-flex rounded-full border border-border bg-card p-1">
          {(["nt", "ot"] as Testament[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTestament(t)}
              aria-pressed={testament === t}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                testament === t ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
            >
              {TESTAMENT_LABEL[t]}
            </button>
          ))}
        </div>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Βρες βιβλίο…"
          aria-label="Βρες βιβλίο"
          className="h-11 w-full rounded-full border border-input bg-card px-4 text-sm outline-none sm:max-w-xs"
        />
      </div>

      {!books ? (
        <div className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          {groups.map((group) => {
            const items = books.filter(
              (b) =>
                b.nr >= group.from &&
                b.nr <= group.to &&
                (!needle || normalizeGreek(b.name).includes(needle)),
            );
            if (!items.length) return null;
            return (
              <section key={group.label}>
                <h2 className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                  {group.label}
                </h2>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((b) => (
                    <li key={b.id}>
                      <Link
                        to="/vivlos/$book/$chapter"
                        params={{ book: b.id, chapter: "1" }}
                        className="surface-card flex items-center justify-between px-4 py-3 transition-transform hover:-translate-y-0.5"
                      >
                        <span className="font-medium">{b.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {b.chapters.length} κεφ.
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
