import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, Clock } from "lucide-react";
import { useEffect, useState } from "react";

import { PassageBlock } from "@/components/bible/PassageBlock";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/data/content";
import { useLibrary } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/programmata/$plan")({
  loader: ({ params }) => {
    const plan = PLANS.find((p) => p.id === params.plan);
    if (!plan) throw notFound();
    return { plan };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Δεν βρέθηκε" }, { name: "robots", content: "noindex" }] };
    }
    const { plan } = loaderData;
    return {
      meta: [
        { title: `${plan.title} — Πρόγραμμα ανάγνωσης` },
        { name: "description", content: plan.subtitle },
        { property: "og:title", content: `${plan.title} — Πρόγραμμα ανάγνωσης` },
        { property: "og:description", content: plan.subtitle },
      ],
    };
  },
  component: PlanPage,
});

function PlanPage() {
  const { plan } = Route.useLoaderData();
  const { data, togglePlanDay } = useLibrary();
  const progress = data.plans.find((p) => p.planId === plan.id);
  const completed = progress?.completedDays ?? [];
  const nextDay = plan.days.find((d) => !completed.includes(d.day)) ?? plan.days[0];
  const [activeDay, setActiveDay] = useState(nextDay.day);

  useEffect(() => {
    setActiveDay(nextDay.day);
  }, [nextDay.day]);

  const day = plan.days.find((d) => d.day === activeDay) ?? plan.days[0];
  const pct = Math.round((completed.length / plan.days.length) * 100);
  const isDone = completed.includes(day.day);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <Link to="/programmata" className="text-sm text-muted-foreground hover:text-foreground">
        ← Όλα τα προγράμματα
      </Link>
      <h1 className="mt-4 font-serif text-3xl font-semibold md:text-4xl">{plan.title}</h1>
      <p className="mt-2 text-muted-foreground">{plan.subtitle}</p>

      <div className="mt-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Ημέρα {day.day} / {plan.days.length}
          </span>
          <span>{pct}% ολοκληρωμένο</span>
        </div>
        <div
          className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Πρόοδος προγράμματος"
        >
          <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-1.5" role="tablist" aria-label="Ημέρες">
        {plan.days.map((d) => (
          <button
            key={d.day}
            type="button"
            role="tab"
            aria-selected={d.day === day.day}
            onClick={() => setActiveDay(d.day)}
            className={cn(
              "size-9 rounded-full border border-border text-xs font-semibold transition-colors",
              completed.includes(d.day) && "bg-accent text-accent-foreground",
              d.day === day.day && "bg-primary text-primary-foreground",
            )}
          >
            {d.day}
          </button>
        ))}
      </div>

      <section className="mt-8">
        <h2 className="font-serif text-2xl font-semibold">{day.title}</h2>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="size-4" aria-hidden /> {day.minutes} λεπτά
        </p>

        <div className="mt-5 space-y-4">
          {day.passages.map((ref) => (
            <PassageBlock
              key={`${ref.book}-${ref.chapter}-${ref.from ?? 0}`}
              passage={ref}
            />
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button
            className="rounded-full"
            variant={isDone ? "outline" : "default"}
            onClick={() => togglePlanDay(plan.id, day.day)}
          >
            {isDone ? (
              <>
                <Check className="mr-1.5 size-4" aria-hidden /> Ολοκληρωμένη
              </>
            ) : (
              "Ολοκλήρωσα τη σημερινή ανάγνωση"
            )}
          </Button>
          {day.day < plan.days.length && (
            <Button
              variant="ghost"
              className="rounded-full"
              onClick={() => setActiveDay(day.day + 1)}
            >
              Επόμενη ημέρα →
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
