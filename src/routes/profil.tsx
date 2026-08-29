import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Flame, Highlighter, MessageCircle, StickyNote, Trash2 } from "lucide-react";

import { useAssistant } from "@/components/assistant/AssistantProvider";
import { ContinueReading } from "@/components/ContinueReading";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/data/content";
import { reference } from "@/lib/bible";
import { REPLY_STYLES } from "@/lib/assistant-question";
import { computeStreak, HIGHLIGHT_COLORS, useLibrary } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profil")({
  head: () => ({
    meta: [
      { title: "Η πορεία μου — αποθηκευμένα εδάφια & πρόοδος" },
      {
        name: "description",
        content:
          "Δες τι έχεις διαβάσει, τα εδάφια που κράτησες, τις επισημάνσεις και τις σημειώσεις σου.",
      },
      { property: "og:title", content: "Η πορεία μου" },
      { property: "og:description", content: "Η ανάγνωσή σου, χωρίς πίεση και χωρίς σύγκριση." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { data, toggleBookmark, setHighlight, removeNote, removeConversation } = useLibrary();
  const { open } = useAssistant();
  const streak = computeStreak(data.readingDays);

  const stats = [
    { icon: Flame, label: "Συνεχόμενες μέρες", value: streak },
    { icon: BookOpen, label: "Κεφάλαια", value: data.chaptersRead.length },
    { icon: Highlighter, label: "Επισημάνσεις", value: data.highlights.length },
    { icon: StickyNote, label: "Σημειώσεις", value: data.notes.length },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-10 md:px-6 md:py-14">
      <header>
        <h1 className="font-serif text-3xl font-semibold md:text-4xl">Η πορεία μου</h1>
        <p className="mt-2 text-muted-foreground">
          Χωρίς σύγκριση με κανέναν. Ο ρυθμός σου είναι αρκετός.
        </p>
      </header>

      <ContinueReading />

      <section>
        <h2 className="sr-only">Στατιστικά</h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <li key={s.label} className="surface-card p-4 text-center">
              <s.icon className="mx-auto size-4 text-primary" aria-hidden />
              <p className="mt-2 font-serif text-2xl font-semibold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-serif text-xl font-semibold">Πρόσφατες συζητήσεις</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Οι 5 τελευταίες ερωτήσεις σου στον Βοηθό — μόνο στη συσκευή σου.
        </p>
        {data.conversations.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Δεν έχεις ξεκινήσει συζήτηση ακόμα.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {data.conversations.map((c) => (
              <li key={c.id} className="surface-card flex items-start gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-primary">{c.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{c.question}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Ύφος: {REPLY_STYLES.find((s) => s.value === c.style)?.label ?? "Ήρεμο"}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  <Button
                    size="sm"
                    className="rounded-full"
                    onClick={() =>
                      open({
                        reference: c.title,
                        suggestion: `Ας συνεχίσουμε τη συζήτηση για ${c.title}.\n${c.question}`,
                        style: c.style,
                      })
                    }
                  >
                    <MessageCircle className="mr-1.5 size-3.5" aria-hidden />
                    Συνέχισε
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full"
                    onClick={() => removeConversation(c.id)}
                    aria-label={`Διαγραφή συζήτησης ${c.title}`}
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-serif text-xl font-semibold">Αποθηκευμένα εδάφια</h2>
        {data.bookmarks.length ? (
          <ul className="mt-4 space-y-3">
            {data.bookmarks.map((b) => (
              <li key={b.id} className="surface-card p-5">
                <p className="text-xs font-semibold text-primary">{reference(b.bookName, b.chapter, b.verse)}</p>
                <p className="scripture mt-2">{b.text}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button asChild variant="outline" size="sm" className="rounded-full">
                    <Link
                      to="/vivlos/$book/$chapter"
                      params={{ book: b.bookId, chapter: String(b.chapter) }}
                    >
                      Άνοιξε το χωρίο
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full"
                    onClick={() => toggleBookmark(b)}
                  >
                    Αφαίρεση
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Δεν έχεις αποθηκεύσει εδάφια ακόμα. Πάτα σε ένα εδάφιο όταν διαβάζεις.
          </p>
        )}
      </section>

      <section>
        <h2 className="font-serif text-xl font-semibold">Επισημάνσεις</h2>
        {data.highlights.length ? (
          <ul className="mt-4 space-y-2">
            {data.highlights.map((h) => (
              <li key={h.id} className="surface-card p-4">
                <p className="text-xs font-semibold text-primary">{reference(h.bookName, h.chapter, h.verse)}</p>
                <p
                  className={cn(
                    "scripture mt-1.5 rounded-md px-1",
                    HIGHLIGHT_COLORS.find((c) => c.value === h.color)?.className,
                  )}
                >
                  {h.text}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 rounded-full"
                  onClick={() => setHighlight(h, null)}
                >
                  Αφαίρεση
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">Καμία επισήμανση ακόμα.</p>
        )}
      </section>

      <section>
        <h2 className="font-serif text-xl font-semibold">Σημειώσεις</h2>
        {data.notes.length ? (
          <ul className="mt-4 space-y-2">
            {data.notes.map((n) => (
              <li key={n.id} className="surface-card p-4">
                <p className="text-xs font-semibold text-primary">{reference(n.bookName, n.chapter, n.verse)}</p>
                <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-wrap">{n.body}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 rounded-full"
                  onClick={() => removeNote(n.id)}
                >
                  Διαγραφή
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">Καμία σημείωση ακόμα.</p>
        )}
      </section>

      <section>
        <h2 className="font-serif text-xl font-semibold">Προγράμματα</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {PLANS.map((plan) => {
            const done = data.plans.find((p) => p.planId === plan.id)?.completedDays.length ?? 0;
            return (
              <li key={plan.id} className="surface-card p-4">
                <p className="font-medium">{plan.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {done} / {plan.days.length} ημέρες
                </p>
                <Button asChild variant="outline" size="sm" className="mt-3 rounded-full">
                  <Link to="/programmata/$plan" params={{ plan: plan.id }}>
                    {done ? "Συνέχισε" : "Ξεκίνα"}
                  </Link>
                </Button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
