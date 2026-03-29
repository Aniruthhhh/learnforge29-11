import { motion } from 'framer-motion';
import { MoreHorizontal } from 'lucide-react';

interface PillBarProps {
  value1: number;
  value2: number;
  accent1: 'cyan' | 'orange' | 'white';
  accent2: 'cyan' | 'orange' | 'white';
}

const accentColors = {
  cyan:   { bg: '#00E5FF', glow: 'rgba(0,229,255,0.5)' },
  orange: { bg: '#FF8A3D', glow: 'rgba(255,138,61,0.5)' },
  white:  { bg: '#7AD7FF', glow: 'rgba(122,215,255,0.4)' },
};

function PillBar({ value1, value2, accent1, accent2 }: PillBarProps) {
  const a1 = accentColors[accent1];
  const a2 = accentColors[accent2];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-10 h-40 rounded-full relative overflow-hidden flex flex-col justify-end p-1 gap-1
        bg-[rgba(255,255,255,0.03)] border border-[rgba(0,229,255,0.08)]">
        {/* Top segment */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${value1}%` }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full rounded-full flex items-center justify-center text-[9px] font-black text-[#020305]"
          style={{
            backgroundColor: a1.bg,
            boxShadow: value1 > 40 ? `0 0 12px ${a1.glow}` : 'none',
          }}
        >
          {value1 > 20 && value1}
        </motion.div>

        {/* Bottom segment */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${value2}%` }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="w-full rounded-full flex items-center justify-center text-[9px] font-black text-[#020305]"
          style={{
            backgroundColor: a2.bg,
            boxShadow: value2 > 40 ? `0 0 12px ${a2.glow}` : 'none',
          }}
        >
          {value2 > 20 && value2}
        </motion.div>

        {/* Separator dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-1.5 h-1.5 rounded-full bg-[#00E5FF] opacity-20 shadow-[0_0_8px_#00E5FF]" />
      </div>
    </div>
  );
}

export function MasteryVisualizer() {
  const data: { v1: number; v2: number; a1: 'cyan' | 'orange' | 'white'; a2: 'cyan' | 'orange' | 'white' }[] = [
    { v1: 52, v2: 81, a1: 'white', a2: 'orange' },
    { v1: 96, v2: 25, a1: 'cyan',  a2: 'orange' },
    { v1: 48, v2: 51, a1: 'cyan',  a2: 'white'  },
    { v1: 80, v2: 49, a1: 'cyan',  a2: 'orange' },
    { v1: 34, v2: 67, a1: 'orange',a2: 'cyan'   },
    { v1: 92, v2: 28, a1: 'cyan',  a2: 'white'  },
    { v1: 58, v2: 20, a1: 'cyan',  a2: 'orange' },
    { v1: 84, v2: 39, a1: 'orange',a2: 'cyan'   },
    { v1: 36, v2: 72, a1: 'white', a2: 'orange' },
  ];

  return (
    <motion.div
      whileHover={{ boxShadow: '0 0 40px rgba(0,229,255,0.08)' }}
      className="rounded-[24px] p-8 mt-5 shadow-2xl relative
        bg-[rgba(10,15,28,0.8)] border border-[rgba(0,229,255,0.07)]
        backdrop-blur-xl transition-all duration-500"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#00E5FF] to-[#4FD1FF]
            shadow-[0_0_10px_rgba(0,229,255,0.5)]" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#6B8CA6]">
            Concept Stability Grid
          </span>
        </div>
        <MoreHorizontal className="w-4 h-4 text-[#6B8CA6] cursor-pointer hover:text-[#A8C7E0] transition-colors" />
      </div>

      {/* Pill bars */}
      <div className="flex justify-between items-end gap-1 px-2 mb-6">
        {data.map((d, i) => (
          <PillBar key={i} value1={d.v1} value2={d.v2} accent1={d.a1} accent2={d.a2} />
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between border-t border-[rgba(0,229,255,0.07)] pt-5">
        <div className="flex gap-5">
          {[
            { color: '#7AD7FF', label: 'Resources' },
            { color: '#00E5FF', label: 'Mastered' },
            { color: '#FF8A3D', label: 'Review' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}80` }} />
              <span className="text-[9px] text-[#6B8CA6] font-black uppercase tracking-widest">{label}</span>
            </div>
          ))}
        </div>
        <div className="text-[9px] font-black tracking-widest uppercase text-[#6B8CA6]">
          Nodes: <span className="text-[#00E5FF]">1,012</span>
        </div>
      </div>
    </motion.div>
  );
}
