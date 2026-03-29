import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Level } from '../../types/gamification';
import { Zap, Shield, AlertCircle, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

interface QuizArenaProps {
  level: Level;
  onComplete: (score: number, weakTopics: string[], accuracy: number) => void;
  onClose: () => void;
}

export function QuizArena({ level, onComplete, onClose }: QuizArenaProps) {
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [incorrectTopics, setIncorrectTopics] = useState<string[]>([]);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  if (!level.questions || level.questions.length === 0) {
    return (
      <div className="p-10 text-center rounded-[28px] border border-[rgba(0,229,255,0.1)]
        bg-[rgba(10,15,28,0.9)] backdrop-blur-xl">
        <AlertCircle className="w-12 h-12 text-[#FF8A3D] mx-auto mb-4 drop-shadow-[0_0_10px_rgba(255,138,61,0.5)]" />
        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3">Node Malfunction</h3>
        <p className="text-[#6B8CA6] text-sm font-bold uppercase tracking-wide mb-6">No pedagogical data found.</p>
        <Button onClick={onClose}
          className="bg-gradient-to-r from-[#00E5FF] to-[#4FD1FF] text-[#020305] font-black uppercase tracking-widest
            shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)]">
          Back to Map
        </Button>
      </div>
    );
  }

  const question = level.questions[currentQIdx];
  const isBoss = level.difficulty === 'boss';
  const progress = (currentQIdx / level.questions.length) * 100;

  const handleSelectAnswer = (idx: number) => {
    if (isAnswerRevealed) return;
    setSelectedAnswer(idx);
    setIsAnswerRevealed(true);
    if (idx === question.correctAnswer) {
      setScore(prev => prev + 10);
      setCorrectAnswersCount(prev => prev + 1);
      confetti({ particleCount: 35, spread: 45, origin: { y: 0.8 }, colors: ['#00E5FF', '#4FD1FF', '#7AD7FF'] });
    } else {
      setIncorrectTopics(prev => prev.includes(question.topic) ? prev : [...prev, question.topic]);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsAnswerRevealed(false);
    if (currentQIdx < level.questions.length - 1) {
      setCurrentQIdx(prev => prev + 1);
    } else {
      const accuracy = Math.round((correctAnswersCount / level.questions.length) * 100);
      if (accuracy >= 50 || isBoss) {
        confetti({ particleCount: 160, spread: 80, origin: { y: 0.6 }, colors: ['#00E5FF', '#FFD27F', '#FF8A3D'] });
      }
      onComplete(score, incorrectTopics, accuracy);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, filter: 'blur(8px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.97, filter: 'blur(8px)' }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-[32px] p-10 shadow-2xl backdrop-blur-xl
        bg-[rgba(10,15,28,0.92)] border border-[rgba(0,229,255,0.08)]"
      style={{
        boxShadow: isBoss
          ? '0 0 60px rgba(255,50,50,0.1), 0 20px 80px rgba(0,0,0,0.6)'
          : '0 0 60px rgba(0,229,255,0.06), 0 20px 80px rgba(0,0,0,0.6)',
      }}
    >
      {/* Ambient corner glow */}
      <div className="absolute top-0 right-0 w-56 h-56 pointer-events-none"
        style={{
          background: isBoss
            ? 'radial-gradient(circle at top right, rgba(255,50,50,0.06), transparent 70%)'
            : 'radial-gradient(circle at top right, rgba(0,229,255,0.05), transparent 70%)',
        }}
      />

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-[rgba(0,229,255,0.06)] relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border"
            style={{
              background: isBoss ? 'rgba(255,50,50,0.1)'  : 'rgba(0,229,255,0.08)',
              borderColor: isBoss ? 'rgba(255,50,50,0.2)' : 'rgba(0,229,255,0.15)',
              boxShadow:   isBoss ? '0 0 15px rgba(255,50,50,0.2)' : '0 0 15px rgba(0,229,255,0.15)',
            }}>
            {isBoss
              ? <Shield className="w-5 h-5 text-red-400" />
              : <Zap className="w-5 h-5 text-[#00E5FF] drop-shadow-[0_0_6px_rgba(0,229,255,0.8)]" />
            }
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-tight uppercase leading-none"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {level.title}
            </h2>
            <p className="text-[9px] text-[#6B8CA6] uppercase tracking-[0.3em] mt-1">
              Node {currentQIdx + 1} of {level.questions.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-right">
            <p className="text-[9px] uppercase font-black text-[#6B8CA6] tracking-widest mb-1">XP</p>
            <p className="text-xl font-black tabular-nums text-[#00E5FF] drop-shadow-[0_0_10px_rgba(0,229,255,0.6)]"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              +{score}
            </p>
          </div>
          <button onClick={onClose}
            className="text-[9px] font-black uppercase tracking-widest text-[#6B8CA6] hover:text-white
              px-4 py-2 rounded-xl border border-[rgba(255,255,255,0.06)] hover:border-[rgba(0,229,255,0.15)]
              transition-all duration-300">
            Abort
          </button>
        </div>
      </div>

      {/* ── Progress Bar ── */}
      <div className="w-full h-1.5 rounded-full overflow-hidden mb-8 bg-[rgba(255,255,255,0.04)] relative z-10">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: `${progress}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
          style={{
            background: isBoss
              ? 'linear-gradient(90deg, #FF4444, #FF8A3D)'
              : 'linear-gradient(90deg, #00E5FF, #4FD1FF)',
            boxShadow: isBoss
              ? '0 0 10px rgba(255,68,68,0.5)'
              : '0 0 10px rgba(0,229,255,0.5)',
          }}
        />
      </div>

      {/* ── Question ── */}
      <div className="mb-8 min-h-[100px] flex flex-col items-center justify-center text-center relative z-10">
        {question.category && (
          <span className="px-4 py-1.5 rounded-full mb-4 text-[9px] font-black uppercase tracking-[0.3em]"
            style={{
              background: 'rgba(0,229,255,0.08)',
              color: '#00E5FF',
              border: '1px solid rgba(0,229,255,0.2)',
            }}>
            {question.category}
          </span>
        )}
        <h3 className="text-xl md:text-2xl font-black text-center text-white leading-snug px-4 uppercase tracking-tight"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          {question.question}
        </h3>
      </div>

      {/* ── Options Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 relative z-10">
        {question.options.map((opt, idx) => {
          const isSelected = selectedAnswer === idx;
          const isCorrect  = idx === question.correctAnswer;

          let borderColor = 'rgba(0,229,255,0.08)';
          let background  = 'rgba(255,255,255,0.02)';
          let textColor   = '#A8C7E0';
          let shadow      = 'none';

          if (isAnswerRevealed) {
            if (isCorrect) {
              borderColor = 'rgba(0,229,255,0.5)';
              background  = 'rgba(0,229,255,0.06)';
              textColor   = '#00E5FF';
              shadow      = '0 0 20px rgba(0,229,255,0.2)';
            } else if (isSelected) {
              borderColor = 'rgba(255,138,61,0.5)';
              background  = 'rgba(255,138,61,0.06)';
              textColor   = '#FF8A3D';
              shadow      = '0 0 15px rgba(255,138,61,0.15)';
            } else {
              background  = 'rgba(255,255,255,0.01)';
              textColor   = '#4A6A8A';
            }
          } else if (isSelected) {
            borderColor = 'rgba(0,229,255,0.4)';
            background  = 'rgba(0,229,255,0.08)';
            textColor   = '#00E5FF';
            shadow      = '0 0 15px rgba(0,229,255,0.15)';
          }

          return (
            <motion.button
              key={idx}
              whileHover={!isAnswerRevealed ? {
                scale: 1.02,
                borderColor: 'rgba(0,229,255,0.25)',
                backgroundColor: 'rgba(0,229,255,0.04)',
              } : {}}
              whileTap={!isAnswerRevealed ? { scale: 0.98 } : {}}
              onClick={() => handleSelectAnswer(idx)}
              disabled={isAnswerRevealed}
              className="p-5 rounded-2xl border-2 text-left relative transition-all duration-300 overflow-hidden"
              style={{ borderColor, background, boxShadow: shadow }}
            >
              <div className="flex items-start justify-between gap-3 relative z-10">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-black mt-0.5 border"
                    style={{
                      borderColor: borderColor,
                      background: `${background.replace(/0\.0\d/, '0.1')}`,
                      color: textColor,
                    }}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-sm font-bold leading-snug uppercase tracking-wide" style={{ color: textColor }}>
                    {opt}
                  </span>
                </div>
                <div className="shrink-0 pt-0.5">
                  {isAnswerRevealed && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
                  )}
                  {isAnswerRevealed && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-[#FF8A3D] drop-shadow-[0_0_8px_rgba(255,138,61,0.8)]" />
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* ── Explanation ── */}
      <AnimatePresence>
        {isAnswerRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            className="p-5 rounded-2xl mb-6 flex gap-4 relative z-10"
            style={{
              background: selectedAnswer === question.correctAnswer
                ? 'rgba(0,229,255,0.04)'
                : 'rgba(255,138,61,0.04)',
              border: `1px solid ${selectedAnswer === question.correctAnswer ? 'rgba(0,229,255,0.2)' : 'rgba(255,138,61,0.2)'}`,
            }}
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5"
              style={{ color: selectedAnswer === question.correctAnswer ? '#00E5FF' : '#FF8A3D' }} />
            <div className="flex-1">
              <p className="font-black mb-2 uppercase tracking-widest text-sm"
                style={{ color: selectedAnswer === question.correctAnswer ? '#00E5FF' : '#FF8A3D' }}>
                {selectedAnswer === question.correctAnswer ? 'Mastery Insight' : 'Refinement Needed'}
              </p>
              <p className="text-sm text-[#A8C7E0] leading-relaxed uppercase tracking-wide font-bold">
                {question.explanation}
              </p>
              {question.answerPoints && question.answerPoints.length > 0 && (
                <div className="pt-4 border-t border-[rgba(0,229,255,0.1)] mt-4">
                  <p className="text-[9px] uppercase font-black text-[#6B8CA6] tracking-widest mb-3">
                    Ideal Answer Points
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {question.answerPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#6B8CA6] font-bold uppercase tracking-wide">
                        <span className="text-[#00E5FF] mt-0.5">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Next CTA ── */}
      <div className="flex justify-end relative z-10">
        <motion.button
          onClick={handleNext}
          disabled={!isAnswerRevealed}
          whileHover={isAnswerRevealed ? {
            scale: 1.02,
            boxShadow: '0 0 30px rgba(0,229,255,0.4)',
          } : {}}
          whileTap={isAnswerRevealed ? { scale: 0.97 } : {}}
          className="min-w-[160px] h-13 py-3 px-8 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em]
            flex items-center justify-center gap-2 transition-all duration-300"
          style={{
            background: isAnswerRevealed
              ? 'linear-gradient(90deg, #00E5FF, #4FD1FF)'
              : 'rgba(255,255,255,0.04)',
            color: isAnswerRevealed ? '#020305' : '#4A6A8A',
            boxShadow: isAnswerRevealed ? '0 0 20px rgba(0,229,255,0.3)' : 'none',
            border: isAnswerRevealed ? 'none' : '1px solid rgba(255,255,255,0.06)',
            cursor: isAnswerRevealed ? 'pointer' : 'default',
          }}
        >
          {currentQIdx < level.questions.length - 1 ? (
            <>Continue <ChevronRight className="w-4 h-4" /></>
          ) : (
            'Complete Node'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
