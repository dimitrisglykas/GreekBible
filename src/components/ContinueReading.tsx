import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useHydrated } from "@/lib/theme";
import { useUserData } from "@/lib/store";

export function ContinueReading() {
  const hydrated = useHydrated();
  const { data } = useUserData();
  const progress = data.progress;

  if (!hydrated) return null;

  if (!progress) {
    return (
      <section className="surface-card flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-serif text-lg font-semibold">Δεν έχεις ξεκινήσει ακόμα.</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Το Ευαγγέλιο του Ιωάννη είναι ένα από τα πιο απλά σημεία εκκίνησης.
          </p>
        </div>
        <Button asChild className="rounded-full">
          <Link to="/vivlos/$book/$chapter" params={{ book: "ioannis", chapter: "1" }}>
            Ξεκίνα με το Ευαγγέλιο του Ιωάννη
          </Link>
        </Button>
      </section>
    );
  }

  const percent = Math.min(
    100,
    Math.round((progress.chapter / Math.max(1, progress.chapterCount)) * 100),
  );

  return (
    <section className="surface-card p-6">
      <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
        Συνέχισε από εκεί που σταμάτησες
      </p>
      <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="font-serif text-2xl font-semibold">
            {progress.bookName} {progress.chapter}
          </h2>
          <div
            className="mt-3 h-2 w-full max-w-sm overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Πρόοδος στο βιβλίο"
          >
            <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{percent}% ολοκληρωμένο</p>
        </div>
        <Button asChild className="rounded-full">
          <Link
            to="/vivlos/$book/$chapter"
            params={{ book: progress.bookId, chapter: String(progress.chapter) }}
          >
            Συνέχισε <ArrowRight className="ml-1.5 size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
