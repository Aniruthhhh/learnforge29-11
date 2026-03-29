import { motion } from 'framer-motion';
import { Lock, Star, Zap, ShieldAlert } from 'lucide-react';
import { Level } from '../../types/gamification';

interface GameMapProps {
  levels: Level[];
  onSelectLevel: (levelId: string) => void;
}

export function GameMap({ levels, onSelectLevel }: GameMapProps) {
  return (
    <div className="relative py-8 flex flex-col items-center">
      {/* Central holographic connector line */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(0,229,255,0.5) 0%, rgba(0,229,255,0.1) 100%)',
          boxShadow: '0 0 12px rgba(0,229,255,0.3)',
        }}
      />

      {levels.map((level, idx) => {
        const isBoss = level.difficulty === 'boss';

        return (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: idx * 0.12, type: 'spring', stiffness: 90, damping: 18 }}
            className={`relative flex items-center justify-center w-full my-8 ${
              idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
            }`}
          >
            {/* ── Level Card ── */}
            <div className={`w-1/2 flex ${idx % 2 === 0 ? 'justify-end pr-14' : 'justify-start pl-14'}`}>
              <motion.div
                whileHover={level.isUnlocked ? {
                  scale: 1.04,
                  y: -6,
                  boxShadow: isBoss
                    ? '0 20px 50px rgba(255,50,50,0.15), 0 0 30px rgba(255,50,50,0.1)'
                    : '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(0,229,255,0.1)',
                } : {}}
                onClick={() => level.isUnlocked && onSelectLevel(level.id)}
                className={`p-6 rounded-[24px] border transition-all duration-300 relative overflow-hidden cursor-pointer ${
                  level.isUnlocked
                    ? isBoss
                      ? 'bg-[rgba(40,10,10,0.85)] border-red-500/20 hover:border-red-500/40'
                      : 'bg-[rgba(10,15,28,0.85)] border-[rgba(0,229,255,0.08)] hover:border-[rgba(0,229,255,0.25)] backdrop-blur-xl'
                    : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.04)] opacity-40 grayscale cursor-not-allowed'
                }`}
              >
                {/* Corner ambient glow */}
                {level.isUnlocked && (
                  <div className="absolute top-0 right-0 w-28 h-28 pointer-events-none"
                    style={{
                      background: isBoss
                        ? 'radial-gradient(circle at top right, rgba(255,50,50,0.08), transparent 70%)'
                        : 'radial-gradient(circle at top right, rgba(0,229,255,0.06), transparent 70%)',
                    }}
                  />
                )}

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.25em]"
                      style={{ color: isBoss ? '#FF4444' : '#00E5FF' }}>
                      Node {idx + 1}
                    </span>
                    {level.isCompleted && (
                      <div className="ml-auto flex items-center gap-1.5 text-[#FFD27F]">
                        <Star className="w-3.5 h-3.5 fill-[#FFD27F]/30 text-[#FFD27F]" />
                        <span className="text-[11px] tabular-nums font-black">{level.score}</span>
                      </div>
                    )}
                  </div>

                  <h4 className="font-black text-xl tracking-tighter uppercase leading-none mb-2 text-white"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {level.title}
                  </h4>
                  <p className="text-[11px] text-[#6B8CA6] font-bold leading-relaxed line-clamp-2 uppercase tracking-wide">
                    {level.description}
                  </p>

                  <div className="mt-4 flex gap-2">
                    {isBoss && (
                      <span className="px-3 py-1 text-[9px] rounded-lg uppercase font-black tracking-widest
                        bg-red-500/10 text-red-400 border border-red-500/20">
                        Critical Boss
                      </span>
                    )}
                    <span className="px-3 py-1 text-[9px] rounded-lg uppercase font-black tracking-widest"
                      style={{
                        background: 'rgba(0,229,255,0.06)',
                        color: '#4FD1FF',
                        border: '1px solid rgba(0,229,255,0.12)',
                      }}>
                      {level.questions.length} Concepts
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ── Central Path Node ── */}
            <div className={`absolute left-1/2 -translate-x-1/2 z-10 w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              level.isCompleted
                ? 'border-[rgba(0,229,255,0.5)]'
                : level.isUnlocked
                  ? 'border-[rgba(0,229,255,0.3)]'
                  : 'border-[rgba(255,255,255,0.08)]'
            }`}
              style={{
                background: level.isCompleted
                  ? 'linear-gradient(135deg, #00E5FF, #4FD1FF)'
                  : level.isUnlocked
                    ? 'rgba(0,229,255,0.08)'
                    : 'rgba(255,255,255,0.03)',
                boxShadow: level.isCompleted
                  ? '0 0 30px rgba(0,229,255,0.5), 0 0 60px rgba(0,229,255,0.2)'
                  : level.isUnlocked
                    ? '0 0 20px rgba(0,229,255,0.2)'
                    : 'none',
              }}>
              {level.isCompleted ? (
                <Star className="w-6 h-6 text-[#020305]" />
              ) : level.isUnlocked ? (
                isBoss
                  ? <ShieldAlert className="w-6 h-6 text-red-400 animate-pulse" />
                  : <Zap className="w-6 h-6 text-[#00E5FF] animate-pulse drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
              ) : (
                <Lock className="w-5 h-5 text-[#6B8CA6]" />
              )}
            </div>

            {/* Spatial filler */}
            <div className="w-1/2" />
          </motion.div>
        );
      })}
    </div>
  );
}
