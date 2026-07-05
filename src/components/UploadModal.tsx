import { useState, useRef, ChangeEvent } from 'react';
import { motion } from 'motion/react';
import { X, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { User } from 'firebase/auth';

export function UploadModal({ onClose, spaceId, user }: { onClose: () => void, spaceId: string, user: User }) {
  const [reflection, setReflection] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [prompts, setPrompts] = useState<string[]>([]);
  const [loadingPrompts, setLoadingPrompts] = useState(false);

  const fetchPrompts = async () => {
    setLoadingPrompts(true);
    try {
      const res = await fetch('/api/generate-prompts', { method: 'POST' });
      const data = await res.json();
      setPrompts(data.prompts || []);
    } catch (e) {
      console.error(e);
    }
    setLoadingPrompts(false);
  };

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
        setImage(dataUrl);
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const submit = async () => {
    if (!reflection && !image) return;
    setLoading(true);
    
    await addDoc(collection(db, 'spaces', spaceId, 'memories'), {
      authorId: user.uid,
      authorName: user.displayName || 'Partner',
      reflection,
      imageUrl: image,
      date: Date.now()
    });
    
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#12142b] border border-white/10 rounded-3xl p-6 w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-serif text-white tracking-wide">Create Memory</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors bg-white/5 p-2 rounded-full">
            <X className="w-5 h-5"/>
          </button>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => {
              if (prompts.length === 0) fetchPrompts();
            }}
            className="w-full flex items-center gap-3 p-4 rounded-2xl bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 transition-colors text-sm text-left border border-indigo-500/20"
          >
            <Sparkles className="w-5 h-5 shrink-0" />
            <span className="font-medium tracking-wide">
              {loadingPrompts ? 'Gathering inspiration from the stars...' : prompts.length > 0 ? 'AI Suggestions:' : 'Need inspiration? Generate prompts'}
            </span>
          </button>
          
          {prompts.length > 0 && (
            <div className="flex flex-col gap-2">
              {prompts.map((p, i) => (
                <button 
                  key={i} 
                  onClick={() => setReflection(p)}
                  className="text-sm text-left p-3 rounded-xl bg-white/5 text-white/80 hover:bg-white/10 transition-colors border border-white/5"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {image ? (
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-black/50 border border-white/10 group">
              <img src={image} alt="Preview" className="w-full h-full object-contain" />
              <button onClick={() => setImage(null)} className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-video rounded-2xl border border-dashed border-white/20 hover:border-white/40 flex flex-col items-center justify-center text-white/40 hover:text-white/70 cursor-pointer transition-colors bg-white/5"
            >
              <ImageIcon className="w-8 h-8 mb-3" />
              <span className="text-sm font-medium tracking-wide">Add Photo (Optional)</span>
            </div>
          )}
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImage} />

          <textarea
            value={reflection}
            onChange={e => setReflection(e.target.value)}
            placeholder="What happened? How did you feel?"
            className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-5 text-white placeholder-white/30 resize-none focus:outline-none focus:border-indigo-500/50 text-base leading-relaxed"
          />

          <button
            onClick={submit}
            disabled={loading || (!reflection && !image)}
            className="w-full py-4 bg-white hover:bg-slate-100 disabled:bg-white/10 disabled:text-white/30 text-[#0a0a14] rounded-2xl font-semibold transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:shadow-none flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Light a Star'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
