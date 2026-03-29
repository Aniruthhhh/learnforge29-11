import { motion } from 'framer-motion';
import { AnalyticsGrid } from './AnalyticsGrid';
import { MasteryVisualizer } from './MasteryVisualizer';
import { NeuralTimeline } from './NeuralTimeline';
import { ChevronDown, SlidersHorizontal, Cpu } from 'lucide-react';

export function DashboardView() {
  const filters = [
    { label: 'Date', value: 'Now' },
    { label: 'Product', value: 'All' },
    { label: 'Profile', value: 'Bogdan' },
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* ── Header Row ── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00E5FF]">Neural Dashboard</span>
          </div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Check Box
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter pill */}
          <div className="flex gap-2 px-5 py-2.5 rounded-2xl border border-[rgba(0,229,255,0.08)]
            bg-[rgba(10,15,28,0.7)] backdrop-blur-md h-11 items-center">
            {filters.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px] font-black uppercase">
                <span className="text-[#6B8CA6] tracking-widest">{f.label}:</span>
                <span className="text-white">{f.value}</span>
                <ChevronDown className="w-3 h-3 text-[#4FD1FF]" />
                {i < filters.length - 1 && <div className="w-px h-3 bg-[rgba(0,229,255,0.15)] mx-1" />}
              </div>
            ))}
          </div>

          {/* Filter icon */}
          <motion.button
            whileHover={{ scale: 1.08, boxShadow: '0 0 15px rgba(0,229,255,0.2)' }}
            whileTap={{ scale: 0.92 }}
            className="w-11 h-11 rounded-xl border border-[rgba(0,229,255,0.12)]
              bg-[rgba(0,229,255,0.05)] flex items-center justify-center
              text-[#4FD1FF] hover:text-[#00E5FF] hover:border-[rgba(0,229,255,0.3)]
              transition-all duration-300"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </motion.button>

          {/* Live indicator */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[rgba(0,229,255,0.12)]
            bg-[rgba(0,229,255,0.04)] backdrop-blur-md">
            <Cpu className="w-4 h-4 text-[#00E5FF]" />
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse shadow-[0_0_6px_#00E5FF]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#00E5FF]">Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Left Side */}
        <div className="flex flex-col gap-8">
          <AnalyticsGrid />
          <MasteryVisualizer />
        </div>

        {/* Right Side */}
        <div className="h-full">
          <NeuralTimeline />
        </div>
      </div>
    </div>
  );
}
