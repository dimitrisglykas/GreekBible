import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Compass, MessageCircle, Sparkles } from "lucide-react";

import heroImage from "@/assets/hero-dawn.jpg";
import { AskAssistantButton, useAssistant } from "@/components/assistant/AssistantProvider";
import { ContinueReading } from "@/components/ContinueReading";
import { DailyVerseCard } from "@/components/DailyVerseCard";
import { Button } from "@/components/ui/button";
import { JESUS_SECTIONS, PLANS, TOPICS } from "@/data/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ελληνική Βίβλος — Γνώρισε τον Λόγο. Γνώρισε τον Χριστό." },
      {
        name: "description",
        content:
          "Η Αγία Γραφή στα ελληνικά, πιο κοντά σου από ποτέ. Διάβασε, αναζήτησε, ρώτησε και ανακάλυψε τι σημαίνει ο Λόγος του Θεού για τη ζωή σου σήμερα.",
      },
      { property: "og:title", content: "Γνώρισε τον Λόγο. Γνώρισε τον Χριστό." },
      {
        property: "og:description",
        content: "Διάβασε τη Βίβλο, κάνε ερωτήσεις και γνώρισε τον Ιησού — με τον δικό σου ρυθμό.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { open } = useAssistant();

  return (
    <div className="animate-fade">
      <section className="relative overflow-hidden">
        <img
          src={heroImage}
          alt="Πρωινό φως πάνω από λόφους με κλαδί ελιάς"
          width={1600}
          height={1200}
          className="absolute inset-0 size-full object-cover opacity-45 dark:opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />
        <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-14 md:px-6 md:pt-28 md:pb-20">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" aria-hidden /> Χωρίς πίεση. Χωρίς κρίση.
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl leading-[1.08] font-semibold md:text-6xl">
            Γνώρισε τον Λόγο.
            <br />
            <span className="text-primary">Γνώρισε τον Χριστό.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Η Αγία Γραφή, πιο κοντά σου από ποτέ. Διάβασε, αναζήτησε, ρώτησε και ανακάλυψε τι μπορεί να
            σημαίνει ο Λόγος του Θεού για τη ζωή σου.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/vivlos/$book/$chapter" params={{ book: "ioannis", chapter: "1" }}>
                Ξεκίνα να διαβάζεις <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full bg-card/70">
              <Link to="/ksekina">Δεν ξέρω από πού να ξεκινήσω</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-14 px-4 pb-4 md:px-6">
        <ContinueReading />

        <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <DailyVerseCard />

          <div className="space-y-6">
            <QuickCard
              to="/anazitisi"
              icon={<Compass className="size-5" />}
              title="Αναζήτησε στη Βίβλο"
              text="Γράψε μια λέξη, μια παραπομπή ή μια ερώτηση — «όταν φοβάμαι», «Ιωάννης 3:16»."
            />
            <QuickCard
              to="/iisous"
              icon={<BookOpen className="size-5" />}
              title="Γνώρισε τον Ιησού"
              text="Ποιος ήταν, τι είπε, τι έκανε και γιατί έχει σημασία σήμερα."
            />
            <div className="surface-card p-6">
              <h3 className="font-serif text-lg font-semibold">Έχεις μια ερώτηση;</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Ο Βοηθός εξηγεί απλά — ακόμα κι αν δεν έχεις διαβάσει ποτέ Βίβλο.
              </p>
              <Button className="mt-4 rounded-full" onClick={() => open()}>
                <MessageCircle className="mr-2 size-4" /> Ρώτα τον Βοηθό
              </Button>
            </div>
          </div>
        </div>

        <section>
          <SectionHeading
            title="Η Βίβλος για τη ζωή σου"
            subtitle="Διάλεξε αυτό που νιώθεις σήμερα."
            to="/anakalypse"
          />
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {TOPICS.slice(0, 8).map((t) => (
              <li key={t.slug}>
                <Link
                  to="/anakalypse/$topic"
                  params={{ topic: t.slug }}
                  className="surface-card flex h-full flex-col gap-2 p-4 transition-transform hover:-translate-y-0.5"
                >
                  <span className="text-2xl" aria-hidden>
                    {t.emoji}
                  </span>
                  <span className="font-medium">{t.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionHeading
            title="Προγράμματα ανάγνωσης"
            subtitle="Λίγα λεπτά την ημέρα, με σειρά."
            to="/programmata"
          />
          <ul className="mt-6 grid gap-3 md:grid-cols-3">
            {PLANS.slice(0, 3).map((plan) => (
              <li key={plan.id}>
                <Link
                  to="/programmata/$plan"
                  params={{ plan: plan.id }}
                  className="surface-card flex h-full flex-col p-5 transition-transform hover:-translate-y-0.5"
                >
                  <span className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                    {plan.days.length} ημέρες
                  </span>
                  <span className="mt-2 font-serif text-lg font-semibold">{plan.title}</span>
                  <span className="mt-1 text-sm text-muted-foreground">{plan.subtitle}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionHeading
            title="Γνώρισε τον Ιησού"
            subtitle="Οκτώ σύντομα βήματα, με κείμενα από τα Ευαγγέλια."
            to="/iisous"
          />
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {JESUS_SECTIONS.slice(0, 4).map((s) => (
              <li key={s.slug}>
                <Link
                  to="/iisous/$section"
                  params={{ section: s.slug }}
                  className="surface-card flex h-full flex-col p-5 transition-transform hover:-translate-y-0.5"
                >
                  <span className="font-serif text-base font-semibold">{s.title}</span>
                  <span className="mt-1 text-sm text-muted-foreground">{s.question}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="surface-card bg-dawn p-8 text-center md:p-12">
          <h2 className="mx-auto max-w-xl font-serif text-2xl leading-snug font-semibold md:text-3xl">
            Ίσως σήμερα είναι η μέρα να ανοίξεις τη Βίβλο.
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/vivlos">Ξεκίνα τώρα</Link>
            </Button>
            <AskAssistantButton className="bg-card/70" />
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionHeading({
  title,
  subtitle,
  to,
}: {
  title: string;
  subtitle: string;
  to: "/anakalypse" | "/programmata" | "/iisous";
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="font-serif text-2xl font-semibold md:text-3xl">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <Link to={to} className="shrink-0 text-sm font-medium text-primary hover:underline">
        Όλα →
      </Link>
    </div>
  );
}

function QuickCard({
  to,
  icon,
  title,
  text,
}: {
  to: "/anazitisi" | "/iisous";
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <Link to={to} className="surface-card block p-6 transition-transform hover:-translate-y-0.5">
      <span className="flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
        {icon}
      </span>
      <h3 className="mt-3 font-serif text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </Link>
  );
}
