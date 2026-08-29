/**
 * Local-first user data.
 *
 * Every entity below mirrors a future database table (Bookmark, Highlight,
 * Note, UserReadingProgress, PrayerEntry, ReadingPlanProgress). Components only
 * talk to these hooks, so moving to Lovable Cloud later means re-implementing
 * `read`/`write` against the database instead of localStorage.
 */
import { useCallback, useEffect, useState } from "react";

import type { ReplyStyle } from "@/lib/assistant-question";

export interface SavedVerse {
  id: string;
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  createdAt: string;
}

export interface Highlight extends SavedVerse {
  color: HighlightColor;
}

export type HighlightColor = "gold" | "olive" | "sky" | "rose";

export interface Note extends SavedVerse {
  body: string;
}

export interface ReadingProgress {
  bookId: string;
  bookName: string;
  chapter: number;
  chapterCount: number;
  updatedAt: string;
}

export interface PrayerEntry {
  id: string;
  prompt: string | null;
  body: string;
  createdAt: string;
}

export interface PlanProgress {
  planId: string;
  completedDays: number[];
  startedAt: string;
}

/** A lightweight record of an assistant conversation (last 5 kept, local only). */
export interface AssistantConversation {
  id: string;
  /** verse reference or topic that titled the conversation */
  title: string;
  /** the question that started it (trimmed) */
  question: string;
  style: ReplyStyle;
  createdAt: string;
}

export interface UserData {
  bookmarks: SavedVerse[];
  highlights: Highlight[];
  notes: Note[];
  progress: ReadingProgress | null;
  chaptersRead: string[];
  readingDays: string[];
  prayers: PrayerEntry[];
  plans: PlanProgress[];
  conversations: AssistantConversation[];
  replyStyle: ReplyStyle;
}

const EMPTY: UserData = {
  bookmarks: [],
  highlights: [],
  notes: [],
  progress: null,
  chaptersRead: [],
  readingDays: [],
  prayers: [],
  plans: [],
  conversations: [],
  replyStyle: "calm",
};

const KEY = "greek-bible/user-v1";
const listeners = new Set<(d: UserData) => void>();
let cache: UserData | null = null;

function read(): UserData {
  if (typeof window === "undefined") return EMPTY;
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? { ...EMPTY, ...(JSON.parse(raw) as UserData) } : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(next: UserData) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable — keep in-memory */
  }
  listeners.forEach((l) => l(next));
}

export function useUserData() {
  const [data, setData] = useState<UserData>(EMPTY);

  useEffect(() => {
    setData(read());
    const listener = (d: UserData) => setData(d);
    listeners.add(listener);
    return () => listeners.delete(listener) as unknown as void;
  }, []);

  const update = useCallback((fn: (d: UserData) => UserData) => write(fn(read())), []);

  return { data, update };
}

const today = () => new Date().toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2, 10);

export function useLibrary() {
  const { data, update } = useUserData();

  const toggleBookmark = useCallback(
    (v: Omit<SavedVerse, "createdAt">) =>
      update((d) => ({
        ...d,
        bookmarks: d.bookmarks.some((b) => b.id === v.id)
          ? d.bookmarks.filter((b) => b.id !== v.id)
          : [{ ...v, createdAt: new Date().toISOString() }, ...d.bookmarks],
      })),
    [update],
  );

  const setHighlight = useCallback(
    (v: Omit<SavedVerse, "createdAt">, color: HighlightColor | null) =>
      update((d) => ({
        ...d,
        highlights: [
          ...(color ? [{ ...v, color, createdAt: new Date().toISOString() }] : []),
          ...d.highlights.filter((h) => h.id !== v.id),
        ],
      })),
    [update],
  );

  const saveNote = useCallback(
    (v: Omit<SavedVerse, "createdAt">, body: string) =>
      update((d) => ({
        ...d,
        notes: body.trim()
          ? [
              { ...v, body: body.trim(), createdAt: new Date().toISOString() },
              ...d.notes.filter((n) => n.id !== v.id),
            ]
          : d.notes.filter((n) => n.id !== v.id),
      })),
    [update],
  );

  const removeNote = useCallback(
    (id: string) => update((d) => ({ ...d, notes: d.notes.filter((n) => n.id !== id) })),
    [update],
  );

  const trackReading = useCallback(
    (p: Omit<ReadingProgress, "updatedAt">) =>
      update((d) => {
        const key = `${p.bookId}.${p.chapter}`;
        return {
          ...d,
          progress: { ...p, updatedAt: new Date().toISOString() },
          chaptersRead: d.chaptersRead.includes(key) ? d.chaptersRead : [...d.chaptersRead, key],
          readingDays: d.readingDays.includes(today()) ? d.readingDays : [...d.readingDays, today()],
        };
      }),
    [update],
  );

  const addPrayer = useCallback(
    (prompt: string | null, body: string) =>
      update((d) => ({
        ...d,
        prayers: [{ id: uid(), prompt, body: body.trim(), createdAt: new Date().toISOString() }, ...d.prayers],
      })),
    [update],
  );

  const removePrayer = useCallback(
    (id: string) => update((d) => ({ ...d, prayers: d.prayers.filter((p) => p.id !== id) })),
    [update],
  );

  const togglePlanDay = useCallback(
    (planId: string, day: number) =>
      update((d) => {
        const existing = d.plans.find((p) => p.planId === planId);
        const base: PlanProgress =
          existing ?? { planId, completedDays: [], startedAt: new Date().toISOString() };
        const completedDays = base.completedDays.includes(day)
          ? base.completedDays.filter((x) => x !== day)
          : [...base.completedDays, day].sort((a, b) => a - b);
        return {
          ...d,
          plans: [{ ...base, completedDays }, ...d.plans.filter((p) => p.planId !== planId)],
          readingDays: d.readingDays.includes(today()) ? d.readingDays : [...d.readingDays, today()],
        };
      }),
    [update],
  );

  const saveConversation = useCallback(
    (c: { title: string; question: string; style: ReplyStyle }) =>
      update((d) => ({
        ...d,
        conversations: [
          { id: uid(), ...c, question: c.question.trim(), createdAt: new Date().toISOString() },
          ...d.conversations.filter((x) => x.title !== c.title),
        ].slice(0, 5),
      })),
    [update],
  );

  const removeConversation = useCallback(
    (id: string) =>
      update((d) => ({ ...d, conversations: d.conversations.filter((c) => c.id !== id) })),
    [update],
  );

  const setReplyStyle = useCallback(
    (replyStyle: ReplyStyle) => update((d) => ({ ...d, replyStyle })),
    [update],
  );

  return {
    data,
    saveConversation,
    removeConversation,
    setReplyStyle,
    toggleBookmark,
    setHighlight,
    saveNote,
    removeNote,
    trackReading,
    addPrayer,
    removePrayer,
    togglePlanDay,
  };
}

/** Consecutive days of activity, ending today or yesterday. */
export function computeStreak(days: string[]) {
  if (!days.length) return 0;
  const set = new Set(days);
  const d = new Date();
  if (!set.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1);
  let streak = 0;
  while (set.has(d.toISOString().slice(0, 10))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export const HIGHLIGHT_COLORS: { value: HighlightColor; label: string; className: string }[] = [
  { value: "gold", label: "Χρυσό", className: "bg-gold/40" },
  { value: "olive", label: "Ελιά", className: "bg-primary/25" },
  { value: "sky", label: "Ουρανί", className: "bg-sky-400/25" },
  { value: "rose", label: "Ροζ", className: "bg-rose-400/25" },
];
