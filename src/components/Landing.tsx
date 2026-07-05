import { motion } from 'motion/react';
import { Moon } from 'lucide-react';

export function Landing({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a14] to-[#12142b] flex flex-col items-center justify-center text-slate-200 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         {/* Background stars */}
         {Array.from({ length: 50 }).map((_, i) => (
           <div 
             key={i} 
             className="absolute bg-white rounded-full opacity-30" 
             style={{
               width: Math.random() * 2 + 1 + 'px',
               height: Math.random() * 2 + 1 + 'px',
               left: Math.random() * 100 + '%',
               top: Math.random() * 100 + '%',
               animation: `twinkle ${Math.random() * 5 + 3}s infinite alternate`
             }} 
           />
         ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 flex flex-col items-center text-center max-w-md px-6"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-8 shadow-[0_0_60px_rgba(99,102,241,0.2)] border border-indigo-500/30">
          <Moon className="w-12 h-12 text-indigo-300" />
        </div>
        <h1 className="text-5xl font-serif text-white mb-4 tracking-tight">Full Moon</h1>
        <p className="text-indigo-200/70 mb-12 text-lg font-medium">
          A shared memory journal for the moments that matter. Transform your long-distance memories into a constellation.
        </p>
        <button
          onClick={onLogin}
          className="px-8 py-4 bg-white hover:bg-slate-100 text-[#0a0a14] rounded-full font-semibold transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] active:scale-95"
        >
          Begin your journey
        </button>
      </motion.div>
    </div>
  );
}
