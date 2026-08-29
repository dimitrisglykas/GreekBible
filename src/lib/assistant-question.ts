/**
 * Friendly-question builder + reply styles for the assistant.
 *
 * Keeps question phrasing out of UI components so every entry point (reader,
 * verse sheet, topics, profile) asks in the same warm, non-pushy Greek voice.
 */

export type ReplyStyle = "calm" | "short" | "deep";

export const REPLY_STYLES: { value: ReplyStyle; label: string; hint: string }[] = [
  { value: "calm", label: "Ήρεμο", hint: "Ζεστά και απλά, σαν συζήτηση" },
  { value: "short", label: "Σύντομο", hint: "Λίγες γραμμές, στο ψαχνό" },
  { value: "deep", label: "Πιο αναλυτικό", hint: "Συμφραζόμενα και βάθος" },
];

const STYLE_INSTRUCTION: Record<ReplyStyle, string> = {
  calm: "Απάντησε ήρεμα και απλά, χωρίς δογματισμό.",
  short: "Απάντησε σύντομα, σε 2-3 γραμμές.",
  deep: "Απάντησε πιο αναλυτικά, με τα συμφραζόμενα του κειμένου.",
};

export const styleInstruction = (style: ReplyStyle) => STYLE_INSTRUCTION[style];

export interface QuestionSeed {
  /** e.g. "Κατά Ιωάννην 3:16" */
  reference?: string | undefined;
  /** the verse text */
  text?: string | undefined;
  /** optional theme, e.g. "Άγχος" */
  topic?: string | undefined;
  style?: ReplyStyle;
}

const OPENERS = [
  "Τι σημαίνει αυτό στην πράξη;",
  "Τι θέλει να μου πει εδώ;",
  "Πώς συνδέεται αυτό με τη ζωή μου σήμερα;",
];

/** Builds a warm, natural-Greek question from the current verse/context. */
export function buildFriendlyQuestion(seed: QuestionSeed): string {
  const style = seed.style ?? "calm";
  const lines: string[] = [];

  if (seed.reference) {
    lines.push(`Διαβάζω το ${seed.reference} και θέλω να το καταλάβω καλύτερα.`);
  } else if (seed.topic) {
    lines.push(`Σκέφτομαι το θέμα «${seed.topic}» και θέλω να δω τι λέει η Βίβλος.`);
  } else {
    lines.push("Θέλω να καταλάβω κάτι από τη Βίβλο.");
  }

  if (seed.text) {
    const snippet = seed.text.length > 220 ? `${seed.text.slice(0, 220).trimEnd()}…` : seed.text;
    lines.push(`«${snippet}»`);
  }

  const opener =
    OPENERS[
      (seed.reference ?? seed.topic ?? "").length % OPENERS.length
    ] ?? OPENERS[0]!;
  lines.push(opener);
  lines.push(styleInstruction(style));

  return lines.join("\n");
}
