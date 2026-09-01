import React from 'react';
import Link from 'next/link';
import SiteBackground from '@/app/pageComponents/siteBackground';

const FEATURES: { label: string; href?: string }[] = [
  { label: "Characters", href: "/characters" },
  { label: "Materials", href: "/materials" },
  { label: "Placeholder" },
];

export default function Home() {
  return (
    <div className="bg-blueTest text-white min-h-screen font-mono h-screen flex flex-col relative overflow-hidden">
      <SiteBackground />

      <nav className="relative z-10 border-b border-glow/40 px-8 py-4 flex items-center justify-between panel-glow">
        <h1 className="text-glow text-2xl font-black tracking-widest uppercase">Gnovia</h1>
      </nav>

      <div className="relative z-10 grid grid-cols-3 border-b border-glow/40 flex-3">
        <div className="col-span-2 border-r border-glow/40 p-8">
          <p className="text-xs text-white/50 uppercase tracking-widest mb-2">Database</p>
          <h2 className="text-glow text-5xl font-black leading-tight mb-4">Genshin Database</h2>
          <p className="text-white/60 text-sm max-w-lg">Character info + Build Display</p>
        </div>
        <div className="p-8 flex flex-col justify-between">
          <p className="text-xs text-white/50 uppercase tracking-widest mb-2">Quick Access</p>
          <Link href="/characters" className="mt-auto border border-glow/40 p-4 hover:bg-glow/10 transition-colors">
            <p className="text-xs text-white/50 uppercase mb-1">Browse</p>
            <p className="text-lg font-bold">Characters →</p>
          </Link>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-3 divide-x divide-glow/40 flex-1">
        {FEATURES.map(({ label, href }) =>
          href ? (
            <Link key={label} href={href} className="p-6 hover:bg-glow/10 transition-colors cursor-pointer block">
              <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Feature</p>
              <p className="font-bold">{label}</p>
            </Link>
          ) : (
            <div key={label} className="p-6 text-white/30">
              <p className="text-xs uppercase tracking-widest mb-1">Feature</p>
              <p className="font-bold">{label}</p>
            </div>
          ),
        )}
      </div>
    </div>
  );
}