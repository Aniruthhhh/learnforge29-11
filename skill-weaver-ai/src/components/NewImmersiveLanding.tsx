"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import Navbar from "@/components/LandingNavbar";
import CanvasSequence from "@/components/CanvasSequence";
import ScrollSection from "@/components/ScrollSection";

import { PulseBeams, type BeamPath } from "@/components/ui/pulse-beams";

const beams: BeamPath[] = [
  {
    path: "M269 220.5H16.5C10.9772 220.5 6.5 224.977 6.5 230.5V398.5",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "80%", y2: "100%" },
      animate: {
        x1: ["0%", "0%", "200%"],
        x2: ["0%", "0%", "180%"],
        y1: ["80%", "0%", "0%"],
        y2: ["100%", "20%", "20%"],
      },
      transition: { duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 2, delay: Math.random() * 2 },
    },
    connectionPoints: [{ cx: 6.5, cy: 398.5, r: 6 }, { cx: 269, cy: 220.5, r: 6 }]
  },
  {
    path: "M568 200H841C846.523 200 851 195.523 851 190V40",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "80%", y2: "100%" },
      animate: {
        x1: ["20%", "100%", "100%"],
        x2: ["0%", "90%", "90%"],
        y1: ["80%", "80%", "-20%"],
        y2: ["100%", "100%", "0%"],
      },
      transition: { duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 2, delay: Math.random() * 2 },
    },
    connectionPoints: [{ cx: 851, cy: 34, r: 6.5 }, { cx: 568, cy: 200, r: 6 }]
  },
  {
    path: "M425.5 274V333C425.5 338.523 421.023 343 415.5 343H152C146.477 343 142 347.477 142 353V426.5",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "80%", y2: "100%" },
      animate: {
        x1: ["20%", "100%", "100%"],
        x2: ["0%", "90%", "90%"],
        y1: ["80%", "80%", "-20%"],
        y2: ["100%", "100%", "0%"],
      },
      transition: { duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 2, delay: Math.random() * 2 },
    },
    connectionPoints: [{ cx: 142, cy: 427, r: 6.5 }, { cx: 425.5, cy: 274, r: 6 }]
  },
  {
    path: "M493 274V333.226C493 338.749 497.477 343.226 503 343.226H760C765.523 343.226 770 347.703 770 353.226V427",
    gradientConfig: {
      initial: { x1: "40%", x2: "50%", y1: "160%", y2: "180%" },
      animate: { x1: "0%", x2: "10%", y1: "-40%", y2: "-20%" },
      transition: { duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 2, delay: Math.random() * 2 },
    },
    connectionPoints: [{ cx: 770, cy: 427, r: 6.5 }, { cx: 493, cy: 274, r: 6 }]
  },
  {
    path: "M380 168V17C380 11.4772 384.477 7 390 7H414",
    gradientConfig: {
      initial: { x1: "-40%", x2: "-10%", y1: "0%", y2: "20%" },
      animate: {
        x1: ["40%", "0%", "0%"],
        x2: ["10%", "0%", "0%"],
        y1: ["0%", "0%", "180%"],
        y2: ["20%", "20%", "200%"],
      },
      transition: { duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 2, delay: Math.random() * 2 },
    },
    connectionPoints: [{ cx: 420.5, cy: 6.5, r: 6 }, { cx: 380, cy: 168, r: 6 }]
  }
];

const gradientColors = { start: "#00E5FF", middle: "#4FD1FF", end: "#FF8A3D" };

