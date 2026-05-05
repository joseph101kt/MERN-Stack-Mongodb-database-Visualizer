import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { 
  Database, 
  Code2, 
  Search, 
  Users, 
  Edit3, 
  ArrowRight, 
  ChevronRight 
} from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-emerald-500/30">
      
      {/* --- SECTION 1: HERO --- */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-mono uppercase tracking-widest mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Full-Stack MERN Project
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            MERN Stack MongoDB <br/><span className=" text-emerald-400"> Document Visualizer</span> 
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            A specialized MongoDB document visualizer built to bridge the gap between raw data and intuitive management.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/products"
              className="group flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-emerald-400 transition-all duration-300"
            >
              View Products
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/admin?view=visualizer"
              className="flex items-center gap-2 bg-zinc-900 border border-white/10 text-white px-8 py-4 rounded-full font-bold hover:bg-zinc-800 transition-all"
            >
              <Database size={18} className="text-emerald-400" />
              Open Visualizer
            </Link>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: WHAT I BUILT --- */}
      <section className="py-24 px-6 bg-zinc-950/50 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Core Features</h2>
              <p className="text-zinc-500">The technical building blocks of this application.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <FeatureCard 
              icon={<Code2 className="text-emerald-400" />}
              title="JSON Visualizer"
              desc="Deeply nested MongoDB documents are rendered through a recursive component tree for crystal-clear data hierarchy."
            />
            {/* Card 2 */}
            <FeatureCard 
              icon={<Edit3 className="text-emerald-400" />}
              title="Live DB Editing"
              desc="Perform CRUD operations directly inline from the UI. Changes are validated and synced instantly with the live database."
            />
            {/* Card 3 */}
            <FeatureCard 
              icon={<Search className="text-emerald-400" />}
              title="Product Search"
              desc="A robust catalogue featuring fuzzy search and filtering against the MongoDB collection for instant results."
            />
            {/* Card 4 */}
            <FeatureCard 
              icon={<Users className="text-emerald-400" />}
              title="Admin Panel"
              desc="A centralized dashboard to oversee CRUD operations for the products and the Mongodb Database Visualizer."
            />
          </div>
        </div>
      </section>

      {/* --- SECTION 3: WHAT I LEARNED --- */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Development Insights</h2>
        
        <div className="grid gap-6">
          <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Code2 size={120} />
            </div>
            
            <p className="text-zinc-400 leading-relaxed text-lg mb-6">
              Transitioning from BaaS like Supabase to a custom MERN stack was a massive step. It forced me to handle the "dirty work" myself—managing manual Express routes and Mongoose schemas instead of relying on automated backend magic.
            </p>

            <ul className="space-y-4">
              <li className="flex gap-3">
                <ChevronRight className="text-emerald-500 shrink-0" size={20} />
                <span><strong className="text-white">Recursive UI Logic:</strong> Engineered recursive React components to handle infinite* JSON nesting levels without hardcoding paths.</span>
              </li>
              <li className="flex gap-3">
                <ChevronRight className="text-emerald-500 shrink-0" size={20} />
                <span><strong className="text-white">RESTful API Design:</strong> Built out multiple GET, POST, PATCH, and DELETE endpoints from scratch using Express to handle database operations.</span>              </li>
              <li className="flex gap-3">
                <ChevronRight className="text-emerald-500 shrink-0" size={20} />
                <span><strong className="text-white">Data Integrity:</strong> Implemented Mongoose schemas to ensure strict data validation in a naturally schema-less MongoDB environment.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  desc: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, desc }) => {
  return (
    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-emerald-500/30 hover:bg-zinc-900/80 transition-all group">
      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
};

export default HomePage;