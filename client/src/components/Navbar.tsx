import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Database, Home } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Product Catalog', path: '/products' },
  { label: 'Create Product', path: '/admin?view=create' },
  { label: 'Update Product', path: '/admin?view=update' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Helper to check if both path and query params match
  const checkActive = (path: string) => {
    const currentFull = location.pathname + location.search;
    return currentFull === path;
  };

  /* ── Scroll detection ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Close mobile menu on escape ── */
  useEffect(() => {
    const handler = (e: { key: string; }) => e.key === 'Escape' && setMobileOpen(false);
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-[100] px-4 pt-4">
        <div
          className={`
            mx-auto flex items-center justify-between px-6 py-3
            transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${scrolled
              ? 'max-w-[800px] rounded-full border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl'
              : 'max-w-7xl rounded-2xl bg-transparent border-transparent'}
          `}
        >
          {/* ── Desktop Nav ── */}
          <NavLink 
            to="/" 
            className={`hidden md:flex items-center gap-2 text-[11px] font-mono border rounded-full px-4 py-1.5 transition 
              ${checkActive('/') ? 'bg-blue-500/20 border-blue-400 text-blue-300' : 'text-blue-400 border-blue-500/30 hover:bg-blue-500/10'}`}
          >
            <Home size={12} />
            Home
          </NavLink>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, path }) => (
              <NavLink
                key={path}
                to={path}
                className={`text-sm font-medium transition-colors duration-200 
                  ${checkActive(path) ? 'text-green-400' : 'text-zinc-400 hover:text-white'}`}
              >
                {label.replace('_', ' ')}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <NavLink 
              to="/admin?view=visualizer" 
              className={`hidden md:flex items-center gap-2 text-[11px] font-mono border rounded-full px-4 py-1.5 transition
                ${checkActive('/admin?view=visualizer') ? 'bg-green-500/20 border-green-400 text-green-300' : 'text-green-400 border-green-500/30 hover:bg-green-500/10'}`}
            >
              <Database size={12} />
              Database Visualizer
            </NavLink>
            
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors bg-transparent border-none"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setMobileOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-4 top-24 rounded-3xl border border-white/10 bg-zinc-900 p-8 flex flex-col gap-6 shadow-2xl animate-in zoom-in-95 duration-300"
          >
            {/* Added Home to Mobile */}
            <NavLink
              to="/"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 text-2xl font-bold transition-colors ${checkActive('/') ? 'text-blue-400' : 'text-zinc-300'}`}
            >
              <Home size={24} /> Home
            </NavLink>

            <div className="h-px bg-white/5" />

            <div className="flex flex-col gap-6">
              {NAV_LINKS.map(({ label, path }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  className={`text-2xl font-bold transition-colors ${checkActive(path) ? 'text-green-400' : 'text-zinc-300'}`}
                >
                  {label.replace('_', ' ')}
                </NavLink>
              ))}
            </div>

            <div className="h-px bg-white/10" />

            {/* Mirroring Desktop's Database Visualizer */}
            <NavLink
              to="/admin?view=visualizer"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-center gap-2 border rounded-2xl py-4 font-bold transition-all
                ${checkActive('/admin?view=visualizer') ? 'bg-green-500/20 border-green-400 text-green-400' : 'text-green-400 border-green-500/30'}`}
            >
              <Database size={18} />
              Database Visualizer
            </NavLink>
          </div>
        </div>
      )}
    </>
  );
}