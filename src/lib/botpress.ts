/**
 * Botpress Webchat loader + Greek configuration (frontend only).
 *
 * The webchat is injected once per browser session from this module (never from
 * a React component body), so remounts can't create duplicate widgets. All
 * user-facing strings are natural, modern Greek.
 */

export const BOTPRESS_INJECT_SRC = "https://cdn.botpress.cloud/webchat/v5.0/inject.js";

const BOT_ID = "6f96bbc3-6e6f-4bcb-ba72-d8b4d0616868";
const CLIENT_ID = "794bea02-8860-4b58-833a-e094906ba944";

/** Greek welcome + conversation starters, replacing the English defaults. */
export const BOTPRESS_INIT_CONFIG = {
  botId: BOT_ID,
  clientId: CLIENT_ID,
  configuration: {
    version: "v2",
    botName: "Βοηθός",
    botDescription: "Ρώτησε ό,τι θέλεις για τη Βίβλο και τον Χριστό.",
    website: {},
    email: {},
    phone: {},
    termsOfService: {},
    privacyPolicy: {},
    feedbackEnabled: true,
    footer: "[⚡ by Botpress](https://botpress.com/?from=webchat)",
    allowFileUpload: false,
    soundEnabled: false,
    conversationHistory: true,
    homePageEnabled: true,
    language: "el",
    locale: "el",
    welcomeHeading: "Γεια σου! Χαίρομαι που είσαι εδώ.",
    welcomeSubtitle:
      "Ρώτησε ό,τι θέλεις για τη Βίβλο, τον Ιησού ή τη ζωή σου. Δεν χρειάζεται να ξέρεις τίποτα από πριν.",
    composerPlaceholder: "Γράψε την ερώτησή σου…",
    conversationStartersEnabled: true,
    conversationStartersDisplayStyle: "cards",
    conversationStarters: [
      {
        id: "study_verse",
        title: "Εξήγησέ μου ένα εδάφιο",
        text: "Θέλω να καταλάβω τι σημαίνει ένα εδάφιο.",
        icon: "book-open",
        enabled: true,
      },
      {
        id: "who_is_jesus",
        title: "Ποιος είναι ο Ιησούς;",
        text: "Ποιος είναι ο Ιησούς και γιατί έχει σημασία σήμερα;",
        icon: "sparkles",
        enabled: true,
      },
      {
        id: "where_to_start",
        title: "Δεν ξέρω από πού να ξεκινήσω",
        text: "Είμαι νέος/α στη Βίβλο. Από πού να ξεκινήσω;",
        icon: "compass",
        enabled: true,
      },
      {
        id: "prayer_guidance",
        title: "Πώς να προσευχηθώ;",
        text: "Θέλω να προσευχηθώ αλλά δεν ξέρω τι να πω.",
        icon: "heart",
        enabled: true,
      },
      {
        id: "hard_times",
        title: "Περνάω δύσκολα",
        text: "Περνάω δύσκολα. Τι λέει η Βίβλος για αυτό που νιώθω;",
        icon: "message-circle",
        enabled: true,
      },
    ],
    citationsEnabled: true,
    agentPresenceEnabled: true,
  },
} as const;

export type BotpressStatus = "idle" | "loading" | "ready" | "error";
export type BotpressErrorKind = "network" | "blocked" | "timeout" | "init" | null;

type BotpressApi = {
  init?: (config: unknown) => void;
  open?: () => void;
  close?: () => void;
  toggle?: () => void;
  sendMessage?: (text: string) => void;
  sendEvent?: (payload: Record<string, unknown>) => void;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
};

declare global {
  interface Window {
    botpress?: BotpressApi;
  }
}

/** Fallback timeout (ms). Configurable at runtime + persisted per device. */
const TIMEOUT_KEY = "greek-bible/bp-timeout";
export const DEFAULT_BOTPRESS_TIMEOUT = 12_000;
let timeoutMs = DEFAULT_BOTPRESS_TIMEOUT;

export function getBotpressTimeout() {
  if (typeof window !== "undefined") {
    const stored = Number(window.localStorage.getItem(TIMEOUT_KEY));
    if (Number.isFinite(stored) && stored >= 3000) timeoutMs = stored;
  }
  return timeoutMs;
}

export function setBotpressTimeout(ms: number) {
  timeoutMs = Math.min(60_000, Math.max(3_000, Math.round(ms)));
  try {
    window.localStorage.setItem(TIMEOUT_KEY, String(timeoutMs));
  } catch {
    /* storage unavailable */
  }
  return timeoutMs;
}

