import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-stone-200 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-serif text-2xl font-semibold text-stone-900">
          Workroots
        </Link>
        <nav className="flex gap-4 text-sm text-stone-700">
          <Link href="/" className="hover:text-stone-900">
            Home
          </Link>
          <Link href="/jobs" className="hover:text-stone-900">
            Browse
          </Link>
          <Link href="/about" className="hover:text-stone-900">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}