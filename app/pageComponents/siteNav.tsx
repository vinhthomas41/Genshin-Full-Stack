"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/characters", label: "Characters" },
  { href: "/materials", label: "Materials" },
];

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="relative z-10 flex items-center justify-between border-b-4 border-glow bg-black px-8 py-4 panel-glow">
      <Link href="/" className="text-glow text-lg font-black uppercase tracking-widest">
        Gnovia
      </Link>
      <div className="flex gap-6">
        {LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`text-xs uppercase tracking-widest transition-colors ${
              pathname?.startsWith(href) ? "text-glow" : "text-white/50 hover:text-glow"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
