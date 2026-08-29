import { MessageCircle } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Botpress AI companion — frontend integration only.
 *
 * The Botpress Webchat is loaded globally via two <script> tags in the root
 * route (inject.js + the bot configuration script). Botpress renders its own
 * floating launcher on every page, so this provider renders NO custom UI of
 * its own — it only delegates "ask about this verse" actions to the Botpress
 * webchat instance exposed on `window.botpress`.
 */

declare global {
  interface Window {
    botpress?: {
      open?: () => void;
      sendMessage?: (text: string) => void;
      sendEvent?: (payload: Record<string, unknown>) => void;
    };
  }
}

export interface AssistantContextPayload {
  /** e.g. "Κατά Ιωάννην 3:16" */
  reference?: string | undefined;
  /** the verse text itself */
  text?: string | undefined;
  /** a suggested first question */
  suggestion?: string | undefined;
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

export function AssistantProvider({ children }: { children: ReactNode }) {
  const open = useCallback((ctx?: AssistantContextPayload) => {
    const bp = window.botpress;
    try {
      if (ctx?.reference && bp?.sendEvent) {
        bp.sendEvent({
          type: "verse-context",
          reference: ctx.reference,
          verse: ctx.text ?? "",
        });
      }
      bp?.open?.();
      const question =
        ctx?.suggestion ?? (ctx?.reference ? `Τι σημαίνει το ${ctx.reference};` : undefined);
      if (question && bp?.sendMessage) {
        // Give the webchat a moment to mount its conversation UI.
        setTimeout(() => {
          try {
            window.botpress?.sendMessage?.(question);
          } catch {
            /* webchat not ready yet — the launcher is still open */
          }
        }, 600);
      }
    } catch {
      /* Botpress script not loaded yet — fail silently */
    }
  }, []);

  const close = useCallback(() => {
    try {
      (window.botpress as { close?: () => void } | undefined)?.close?.();
    } catch {
      /* noop */
    }
  }, []);

  const api = useMemo(
    () => ({ open, close, isOpen: false, context: null }),
    [open, close],
  );

  return <AssistantCtx.Provider value={api}>{children}</AssistantCtx.Provider>;
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
          suggestion: reference ? `Τι σημαίνει το ${reference};` : undefined,
        })
      }
    >
      <MessageCircle className="mr-2 size-4" aria-hidden />
      {label}
    </Button>
  );
}
