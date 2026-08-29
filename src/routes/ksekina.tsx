import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { AskAssistantButton } from "@/components/assistant/AssistantProvider";
import { PassageBlock } from "@/components/bible/PassageBlock";
import { Button } from "@/components/ui/button";
import { PLANS, START_OPTIONS, TOPICS } from "@/data/content";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ksekina")({
  head: () => ({
    meta: [
      { title: "Δεν ξέρεις από πού να ξεκινήσεις; — Ελληνική Βίβλος" },
      {
        name: "description",
        content:
          "Απάντησε σε μία ερώτηση και βρες τι αξίζει να διαβάσεις πρώτο, ανάλογα με αυτό που ψάχνεις σήμερα.",
      },
      { property: "og:title", content: "Δεν ξέρεις από πού να ξεκινήσεις;" },
      { property: "og:description", content: "Κανένα πρόβλημα. Ξεκινάμε μαζί, με ένα μικρό βήμα." },
    ],
  }),
  component: StartPage,
});

function StartPage() {
  const [choice, setChoice] = useState<(typeof START_OPTIONS)[number] | null>(null);
  const plan = choice?.planId ? PLANS.find((p) => p.id === choice.planId) : undefined;
  const topic = choice?.topicSlug ? TOPICS.find((t) => t.slug === choice.topicSlug) : undefined;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <h1 className="font-serif text-3xl font-semibold md:text-4xl">
        Δεν ξέρεις από πού να ξεκινήσεις; Κανένα πρόβλημα.
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">Τι θα ήθελες να ανακαλύψεις σήμερα;</p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {START_OPTIONS.map((o) => (
          <li key={o.id}>
            <button
              type="button"
              onClick={() => setChoice(o)}
              aria-pressed={choice?.id === o.id}
              className={cn(
                "surface-card w-full p-5 text-left transition-transform hover:-translate-y-0.5",
                choice?.id === o.id && "ring-2 ring-primary",
              )}
            >
              <span className="mr-2 text-xl" aria-hidden>
                {o.emoji}
              </span>
              <span className="font-medium">{o.label}</span>
            </button>
          </li>
        ))}
      </ul>

      {choice && (
        <section className="animate-fade mt-10" aria-live="polite">
          <h2 className="font-serif text-2xl font-semibold">{choice.resultTitle}</h2>
          <p className="mt-2 text-muted-foreground">{choice.resultText}</p>

          <div className="mt-6 space-y-4">
            {choice.passages.map((ref) => (
              <PassageBlock key={ref} passage={ref} />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {plan && (
              <Button asChild className="rounded-full">
                <Link to="/programmata/$plan" params={{ plan: plan.id }}>
                  Ξεκίνα: {plan.title}
                </Link>
              </Button>
            )}
            {topic && (
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/anakalypse/$topic" params={{ topic: topic.slug }}>
                  Περισσότερα για {topic.title.toLowerCase()}
                </Link>
              </Button>
            )}
            <AskAssistantButton
              reference={choice.label}
              label="Ρώτα τον Βοηθό"
              className="rounded-full"
            />
          </div>
        </section>
      )}
    </div>
  );
}
