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

type BotpressApi = {
  init?: (config: unknown) => void;
  open?: () => void;
  close?: () => void;
  toggle?: () => void;
  sendMessage?: (text: string) => void;
  sendEvent?: (payload: Record<string, unknown>) => void;
  updateUser?: (payload: Record<string, unknown>) => void;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
};

declare global {
  interface Window {
    botpress?: BotpressApi;
  }
}

let status: BotpressStatus = "idle";
const listeners = new Set<(s: BotpressStatus) => void>();
let readyResolvers: Array<() => void> = [];

function setStatus(next: BotpressStatus) {
  status = next;
  listeners.forEach((l) => l(next));
  if (next === "ready") {
    readyResolvers.forEach((r) => r());
    readyResolvers = [];
  }
}

export function getBotpressStatus() {
  return status;
}

export function subscribeBotpressStatus(listener: (s: BotpressStatus) => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Resolves when the webchat is ready, rejects if it failed / timed out. */
export function whenBotpressReady(timeoutMs = 12_000) {
  if (status === "ready") return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("botpress-timeout")), timeoutMs);
    readyResolvers.push(() => {
      clearTimeout(t);
      resolve();
    });
  });
}

const SCRIPT_ID = "botpress-inject";

/** Loads inject.js + initialises the webchat once. Safe to call repeatedly. */
export function loadBotpress({ retry = false } = {}) {
  if (typeof window === "undefined") return;
  if (!retry && (status === "loading" || status === "ready")) return;
  if (retry) {
    document.getElementById(SCRIPT_ID)?.remove();
  }

  setStatus("loading");

  const init = () => {
    try {
      window.botpress?.init?.(BOTPRESS_INIT_CONFIG);
      window.botpress?.on?.("webchat:ready", () => setStatus("ready"));
      // Fallback: some versions are usable right after init.
      setTimeout(() => {
        if (status === "loading" && window.botpress?.open) setStatus("ready");
      }, 1500);
    } catch {
      setStatus("error");
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
  script.addEventListener("error", () => setStatus("error"));
  document.head.appendChild(script);

  // Hard timeout so the UI never waits forever.
  setTimeout(() => {
    if (status === "loading") setStatus("error");
  }, 12_000);
}
