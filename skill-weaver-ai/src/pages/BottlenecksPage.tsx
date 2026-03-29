import { bottlenecks } from '@/lib/mockData';
import { AlertTriangle, Clock, Target, ShieldAlert, Zap, Info, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const severityConfig = {
  critical: { color: '#FF8A3D', glow: 'rgba(255,138,61,0.4)',  label: 'CRITICAL', gradient: 'from-[#FF8A3D] to-[#FFB347]' },
  medium:   { color: '#00E5FF', glow: 'rgba(0,229,255,0.35)',   label: 'MEDIUM',   gradient: 'from-[#00E5FF] to-[#4FD1FF]' },
  low:      { color: '#7AD7FF', glow: 'rgba(122,215,255,0.25)', label: 'LOW',      gradient: 'from-[#7AD7FF] to-[#A8C7E0]' },
};

export default function BottlenecksPage() {
  const sev = (key: string) => severityConfig[key as keyof typeof severityConfig] ?? severityConfig.low;

  return (
    <div className="flex flex-col gap-10">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#FF8A3D] shadow-[0_0_8px_#FF8A3D] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF8A3D]">Bottleneck Detection</span>
          </div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Stress Test
          </h2>
        </div>

        <div className="flex gap-3">
          {(['critical', 'medium', 'low'] as const).map((s) => {
            const cfg = sev(s);
            const count = bottlenecks.filter(b => b.severity === s).length;
            return (
              <div key={s} className="px-5 py-3 rounded-2xl flex items-center gap-3 backdrop-blur-md"
                style={{
                  background: `${cfg.color}10`,
                  border: `1px solid ${cfg.color}25`,
                  boxShadow: `0 0 15px ${cfg.color}15`,
                }}>
                <div className="text-right">
                  <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: cfg.color }}>{cfg.label}</p>
                  <p className="text-xl font-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{count}</p>
                </div>
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.color, boxShadow: `0 0 10px ${cfg.glow}` }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Bottleneck Cards ── */}
      <div className="grid grid-cols-1 gap-8">
        {bottlenecks.map((b, i) => {
          const cfg = sev(b.severity);
          const timeMultiple = (b.avgTime / b.expectedTime).toFixed(1);
          const pct = (b.expectedTime / b.avgTime) * 100;

          return (
            <motion.div
              key={i}
              whileHover={{ x: 6, boxShadow: `0 0 40px ${cfg.color}15, 0 20px 60px rgba(0,0,0,0.4)` }}
              className="relative rounded-[28px] p-10 flex flex-col lg:flex-row gap-10
                bg-[rgba(10,15,28,0.85)] border border-[rgba(0,229,255,0.07)]
                backdrop-blur-xl shadow-2xl transition-all duration-300 overflow-hidden group"
            >
              {/* Left severity pulse bar */}
              <motion.div
                className="absolute left-0 top-0 h-full w-1.5 rounded-r-full"
                style={{ background: `linear-gradient(180deg, ${cfg.color}, ${cfg.color}60)` }}
                whileHover={{ boxShadow: `0 0 20px ${cfg.glow}` }}
              />

              {/* Corner ambient */}
              <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none opacity-15"
                style={{ background: `radial-gradient(circle at top right, ${cfg.color}, transparent 70%)` }} />

              {/* ── Left: Core Info ── */}
              <div className="flex-1 pl-4">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center border shrink-0"
                    style={{
                      background: `${cfg.color}12`,
                      borderColor: `${cfg.color}25`,
                      boxShadow: `0 0 20px ${cfg.color}20`,
                    }}>
                    <ShieldAlert className="w-7 h-7" style={{ color: cfg.color }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight leading-none"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {b.topic}
                    </h3>
                    <div className="mt-2">
                      <span className="text-[9px] font-black uppercase tracking-[0.25em] px-3 py-1 rounded-lg"
                        style={{
                          color: cfg.color,
                          background: `${cfg.color}12`,
                          border: `1px solid ${cfg.color}20`,
                        }}>
                        {cfg.label} PRIORITY
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm font-bold text-[#A8C7E0] leading-relaxed mb-8 uppercase tracking-wide">
                  {b.message}
                </p>

                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: Clock, label: 'Response Time', value: `${b.avgTime}s`, sub: `${timeMultiple}x slow`, subColor: '#FF8A3D' },
                    { icon: Target, label: 'Target Accuracy', value: `${b.accuracy}%`, sub: `/ ${b.expectedAccuracy}%`, subColor: '#6B8CA6' },
                  ].map(({ icon: Icon, label, value, sub, subColor }, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-[#6B8CA6] shrink-0" />
                      <div>
                        <p className="text-[9px] font-black text-[#6B8CA6] uppercase tracking-widest opacity-60">{label}</p>
                        <p className="text-lg font-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          {value} <span className="text-xs" style={{ color: subColor }}>{sub}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Right: Visualization ── */}
              <div className="lg:w-72 flex flex-col gap-6 justify-between">
                {/* Efficiency Gap Bar */}
                <div className="rounded-2xl p-5 border"
                  style={{ background: 'rgba(0,229,255,0.03)', borderColor: 'rgba(0,229,255,0.08)' }}>
                  <div className="flex justify-between items-end mb-4">
                    <span className="text-[9px] font-black text-[#6B8CA6] uppercase tracking-widest">Efficiency Gap</span>
                    <Zap className="w-4 h-4 text-[#FF8A3D]" />
                  </div>
                  <div className="h-2.5 w-full bg-[rgba(255,255,255,0.04)] rounded-full overflow-hidden flex gap-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, #00E5FF, #4FD1FF)`,
                        boxShadow: '0 0 10px rgba(0,229,255,0.5)',
                      }}
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${100 - pct}%` }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                      className="h-full rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, #FF8A3D, #FFB347)',
                        opacity: 0.5,
                      }}
                    />
                  </div>
                  <p className="text-[9px] font-black text-[#FF8A3D] mt-4 uppercase tracking-[0.2em]">
                    Optimization required: {(100 - pct).toFixed(0)}%
                  </p>
                </div>

                {/* AI Recommendation */}
                <div className="rounded-2xl p-5 flex gap-4 items-start"
                  style={{
                    background: 'rgba(0,229,255,0.04)',
                    border: '1px solid rgba(0,229,255,0.15)',
                    boxShadow: '0 0 20px rgba(0,229,255,0.05)',
                  }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg, #00E5FF, #4FD1FF)', boxShadow: '0 0 15px rgba(0,229,255,0.4)' }}>
                    <Zap className="w-4 h-4 text-[#020305]" />
                  </div>
                  <p className="text-xs font-black uppercase tracking-wide leading-tight">
                    <span className="text-[#6B8CA6] block mb-1.5 text-[9px]">AI Recommendation</span>
                    <span className="text-white">{b.suggestion}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
