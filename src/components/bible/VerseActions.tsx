import { BookOpen, Copy, Highlighter, MessageCircle, Share2, StickyNote, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";

import { useAssistant } from "@/components/assistant/AssistantProvider";
import { ShareVerseDialog } from "@/components/bible/ShareVerseDialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { reference, type Verse } from "@/lib/bible";
import { HIGHLIGHT_COLORS, useLibrary } from "@/lib/store";
import { cn } from "@/lib/utils";

export function VerseActions({
  verse,
  onClose,
  showContextLink = false,
}: {
  verse: Verse;
  onClose: () => void;
  showContextLink?: boolean;
}) {
  const { data, toggleBookmark, setHighlight, saveNote } = useLibrary();
  const { open } = useAssistant();
  const [noteOpen, setNoteOpen] = useState(false);
  const [share, setShare] = useState(false);
  const [note, setNote] = useState("");

  const ref = reference(verse.bookName, verse.chapter, verse.verse);
  const saved = data.bookmarks.some((b) => b.id === verse.id);
  const highlight = data.highlights.find((h) => h.id === verse.id);
  const existingNote = data.notes.find((n) => n.id === verse.id);

  useEffect(() => setNote(existingNote?.body ?? ""), [existingNote?.body, verse.id]);

  const payload = {
    id: verse.id,
    bookId: verse.bookId,
    bookName: verse.bookName,
    chapter: verse.chapter,
    verse: verse.verse,
    text: verse.text,
  };

  const copy = async () => {
    await navigator.clipboard?.writeText(`«${verse.text}»\n— ${ref}`);
    toast.success("Αντιγράφηκε");
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center">
        <button
          type="button"
          aria-label="Κλείσιμο"
          className="absolute inset-0 bg-foreground/25 backdrop-blur-[2px]"
          onClick={onClose}
        />
        <div
          role="dialog"
          aria-label={`Ενέργειες για ${ref}`}
          className="relative w-full max-w-md rounded-t-3xl bg-card p-4 shadow-lifted animate-rise sm:rounded-3xl"
        >
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-primary">{ref}</p>
              <p className="scripture mt-1 line-clamp-3 text-sm text-muted-foreground">{verse.text}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Κλείσιμο">
              <X className="size-4" />
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <ActionTile
              icon={<BookOpen className="size-5" />}
              label={saved ? "Αποθηκευμένο" : "Αποθήκευση"}
              active={saved}
              onClick={() => {
                toggleBookmark(payload);
                toast.success(saved ? "Αφαιρέθηκε" : "Αποθηκεύτηκε στην πορεία σου");
              }}
            />
            <ActionTile
              icon={<Highlighter className="size-5" />}
              label="Επισήμανση"
              active={!!highlight}
              onClick={() => setNoteOpen(false)}
              asChild={
                <div className="mt-2 flex justify-center gap-1.5">
                  {HIGHLIGHT_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      aria-label={c.label}
                      onClick={() =>
                        setHighlight(payload, highlight?.color === c.value ? null : c.value)
                      }
                      className={cn(
                        "size-5 rounded-full border border-border",
                        c.className,
                        highlight?.color === c.value && "ring-2 ring-ring",
                      )}
                    />
                  ))}
                </div>
              }
            />
            <ActionTile
              icon={<StickyNote className="size-5" />}
              label="Σημείωση"
              active={!!existingNote}
              onClick={() => setNoteOpen((v) => !v)}
            />
            <ActionTile icon={<Copy className="size-5" />} label="Αντιγραφή" onClick={copy} />
            <ActionTile
              icon={<Share2 className="size-5" />}
              label="Κοινοποίηση"
              onClick={() => setShare(true)}
            />
            <ActionTile
              icon={<MessageCircle className="size-5" />}
              label="Ρώτησε τον Βοηθό"
              onClick={() => {
                open({ reference: ref, text: verse.text, suggestion: `Τι σημαίνει το ${ref};` });
                onClose();
              }}
            />
          </div>

          {noteOpen && (
            <div className="mt-4 space-y-2">
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Τι σου λέει αυτό το εδάφιο;"
                rows={4}
                aria-label="Σημείωση"
              />
              <Button
                className="w-full rounded-full"
                onClick={() => {
                  saveNote(payload, note);
                  toast.success(note.trim() ? "Η σημείωση αποθηκεύτηκε" : "Η σημείωση διαγράφηκε");
                  setNoteOpen(false);
                }}
              >
                Αποθήκευση σημείωσης
              </Button>
            </div>
          )}

          {showContextLink && (
            <Link
              to="/vivlos/$book/$chapter"
              params={{ book: verse.bookId, chapter: String(verse.chapter) }}
              className="mt-4 block rounded-full border border-border py-2.5 text-center text-sm font-medium hover:bg-accent"
              onClick={onClose}
            >
              Διάβασε τα συμφραζόμενα
            </Link>
          )}
        </div>
      </div>

      {share && <ShareVerseDialog verse={verse} onClose={() => setShare(false)} />}
    </>
  );
}

function ActionTile({
  icon,
  label,
  onClick,
  active,
  asChild,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  asChild?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-background p-3 text-center transition-colors",
        active && "border-primary/40 bg-primary/8",
      )}
    >
      <button type="button" onClick={onClick} className="flex w-full flex-col items-center gap-1.5">
        <span className={cn("text-muted-foreground", active && "text-primary")}>{icon}</span>
        <span className="text-[11px] leading-tight font-medium">{label}</span>
      </button>
      {asChild}
    </div>
  );
}
