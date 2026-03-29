import { motion } from 'framer-motion';
import { MoreHorizontal, BookOpen, Zap, MessageSquare, Star } from 'lucide-react';

interface TimelineRowProps {
  date: string;
  width: string;
  offset: string;
  accent: 'cyan' | 'orange' | 'soft';
  icon: React.ElementType;
  label: string;
  avatars?: string[];
}

const accentMap = {
  cyan:   { bg: 'linear-gradient(90deg, #00E5FF, #4FD1FF)', glow: 'rgba(0,229,255,0.35)',   text: '#020305', border: 'rgba(0,229,255,0.4)'   },
  orange: { bg: 'linear-gradient(90deg, #FF8A3D, #FFB347)', glow: 'rgba(255,138,61,0.35)',  text: '#020305', border: 'rgba(255,138,61,0.4)'  },
  soft:   { bg: 'linear-gradient(90deg, #7AD7FF, #A8C7E0)', glow: 'rgba(122,215,255,0.25)', text: '#020305', border: 'rgba(122,215,255,0.3)' },
};

function TimelineRow({ date, width, offset, accent, icon: Icon, label, avatars }: TimelineRowProps) {
  const a = accentMap[accent];

  return (
    <div className="flex items-center gap-5 h-12 w-full group">
      <span className="text-[10px] font-black text-[#6B8CA6] w-12 tabular-nums shrink-0">{date}</span>

      <div className="flex-1 h-full relative border-l border-dashed border-[rgba(0,229,255,0.1)]">
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: width, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            marginLeft: offset,
            background: a.bg,
            boxShadow: `0 0 16px ${a.glow}, 0 4px 20px rgba(0,0,0,0.3)`,
          }}
          className="h-10 rounded-full flex items-center justify-between px-2 gap-3
            absolute top-1 cursor-pointer hover:scale-[1.02] transition-all duration-300"
        >
          {/* Icon container */}
          <div className="w-7 h-7 rounded-full bg-[rgba(2,3,5,0.4)] flex items-center justify-center shrink-0 border border-white/20">
            <Icon className="w-3.5 h-3.5" style={{ color: a.text }} />
          </div>

          {avatars && (
            <div className="flex -space-x-2">
              {avatars.slice(0, 3).map((av, i) => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-[rgba(2,3,5,0.5)] overflow-hidden">
                  <img src={av} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          <span className="text-[9px] font-black pr-2" style={{ color: a.text }}>{label}</span>
        </motion.div>
      </div>
    </div>
  );
}

export function NeuralTimeline() {
  const rows: Omit<TimelineRowProps, 'icon'> & { icon: React.ElementType }[] = [
    { date: '30.09', width: '35%', offset: '5%',  accent: 'cyan',   icon: BookOpen,     label: '16 concepts' },
    { date: '29.09', width: '30%', offset: '45%', accent: 'orange', icon: Zap,          label: '29 quizzes'  },
    {
      date: '28.09', width: '40%', offset: '15%', accent: 'soft',   icon: MessageSquare, label: '15',
      avatars: [
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100',
      ],
    },
    { date: '27.09', width: '35%', offset: '25%', accent: 'cyan',   icon: Star,          label: '21 mastered' },
    { date: '26.09', width: '25%', offset: '0%',  accent: 'soft',   icon: MessageSquare, label: '10 chats'    },
    {
      date: '25.09', width: '45%', offset: '20%', accent: 'cyan',   icon: Zap,           label: '19',
      avatars: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      ],
    },
    { date: '24.09', width: '25%', offset: '30%', accent: 'soft',   icon: MessageSquare, label: '8 notes'     },
  ];

  return (
    <div className="rounded-[24px] p-8 h-full shadow-2xl relative flex flex-col
      bg-[rgba(10,15,28,0.8)] border border-[rgba(0,229,255,0.07)] backdrop-blur-xl
      transition-colors duration-500">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#FF8A3D] to-[#FFB347]
            shadow-[0_0_10px_rgba(255,138,61,0.5)]" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#6B8CA6]">
            Neural Stream
          </span>
        </div>
        <MoreHorizontal className="w-4 h-4 text-[#6B8CA6] cursor-pointer hover:text-white transition-colors" />
      </div>

      {/* Timeline rows */}
      <div className="flex flex-col gap-5 flex-1 relative">
        {/* Background grid lines */}
        <div className="absolute inset-0 flex justify-between px-16 pointer-events-none opacity-[0.04]">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-px h-full border-l border-dashed border-[#00E5FF]" />
          ))}
        </div>

        {rows.map((r, i) => (
          <TimelineRow key={i} {...r} />
        ))}
      </div>

      {/* Footer legend */}
      <div className="flex items-center justify-between border-t border-[rgba(0,229,255,0.07)] pt-5 mt-5">
        <div className="flex gap-5">
          {[
            { color: '#00E5FF', label: 'Paths' },
            { color: '#FF8A3D', label: 'Quizzes' },
            { color: '#7AD7FF', label: 'Chat' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}80` }} />
              <span className="text-[9px] text-[#6B8CA6] font-black uppercase tracking-widest">{label}</span>
            </div>
          ))}
        </div>
        <div className="text-[9px] font-black tracking-widest uppercase text-[#6B8CA6]">
          Activity: <span className="text-[#00E5FF]">284</span>
        </div>
      </div>
    </div>
  );
}
