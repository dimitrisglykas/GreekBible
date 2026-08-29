import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { AskAssistantButton } from "@/components/assistant/AssistantProvider";
import { PassageBlock } from "@/components/bible/PassageBlock";
import { JESUS_SECTIONS } from "@/data/content";

export const Route = createFileRoute("/iisous/$section")({
  loader: ({ params }) => {
    const index = JESUS_SECTIONS.findIndex((s) => s.slug === params.section);
    if (index === -1) throw notFound();
    return { section: JESUS_SECTIONS[index], next: JESUS_SECTIONS[index + 1] ?? null };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Δεν βρέθηκε" }, { name: "robots", content: "noindex" }] };
    }
    const { section } = loaderData;
    return {
      meta: [
        { title: `${section.title} — Γνώρισε τον Ιησού` },
        { name: "description", content: section.question },
        { property: "og:title", content: `${section.title} — Γνώρισε τον Ιησού` },
        { property: "og:description", content: section.question },
      ],
    };
  },
  component: JesusSection,
});

function JesusSection() {
  const { section, next } = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <Link to="/iisous" className="text-sm text-muted-foreground hover:text-foreground">
        ← Γνώρισε τον Ιησού
      </Link>
      <h1 className="mt-4 font-serif text-3xl font-semibold md:text-4xl">{section.title}</h1>
      <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{section.question}</p>
      {section.body.map((para) => (
        <p key={para} className="mt-4 leading-relaxed">
          {para}
        </p>
      ))}

      <h2 className="mt-10 font-serif text-xl font-semibold">Διάβασέ το ο ίδιος</h2>
      <div className="mt-4 space-y-4">
        {section.passages.map((ref) => (
          <PassageBlock
            key={`${ref.book}-${ref.chapter}-${ref.from ?? 0}`}
            passage={ref}
          />
        ))}
      </div>

      <div className="surface-card mt-10 flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
        <AskAssistantButton
          reference={section.title}
          label="Ρώτα τον Βοηθό"
          className="rounded-full"
        />
        {next && (
          <Link
            to="/iisous/$section"
            params={{ section: next.slug }}
            className="text-sm font-semibold text-primary"
          >
            Επόμενο: {next.title} →
          </Link>
        )}
      </div>
    </div>
  );
}