export default function NewImmersiveLanding({ onEnterApp }: { onEnterApp: () => void }) {
  const { scrollYProgress } = useScroll();

  // Dim canvas slightly when text is showing
  const bgOpacity = useTransform(
    scrollYProgress,
    [
      0, 0.02, 0.08, 0.12, 
      0.15, 0.18, 0.28, 0.32, 
      0.35, 0.38, 0.48, 0.52, 
      0.55, 0.58, 0.68, 0.72, 
      0.75, 0.78, 0.85, 0.88, 
      0.90, 0.92, 0.98, 1.0
    ],
    [
      1, 0.75, 0.75, 1,
      1, 0.75, 0.75, 1,
      1, 0.75, 0.75, 1,
      1, 0.75, 0.75, 1,
      1, 0.75, 0.75, 1,
      1, 0.75, 0.75, 1,
    ]
  );

  return (
    <main className="w-full bg-[#050505] min-h-screen text-white selection:bg-primary/30">
      <Navbar onEnterApp={onEnterApp} />

      <div className="relative w-full h-[600vh]">
        {/* Sticky Background Canvas Animation setup */}
        <div className="sticky top-0 w-full h-screen overflow-hidden z-0 bg-[#050505]">
          <motion.div style={{ opacity: bgOpacity }} className="w-full h-full object-cover">
            <CanvasSequence progress={scrollYProgress} />
          </motion.div>
          
          {/* Subtle radial gradient overlay to blend edges */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)] opacity-60 pointer-events-none" />
          
          {/* Light gradient cinematic overlay for premium effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30 pointer-events-none z-10" />

          {/* Scrollytelling Absolute Texts Container */}
          <ScrollSection
            progress={scrollYProgress}
            range={[0, 0.02, 0.08, 0.12]}
            headline="Stop Learning. Start Forging."
            subhead="LearnForge AI analyzes how you learn and builds the fastest path to mastery."
            alignment="center"
          />

          <ScrollSection
            progress={scrollYProgress}
            range={[0.15, 0.18, 0.28, 0.32]}
            headline="We break down your learning."
            subhead="Every action, every mistake, every second — analyzed."
            alignment="left"
          />

          <ScrollSection
            progress={scrollYProgress}
            range={[0.35, 0.38, 0.48, 0.52]}
            headline="Find where you're stuck."
            subhead="Hidden inefficiencies. Exposed instantly."
            alignment="right"
          />

          <ScrollSection
            progress={scrollYProgress}
            range={[0.55, 0.58, 0.68, 0.72]}
            headline="We build your learning model."
            subhead="A digital twin that understands how you learn — and what actually works."
            alignment="left"
          />

          <ScrollSection
            progress={scrollYProgress}
            range={[0.75, 0.78, 0.85, 0.88]}
            headline="Simulate before you act."
            subhead="Test strategies. Predict outcomes. Optimize instantly."
            alignment="center"
          />

          <ScrollSection
            progress={scrollYProgress}
            range={[0.90, 0.92, 0.98, 1.0]}
            headline="Forge your skills."
            subhead="Learning, optimized."
            alignment="center"
          />
        </div>
      </div>

      <div className="w-full bg-[#050505] flex items-center justify-center py-32 relative z-20">
        <PulseBeams
          beams={beams}
          gradientColors={gradientColors}
          className="bg-transparent"
        >
          <motion.button 
            onClick={onEnterApp}
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group cursor-pointer relative rounded-full p-px text-xs font-semibold leading-6 text-white inline-block overflow-visible"
          >
            {/* High-Fidelity Energy Resonance Glow */}
            <motion.div 
              animate={{ 
                opacity: [0, 0.2, 1, 0.2, 0],
                scale: [0.98, 1, 1.05, 1, 0.98],
                filter: ["blur(8px)", "blur(16px)", "blur(24px)", "blur(16px)", "blur(8px)"]
              }}
              transition={{
                duration: 2, 
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut"
              }}
              className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#00E5FF] via-[#4FD1FF] to-[#FF8A3D] opacity-0 z-0 pointer-events-none"
            />

            <div className="relative flex justify-center w-[220px] text-center space-x-2 h-[64px] items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 overflow-hidden">
              {/* Subtle hover internal glow */}
              <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(0,229,255,0.25)_0%,rgba(0,229,255,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              
              <span className="text-xl font-bold inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#00E5FF] via-[#4FD1FF] to-[#FF8A3D] tracking-tight">
                Start Forging
              </span>
            </div>
          </motion.button>
        </PulseBeams>
      </div>
    </main>
  );
}
