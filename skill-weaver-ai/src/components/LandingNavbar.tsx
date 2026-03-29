"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import GradientMenu from "@/components/ui/gradient-menu";

export default function Navbar({ onEnterApp }: { onEnterApp: () => void }) {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-3 bg-black/40 backdrop-blur-md border-b border-white/10"
    >
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold tracking-tight text-white">LearnForge</span>
      </div>

      <div className="hidden md:flex flex-1 justify-center">
        <GradientMenu />
      </div>

      <LiquidButton size="sm" onClick={onEnterApp}>
        Start Forging
      </LiquidButton>
    </motion.nav>
  );
}
