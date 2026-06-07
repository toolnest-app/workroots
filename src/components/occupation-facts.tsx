import type { ReactNode } from "react";
import { Hammer, Lightbulb, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface FactCardProps {
  title: string;
  body: string;
  icon: ReactNode;
  className?: string;
}

function FactCard({ title, body, icon, className }: FactCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/70 bg-muted/20 p-5",
        className
      )}
    >
      <div className="mb-3 flex items-center gap-2 text-primary">
        {icon}
        <h3 className="font-serif text-base font-semibold text-foreground">
          {title}
        </h3>
      </div>
      <p className="text-sm leading-relaxed text-foreground/85">{body}</p>
    </div>
  );
}

interface OccupationFactsProps {
  duties?: string;
  skills?: string;
  tools?: string;
}

export function OccupationFacts({ duties, skills, tools }: OccupationFactsProps) {
  const cards = [
    duties && {
      title: "Duties",
      body: duties,
      icon: <Hammer className="size-4" />,
    },
    skills && {
      title: "Skills",
      body: skills,
      icon: <Lightbulb className="size-4" />,
    },
    tools && {
      title: "Tools",
      body: tools,
      icon: <Wrench className="size-4" />,
    },
  ].filter(Boolean) as FactCardProps[];

  if (cards.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="font-serif text-xl font-semibold tracking-tight">
        Work in practice
      </h2>
      <div
        className={cn(
          "grid gap-4",
          cards.length === 3 && "md:grid-cols-3",
          cards.length === 2 && "md:grid-cols-2"
        )}
      >
        {cards.map((card) => (
          <FactCard key={card.title} {...card} />
        ))}
      </div>
    </section>
  );
}