let status: BotpressStatus = "idle";
let errorKind: BotpressErrorKind = null;
const listeners = new Set<(s: BotpressStatus, e: BotpressErrorKind) => void>();
let readyResolvers: Array<() => void> = [];
let failResolvers: Array<(kind: BotpressErrorKind) => void> = [];

function setStatus(next: BotpressStatus, kind: BotpressErrorKind = null) {
  status = next;
  errorKind = next === "error" ? (kind ?? "network") : null;
  listeners.forEach((l) => l(status, errorKind));
  if (next === "ready") {
    readyResolvers.forEach((r) => r());
    readyResolvers = [];
    failResolvers = [];
  }
  if (next === "error") {
    failResolvers.forEach((r) => r(errorKind));
    failResolvers = [];
    readyResolvers = [];
  }
}

export function getBotpressStatus() {
  return status;
}

export function getBotpressError() {
  return errorKind;
}

export function subscribeBotpressStatus(
  listener: (s: BotpressStatus, e: BotpressErrorKind) => void,
) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Human-readable Greek message for each failure mode. */
export function botpressErrorMessage(kind: BotpressErrorKind) {
  switch (kind) {
    case "blocked":
      return "Ο Βοηθός μπλοκάρεται από τον browser ή κάποιο ad blocker. Δοκίμασε να απενεργοποιήσεις την αποκλειστική λειτουργία για αυτή τη σελίδα.";
    case "timeout":
      return "Ο Βοηθός αργεί πολύ να φορτώσει. Μπορεί να είναι αργή σύνδεση — δοκίμασε ξανά.";
    case "init":
      return "Ο Βοηθός φόρτωσε αλλά δεν ξεκίνησε σωστά. Μια ανανέωση συνήθως το λύνει.";
    default:
      return "Δεν υπάρχει σύνδεση με τον Βοηθό. Έλεγξε το internet και δοκίμασε ξανά.";
  }
}

/** Resolves when the webchat is ready; rejects with the error kind on failure. */
export function whenBotpressReady(ms = getBotpressTimeout()) {
  if (status === "ready") return Promise.resolve();
  if (status === "error") return Promise.reject(new Error(errorKind ?? "network"));
  return new Promise<void>((resolve, reject) => {
    const t = setTimeout(() => {
      setStatus("error", "timeout");
      reject(new Error("timeout"));
    }, ms);
    readyResolvers.push(() => {
      clearTimeout(t);
      resolve();
    });
    failResolvers.push((kind) => {
      clearTimeout(t);
      reject(new Error(kind ?? "network"));
    });
  });
}

const SCRIPT_ID = "botpress-inject";

/** Loads inject.js + initialises the webchat once. Safe to call repeatedly. */
export function loadBotpress({ retry = false } = {}) {
  if (typeof window === "undefined") return;
  if (!retry && (status === "loading" || status === "ready")) return;
  if (retry) document.getElementById(SCRIPT_ID)?.remove();

  const ms = getBotpressTimeout();
  setStatus("loading");

  const init = () => {
    if (!window.botpress?.init) {
      // Script tag reported load but nothing was registered → blocked/rewritten.
      setStatus("error", "blocked");
      return;
    }
    try {
      window.botpress.init(BOTPRESS_INIT_CONFIG);
      window.botpress.on?.("webchat:ready", () => setStatus("ready"));
      setTimeout(() => {
        if (status === "loading" && window.botpress?.open) setStatus("ready");
      }, 1500);
    } catch {
      setStatus("error", "init");
    }
  };

  if (!retry && window.botpress?.init) {
    init();
    return;
  }

  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.src = BOTPRESS_INJECT_SRC;
  script.defer = true;
  script.addEventListener("load", init);
  script.addEventListener("error", () => setStatus("error", "blocked"));
  document.head.appendChild(script);

  setTimeout(() => {
    if (status === "loading") setStatus("error", navigator.onLine ? "timeout" : "network");
  }, ms);
}

/**
 * Minimised verse-context payload.
 *
 * Only what the bot needs to answer: the reference, a trimmed verse snippet,
 * the requested reply style and the language. No URLs, no ids, no reading
 * history, no device or user data.
 */
export function minimalVerseContext(input: {
  reference?: string | undefined;
  text?: string | undefined;
  style?: string | undefined;
}) {
  const payload: Record<string, string> = { type: "verse-context", language: "el" };
  if (input.reference) payload['reference'] = input.reference.slice(0, 80);
  if (input.text) {
    const t = input.text.replace(/\s+/g, " ").trim();
    payload['verse'] = t.length > 300 ? `${t.slice(0, 300)}…` : t;
  }
  if (input.style) payload['style'] = input.style;
  return payload;
}
