"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { ReactNode } from "react";
import { AlertTriangle, ArrowRight, BrainCircuit, ChartColumn, Lightbulb, Wrench } from "lucide-react";
import Hero3DSection from "@/components/blocks/3d-hero-section-boxes";

const sampleUser = {
  recursionAccuracy: 45,
  recursionTime: 15,
  bottleneck: "Recursion Base Case",
  improvement: "+30%",
};

function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6 }}
      className="mx-auto w-[min(1100px,94vw)] py-14"
    >
      {children}
    </motion.section>
  );
}

export default function Home() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start start", "end end"] });
  const screenshotY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <main ref={targetRef} className="bg-slate-950 text-slate-100">
      <Hero3DSection
        onViewDemo={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
        onStartOptimizing={() => window.scrollTo({ top: window.innerHeight * 2.2, behavior: "smooth" })}
      />

      <Reveal>
        <div className="rounded-3xl border border-red-400/30 bg-red-500/10 p-6 md:p-8">
          <div className="mb-3 flex items-center gap-2 text-red-300">
            <AlertTriangle className="h-4 w-4" />
            <p className="text-sm font-medium uppercase tracking-[0.18em]">Bottleneck Detection</p>
          </div>
          <h2 className="text-3xl font-semibold md:text-4xl">Find Where You&apos;re Stuck</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-red-300/30 bg-slate-900/60 p-5">
              <p className="text-sm text-slate-300">Recursion</p>
              <p className="mt-1 text-lg text-red-300">High delay ({sampleUser.recursionTime} min avg)</p>
            </div>
            <div className="rounded-2xl border border-yellow-300/30 bg-slate-900/60 p-5">
              <p className="text-sm text-slate-300">Arrays</p>
              <p className="mt-1 text-lg text-yellow-300">Low accuracy ({sampleUser.recursionAccuracy}%)</p>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="grid items-start gap-6 md:grid-cols-2">
          <div>
            <p className="mb-2 flex items-center gap-2 text-cyan-300">
              <BrainCircuit className="h-4 w-4" /> Digital Twin
            </p>
            <h3 className="text-3xl font-semibold md:text-4xl">Your Learning. Simulated.</h3>
            <p className="mt-3 text-slate-300">
              We mirror your patterns, test strategy shifts, and project the fastest path forward before you spend extra hours.
            </p>
          </div>
          <motion.div
            style={{ y: screenshotY }}
            className="rounded-2xl border border-cyan-300/25 bg-white/5 p-5 backdrop-blur-sm"
          >
            <table className="w-full text-left text-sm">
              <thead className="text-slate-300">
                <tr>
                  <th className="pb-3">Metric</th>
                  <th className="pb-3">Before</th>
                  <th className="pb-3">After</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-white/10">
                  <td className="py-3">Accuracy</td>
                  <td className="py-3 text-red-300">60%</td>
                  <td className="py-3 text-cyan-300">85%</td>
                </tr>
                <tr className="border-t border-white/10">
                  <td className="py-3">Time</td>
                  <td className="py-3 text-red-300">10 min</td>
                  <td className="py-3 text-cyan-300">6 min</td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        </div>
      </Reveal>

      <Reveal>
        <h3 className="mb-5 flex items-center gap-2 text-3xl font-semibold md:text-4xl">
          <Lightbulb className="h-5 w-5 text-violet-300" /> Your Next Best Move
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          {["Practice recursion basics", "Switch to visual learning", "Solve 10 easy problems"].map((item) => (
            <motion.div
              key={item}
              whileHover={{ y: -6 }}
              className="rounded-2xl border border-violet-300/20 bg-white/5 p-5 backdrop-blur-sm"
            >
              {item}
            </motion.div>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <h3 className="mb-5 flex items-center gap-2 text-3xl font-semibold md:text-4xl">
          <Wrench className="h-5 w-5 text-cyan-300" /> Don&apos;t Just Learn. Build.
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {["Sorting visualizer", "Recursion simulator"].map((project) => (
            <motion.div
              key={project}
              whileHover={{ scale: 1.02 }}
              className="rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 p-6"
            >
              <p className="text-lg font-medium">{project}</p>
              <p className="mt-2 text-sm text-slate-300">Project-first learning with instant AI feedback loops.</p>
            </motion.div>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <div className="mb-20 rounded-3xl border border-white/15 bg-white/5 p-8 text-center backdrop-blur-sm md:p-10">
          <p className="mx-auto mb-3 flex w-fit items-center gap-2 text-cyan-300">
            <ChartColumn className="h-4 w-4" /> Problem -&gt; Insight -&gt; Solution
          </p>
          <h4 className="text-3xl font-semibold md:text-5xl">An AI system that optimizes your learning in real time.</h4>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Identify friction, simulate alternatives, and execute the best next action in minutes.
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 text-sm font-semibold text-slate-900"
          >
            Start Optimizing <ArrowRight className="h-4 w-4" />
          </motion.button>
        </div>
      </Reveal>
    </main>
  );
}
