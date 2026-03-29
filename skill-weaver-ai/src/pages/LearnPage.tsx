import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedCard } from '@/components/AnimatedCard';

import { UploadContentArea } from '@/components/learn/UploadContentArea';
import { GameMap } from '@/components/learn/GameMap';
import { QuizArena } from '@/components/learn/QuizArena';
import { PerformanceDashboard } from '@/components/learn/PerformanceDashboard';
import { FlashcardDeck } from '@/components/learn/FlashcardDeck';
import { ConceptGuide } from '@/components/learn/ConceptGuide';
import { StudyPackGenerator } from '@/components/learn/StudyPackGenerator';
import { LearnSidebar } from '@/components/learn/LearnSidebar';
import { LearnTopNav } from '@/components/learn/LearnTopNav';
import { DashboardView } from '@/components/learn/DashboardView';

import { Level, UserProfile, GameSession, Flashcard, Concept } from '@/types/gamification';
import { generateGameFromText } from '@/lib/gameEngineSimulation';
import { Brain, ArrowLeft, AlertCircle, Map as MapIcon, BookOpen, Layers, Lightbulb, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { StudyBuddyPanel } from '@/components/learn/StudyBuddyPanel';

type ViewMode = 'map' | 'flashcards' | 'concepts' | 'pack';

export default function LearnPage() {
  const [profile, setProfile] = useState<UserProfile>({
    xp: 0,
    rank: 'Novice Scholar',
    streak: 1,
    weakAreas: [],
    totalAccuracy: 0,
    questionsAttempted: 0,
    questionsCorrect: 0,
  });

  const [session, setSession] = useState<GameSession & { flashcards: Flashcard[], concepts: Concept[], summary: string }>({
    levels: [],
    currentLevelId: null,
    status: 'idle',
    flashcards: [],
    concepts: [],
    summary: '',
  });

  const [activeView, setActiveView] = useState<ViewMode>('map');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeQuizLevel, setActiveQuizLevel] = useState<Level | null>(null);
  const [backendStatus, setBackendStatus] = useState<{ configured: boolean; model: string } | null>(null);

  useState(() => {
    fetch('http://localhost:8787/api/chat/status')
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(d => setBackendStatus({ configured: d.openaiConfigured, model: d.model }))
      .catch(() => setBackendStatus({ configured: false, model: 'offline' }));
  });

  const handleProcessContent = async (content: string) => {
    setIsProcessing(true);
    const id = toast.loading('Architecting your Neural Path...');
    
    try {
      const response = await fetch('http://127.0.0.1:8787/api/generate-assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 503) {
          toast.dismiss(id);
          toast.info('OpenAI Quota Exceeded. Entering Demo Mode...');
          const simData = generateGameFromText(content);
          setSession({
            levels: simData.levels,
            currentLevelId: null,
            status: 'playing',
            flashcards: simData.flashcards || [],
            concepts: simData.concepts || [],
            summary: simData.summary || 'Demo path active.',
          });
          setActiveView('map');
          return;
        }
        throw new Error(data.error || 'Failed to generate assets');
      }
      
      setSession({
        levels: data.levels,
        currentLevelId: null,
        status: 'playing',
        flashcards: data.flashcards || [],
        concepts: data.concepts || [],
        summary: data.summary || '',
      });
      setActiveView('map');
      toast.success('Neural Path Synchronized!', { id });
    } catch (err: any) {
      console.error('AI Processing Error:', err);
      toast.error(err.message || 'Failed to generate specialized quiz.', { id });
      // We do NOT fallback to simulation here anymore as per request to remove silent failures
      // unless it was a quota issue (handled above)
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectLevel = (levelId: string) => {
    const level = session.levels.find(l => l.id === levelId);
    if (level && level.isUnlocked) {
      setActiveQuizLevel(level);
    }
  };

  const handleCompleteQuiz = (score: number, weakTopics: string[], accuracy: number) => {
    if (!activeQuizLevel) return;

    const updatedProfile = { ...profile };
    updatedProfile.questionsAttempted += activeQuizLevel.questions.length;
    updatedProfile.questionsCorrect += activeQuizLevel.questions.length * (accuracy / 100);
    updatedProfile.xp += score;
    
    weakTopics.forEach(topic => {
      if (!updatedProfile.weakAreas.includes(topic)) updatedProfile.weakAreas.push(topic);
    });

    updatedProfile.totalAccuracy = Math.round((updatedProfile.questionsCorrect / updatedProfile.questionsAttempted) * 100) || 0;
    
    if (updatedProfile.xp < 100) updatedProfile.rank = 'Novice Scholar';
    else if (updatedProfile.xp < 300) updatedProfile.rank = 'Apprentice Learner';
    else if (updatedProfile.xp < 600) updatedProfile.rank = 'Knowledge Seeker';
    else updatedProfile.rank = 'Adept Thinker';

    setProfile(updatedProfile);

    const currentLevIndex = session.levels.findIndex(l => l.id === activeQuizLevel.id);
    const newLevels = [...session.levels];
    newLevels[currentLevIndex] = { ...newLevels[currentLevIndex], isCompleted: true, score };

    if (currentLevIndex + 1 < newLevels.length) {
      newLevels[currentLevIndex + 1] = { ...newLevels[currentLevIndex + 1], isUnlocked: true };
    }

    setSession({ ...session, levels: newLevels });
    setTimeout(() => setActiveQuizLevel(null), 1500);
  };

  return (
    <div className="h-full">
      <AnimatePresence mode="wait">
        {activeQuizLevel ? (
          <motion.div key="quiz" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-4xl mx-auto">
            <QuizArena level={activeQuizLevel} onComplete={handleCompleteQuiz} onClose={() => setActiveQuizLevel(null)} />
          </motion.div>
        ) : session.status === 'idle' ? (
          <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
             <UploadContentArea onProcess={handleProcessContent} isProcessing={isProcessing} />
          </motion.div>
        ) : (
          <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
            {/* Inner Module Selection - High Fidelity Style */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/10 shadow-2xl">
                {[
                  { id: 'map', label: 'Neural Path', icon: MapIcon },
                  { id: 'flashcards', label: 'Flashcards', icon: Layers },
                  { id: 'concepts', label: 'Concept Guide', icon: Lightbulb },
                  { id: 'pack', label: 'Study Pack', icon: FileText },
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveView(tab.id as ViewMode)}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeView === tab.id 
                        ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]' 
                        : 'text-muted-foreground hover:text-white'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </motion.button>
                ))}
              </div>
              
              <Button variant="outline" onClick={() => setSession({ ...session, status: 'idle' })} className="rounded-xl border-white/10 hover:bg-white/5 text-xs font-bold uppercase tracking-widest h-10 px-6">
                <ArrowLeft className="w-4 h-4 mr-2" /> New Neural Path
              </Button>
            </div>

            <div className="flex-1">
              <AnimatePresence mode="wait">
                {activeView === 'map' && (
                  <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#141414] border border-white/5 rounded-[32px] p-10 shadow-2xl min-h-[500px] relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                    <div className="relative z-10 py-10">
                      <GameMap levels={session.levels} onSelectLevel={handleSelectLevel} />
                    </div>
                  </motion.div>
                )}

                {activeView === 'flashcards' && (
                  <motion.div key="fc" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <FlashcardDeck cards={session.flashcards} />
                  </motion.div>
                )}

                {activeView === 'concepts' && (
                  <motion.div key="concepts" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                    <ConceptGuide concepts={session.concepts} />
                  </motion.div>
                )}

                {activeView === 'pack' && (
                  <motion.div key="pack" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <StudyPackGenerator 
                      summary={session.summary} 
                      levels={session.levels} 
                      flashcards={session.flashcards} 
                      concepts={session.concepts}
                      topicTitle={session.levels[0]?.title}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
