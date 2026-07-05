import { motion } from 'motion/react';
import { X, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Memory } from '../types';

export function MemoryModal({ memory, onClose }: { memory: Memory, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-[#12142b] border border-white/10 rounded-3xl w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="absolute top-4 right-4 z-10">
          <button onClick={onClose} className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white/70 hover:text-white transition-colors border border-white/10">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {memory.imageUrl && (
          <div className="w-full bg-black/50 border-b border-white/5 relative">
             <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
            <img src={memory.imageUrl} alt="Memory" className="w-full max-h-[45vh] object-contain relative z-0" />
          </div>
        )}
        
        <div className="p-8 overflow-y-auto">
          <div className="flex items-center gap-2 text-indigo-300 text-sm font-medium mb-4 tracking-wide uppercase">
            <Calendar className="w-4 h-4" />
            {format(memory.date, 'MMMM d, yyyy')}
          </div>
          <p className="text-white/90 text-lg leading-relaxed font-serif whitespace-pre-wrap">
            {memory.reflection}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
