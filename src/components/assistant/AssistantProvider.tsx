import { MessageCircle, RefreshCw, X } from "lucide-react";
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
import {
  getBotpressStatus,
  loadBotpress,
  subscribeBotpressStatus,
  whenBotpressReady,
  type BotpressStatus,
} from "@/lib/botpress";
import { cn } from "@/lib/utils";

/**
 * Botpress AI companion — frontend integration only.
 *
 * The webchat script is injected once from `@/lib/botpress` (module scope, not a
 * component body), so remounts can never create a duplicate widget. Botpress
 * renders its own launcher, so this provider adds no floating button: it only
 * hands the current verse/context over to the webchat and shows a small
 * accessible fallback card if the webchat fails to load.
 */

export interface AssistantContextPayload {
  /** e.g. "Κατά Ιωάννην 3:16" */
  reference?: string | undefined;
  /** the verse text itself */
  text?: string | undefined;
  /** a suggested first question */
  suggestion?: string | undefined;
  /** where in the app the question came from, e.g. "Ανάγνωση" */
  source?: string | undefined;
}

interface AssistantApi {
  open: (ctx?: AssistantContextPayload) => void;
  close: () => void;
  status: BotpressStatus;
  retry: () => void;
  context: AssistantContextPayload | null;
}

const AssistantCtx = createContext<AssistantApi>({
  open: () => {},
  close: () => {},
  status: "idle",
  retry: () => {},
  context: null,
});

export const useAssistant = () => useContext(AssistantCtx);

function buildContextMessage(ctx: AssistantContextPayload) {
  const parts: string[] = [];
  if (ctx.suggestion) parts.push(ctx.suggestion);
  else if (ctx.reference) parts.push(`Τι σημαίνει το εδάφιο ${ctx.reference};`);
  if (ctx.reference) parts.push(`\n\nΕδάφιο: ${ctx.reference}`);
  if (ctx.text) parts.push(`\n«${ctx.text}»`);
  return parts.join("");
}

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<BotpressStatus>("idle");
  const [context, setContext] = useState<AssistantContextPayload | null>(null);
  const [showFallback, setShowFallback] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const attemptedRef = useRef(false);

  // Load once on the client.
  useEffect(() => {
    setStatus(getBotpressStatus());
    const unsub = subscribeBotpressStatus(setStatus);
    loadBotpress();
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    if (status === "error" && attemptedRef.current) setShowFallback(true);
    if (status === "ready") setShowFallback(false);
  }, [status]);

  const open = useCallback((ctx?: AssistantContextPayload) => {
    attemptedRef.current = true;
    setContext(ctx ?? null);
    if (getBotpressStatus() === "error") {
      setShowFallback(true);
      setAnnouncement("Ο Βοηθός δεν φόρτωσε. Δοκίμασε ξανά.");
      return;
    }
    setAnnouncement(
      ctx?.reference
        ? `Ανοίγει ο Βοηθός με το εδάφιο ${ctx.reference}.`
        : "Ανοίγει ο Βοηθός.",
    );
    loadBotpress();

    whenBotpressReady()
      .then(() => {
        const bp = window.botpress;
        if (ctx?.reference || ctx?.text) {
          try {
            bp?.sendEvent?.({
              type: "verse-context",
              reference: ctx.reference ?? "",
              verse: ctx.text ?? "",
              source: ctx.source ?? "",
              url: window.location.href,
            });
            bp?.updateUser?.({
              data: {
                lastReference: ctx.reference ?? "",
                lastVerse: ctx.text ?? "",
                language: "el",
              },
            });
          } catch {
            /* context handoff is best-effort */
          }
        }
        bp?.open?.();
        // Focus the widget for keyboard / screen-reader users.
        setTimeout(() => {
          const host = document.querySelector<HTMLElement>(
            "#bp-web-widget, #webchat, [class*='bpWebchat'], [id^='bp-']",
          );
          host?.setAttribute("tabindex", "-1");
          host?.focus?.();
        }, 400);
        if (ctx?.reference || ctx?.text || ctx?.suggestion) {
          setTimeout(() => {
            try {
              window.botpress?.sendMessage?.(buildContextMessage(ctx));
            } catch {
              /* conversation UI not ready */
            }
          }, 700);
        }
      })
      .catch(() => {
        setShowFallback(true);
        setAnnouncement("Ο Βοηθός δεν φόρτωσε. Δοκίμασε ξανά.");
      });
  }, []);

  const close = useCallback(() => {
    try {
      window.botpress?.close?.();
    } catch {
      /* noop */
    }
  }, []);

  const retry = useCallback(() => {
    setShowFallback(false);
    setAnnouncement("Επαναφόρτωση του Βοηθού…");
    loadBotpress({ retry: true });
    whenBotpressReady()
      .then(() => {
        window.botpress?.open?.();
        setAnnouncement("Ο Βοηθός είναι έτοιμος.");
      })
      .catch(() => setShowFallback(true));
  }, []);

  // Escape closes the webchat, for keyboard users.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const api = useMemo(
    () => ({ open, close, status, retry, context }),
    [open, close, status, retry, context],
  );

  return (
    <AssistantCtx.Provider value={api}>
      {children}
      <p aria-live="polite" role="status" className="sr-only">
        {announcement}
      </p>
      {showFallback ? (
        <AssistantFallback context={context} onRetry={retry} onDismiss={() => setShowFallback(false)} />
      ) : null}
    </AssistantCtx.Provider>
  );
}

function AssistantFallback({
  context,
  onRetry,
  onDismiss,
}: {
  context: AssistantContextPayload | null;
  onRetry: () => void;
  onDismiss: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div
      ref={ref}
      role="alertdialog"
      aria-modal="false"
      aria-labelledby="assistant-fallback-title"
      tabIndex={-1}
      className="surface-card fixed right-4 bottom-24 z-50 w-[min(22rem,calc(100vw-2rem))] rounded-2xl p-4 shadow-lifted lg:bottom-6"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 id="assistant-fallback-title" className="text-base font-semibold">
          Ο Βοηθός δεν φόρτωσε
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="-mt-1 -mr-1 size-8 rounded-full"
          onClick={onDismiss}
          aria-label="Κλείσιμο μηνύματος"
        >
          <X className="size-4" aria-hidden />
        </Button>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Κάτι πήγε στραβά με τη σύνδεση. Μπορείς να δοκιμάσεις ξανά — ή να συνεχίσεις να διαβάζεις,
        όλα τα άλλα λειτουργούν κανονικά.
      </p>
      {context?.reference ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Η ερώτησή σου αφορούσε: <span className="font-medium">{context.reference}</span>
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <Button className="rounded-full" onClick={onRetry}>
          <RefreshCw className="mr-2 size-4" aria-hidden />
          Δοκίμασε ξανά
        </Button>
        <Button variant="outline" className="rounded-full" onClick={onDismiss}>
          Άλλη ώρα
        </Button>
      </div>
    </div>
  );
}

export function AskAssistantButton({
  reference,
  text,
  label = "Ρώτησε τον Βοηθό",
  className,
}: {
  reference?: string | undefined;
  text?: string | undefined;
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
          ...(reference ? { suggestion: `Τι σημαίνει το ${reference};` } : {}),
        })
      }
    >
      <MessageCircle className="mr-2 size-4" aria-hidden />
      {label}
    </Button>
  );
}
