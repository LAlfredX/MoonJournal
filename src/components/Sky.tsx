import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { User } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Memory } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Sparkles, Share2, Star } from 'lucide-react';
import { MemoryModal } from './MemoryModal';
import { UploadModal } from './UploadModal';
import { SummaryModal } from './SummaryModal';
import { CONSTELLATIONS, ALL_STARS } from '../constellations';

export function Sky({ user }: { user: User }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const spaceId = searchParams.get('space');
  const [memories, setMemories] = useState<Memory[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [activeMemory, setActiveMemory] = useState<Memory | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);

  useEffect(() => {
    if (!spaceId) {
      const newSpaceId = Math.random().toString(36).substring(2, 9);
      setSearchParams({ space: newSpaceId });
      return;
    }

    const memoriesRef = collection(db, 'spaces', spaceId, 'memories');
    const q = query(memoriesRef, orderBy('date', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const mems = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Memory));
      setMemories(mems);
    });

    return unsub;
  }, [spaceId, setSearchParams]);

  if (!spaceId) return null;

  const copyInvite = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Invite link copied!");
  };

  return (
    <div className="min-h-screen bg-[#06070d] relative overflow-hidden flex flex-col">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a14] via-[#12142b] to-[#1a1736] opacity-80" />
      
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
        <h1 className="text-lg font-serif text-white tracking-[0.3em] uppercase drop-shadow-md">Full Moon</h1>
        <div className="flex gap-4">
          <button onClick={copyInvite} className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-indigo-200 transition-colors backdrop-blur-sm border border-white/5">
            <Share2 className="w-4 h-4" />
          </button>
          <button onClick={() => setSummaryOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors backdrop-blur-sm border border-white/5">
            <Sparkles className="w-4 h-4 text-indigo-300" />
            <span className="text-sm font-medium tracking-wide">Insights</span>
          </button>
        </div>
      </header>

      {/* The Sky Canvas */}
      <main className="flex-1 relative z-10">
        {/* Constellation Lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          {CONSTELLATIONS.map((c, cIdx) => (
            <g key={`constellation-${cIdx}`}>
              {c.connections.map(([p1, p2], i) => (
                <line
                  key={`line-${cIdx}-${i}`}
                  x1={`${c.points[p1].x}%`}
                  y1={`${c.points[p1].y}%`}
                  x2={`${c.points[p2].x}%`}
                  y2={`${c.points[p2].y}%`}
                  stroke="white"
                  strokeWidth="1"
                  strokeDasharray="2 6"
                />
              ))}
            </g>
          ))}
        </svg>

        {/* Base Constellation Stars */}
        {ALL_STARS.map((star, i) => {
          const isOccupied = memories.some((_, mIdx) => (mIdx % ALL_STARS.length) === i);
          if (isOccupied) return null;
          return (
            <div
              key={`base-star-${i}`}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 text-white/20"
              style={{ left: `${star.x}%`, top: `${star.y}%` }}
            >
              <Star className="w-2 h-2 fill-current" />
            </div>
          );
        })}

        {/* Lit Up Memory Stars */}
        {memories.map((m, i) => {
          const star = ALL_STARS[i % ALL_STARS.length];
          return (
            <motion.button
              key={m.id}
              initial={{ scale: 0, opacity: 0, y: -100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: Math.min(i * 0.05, 1) }}
              onClick={() => setActiveMemory(m)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 group cursor-pointer flex items-center justify-center text-yellow-100"
              style={{ left: `${star.x}%`, top: `${star.y}%` }}
            >
              <Star className="w-4 h-4 fill-current drop-shadow-[0_0_15px_rgba(255,255,255,1)] group-hover:scale-125 transition-transform duration-300" />
              <div className="absolute inset-0 bg-yellow-100/20 rounded-full animate-ping opacity-0 group-hover:opacity-100" />
              {m.imageUrl && (
                <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-indigo-400 rounded-full shadow-[0_0_8px_rgba(99,102,241,1)] border border-black/50" />
              )}
            </motion.button>
          );
        })}
      </main>

      {/* FAB to add memory */}
      <div className="absolute bottom-8 right-8 z-20">
        <button
          onClick={() => setUploadOpen(true)}
          className="w-16 h-16 bg-white hover:bg-slate-100 text-[#0a0a14] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 transition-all active:scale-95"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <AnimatePresence>
        {uploadOpen && (
          <UploadModal 
            onClose={() => setUploadOpen(false)} 
            spaceId={spaceId}
            user={user}
          />
        )}
        {activeMemory && (
          <MemoryModal 
            memory={activeMemory} 
            onClose={() => setActiveMemory(null)} 
          />
        )}
        {summaryOpen && (
          <SummaryModal
            memories={memories}
            onClose={() => setSummaryOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
