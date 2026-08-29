/**
 * Bible data layer.
 *
 * The Scripture text lives entirely outside the UI, as structured data:
 *   Bible -> Book -> Chapter -> Verse
 *
 * It is served as static JSON from /public/bible (one file per book plus an
 * index). Swapping this layer for a database (e.g. Lovable Cloud tables
 * `books`, `chapters`, `verses`) only requires changing the two fetchers
 * below — no UI component reads hardcoded Scripture.
 *
 * Verse identity is stable and global: `${bookId}.${chapter}.${verse}`
 */

export type Testament = "ot" | "nt";

export interface BookMeta {
  id: string;
  name: string;
  nr: number;
  testament: Testament;
  /** verse count per chapter, index 0 = chapter 1 */
  chapters: number[];
}

export interface ChapterData {
  c: number;
  v: string[];
}

export interface BookData {
  id: string;
  name: string;
  chapters: ChapterData[];
}

export interface Verse {
  id: string;
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
}

export const verseId = (bookId: string, chapter: number, verse: number) =>
  `${bookId}.${chapter}.${verse}`;

export function parseVerseId(id: string) {
  const [bookId, chapter, verse] = id.split(".");
  return { bookId, chapter: Number(chapter), verse: Number(verse) };
}

export const TESTAMENT_LABEL: Record<Testament, string> = {
  ot: "Παλαιά Διαθήκη",
  nt: "Καινή Διαθήκη",
};

/** Human-friendly grouping used in the book selector. */
export const BOOK_GROUPS: { label: string; testament: Testament; from: number; to: number }[] = [
  { label: "Νόμος", testament: "ot", from: 1, to: 5 },
  { label: "Ιστορικά", testament: "ot", from: 6, to: 17 },
  { label: "Ποιητικά", testament: "ot", from: 18, to: 22 },
  { label: "Προφήτες", testament: "ot", from: 23, to: 39 },
  { label: "Ευαγγέλια & Πράξεις", testament: "nt", from: 40, to: 44 },
  { label: "Επιστολές", testament: "nt", from: 45, to: 65 },
  { label: "Αποκάλυψη", testament: "nt", from: 66, to: 66 },
];

const asset = (path: string) => path;

export async function fetchBooks(): Promise<BookMeta[]> {
  const res = await fetch(asset("/bible/index.json"));
  if (!res.ok) throw new Error("Δεν μπόρεσα να φορτώσω τα βιβλία της Βίβλου.");
  return res.json();
}

export async function fetchBook(bookId: string): Promise<BookData> {
  const res = await fetch(asset(`/bible/${bookId}.json`));
  if (!res.ok) throw new Error("Δεν μπόρεσα να φορτώσω αυτό το βιβλίο.");
  return res.json();
}

export const booksQuery = {
  queryKey: ["bible", "books"] as const,
  queryFn: fetchBooks,
  staleTime: Infinity,
};

export const bookQuery = (bookId: string) => ({
  queryKey: ["bible", "book", bookId] as const,
  queryFn: () => fetchBook(bookId),
  staleTime: Infinity,
});

export function getChapter(book: BookData, chapter: number): Verse[] {
  const ch = book.chapters.find((c) => c.c === chapter);
  if (!ch) return [];
  return ch.v.map((text, i) => ({
    id: verseId(book.id, chapter, i + 1),
    bookId: book.id,
    bookName: book.name,
    chapter,
    verse: i + 1,
    text,
  }));
}

export const reference = (bookName: string, chapter: number, verse?: number, endVerse?: number) =>
  `${bookName} ${chapter}${verse ? `:${verse}${endVerse && endVerse !== verse ? `-${endVerse}` : ""}` : ""}`;

/** A reference to a range of verses, used by topics, plans and Jesus pages. */
export interface PassageRef {
  book: string;
  chapter: number;
  from?: number;
  to?: number;
}

export function passagePath(p: PassageRef) {
  return { book: p.book, chapter: String(p.chapter) };
}

export async function loadPassage(p: PassageRef): Promise<{ verses: Verse[]; bookName: string }> {
  const book = await fetchBook(p.book);
  const all = getChapter(book, p.chapter);
  const from = p.from ?? 1;
  const to = p.to ?? (p.from ? p.from : all.length);
  return { verses: all.filter((v) => v.verse >= from && v.verse <= to), bookName: book.name };
}

/** Normalises Greek text for accent/case-insensitive search. */
export function normalizeGreek(input: string) {
  return input
    .toLocaleLowerCase("el")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ς/g, "σ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Parses queries like "Ιωάννης 3:16" or "ioannis 3". */
export function parseReferenceQuery(query: string, books: BookMeta[]) {
  const m = query.trim().match(/^(.+?)\s+(\d+)(?:\s*[:.,]\s*(\d+))?$/);
  if (!m) return null;
  const [, rawName, chapter, verse] = m;
  const needle = normalizeGreek(rawName ?? "");
  const book =
    books.find((b) => normalizeGreek(b.name) === needle) ??
    books.find((b) => normalizeGreek(b.name).includes(needle)) ??
    books.find((b) => normalizeGreek(b.id).includes(needle));
  if (!book) return null;
  const ch = Math.min(Math.max(1, Number(chapter)), book.chapters.length);
  return { book, chapter: ch, ...(verse ? { verse: Number(verse) } : {}) };
}
