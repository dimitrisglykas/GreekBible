import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Home, Moon, Search, Sparkles, Sun, User } from "lucide-react";

import { useAssistant } from "@/components/assistant/AssistantProvider";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Αρχική" },
  { to: "/vivlos", label: "Βίβλος" },
  { to: "/anazitisi", label: "Αναζήτηση" },
  { to: "/simera", label: "Σήμερα" },
  { to: "/anakalypse", label: "Ανακάλυψε" },
  { to: "/profil", label: "Προφίλ" },
] as const;

const MOBILE_NAV = [
  { to: "/", label: "Αρχική", icon: Home },
  { to: "/vivlos", label: "Βίβλος", icon: BookOpen },
  { to: "/anazitisi", label: "Αναζήτηση", icon: Search },
  { to: "/simera", label: "Σήμερα", icon: Sparkles },
  { to: "/profil", label: "Προφίλ", icon: User },
] as const;

export function SiteHeader() {
  const { open } = useAssistant();
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2" aria-label="Ελληνική Βίβλος — Αρχική">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <BookOpen className="size-[18px]" aria-hidden />
          </span>
          <span className="font-serif text-lg leading-none font-semibold">
            Ελληνική<span className="text-primary"> Βίβλος</span>
          </span>
        </Link>

        <nav aria-label="Κύρια πλοήγηση" className="ml-4 hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              activeProps={{ className: "bg-accent text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label={theme === "dark" ? "Φωτεινό θέμα" : "Σκοτεινό θέμα"}
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          <Button className="rounded-full" onClick={() => open()}>
            <span aria-hidden>💬</span>
            <span className="ml-1.5 hidden sm:inline">Ρώτα τον Βοηθό</span>
            <span className="ml-1.5 sm:hidden">Βοηθός</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function MobileTabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      aria-label="Πλοήγηση"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch">
        {MOBILE_NAV.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="size-5" aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/70 px-4 py-10 md:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 text-sm text-muted-foreground md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-2">
          <p className="font-serif text-base font-semibold text-foreground">
            Γνώρισε τον Λόγο. Γνώρισε τον Χριστό.
          </p>
          <p>
            Η Αγία Γραφή, πιο κοντά σου από ποτέ. Ελεύθερα προσβάσιμη, χωρίς πίεση και χωρίς κρίση.
          </p>
        </div>
        <nav aria-label="Σύνδεσμοι" className="grid grid-cols-2 gap-x-10 gap-y-2">
          <Link to="/vivlos" className="hover:text-foreground">
            Βίβλος
          </Link>
          <Link to="/iisous" className="hover:text-foreground">
            Γνώρισε τον Ιησού
          </Link>
          <Link to="/anakalypse" className="hover:text-foreground">
            Ανακάλυψε
          </Link>
          <Link to="/programmata" className="hover:text-foreground">
            Προγράμματα
          </Link>
          <Link to="/prosefchi" className="hover:text-foreground">
            Προσευχή
          </Link>
          <Link to="/ksekina" className="hover:text-foreground">
            Δεν ξέρω από πού να ξεκινήσω
          </Link>
        </nav>
      </div>
      <p className="mx-auto mt-8 max-w-6xl text-xs text-muted-foreground">
        Κείμενο: Νέα Ελληνική Μετάφραση (Βάμβα), δημόσιο κτήμα.
      </p>
    </footer>
  );
}
