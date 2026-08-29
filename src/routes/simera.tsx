import { createFileRoute, Link } from "@tanstack/react-router";

import { DailyVerseCard } from "@/components/DailyVerseCard";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/data/content";

export const Route = createFileRoute("/simera")({
  head: () => ({
    meta: [
      { title: "Σήμερα — Στίχος της ημέρας & μια σκέψη" },
      {
        name: "description",
        content:
          "Ένα εδάφιο και μια σύντομη σκέψη για σήμερα. Λίγα λεπτά για να ξεκινήσεις ή να κλείσεις τη μέρα σου.",
      },
      { property: "og:title", content: "Σήμερα — Στίχος της ημέρας" },
      { property: "og:description", content: "Ένα εδάφιο, μια σκέψη, λίγα λεπτά ησυχίας." },
    ],
  }),
  component: TodayPage,
});

function TodayPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10 md:px-6 md:py-14">
      <header>
        <h1 className="font-serif text-3xl font-semibold md:text-4xl">Σήμερα</h1>
        <p className="mt-2 text-muted-foreground">
          Δεν χρειάζεται να διαβάσεις πολλά. Λίγα λεπτά αρκούν.
        </p>
      </header>

      <DailyVerseCard />

      <section className="surface-card p-6">
        <h2 className="font-serif text-xl font-semibold">Θέλεις κάτι πιο σταθερό;</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ένα πρόγραμμα ανάγνωσης σου δίνει ένα μικρό κείμενο κάθε μέρα.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {PLANS.slice(0, 3).map((p) => (
            <Button key={p.id} asChild variant="outline" className="rounded-full">
              <Link to="/programmata/$plan" params={{ plan: p.id }}>
                {p.title}
              </Link>
            </Button>
          ))}
        </div>
      </section>

      <section className="surface-card p-6">
        <h2 className="font-serif text-xl font-semibold">Μίλησε στον Θεό</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Δεν χρειάζεσαι τέλειες λέξεις. Η προσευχή μπορεί να ξεκινήσει απλά.
        </p>
        <Button asChild className="mt-4 rounded-full">
          <Link to="/prosefchi">Άνοιξε την προσευχή</Link>
        </Button>
      </section>
    </div>
  );
}
