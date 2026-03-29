import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { MoreHorizontal, ArrowUp, ArrowDown, TrendingUp } from 'lucide-react';

const dataUp = [
  { v: 10 }, { v: 25 }, { v: 15 }, { v: 40 }, { v: 30 }, { v: 55 }, { v: 45 },
];
const dataDown = [
  { v: 55 }, { v: 45 }, { v: 50 }, { v: 30 }, { v: 38 }, { v: 25 }, { v: 32 },
];

interface AnalyticsCardProps {
  title: string;
  percent1: string;
  label1: string;
  percent2: string;
  label2: string;
  accent: 'cyan' | 'orange';
  data: { v: number }[];
}

function AnalyticsCard({ title, percent1, label1, percent2, label2, accent, data }: AnalyticsCardProps) {
  const isCyan = accent === 'cyan';
  const primaryColor = isCyan ? '#00E5FF' : '#FF8A3D';
  const secondaryColor = isCyan ? '#4FD1FF' : '#FFB347';
  const glowClass = isCyan
    ? 'shadow-[0_0_30px_rgba(0,229,255,0.12)]'
    : 'shadow-[0_0_30px_rgba(255,138,61,0.1)]';
  const borderHover = isCyan
    ? 'hover:border-[rgba(0,229,255,0.25)]'
    : 'hover:border-[rgba(255,138,61,0.25)]';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`relative overflow-hidden flex flex-col gap-5 p-6 rounded-[24px]
        bg-[rgba(10,15,28,0.8)] border border-[rgba(255,255,255,0.06)]
        backdrop-blur-xl transition-all duration-300 cursor-default group
        ${glowClass} ${borderHover}`}
    >
      {/* Corner accent */}
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 pointer-events-none`}
        style={{ background: `radial-gradient(circle at top right, ${primaryColor}, transparent 70%)` }}
      />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: primaryColor, boxShadow: `0 0 6px ${primaryColor}` }} />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#6B8CA6]">{title}</span>
        </div>
        <MoreHorizontal className="w-4 h-4 text-[#6B8CA6] cursor-pointer hover:text-white transition-colors" />
      </div>

      {/* Stats row */}
      <div className="flex gap-6">
        <div>
          <div className="flex items-center gap-1.5" style={{ color: primaryColor }}>
            <ArrowUp className="w-3 h-3" />
            <span className="text-2xl font-black text-white tracking-tighter" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {percent1}
            </span>
          </div>
          <p className="text-[9px] text-[#6B8CA6] mt-1 font-black uppercase tracking-widest">{label1}</p>
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-[#FF8A3D]">
            <ArrowDown className="w-3 h-3" />
            <span className="text-2xl font-black text-white tracking-tighter" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {percent2}
            </span>
          </div>
          <p className="text-[9px] text-[#6B8CA6] mt-1 font-black uppercase tracking-widest">{label2}</p>
        </div>
      </div>

      {/* Sparkline chart */}
      <div className="h-14 -mx-6 -mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <defs>
              <linearGradient id={`grad-${accent}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={primaryColor} stopOpacity={0.6} />
                <stop offset="100%" stopColor={secondaryColor} stopOpacity={1} />
              </linearGradient>
            </defs>
            <Line
              type="monotone"
              dataKey="v"
              stroke={`url(#grad-${accent})`}
              strokeWidth={2.5}
              dot={false}
              animationDuration={2000}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(10,15,28,0.95)',
                border: `1px solid ${primaryColor}40`,
                borderRadius: '12px',
                fontSize: '10px',
              }}
              itemStyle={{ color: primaryColor, fontWeight: 900 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export function AnalyticsGrid() {
  return (
    <div className="grid grid-cols-2 gap-5 h-fit">
      <AnalyticsCard
        title="Knowledge Base"
        percent1="2.4%"
        label1="Neural Links"
        percent2="1.1%"
        label2="Retention"
        accent="cyan"
        data={dataUp}
      />
      <AnalyticsCard
        title="Skill Growth"
        percent1="2.8%"
        label1="Mastery Speed"
        percent2="3.2%"
        label2="Complexity"
        accent="orange"
        data={dataDown}
      />
    </div>
  );
}
