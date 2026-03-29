import { ReactNode } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { AppTopNav } from '@/components/AppTopNav';
import { ExpertChatbot } from '@/components/ExpertChatbot';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary transition-colors duration-700 overflow-x-hidden relative">

      {/* ── Ambient Holographic Background Orbs ── */}
      <div className="holo-background-orbs" aria-hidden="true" />

      {/* ── Subtle scan-line noise texture ── */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]
        bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* ── Top ambient glow — primary ── */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] pointer-events-none z-0
        bg-[radial-gradient(ellipse_at_top,rgba(0,229,255,0.06)_0%,transparent_70%)]" />

      {/* ── Bottom-right ambient — energy ── */}
      <div className="fixed bottom-0 right-0 w-[50vw] h-[40vh] pointer-events-none z-0
        bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,138,61,0.04)_0%,transparent_70%)]" />

      {/* ── Sidebar ── */}
      <AppSidebar />

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden relative z-10">
        <AppTopNav />

        <main className="flex-1 p-8 lg:p-10 relative overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key="page-content"
              initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        <ExpertChatbot />
      </div>
    </div>
  );
}
