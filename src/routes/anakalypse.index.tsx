import { createFileRoute, Link } from "@tanstack/react-router";

import { TOPICS } from "@/data/content";

export const Route = createFileRoute("/anakalypse/")({
  head: () => ({
    meta: [
      { title: "Ανακάλυψε — Η Βίβλος για τη ζωή σου" },
      {
        name: "description",
        content:
          "Αγάπη, άγχος, φόβος, ελπίδα, συγχώρεση: δες τι λέει η Βίβλος για αυτά που ζεις τώρα.",
      },
      { property: "og:title", content: "Η Βίβλος για τη ζωή σου" },
      {
        property: "og:description",
        content: "Διάλεξε ένα θέμα και βρες εδάφια που μιλάνε για αυτό που περνάς.",
      },
    ],
  }),
  component: DiscoverPage,
});

function DiscoverPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
      <h1 className="font-serif text-3xl font-semibold md:text-4xl">Η Βίβλος για τη ζωή σου</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Διάλεξε αυτό που σου μοιάζει πιο κοντινό σήμερα. Δεν υπάρχει σωστή ή λάθος απάντηση.
      </p>

      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {TOPICS.map((t) => (
          <li key={t.slug}>
            <Link
              to="/anakalypse/$topic"
              params={{ topic: t.slug }}
              className="surface-card flex h-full flex-col gap-2 p-5 transition-transform hover:-translate-y-0.5"
            >
              <span className="text-2xl" aria-hidden>
                {t.emoji}
              </span>
              <span className="font-serif text-base font-semibold">{t.title}</span>
              <span className="text-xs leading-relaxed text-muted-foreground">
                {t.passages.length} χωρία
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="surface-card mt-10 p-6">
        <h2 className="font-serif text-xl font-semibold">Δεν ξέρεις τι ψάχνεις;</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Απάντησε σε μία ερώτηση και θα σου προτείνουμε κάτι να διαβάσεις.
        </p>
        <Link
          to="/ksekina"
          className="mt-4 inline-flex rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Δεν ξέρω από πού να ξεκινήσω
        </Link>
      </div>
    </div>
  );
}
