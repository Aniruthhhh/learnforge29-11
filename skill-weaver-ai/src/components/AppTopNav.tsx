import { motion } from 'framer-motion';
import { Box, Activity, MessageSquare, Search, Bell, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

export function AppTopNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useApp();

  const tabs = [
    { id: '/', label: 'Dashboard', icon: Box },
    { id: '/learn', label: 'Neural Forge', icon: Activity },
    { id: '/analytics', label: 'Monitor', icon: MessageSquare },
  ];

  return (
    <header className="h-20 px-8 lg:px-10 flex items-center justify-between sticky top-0 z-40
      transition-colors duration-500"
      style={{
        background: 'var(--nav-surface)',
        borderBottom: '1px solid var(--nav-border-c)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}>

      {/* ── Navigation Tabs ── */}
      <div className="flex items-center gap-5">
        <nav className="flex gap-1 p-1 rounded-2xl"
          style={{
            background: 'var(--glass-surface)',
            border: '1px solid var(--glass-border-c)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          }}>
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => navigate(tab.id)}
                whileTap={{ scale: 0.97 }}
                className="relative flex items-center gap-2 px-5 py-2 rounded-xl text-[11px] font-black
                  uppercase tracking-[0.15em] transition-all duration-300 overflow-hidden"
                style={{
                  color: isActive ? '#00C8FF' : 'var(--text-low)',
                  background: isActive ? 'var(--glass-surface-2)' : 'transparent',
                }}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}

                {/* Active gradient underline */}
                {isActive && (
                  <motion.div
                    layoutId="nav-active-line"
                    className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #00C8FF, #4FD1FF)',
                      boxShadow: '0 0 8px rgba(0,200,255,0.5)',
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Search */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
          style={{
            background: 'var(--glass-surface)',
            border: '1px solid var(--glass-border-c)',
            color: 'var(--text-low)',
          }}
        >
          <Search className="w-4 h-4" />
        </motion.button>
      </div>

      {/* ── Right: Profile & Actions ── */}
      <div className="flex items-center gap-4">
        {/* User info */}
        <div className="text-right hidden sm:block">
          <p className="text-sm font-black tracking-tight leading-none mb-1 uppercase"
            style={{ color: 'hsl(var(--foreground))' }}>
            {user.name}
          </p>
          <p className="text-[10px] font-black uppercase tracking-widest"
            style={{ color: '#00C8FF' }}>
            {user.level}
          </p>
        </div>

        {/* Avatar */}
        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-11 h-11 rounded-xl overflow-hidden cursor-pointer flex items-center justify-center
              transition-all duration-300"
            style={{
              background: 'var(--glass-surface)',
              border: '2px solid var(--glass-border-c)',
            }}
          >
            <User className="w-5 h-5" style={{ color: '#00C8FF' }} />
          </motion.div>
          {/* Notification badge — orange */}
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full border-2
            flex items-center justify-center text-[9px] font-black text-white"
            style={{
              background: 'linear-gradient(135deg, #FF8A3D, #FFB347)',
              borderColor: 'hsl(var(--background))',
              boxShadow: '0 0 8px rgba(255,138,61,0.4)',
            }}>
            🔥
          </div>
        </div>

        {/* Bell */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
          style={{
            background: 'var(--glass-surface)',
            border: '1px solid var(--glass-border-c)',
            color: 'var(--text-low)',
          }}
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#00C8FF]
            shadow-[0_0_6px_rgba(0,200,255,0.8)]" />
        </motion.button>

        <ThemeToggle />
      </div>
    </header>
  );
}
