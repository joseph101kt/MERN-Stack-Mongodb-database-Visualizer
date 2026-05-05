'use client';

import React, { useEffect, useRef } from 'react';
import { Mail,  Download, ExternalLink } from 'lucide-react';

const LINKS = [
  { label: 'joseph101kt@gmail.com', href: 'mailto:joseph101kt@gmail.com', icon: <Mail size={16} /> },
  { label: 'GitHub', href: 'https://github.com/joseph101kt', icon: ' ⌥  ' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/joseph-kakkassery', icon: ' ◫  ' },
];

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('opacity-100', 'translate-y-0');
        }),
      { threshold: 0.15 }
    );

    sectionRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      id="contact"
      ref={sectionRef}
      className="relative mx-auto bg-black border-t border-white/5 px-6 pt-24 pb-12 overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-emerald-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="reveal opacity-0 translate-y-4 transition-all duration-700 text-center mb-12">
          <span className="text-[10px] font-mono tracking-[0.2em] text-emerald-500 uppercase mb-4 block">
            Get in touch
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Let's work together
          </h2>
          <p className="mx-auto max-w-md text-zinc-400 text-sm leading-relaxed">
            I'm currently looking for new opportunities and freelance projects. 
            If you have a question or just want to say hi, I'll do my best to get back to you!
          </p>
        </div>

        {/* Links Grid */}
        <div className="reveal opacity-0 translate-y-4 transition-all duration-700 delay-200 flex flex-wrap justify-center gap-3 mb-20">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3 rounded-xl border border-white/5 bg-white/[0.02] text-zinc-400 text-sm font-medium transition-all hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:text-emerald-400"
            >
              {link.icon}
              {link.label}
            </a>
          ))}

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <a href="https://josephkportfolio.netlify.app" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
              josephkportfolio.netlify.app <ExternalLink size={10} />
            </a>
          </div>
          <p>© {new Date().getFullYear()} — Built with React + Vite + Tailwind + MongoDB + Express</p>
        </div>
      </div>
    </footer>
  );
}