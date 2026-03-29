import { motion } from 'framer-motion';
import { Target, Trophy, Flame, AlertCircle } from 'lucide-react';
import { UserProfile } from '../../types/gamification';

interface PerformanceDashboardProps {
  profile: UserProfile;
}

export function PerformanceDashboard({ profile }: PerformanceDashboardProps) {
  
  // Neon color helper based on accuracy
  const getAccuracyColor = (acc: number) => {
    if (acc >= 80) return 'text-primary drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]';
    if (acc >= 50) return 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]';
    return 'text-destructive drop-shadow-[0_0_8px_rgba(255,0,0,0.5)]';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/40 backdrop-blur-xl border border-border rounded-2xl p-6 space-y-6"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Neural Link Stats
        </h3>
        <span className="text-xs font-mono px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20 uppercase tracking-widest">
          {profile.rank}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Total XP */}
        <div className="bg-muted/30 p-4 rounded-xl border border-border/50 flex flex-col items-center justify-center text-center group hover:bg-muted/50 transition-colors">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Total XP</span>
          <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500 tabular-nums">
            {profile.xp}
          </span>
        </div>

        {/* Streak */}
        <div className="bg-muted/30 p-4 rounded-xl border border-border/50 flex flex-col items-center justify-center text-center group hover:bg-muted/50 transition-colors relative overflow-hidden">
          <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1 justify-center w-full">
            <Flame className="w-3 h-3 text-orange-500" /> Daily Streak
          </span>
          <span className="text-3xl font-bold text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.4)] tabular-nums">
            {profile.streak}
          </span>
        </div>
      </div>

      <div className="bg-muted/30 p-4 rounded-xl border border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Global Accuracy</p>
            <p className="text-xs text-muted-foreground">{profile.questionsAttempted} queries solved</p>
          </div>
        </div>
        <div className={`text-2xl font-bold tabular-nums ${getAccuracyColor(profile.totalAccuracy)}`}>
          {profile.totalAccuracy}%
        </div>
      </div>

      {/* Weak Areas Module */}
      <div className="mt-6 pt-6 border-t border-border/50">
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-destructive" />
          Optimization Required
        </h4>
        
        {profile.weakAreas.length === 0 ? (
          <div className="text-center py-4 bg-muted/20 rounded-lg border border-dashed border-border/50">
            <p className="text-xs text-muted-foreground">All systems optimal. No weak areas detected.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {profile.weakAreas.map((area, idx) => (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                key={idx}
                className="px-3 py-1.5 text-xs font-medium rounded-full bg-destructive/10 text-destructive border border-destructive/20 shadow-[0_0_10px_rgba(255,0,0,0.1)] flex items-center gap-1.5"
              >
                <div className="w-1 h-1 rounded-full bg-destructive animate-pulse" />
                {area}
              </motion.span>
            ))}
          </div>
        )}
      </div>

    </motion.div>
  );
}
