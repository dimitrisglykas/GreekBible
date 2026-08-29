import { createFileRoute, Link } from "@tanstack/react-router";

import { PLANS } from "@/data/content";
import { useLibrary } from "@/lib/store";

export const Route = createFileRoute("/programmata/")({
  head: () => ({
    meta: [
      { title: "Προγράμματα ανάγνωσης — λίγα λεπτά την ημέρα" },
      {
        name: "description",
        content:
          "Γνώρισε τον Ιησού σε 30 ημέρες, 7 ημέρες ελπίδας, προσευχής ή ειρήνης. Μικρά καθημερινά κείμενα με ρυθμό που αντέχεις.",
      },
      { property: "og:title", content: "Προγράμματα ανάγνωσης" },
      { property: "og:description", content: "Ένα μικρό κείμενο κάθε μέρα. Χωρίς πίεση." },
    ],
  }),
  component: PlansPage,
});

function PlansPage() {
  const { data } = useLibrary();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
      <h1 className="font-serif text-3xl font-semibold md:text-4xl">Προγράμματα ανάγνωσης</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Λίγα λεπτά την ημέρα. Αν χάσεις μια μέρα, δεν χάλασε τίποτα — συνεχίζεις από εκεί που είσαι.
      </p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {PLANS.map((plan) => {
          const done = data.plans.find((p) => p.planId === plan.id)?.completedDays.length ?? 0;
          const pct = Math.round((done / plan.days.length) * 100);
          return (
            <li key={plan.id}>
              <Link
                to="/programmata/$plan"
                params={{ plan: plan.id }}
                className="surface-card flex h-full flex-col p-5 transition-transform hover:-translate-y-0.5"
              >
                <h2 className="font-serif text-lg font-semibold">{plan.title}</h2>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {plan.subtitle}
                </p>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {done > 0 ? `Ημέρα ${Math.min(done + 1, plan.days.length)} / ` : ""}
                      {plan.days.length} ημέρες
                    </span>
                    <span>{pct}%</span>
                  </div>
                  <div
                    className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted"
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Πρόοδος: ${plan.title}`}
                  >
                    <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
