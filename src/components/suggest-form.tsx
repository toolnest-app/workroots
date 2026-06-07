"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { SuggestionType } from "@/db/schema";

const TYPE_OPTIONS: { value: SuggestionType; label: string; hint: string }[] = [
  {
    value: "correction",
    label: "Factual correction",
    hint: "Dates, duties, status, lineage, or other encyclopedia facts",
  },
  {
    value: "pressure",
    label: "Current pressures feedback",
    hint: "AI & automation assessment for a role",
  },
  {
    value: "source",
    label: "Better source",
    hint: "Citation, link, or reference we should add",
  },
  {
    value: "other",
    label: "Other feedback",
    hint: "General notes or missing roles to consider",
  },
];

export function SuggestForm() {
  const searchParams = useSearchParams();
  const initialSlug = searchParams.get("role") ?? "";
  const initialType = searchParams.get("type") ?? "correction";

  const [occupationSlug, setOccupationSlug] = useState(initialSlug);
  const [type, setType] = useState<SuggestionType>(
    TYPE_OPTIONS.some((option) => option.value === initialType)
      ? (initialType as SuggestionType)
      : "correction"
  );
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          occupationSlug,
          type,
          message,
          email,
          name,
          website,
        }),
      });

      if (res.status === 429) {
        setStatus("error");
        setErrorMessage(
          "Too many submissions from this network. Please try again in an hour."
        );
        return;
      }

      if (!res.ok) {
        setStatus("error");
        setErrorMessage("Could not send your suggestion. Please try again.");
        return;
      }

      setStatus("success");
      setMessage("");
      setWebsite("");
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-emerald-300/70 bg-emerald-50/80 p-6 text-emerald-950">
        <h2 className="font-serif text-xl font-semibold">Thank you</h2>
        <p className="mt-2 text-sm leading-relaxed">
          Your suggestion is in the moderation queue. We review corrections
          manually and update curated entries when evidence supports a change.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => setStatus("idle")}
        >
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="type" className="text-sm font-medium">
          What kind of feedback?
        </label>
        <select
          id="type"
          value={type}
          onChange={(event) => setType(event.target.value as SuggestionType)}
          className="flex h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">
          {TYPE_OPTIONS.find((option) => option.value === type)?.hint}
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="occupationSlug" className="text-sm font-medium">
          Role slug{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <Input
          id="occupationSlug"
          value={occupationSlug}
          onChange={(event) => setOccupationSlug(event.target.value)}
          placeholder="e.g. software-developer"
        />
        <p className="text-xs text-muted-foreground">
          From the URL: /jobs/<strong>software-developer</strong>
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          Your suggestion
        </label>
        <Textarea
          id="message"
          required
          minLength={20}
          maxLength={4000}
          rows={6}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Describe what should change and why. Include sources when possible."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <Input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />
        </div>
      </div>

      <div className="hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <Input
          id="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      {errorMessage && (
        <p className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      )}

      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Submit suggestion"}
      </Button>
    </form>
  );
}