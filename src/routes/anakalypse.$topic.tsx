import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { AskAssistantButton } from "@/components/assistant/AssistantProvider";
import { PassageBlock } from "@/components/bible/PassageBlock";
import { TOPICS } from "@/data/content";

export const Route = createFileRoute("/anakalypse/$topic")({
  loader: ({ params }) => {
    const topic = TOPICS.find((t) => t.slug === params.topic);
    if (!topic) throw notFound();
    return { topic };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Δεν βρέθηκε" }, { name: "robots", content: "noindex" }] };
    }
    const { topic } = loaderData;
    return {
      meta: [
        { title: `${topic.title} — Τι λέει η Βίβλος` },
        { name: "description", content: topic.intro },
        { property: "og:title", content: `${topic.title} — Τι λέει η Βίβλος` },
        { property: "og:description", content: topic.intro },
      ],
    };
  },
  component: TopicPage,
});

function TopicPage() {
  const { topic } = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <Link to="/anakalypse" className="text-sm text-muted-foreground hover:text-foreground">
        ← Όλα τα θέματα
      </Link>
      <h1 className="mt-4 font-serif text-3xl font-semibold md:text-4xl">
        <span className="mr-2" aria-hidden>
          {topic.emoji}
        </span>
        {topic.title}
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{topic.intro}</p>

      <div className="mt-8 space-y-4">
        {topic.passages.map((ref) => (
          <PassageBlock key={ref} passage={ref} />
        ))}
      </div>

      <div className="surface-card mt-10 flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Έχεις ερώτηση για κάτι από αυτά; Ρώτα ελεύθερα.
        </p>
        <AskAssistantButton
          reference={topic.title}
          label="Ρώτα τον Βοηθό"
          className="rounded-full"
        />
      </div>
    </div>
  );
}
