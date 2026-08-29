import { MessageCircle, RefreshCw, Sparkle, X } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { REPLY_STYLES, buildFriendlyQuestion, styleInstruction, type ReplyStyle } from "@/lib/assistant-question";
import {
  botpressErrorMessage,
  getBotpressError,
  getBotpressStatus,
  getBotpressTimeout,
  loadBotpress,
  minimalVerseContext,
  setBotpressTimeout,
  subscribeBotpressStatus,
  whenBotpressReady,
  type BotpressErrorKind,
  type BotpressStatus,
} from "@/lib/botpress";
import { useLibrary } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Botpress AI companion — frontend integration only.
 *
 * The webchat script is injected once from `@/lib/botpress` (module scope, not a
 * component body), so remounts can never create a duplicate widget. Botpress
 * renders its own launcher; this provider only hands over a minimised verse
 * context + reply style, remembers the last 5 conversations locally, and shows
 * an accessible fallback if the webchat fails to load.
 */

export interface AssistantContextPayload {
  /** e.g. "Κατά Ιωάννην 3:16" */
  reference?: string | undefined;
  /** the verse text itself */
  text?: string | undefined;
  /** a ready-made question */
  suggestion?: string | undefined;
  /** optional theme, e.g. "Ελπίδα" */
  topic?: string | undefined;
  /** reply tone; falls back to the saved preference */
  style?: ReplyStyle | undefined;
}

interface AssistantApi {
  open: (ctx?: AssistantContextPayload) => void;
  /** opens the "build my question" composer for the given context */
  compose: (ctx?: AssistantContextPayload) => void;
  close: () => void;
  status: BotpressStatus;
  error: BotpressErrorKind;
  retry: () => void;
  context: AssistantContextPayload | null;
}

const AssistantCtx = createContext<AssistantApi>({
  open: () => {},
  compose: () => {},
  close: () => {},
  status: "idle",
  error: null,
  retry: () => {},
  context: null,
});

export const useAssistant = () => useContext(AssistantCtx);

