"use client";

import Spline from "@splinetool/react-spline";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type HeroProps = {
  onViewDemo?: () => void;
  onStartOptimizing?: () => void;
};

export default function Hero3DSection({ onViewDemo, onStartOptimizing }: HeroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(56,189,248,0.14),transparent_35%),radial-gradient(circle_at_85%_15%,rgba(139,92,246,0.18),transparent_35%),radial-gradient(circle_at_60%_85%,rgba(6,182,212,0.1),transparent_45%)]" />
      <div className="absolute left-1/2 top-6 z-20 w-[min(1100px,94vw)] -translate-x-1/2 rounded-2xl border border-white/15 bg-white/8 px-4 py-3 backdrop-blur-md md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-cyan-200">
            <Sparkles className="h-4 w-4" />
            SMART BUILD 2.0
          </div>
          <p className="hidden text-xs tracking-[0.2em] text-white/70 md:block">
            AI \ LEARNING \ SIMULATION \ OPTIMIZATION
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto grid min-h-screen w-[min(1200px,94vw)] items-center gap-8 pt-24 md:grid-cols-2 md:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <h1 className="text-4xl font-semibold leading-tight text-white md:text-6xl">
            Stop Learning.
            <br />
            <span className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">
              Start Optimizing.
            </span>
          </h1>
          <p className="max-w-xl text-base text-slate-300 md:text-lg">
            SMART BUILD 2.0 detects how you learn, identifies bottlenecks, and simulates the fastest path to mastery.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={onViewDemo}>View Demo</Button>
            <Button variant="outline" onClick={onStartOptimizing}>
              Start Optimizing
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="h-[420px] rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-cyan-900/30 backdrop-blur-sm md:h-[520px]"
        >
          <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
        </motion.div>
      </div>
    </section>
  );
}
