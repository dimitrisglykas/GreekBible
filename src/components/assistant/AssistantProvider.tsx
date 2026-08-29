import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Botpress AI companion — frontend integration only.
 *
 * The conversation itself is handled by Botpress. Set the two variables below
 * in your environment to connect the real assistant:
 *
 *   VITE_BOTPRESS_CLIENT_ID   (Botpress webchat client id)
 *   VITE_BOTPRESS_WEBCHAT_URL (optional: shareable webchat URL, embedded as iframe)
 *
 * Until then the panel shows a clearly-labelled placeholder. Any verse context
 * the user came from is passed to Botpress via `webchat.sendEvent` / the iframe
 * query string, so the assistant can answer about that exact verse.
 */

export interface AssistantContextPayload {
  /** e.g. "Κατά Ιωάννην 3:16" */
  reference?: string;
  /** the verse text itself */
  text?: string;
  /** a suggested first question */
  suggestion?: string;
}

interface AssistantApi {
  open: (ctx?: AssistantContextPayload) => void;
  close: () => void;
  isOpen: boolean;
  context: AssistantContextPayload | null;
}

const AssistantCtx = createContext<AssistantApi>({
  open: () => {},
  close: () => {},
  isOpen: false,
  context: null,
});

export const useAssistant = () => useContext(AssistantCtx);

const CLIENT_ID = import.meta.env["VITE_BOTPRESS_CLIENT_ID"] as string | undefined;
const WEBCHAT_URL = import.meta.env["VITE_BOTPRESS_WEBCHAT_URL"] as string | undefined;

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [context, setContext] = useState<AssistantContextPayload | null>(null);

  const open = useCallback((ctx?: AssistantContextPayload) => {
    setContext(ctx ?? null);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  const api = useMemo(() => ({ open, close, isOpen, context }), [open, close, isOpen, context]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <AssistantCtx.Provider value={api}>
      {children}
      <AssistantLauncher />
      <AssistantPanel />
    </AssistantCtx.Provider>
  );
}

function AssistantLauncher() {
  const { open, isOpen } = useAssistant();
  if (isOpen) return null;
  return (
    <button
      type="button"
      onClick={() => open()}
      aria-label="Ρώτα τον Βοηθό"
      className="fixed right-4 bottom-20 z-40 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lifted transition-transform hover:scale-[1.03] md:right-6 md:bottom-6"
    >
      <MessageCircle className="size-5" aria-hidden />
      <span className="hidden sm:inline">Ρώτα τον Βοηθό</span>
    </button>
  );
}

function AssistantPanel() {
  const { isOpen, close, context } = useAssistant();
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) setDraft(context?.suggestion ?? "");
  }, [isOpen, context]);

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, [isOpen]);

  const iframeSrc = useMemo(() => {
    if (!WEBCHAT_URL) return null;
    const url = new URL(WEBCHAT_URL);
    if (context?.reference) url.searchParams.set("reference", context.reference);
    if (context?.text) url.searchParams.set("verse", context.text.slice(0, 400));
    return url.toString();
  }, [context]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end sm:p-6">
      <button
        type="button"
        aria-label="Κλείσιμο"
        onClick={close}
        className="absolute inset-0 bg-foreground/25 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-label="Βοηθός Βίβλου"
        className={cn(
          "relative flex h-[88vh] w-full flex-col overflow-hidden rounded-t-3xl bg-card shadow-lifted animate-rise",
          "sm:h-[620px] sm:max-w-md sm:rounded-3xl",
        )}
      >
        <header className="flex items-start gap-3 border-b border-border px-4 py-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
            <Sparkles className="size-4" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Βοηθός Βίβλου</p>
            <p className="text-xs text-muted-foreground">
              Βοηθάει να καταλάβεις τη Γραφή. Δεν μιλάει εξ ονόματος του Θεού.
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={close} aria-label="Κλείσιμο">
            <X className="size-4" />
          </Button>
        </header>

        {context?.reference && (
          <div className="mx-4 mt-3 rounded-2xl border border-border bg-muted/60 px-3 py-2">
            <p className="text-xs font-semibold text-primary">{context.reference}</p>
            {context.text && (
              <p className="scripture mt-1 line-clamp-3 text-sm text-muted-foreground">{context.text}</p>
            )}
          </div>
        )}

        {iframeSrc ? (
          <iframe
            src={iframeSrc}
            title="Βοηθός Βίβλου"
            className="min-h-0 flex-1 border-0"
            allow="microphone"
          />
        ) : (
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
            <Bubble>
              Γεια σου! Μπορείς να με ρωτήσεις οτιδήποτε για τη Βίβλο — ακόμα κι αν νομίζεις ότι είναι
              «βασική» ερώτηση.
            </Bubble>
            <Bubble>
              Ο βοηθός συνδέεται με το Botpress. Πρόσθεσε τη μεταβλητή{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">VITE_BOTPRESS_WEBCHAT_URL</code>{" "}
              {CLIENT_ID ? "(client id: βρέθηκε)" : "ή VITE_BOTPRESS_CLIENT_ID"} για να ενεργοποιηθεί η
              πραγματική συνομιλία.
            </Bubble>
            <div className="space-y-2 pt-2">
              {[
                "Τι είναι η Βίβλος;",
                "Ποιος είναι ο Ιησούς;",
                "Από πού να ξεκινήσω να διαβάζω;",
                "Πώς προσεύχομαι;",
              ].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setDraft(q)}
                  className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {!iframeSrc && (
          <form
            className="flex items-center gap-2 border-t border-border p-3"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Γράψε την ερώτησή σου…"
              aria-label="Η ερώτησή σου"
              className="h-11 min-w-0 flex-1 rounded-full border border-input bg-background px-4 text-sm outline-none"
            />
            <Button type="submit" size="icon" className="size-11 rounded-full" aria-label="Αποστολή">
              <Send className="size-4" />
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

function Bubble({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-[92%] rounded-2xl rounded-tl-sm bg-muted px-3 py-2 text-sm leading-relaxed">
      {children}
    </div>
  );
}

export function AskAssistantButton({
  reference,
  text,
  label = "Ρώτησε τον Βοηθό",
  className,
}: {
  reference?: string;
  text?: string;
  label?: string;
  className?: string;
}) {
  const { open } = useAssistant();
  return (
    <Button
      variant="outline"
      className={cn("rounded-full", className)}
      onClick={() =>
        open({
          reference,
          text,
          suggestion: reference ? `Τι σημαίνει το ${reference};` : undefined,
        })
      }
    >
      <MessageCircle className="mr-2 size-4" aria-hidden />
      {label}
    </Button>
  );
}
