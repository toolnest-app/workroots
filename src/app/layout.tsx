import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { CommandMenu } from "@/components/command-menu";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Workroots — Global Job Encyclopedia",
    template: "%s · Workroots",
  },
  description:
    "Explore work across history: how old a job is, how it evolved, and how roles connect across eras.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(fraunces.variable, sourceSans.variable, "font-sans")}
    >
      <body className="min-h-screen antialiased">
        <TooltipProvider>
          <CommandMenu />
          <SiteHeader />
          <main className="mx-auto max-w-6xl flex-1 px-4 py-8 md:py-10">
            {children}
          </main>
          <footer className="border-t border-border/60 bg-muted/30 py-10">
            <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
              <p className="font-serif text-base text-foreground/80">
                Workroots
              </p>
              <p className="mt-1">
                Historical archive &amp; encyclopedia of human work
              </p>
              <p className="mt-3">
                <a href="/suggest" className="underline-offset-2 hover:underline">
                  Suggest a correction
                </a>
              </p>
            </div>
          </footer>
        </TooltipProvider>
      </body>
    </html>
  );
}