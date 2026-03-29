import { motion } from 'framer-motion';
import { performanceHistory, topicHeatmap, bottlenecks } from '@/lib/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { MoreHorizontal, Info, TrendingUp, Activity, Target, Zap } from 'lucide-react';

export default function AnalyticsPage() {
  const efficiencyScore = 64;

  return (
    <div className="flex flex-col gap-10">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00E5FF]">Real-time Tracking</span>
          </div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Monitoring
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-6 py-3 rounded-2xl flex items-center gap-4
            bg-[rgba(0,229,255,0.06)] border border-[rgba(0,229,255,0.15)]
            shadow-[0_0_20px_rgba(0,229,255,0.08)]">
            <div className="text-right">
              <p className="text-[9px] font-black text-[#6B8CA6] uppercase tracking-widest">Efficiency</p>
              <p className="text-xl font-black text-[#00E5FF]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {efficiencyScore}%
              </p>
            </div>
            <Activity className="w-5 h-5 text-[#00E5FF] drop-shadow-[0_0_6px_rgba(0,229,255,0.8)]" />
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Performance Trend */}
        <motion.div
          whileHover={{ y: -4, boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(0,229,255,0.06)' }}
          className="lg:col-span-2 rounded-[24px] p-8 shadow-2xl relative overflow-hidden
            bg-[rgba(10,15,28,0.85)] border border-[rgba(0,229,255,0.07)]
            backdrop-blur-xl transition-all duration-300"
        >
          {/* Top-right cyan ambient glow */}
          <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none
            bg-[radial-gradient(circle_at_top_right,rgba(0,229,255,0.06),transparent_70%)]" />

          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#00E5FF] to-[#4FD1FF]
                shadow-[0_0_10px_rgba(0,229,255,0.5)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#6B8CA6]">
                Neural Output Velocity
              </span>
            </div>
            <MoreHorizontal className="w-4 h-4 text-[#6B8CA6] cursor-pointer hover:text-white transition-colors" />
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceHistory}>
                <defs>
                  <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF8A3D" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#FF8A3D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,229,255,0.05)" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false}
                  tick={{ fill: '#6B8CA6', fontSize: 10, fontWeight: 900 }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(10,15,28,0.95)',
                    border: '1px solid rgba(0,229,255,0.2)',
                    borderRadius: '14px',
                    fontSize: '10px',
                    backdropFilter: 'blur(20px)',
                  }}
                  itemStyle={{ color: '#00E5FF', fontWeight: 900 }}
                />
                <Area type="monotone" dataKey="accuracy" stroke="#00E5FF" strokeWidth={3}
                  fillOpacity={1} fill="url(#cyanGrad)"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(0,229,255,0.4))' }} />
                <Area type="monotone" dataKey="efficiency" stroke="#FF8A3D" strokeWidth={2}
                  fillOpacity={1} fill="url(#orangeGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Stat breakdown cards */}
        <div className="flex flex-col gap-5">
          {[
            { label: 'Retention', value: '84%', icon: Target, color: '#00E5FF', glow: 'rgba(0,229,255,0.3)', sub: '+12% increase' },
            { label: 'Complexity', value: '4.2', icon: Activity, color: '#FF8A3D', glow: 'rgba(255,138,61,0.3)', sub: 'Adaptive scaling' },
            { label: 'Velocity', value: '1.2s', icon: TrendingUp, color: '#7AD7FF', glow: 'rgba(122,215,255,0.25)', sub: 'Peak performance' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ x: 4 }}
              className="rounded-[20px] p-5 flex items-center justify-between
                bg-[rgba(10,15,28,0.85)] border border-[rgba(0,229,255,0.07)]
                backdrop-blur-xl shadow-xl transition-all duration-300
                hover:border-[rgba(0,229,255,0.15)]"
            >
              <div>
                <p className="text-[9px] font-black text-[#6B8CA6] uppercase tracking-widest mb-2">{stat.label}</p>
                <p className="text-2xl font-black text-white tracking-tighter" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {stat.value}
                </p>
                <p className="text-[9px] font-black mt-1.5 uppercase tracking-widest" style={{ color: stat.color }}>
                  {stat.sub}
                </p>
              </div>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center border"
                style={{
                  backgroundColor: `${stat.color}12`,
                  borderColor: `${stat.color}25`,
                  boxShadow: `0 0 15px ${stat.glow}`,
                }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Neural Heatmap ── */}
      <div className="rounded-[24px] p-8 shadow-2xl
        bg-[rgba(10,15,28,0.85)] border border-[rgba(0,229,255,0.07)]
        backdrop-blur-xl transition-colors duration-500">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#FF8A3D] to-[#FFB347]
              shadow-[0_0_10px_rgba(255,138,61,0.5)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#6B8CA6]">
              Neural Stability Heatmap
            </span>
          </div>
          <Info className="w-4 h-4 text-[#6B8CA6] cursor-pointer hover:text-white transition-colors" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {topicHeatmap.map((t, i) => {
            const color = t.color === 'high' ? '#00E5FF' : t.color === 'medium' ? '#FF8A3D' : '#7AD7FF';
            const glow  = t.color === 'high' ? 'rgba(0,229,255,0.35)' : t.color === 'medium' ? 'rgba(255,138,61,0.35)' : 'rgba(122,215,255,0.25)';

            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.06, boxShadow: `0 0 25px ${glow}` }}
                className="p-4 rounded-2xl flex flex-col items-center gap-4 cursor-pointer
                  border border-[rgba(0,229,255,0.05)] bg-[rgba(255,255,255,0.02)]
                  hover:bg-[rgba(0,229,255,0.03)] transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black text-[#020305] shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)`, boxShadow: `0 0 20px ${glow}` }}>
                  {t.strength}
                </div>
                <span className="text-[9px] font-black uppercase text-center tracking-widest leading-tight text-[#6B8CA6]">
                  {t.topic}
                </span>
              </motion.div>
            );
          })}
        </div>

        <div className="flex items-center gap-6 mt-10 pt-6 border-t border-[rgba(0,229,255,0.06)]
          text-[9px] font-black uppercase tracking-[0.25em] text-[#6B8CA6]">
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" /> Peak Alpha
          </span>
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF8A3D] shadow-[0_0_8px_#FF8A3D]" /> Resonance
          </span>
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#7AD7FF] shadow-[0_0_8px_#7AD7FF]" /> Stabilizing
          </span>
        </div>
      </div>
    </div>
  );
}