export function AssistantProvider({ children }: { children: ReactNode }) {
  const { data, saveConversation, setReplyStyle } = useLibrary();
  const [status, setStatus] = useState<BotpressStatus>("idle");
  const [error, setError] = useState<BotpressErrorKind>(null);
  const [context, setContext] = useState<AssistantContextPayload | null>(null);
  const [composer, setComposer] = useState<AssistantContextPayload | null>(null);
  const [showFallback, setShowFallback] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const attemptedRef = useRef(false);

  useEffect(() => {
    setStatus(getBotpressStatus());
    setError(getBotpressError());
    const unsub = subscribeBotpressStatus((s, e) => {
      setStatus(s);
      setError(e);
    });
    loadBotpress();
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    if (status === "error" && attemptedRef.current) setShowFallback(true);
    if (status === "ready") setShowFallback(false);
  }, [status]);

  const open = useCallback(
    (ctx?: AssistantContextPayload) => {
      attemptedRef.current = true;
      setContext(ctx ?? null);
      setComposer(null);
      const style: ReplyStyle = ctx?.style ?? data.replyStyle ?? "calm";
      const question =
        ctx?.suggestion ??
        (ctx?.reference || ctx?.topic
          ? buildFriendlyQuestion({
              ...(ctx?.reference ? { reference: ctx.reference } : {}),
              ...(ctx?.text ? { text: ctx.text } : {}),
              ...(ctx?.topic ? { topic: ctx.topic } : {}),
              style,
            })
          : undefined);

      if (getBotpressStatus() === "error") {
        setShowFallback(true);
        setAnnouncement("Ο Βοηθός δεν φόρτωσε. Δοκίμασε ξανά.");
        return;
      }
      setAnnouncement(
        ctx?.reference ? `Ανοίγει ο Βοηθός με το εδάφιο ${ctx.reference}.` : "Ανοίγει ο Βοηθός.",
      );
      loadBotpress();

      whenBotpressReady()
        .then(() => {
          const bp = window.botpress;
          try {
            bp?.sendEvent?.(
              minimalVerseContext({
                reference: ctx?.reference,
                text: ctx?.text,
                style,
              }),
            );
          } catch {
            /* context handoff is best-effort */
          }
          bp?.open?.();
          setTimeout(() => {
            const host = document.querySelector<HTMLElement>(
              "#bp-web-widget, #webchat, [class*='bpWebchat'], [id^='bp-']",
            );
            host?.setAttribute("tabindex", "-1");
            host?.focus?.();
          }, 400);
          if (question) {
            setTimeout(() => {
              try {
                window.botpress?.sendMessage?.(question);
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

      if (question) {
        saveConversation({
          title: ctx?.reference ?? ctx?.topic ?? "Ελεύθερη συζήτηση",
          question,
          style,
        });
      }
    },
    [data.replyStyle, saveConversation],
  );

  const compose = useCallback((ctx?: AssistantContextPayload) => {
    setComposer(ctx ?? {});
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const api = useMemo(
    () => ({ open, compose, close, status, error, retry, context }),
    [open, compose, close, status, error, retry, context],
  );

  return (
    <AssistantCtx.Provider value={api}>
      {children}
      <p aria-live="polite" role="status" className="sr-only">
        {announcement}
      </p>
      {composer ? (
        <QuestionComposer
          seed={composer}
          defaultStyle={data.replyStyle ?? "calm"}
          onStyleChange={setReplyStyle}
          onClose={() => setComposer(null)}
          onSend={(question, style) => {
            setComposer(null);
            open({ ...composer, suggestion: question, style });
          }}
        />
      ) : null}
      {showFallback ? (
        <AssistantFallback
          context={context}
          errorKind={error}
          onRetry={retry}
          onDismiss={() => setShowFallback(false)}
        />
      ) : null}
    </AssistantCtx.Provider>
  );
}

/** "Χτίσε την ερώτησή μου" — pre-fills a friendly question before opening Botpress. */
function QuestionComposer({
  seed,
  defaultStyle,
  onStyleChange,
  onSend,
  onClose,
}: {
  seed: AssistantContextPayload;
  defaultStyle: ReplyStyle;
  onStyleChange: (s: ReplyStyle) => void;
  onSend: (question: string, style: ReplyStyle) => void;
  onClose: () => void;
}) {
  const [style, setStyle] = useState<ReplyStyle>(defaultStyle);
  const [question, setQuestion] = useState(() =>
    buildFriendlyQuestion({
      ...(seed.reference ? { reference: seed.reference } : {}),
      ...(seed.text ? { text: seed.text } : {}),
      ...(seed.topic ? { topic: seed.topic } : {}),
      style: defaultStyle,
    }),
  );
  const areaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    areaRef.current?.focus();
  }, []);

  const applyStyle = (next: ReplyStyle) => {
    setStyle(next);
    onStyleChange(next);
    setQuestion((prev) => {
      const withoutInstruction = REPLY_STYLES.reduce(
        (acc, s) => acc.replace(styleInstruction(s.value), "").trimEnd(),
        prev,
      );
      return `${withoutInstruction}\n${styleInstruction(next)}`;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Κλείσιμο"
        className="absolute inset-0 bg-foreground/25 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="question-composer-title"
        className="relative w-full max-w-md rounded-t-3xl bg-card p-4 shadow-lifted animate-rise sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="question-composer-title" className="font-serif text-lg font-semibold">
              Η ερώτησή σου
            </h2>
            <p className="text-xs text-muted-foreground">
              {seed.reference ?? seed.topic ?? "Ρώτησε ό,τι θέλεις"} — άλλαξέ την όπως σου ταιριάζει.
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Κλείσιμο">
            <X className="size-4" aria-hidden />
          </Button>
        </div>

        <Textarea
          ref={areaRef}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={6}
          aria-label="Η ερώτησή σου προς τον Βοηθό"
          className="mt-3"
        />

        <fieldset className="mt-3">
          <legend className="text-xs font-semibold text-muted-foreground">Ύφος απάντησης</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {REPLY_STYLES.map((s) => (
              <button
                key={s.value}
                type="button"
                aria-pressed={style === s.value}
                title={s.hint}
                onClick={() => applyStyle(s.value)}
                className={cn(
                  "rounded-full border border-border px-3 py-1.5 text-sm",
                  style === s.value ? "bg-primary text-primary-foreground" : "bg-background",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button className="rounded-full" onClick={() => onSend(question.trim(), style)}>
            <MessageCircle className="mr-2 size-4" aria-hidden />
            Άνοιξε τον Βοηθό
          </Button>
          <Button variant="outline" className="rounded-full" onClick={onClose}>
            Άκυρο
          </Button>
        </div>
      </div>
    </div>
  );
}

function AssistantFallback({
  context,
  errorKind,
  onRetry,
  onDismiss,
}: {
  context: AssistantContextPayload | null;
  errorKind: BotpressErrorKind;
  onRetry: () => void;
  onDismiss: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [timeout, setTimeoutValue] = useState(() => Math.round(getBotpressTimeout() / 1000));
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
      <p className="mt-1 text-sm text-muted-foreground">{botpressErrorMessage(errorKind)}</p>
      {context?.reference ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Η ερώτησή σου αφορούσε: <span className="font-medium">{context.reference}</span>
        </p>
      ) : null}
      <label className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        Χρόνος αναμονής
        <input
          type="number"
          min={3}
          max={60}
          value={timeout}
          onChange={(e) => {
            const v = Number(e.target.value);
            setTimeoutValue(v);
            if (Number.isFinite(v)) setBotpressTimeout(v * 1000);
          }}
          className="w-16 rounded-lg border border-border bg-background px-2 py-1 text-foreground"
        />
        δευτ.
      </label>
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
  topic,
  label = "Ρώτησε τον Βοηθό",
  className,
}: {
  reference?: string | undefined;
  text?: string | undefined;
  topic?: string | undefined;
  label?: string;
  className?: string;
}) {
  const { open } = useAssistant();
  return (
    <Button
      variant="outline"
      className={cn("rounded-full", className)}
      onClick={() => open({ reference, text, topic })}
    >
      <MessageCircle className="mr-2 size-4" aria-hidden />
      {label}
    </Button>
  );
}

/** "Χτίσε την ερώτησή μου" — opens the composer instead of the raw webchat. */
export function BuildQuestionButton({
  reference,
  text,
  topic,
  className,
  variant = "secondary",
}: {
  reference?: string | undefined;
  text?: string | undefined;
  topic?: string | undefined;
  className?: string;
  variant?: "secondary" | "outline" | "ghost";
}) {
  const { compose } = useAssistant();
  return (
    <Button
      variant={variant}
      className={cn("rounded-full", className)}
      onClick={() => compose({ reference, text, topic })}
    >
      <Sparkle className="mr-2 size-4" aria-hidden />
      Χτίσε την ερώτησή μου
    </Button>
  );
}
