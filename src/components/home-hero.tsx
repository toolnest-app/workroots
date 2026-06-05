import { CommandTrigger } from "@/components/command-trigger";
import { BookOpen, Clock, GitBranch } from "lucide-react";

interface HomeHeroProps {
  totalRoles: number;
}

export function HomeHero({ totalRoles }: HomeHeroProps) {
  const formatted =
    totalRoles >= 1000
      ? `${Math.floor(totalRoles / 100) / 10}k+`
      : totalRoles.toLocaleString();

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border/80 bg-card">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 20% 0%, oklch(0.75 0.08 75 / 0.4), transparent),
            radial-gradient(ellipse 60% 50% at 90% 100%, oklch(0.55 0.06 200 / 0.25), transparent)
          `,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative px-6 py-10 md:px-10 md:py-14">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
          Global work archive
        </p>
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
          Every occupation
          <br />
          <span className="text-primary">has roots</span>
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Discover how old a job is, how it evolved, and which roles came before
          and after — from Bronze Age crafts to today&apos;s careers.
        </p>
        <div className="mt-8 max-w-md">
          <CommandTrigger className="h-11 w-full sm:w-full" />
        </div>
        <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-border/60 pt-8 sm:max-w-lg">
          <div>
            <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <BookOpen className="size-3.5" />
              Roles
            </dt>
            <dd className="mt-1 font-serif text-2xl font-semibold tabular-nums">
              {formatted}
            </dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <Clock className="size-3.5" />
              Eras
            </dt>
            <dd className="mt-1 font-serif text-2xl font-semibold">6</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <GitBranch className="size-3.5" />
              Lineage
            </dt>
            <dd className="mt-1 font-serif text-2xl font-semibold">Mapped</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}