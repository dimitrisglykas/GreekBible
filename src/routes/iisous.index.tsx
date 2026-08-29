import { createFileRoute, Link } from "@tanstack/react-router";

import { JESUS_SECTIONS } from "@/data/content";

export const Route = createFileRoute("/iisous/")({
  head: () => ({
    meta: [
      { title: "Γνώρισε τον Ιησού — Ποιος είναι και γιατί έχει σημασία" },
      {
        name: "description",
        content:
          "Η ζωή Του, τα λόγια Του, οι παραβολές, τα θαύματα, ο Σταυρός και η Ανάσταση — απλά, με κείμενα από τα Ευαγγέλια.",
      },
      { property: "og:title", content: "Γνώρισε τον Ιησού" },
      {
        property: "og:description",
        content: "Ξεκίνα από την αρχή: ποιος είναι ο Ιησούς και τι είπε πραγματικά.",
      },
    ],
  }),
  component: JesusIndex,
});

function JesusIndex() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
      <h1 className="font-serif text-3xl font-semibold md:text-4xl">Γνώρισε τον Ιησού</h1>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">
        Δεν χρειάζεται να ξέρεις τίποτα από πριν. Εδώ ξεκινάμε από την αρχή, με απλά λόγια και με τα
        ίδια τα κείμενα.
      </p>

      <ol className="mt-8 space-y-3">
        {JESUS_SECTIONS.map((s, i) => (
          <li key={s.slug}>
            <Link
              to="/iisous/$section"
              params={{ section: s.slug }}
              className="surface-card flex items-start gap-4 p-5 transition-transform hover:-translate-y-0.5"
            >
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                {i + 1}
              </span>
              <span>
                <span className="block font-serif text-lg font-semibold">{s.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                  {s.summary}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
