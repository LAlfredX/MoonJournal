import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { Memory } from '../types';

export function SummaryModal({ memories, onClose }: { memories: Memory[], onClose: () => void }) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (memories.length === 0) {
      setSummary("Your night sky is waiting for its first stars. Share a memory to begin your journey.");
      setLoading(false);
      return;
    }

    const payload = memories.map(m => ({ date: m.date, text: m.reflection }));

    fetch('/api/generate-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memories: payload })
    })
    .then(r => r.json())
    .then(data => {
      setSummary(data.summary);
      setLoading(false);
    })
    .catch(() => {
      setSummary("Failed to look at the stars right now. Please try again later.");
      setLoading(false);
    });
  }, [memories]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gradient-to-br from-[#12142b] to-[#1a1736] rounded-3xl p-8 w-full max-w-md shadow-2xl border border-indigo-500/20 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-32 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 p-32 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

        <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors bg-white/5 p-2 rounded-full z-10">
          <X className="w-5 h-5"/>
        </button>

        <div className="w-16 h-16 rounded-full bg-indigo-500/20 mx-auto flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(99,102,241,0.2)] border border-indigo-500/30 relative z-10">
          <Sparkles className="w-8 h-8 text-indigo-300" />
        </div>
        
        <h2 className="text-2xl font-serif text-white mb-8 relative z-10">Constellation Insights</h2>

        <div className="relative z-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 text-indigo-200/60">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-indigo-400" />
              <p className="text-sm tracking-wide">Reading the stars...</p>
            </div>
          ) : (
            <p className="text-white/90 text-lg leading-relaxed font-serif">
              {summary}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
