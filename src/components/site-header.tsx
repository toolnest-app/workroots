import Link from "next/link";
import { CommandTrigger } from "@/components/command-trigger";
import { cn } from "@/lib/utils";

const navLink =
  "text-sm text-muted-foreground transition-colors hover:text-foreground";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-2">
            <span
              className={cn(
                "flex size-8 items-center justify-center rounded-lg bg-primary font-serif text-sm font-bold text-primary-foreground"
              )}
            >
              W
            </span>
            <span className="font-serif text-xl font-semibold tracking-tight group-hover:text-primary">
              Workroots
            </span>
          </Link>
          <nav className="flex gap-4 sm:hidden">
            <Link href="/jobs" className={navLink}>
              Browse
            </Link>
            <Link href="/suggest" className={navLink}>
              Suggest
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end gap-4 sm:max-w-md">
          <CommandTrigger className="hidden sm:flex" />
          <nav className="hidden gap-5 sm:flex">
            <Link href="/" className={navLink}>
              Home
            </Link>
            <Link href="/jobs" className={navLink}>
              Browse
            </Link>
            <Link href="/about" className={navLink}>
              About
            </Link>
            <Link href="/suggest" className={navLink}>
              Suggest
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}