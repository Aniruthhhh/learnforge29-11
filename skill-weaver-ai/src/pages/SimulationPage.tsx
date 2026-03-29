import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend } from 'recharts';
import { Cpu, Play, RotateCcw, Zap, TrendingUp, ArrowRight, Settings, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface SimulationConfig {
  practiceIncrease: number;
  difficultyReduction: number;
  visualLearning: number;
}

const baseMetrics = {
  recursionAccuracy: 32, recursionTime: 120,
  patternAccuracy: 48,   patternTime: 90,
  sortingAccuracy: 68,   sortingTime: 70,
  overallEfficiency: 64,
};

function simulate(config: SimulationConfig) {
  const { practiceIncrease, difficultyReduction, visualLearning } = config;
  const practiceFactor   = 1 + (practiceIncrease / 100) * 0.8;
  const difficultyFactor = 1 + (difficultyReduction / 100) * 0.4;
  const visualFactor     = 1 + (visualLearning / 100) * 0.3;
  const cap = (v: number, max = 98) => Math.min(Math.round(v), max);
  const timeReduce = (t: number, f: number) => Math.max(20, Math.round(t / f));
  return {
    recursionAccuracy: cap(baseMetrics.recursionAccuracy * practiceFactor * difficultyFactor),
    recursionTime:     timeReduce(baseMetrics.recursionTime, practiceFactor),
    patternAccuracy:   cap(baseMetrics.patternAccuracy * visualFactor * practiceFactor),
    patternTime:       timeReduce(baseMetrics.patternTime, visualFactor),
    sortingAccuracy:   cap(baseMetrics.sortingAccuracy * practiceFactor),
    sortingTime:       timeReduce(baseMetrics.sortingTime, practiceFactor),
    overallEfficiency: cap(baseMetrics.overallEfficiency * (practiceFactor * 0.5 + difficultyFactor * 0.3 + visualFactor * 0.2)),
  };
}

export default function SimulationPage() {
  const [config, setConfig] = useState<SimulationConfig>({ practiceIncrease: 50, difficultyReduction: 30, visualLearning: 40 });
  const [simulated, setSimulated] = useState<ReturnType<typeof simulate> | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runSimulation = () => {
    setIsRunning(true);
    setSimulated(null);
    setTimeout(() => { setSimulated(simulate(config)); setIsRunning(false); }, 1500);
  };
  const reset = () => { setSimulated(null); setConfig({ practiceIncrease: 50, difficultyReduction: 30, visualLearning: 40 }); };

  const comparisonData = simulated ? [
    { topic: 'Recursion', before: baseMetrics.recursionAccuracy, after: simulated.recursionAccuracy },
    { topic: 'Patterns',  before: baseMetrics.patternAccuracy,   after: simulated.patternAccuracy   },
    { topic: 'Sorting',   before: baseMetrics.sortingAccuracy,   after: simulated.sortingAccuracy   },
  ] : [];

  const radarData = simulated ? [
    { subject: 'Recursion',  Current: baseMetrics.recursionAccuracy,  Simulated: simulated.recursionAccuracy },
    { subject: 'Patterns',   Current: baseMetrics.patternAccuracy,    Simulated: simulated.patternAccuracy   },
    { subject: 'Sorting',    Current: baseMetrics.sortingAccuracy,    Simulated: simulated.sortingAccuracy   },
    { subject: 'Speed',      Current: 40, Simulated: Math.min(85, 40 * (1 + config.practiceIncrease / 100 * 0.6)) },
    { subject: 'Efficiency', Current: baseMetrics.overallEfficiency,  Simulated: simulated.overallEfficiency },
  ] : [];

  return (
    <div className="flex flex-col gap-10">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00E5FF]">Digital Twin Engine</span>
          </div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Simulation
          </h2>
        </div>
        <div className="px-6 py-3 rounded-2xl flex items-center gap-3
          bg-[rgba(0,229,255,0.06)] border border-[rgba(0,229,255,0.15)]
          shadow-[0_0_20px_rgba(0,229,255,0.08)]">
          <div className="text-right">
            <p className="text-[9px] font-black text-[#6B8CA6] uppercase tracking-widest">Prediction</p>
            <p className="text-sm font-black text-[#00E5FF] uppercase">Active</p>
          </div>
          <Cpu className="w-5 h-5 text-[#00E5FF] drop-shadow-[0_0_6px_rgba(0,229,255,0.8)]" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ── Controls Panel ── */}
        <div className="flex flex-col gap-5">
          <motion.div
            whileHover={{ boxShadow: '0 0 40px rgba(0,229,255,0.08)' }}
            className="rounded-[28px] p-8 space-y-8
              bg-[rgba(10,15,28,0.85)] border border-[rgba(0,229,255,0.08)]
              backdrop-blur-xl shadow-2xl transition-all duration-300"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[#00E5FF] to-[#4FD1FF]
                  shadow-[0_0_8px_rgba(0,229,255,0.5)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#6B8CA6]">
                  Optimization Strategy
                </span>
              </div>
              <Settings className="w-4 h-4 text-[#6B8CA6] cursor-pointer hover:text-white transition-colors" />
            </div>

            <div className="space-y-8 py-2">
              {[
                { label: 'Practice Frequency', value: `+${config.practiceIncrease}%`, key: 'practiceIncrease' as const, state: config.practiceIncrease },
                { label: 'Node Complexity',    value: `-${config.difficultyReduction}%`, key: 'difficultyReduction' as const, state: config.difficultyReduction },
                { label: 'Visual Synthesis',   value: `${config.visualLearning}%`, key: 'visualLearning' as const, state: config.visualLearning },
              ].map((param) => (
                <div key={param.key}>
                  <div className="flex justify-between items-end mb-4 text-[10px] font-black uppercase">
                    <span className="text-[#6B8CA6] tracking-widest">{param.label}</span>
                    <span className="text-[#00E5FF]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{param.value}</span>
                  </div>
                  <Slider
                    value={[param.state]}
                    onValueChange={([v]) => setConfig(p => ({ ...p, [param.key]: v }))}
                    max={100} step={5}
                    className="cursor-pointer [&_[role=slider]]:bg-[#00E5FF] [&_[role=slider]]:border-[#00E5FF]
                      [&_[role=slider]]:shadow-[0_0_10px_rgba(0,229,255,0.5)]"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <motion.button
                onClick={runSimulation}
                disabled={isRunning}
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,229,255,0.4)' }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 h-13 py-3 rounded-2xl flex items-center justify-center
                  font-black text-[10px] uppercase tracking-[0.2em] gap-3
                  bg-gradient-to-r from-[#00E5FF] to-[#4FD1FF] text-[#020305]
                  shadow-[0_0_20px_rgba(0,229,255,0.3)] disabled:opacity-50 transition-all duration-300"
              >
                {isRunning ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <Cpu className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <><Play className="w-4 h-4" /> Run Synthesis</>
                )}
              </motion.button>
              <motion.button
                onClick={reset}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="h-13 w-13 py-3 px-3 rounded-2xl flex items-center justify-center
                  border border-[rgba(0,229,255,0.15)] bg-[rgba(0,229,255,0.05)]
                  text-[#4FD1FF] hover:border-[rgba(0,229,255,0.3)] transition-all duration-300"
              >
                <RotateCcw className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>

          {/* Model Fidelity */}
          <div className="rounded-[24px] p-6 flex gap-4 items-start
            bg-[rgba(0,229,255,0.04)] border border-[rgba(0,229,255,0.12)]
            shadow-[0_0_20px_rgba(0,229,255,0.05)]">
            <Info className="w-5 h-5 text-[#00E5FF] shrink-0 mt-0.5 drop-shadow-[0_0_6px_rgba(0,229,255,0.6)]" />
            <div>
              <span className="text-[9px] font-black text-[#00E5FF] uppercase tracking-widest block mb-2">Model Fidelity</span>
              <p className="text-xs font-bold text-[#A8C7E0] leading-relaxed uppercase tracking-wide">
                Digital twin simulation uses localized neural weights to predict retention curves with 94.2% accuracy.
              </p>
            </div>
          </div>
        </div>

        {/* ── Results Canvas ── */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {isRunning && (
              <motion.div key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="rounded-[28px] h-full min-h-[400px] p-20 flex flex-col items-center justify-center text-center
                  bg-[rgba(10,15,28,0.85)] border border-[rgba(0,229,255,0.08)] backdrop-blur-xl shadow-2xl">
                <motion.div
                  animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6], filter: ['blur(0)', 'blur(4px)', 'blur(0)'] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-24 h-24 rounded-full border-2 border-[#00E5FF] flex items-center justify-center mb-8
                    shadow-[0_0_40px_rgba(0,229,255,0.3)]">
                  <Cpu className="w-12 h-12 text-[#00E5FF] drop-shadow-[0_0_10px_rgba(0,229,255,0.8)]" />
                </motion.div>
                <h3 className="text-xl font-black text-white uppercase tracking-[0.2em] mb-2">Synthesizing Twin...</h3>
                <p className="text-[10px] font-black text-[#6B8CA6] uppercase tracking-[0.2em]">Recalculating neural weights</p>
              </motion.div>
            )}

            {!isRunning && simulated && (
              <motion.div key="results"
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col gap-6">

                {/* Bar Chart */}
                <div className="rounded-[28px] p-8 bg-[rgba(10,15,28,0.85)] border border-[rgba(0,229,255,0.07)] backdrop-blur-xl shadow-2xl">
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#6B8CA6]">Performance Delta — Accuracy</span>
                    <Zap className="w-4 h-4 text-[#00E5FF]" />
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={comparisonData} barGap={10}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,229,255,0.04)" vertical={false} />
                      <XAxis dataKey="topic" axisLine={false} tickLine={false}
                        tick={{ fill: '#6B8CA6', fontSize: 10, fontWeight: 900 }} />
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip contentStyle={{ background: 'rgba(10,15,28,0.95)', border: '1px solid rgba(0,229,255,0.2)', borderRadius: '12px', fontSize: '10px' }} />
                      <Bar dataKey="before" name="Initial" fill="rgba(255,255,255,0.05)" radius={[8, 8, 8, 8]} />
                      <Bar dataKey="after" name="Projected" fill="#00E5FF" radius={[8, 8, 8, 8]}
                        style={{ filter: 'drop-shadow(0 0 8px rgba(0,229,255,0.5))' }} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Radar Chart */}
                  <div className="rounded-[24px] p-8 bg-[rgba(10,15,28,0.85)] border border-[rgba(0,229,255,0.07)] backdrop-blur-xl shadow-2xl">
                    <p className="text-[10px] font-black text-[#6B8CA6] uppercase tracking-[0.25em] mb-6">Skill Radar</p>
                    <ResponsiveContainer width="100%" height={220}>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="rgba(0,229,255,0.07)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#6B8CA6', fontWeight: 900 }} />
                        <Radar name="Now" dataKey="Current" stroke="rgba(255,255,255,0.1)" fill="white" fillOpacity={0.04} />
                        <Radar name="Simulated" dataKey="Simulated" stroke="#00E5FF" fill="#00E5FF" fillOpacity={0.15}
                          style={{ filter: 'drop-shadow(0 0 6px rgba(0,229,255,0.4))' }} />
                        <Legend wrapperStyle={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', paddingTop: '16px' }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Neural Projections */}
                  <div className="rounded-[24px] p-8 bg-[rgba(10,15,28,0.85)] border border-[rgba(0,229,255,0.07)] backdrop-blur-xl shadow-2xl flex flex-col justify-between">
                    <p className="text-[10px] font-black text-[#6B8CA6] uppercase tracking-[0.25em] mb-8">Neural Projections</p>
                    <div className="space-y-6">
                      {[
                        { label: 'Recursion Mastered', before: baseMetrics.recursionAccuracy, after: simulated.recursionAccuracy },
                        { label: 'Latency Reduction',  before: baseMetrics.recursionTime, after: simulated.recursionTime, suffix: 's', lower: true },
                        { label: 'Energy Efficiency',  before: baseMetrics.overallEfficiency, after: simulated.overallEfficiency },
                      ].map((m, idx) => {
                        const diff = m.lower ? m.before - m.after : m.after - m.before;
                        return (
                          <div key={idx} className="flex items-center justify-between">
                            <div>
                              <p className="text-[9px] font-black text-[#6B8CA6] uppercase tracking-widest mb-1">{m.label}</p>
                              <div className="flex items-center gap-3">
                                <span className="text-base font-bold text-white/30 tabular-nums">{m.before}{m.suffix || '%'}</span>
                                <ArrowRight className="w-3 h-3 text-white/10" />
                                <span className="text-xl font-black text-white tabular-nums" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                  {m.after}{m.suffix || '%'}
                                </span>
                              </div>
                            </div>
                            <div className="px-3 py-1.5 rounded-xl flex items-center gap-2
                              bg-[rgba(0,229,255,0.08)] border border-[rgba(0,229,255,0.2)]
                              shadow-[0_0_10px_rgba(0,229,255,0.1)]">
                              <TrendingUp className="w-3 h-3 text-[#00E5FF]" />
                              <span className="text-[10px] font-black text-[#00E5FF]">+{diff}{m.suffix || '%'}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {!isRunning && !simulated && (
              <motion.div key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="rounded-[28px] h-full min-h-[400px] p-20 flex flex-col items-center justify-center text-center
                  bg-[rgba(10,15,28,0.85)] border border-dashed border-[rgba(0,229,255,0.1)] backdrop-blur-xl shadow-2xl">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-8 rotate-12
                  bg-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.1)]">
                  <Cpu className="w-10 h-10 text-[#00E5FF] opacity-30" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-[0.2em] mb-3">Initialize Synthesis</h3>
                <p className="text-[10px] font-black text-[#6B8CA6] uppercase tracking-[0.2em] max-w-[200px] leading-relaxed">
                  Adjust twin parameters to generate neural forecasts
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
