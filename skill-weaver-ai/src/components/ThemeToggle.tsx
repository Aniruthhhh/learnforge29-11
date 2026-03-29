"use client";

import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return (
    <div className="w-10 h-10 rounded-xl border border-[rgba(0,229,255,0.1)] bg-[rgba(0,229,255,0.04)] opacity-0" />
  );

  const isDark = theme === 'dark';

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      className={`relative w-10 h-10 rounded-xl border flex items-center justify-center
        overflow-hidden transition-all duration-300 ${
        isDark
          ? 'border-[rgba(0,229,255,0.15)] bg-[rgba(0,229,255,0.06)] hover:border-[rgba(0,229,255,0.35)] hover:shadow-[0_0_20px_rgba(0,229,255,0.2)]'
          : 'border-[rgba(255,138,61,0.2)] bg-[rgba(255,138,61,0.08)] hover:border-[rgba(255,138,61,0.4)] hover:shadow-[0_0_20px_rgba(255,138,61,0.2)]'
      }`}
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ y: 16, opacity: 0, rotate: 30 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -16, opacity: 0, rotate: -30 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <Moon className="w-4 h-4 text-[#00E5FF] drop-shadow-[0_0_6px_rgba(0,229,255,0.8)]" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: 16, opacity: 0, rotate: -30 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -16, opacity: 0, rotate: 30 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <Sun className="w-4 h-4 text-[#FF8A3D] drop-shadow-[0_0_6px_rgba(255,138,61,0.8)]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background glow pulse on hover */}
      <div className={`absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
        isDark ? 'bg-[radial-gradient(circle,rgba(0,229,255,0.12)_0%,transparent_70%)]'
               : 'bg-[radial-gradient(circle,rgba(255,138,61,0.12)_0%,transparent_70%)]'
      }`} />
    </motion.button>
  );
}
