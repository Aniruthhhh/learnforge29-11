import { motion } from 'framer-motion';
import { LayoutGrid, Brain, LineChart, ShieldAlert, Zap, Plus, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useApp();

  const navItems = [
    { icon: LayoutGrid, id: 'dashboard', path: '/', label: 'Dashboard' },
    { icon: Brain, id: 'learn', path: '/learn', label: 'Neural Forge' },
    { icon: LineChart, id: 'analytics', path: '/analytics', label: 'Analytics' },
    { icon: ShieldAlert, id: 'bottlenecks', path: '/bottlenecks', label: 'Stress Test' },
    { icon: Zap, id: 'simulation', path: '/simulation', label: 'Simulation' },
  ];

  return (
    <aside className="w-20 flex flex-col items-center py-8 gap-6 h-screen sticky top-0 z-50
      transition-colors duration-500"
      style={{
        background: 'var(--sidebar-surface)',
        borderRight: '1px solid var(--sidebar-border-c)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}>

      {/* ── Logo ── */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/')}
        className="relative w-12 h-12 rounded-2xl cursor-pointer mb-4 flex items-center justify-center
          transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, #00C8FF, #4FD1FF)',
          boxShadow: '0 0 25px rgba(0,200,255,0.35)',
        }}
      >
        <Brain className="w-7 h-7 text-white" />
        {/* Pulse ring */}
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-2xl border-2 border-[#00C8FF] pointer-events-none"
        />
      </motion.div>

      {/* Divider */}
      <div className="w-8 h-px" style={{ background: 'linear-gradient(to right, transparent, var(--glass-border-c), transparent)' }} />

      {/* ── Nav ── */}
      <nav className="flex flex-col gap-3 flex-1 w-full items-center">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div key={item.id} className="relative group">
              <motion.button
                onClick={() => navigate(item.path)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative"
                style={{
                  background: isActive ? 'var(--glass-surface)' : 'transparent',
                  border: isActive ? '1px solid var(--glass-border-c)' : '1px solid transparent',
                  color: isActive ? '#00C8FF' : 'var(--text-low)',
                  boxShadow: isActive ? '0 0 18px rgba(0,200,255,0.2)' : 'none',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.border = '1px solid var(--glass-border-c)';
                    (e.currentTarget as HTMLButtonElement).style.background = 'var(--glass-surface)';
                    (e.currentTarget as HTMLButtonElement).style.color = '#00C8FF';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.border = '1px solid transparent';
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-low)';
                  }
                }}
              >
                <item.icon className="w-5 h-5" />

                {/* Active left indicator */}
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                    style={{ background: 'linear-gradient(180deg, #00C8FF, #4FD1FF)', boxShadow: '0 0 10px rgba(0,200,255,0.5)' }}
                  />
                )}
              </motion.button>

              {/* Tooltip */}
              <div className="absolute left-16 top-1/2 -translate-y-1/2
                px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100
                pointer-events-none transition-all duration-200 translate-x-[-8px] group-hover:translate-x-0
                whitespace-nowrap z-50 text-[10px] font-black uppercase tracking-widest"
                style={{
                  background: 'var(--glass-surface)',
                  border: '1px solid var(--glass-border-c)',
                  color: '#00C8FF',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  backdropFilter: 'blur(16px)',
                }}>
                {item.label}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent"
                  style={{ borderRightColor: 'var(--glass-border-c)' }} />
              </div>
            </div>
          );
        })}
      </nav>

      {/* ── Bottom Actions ── */}
      <div className="flex flex-col gap-3 mb-2">
        <div className="w-8 h-px mx-auto" style={{ background: 'linear-gradient(to right, transparent, var(--glass-border-c), transparent)' }} />

        <motion.button
          whileHover={{ scale: 1.08, rotate: 90 }}
          whileTap={{ scale: 0.92 }}
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300"
          style={{
            background: 'var(--glass-surface)',
            border: '1px solid var(--glass-border-c)',
            color: 'var(--text-muted-c)',
          }}
        >
          <Plus className="w-5 h-5" />
        </motion.button>

        <motion.button
          onClick={logout}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300
            hover:text-red-500 hover:border-red-400/40 hover:bg-red-500/5"
          style={{
            border: '1px solid var(--glass-border-c)',
            color: 'var(--text-low)',
          }}
        >
          <LogOut className="w-4 h-4" />
        </motion.button>
      </div>
    </aside>
  );
}
