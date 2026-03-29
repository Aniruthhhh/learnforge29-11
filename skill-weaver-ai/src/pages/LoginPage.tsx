import { Suspense, lazy, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { quizQuestions } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, Mail, ArrowRight, Sparkles, CheckCircle2, User, Cpu, Zap } from 'lucide-react';

const ImmersiveLanding = lazy(() => import('@/components/NewImmersiveLanding'));

const fadeSlide = {
  initial: { opacity: 0, y: 24, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit:    { opacity: 0, y: -16, filter: 'blur(10px)' },
};
const fadeTransition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] };

export default function LoginPage() {
  const { login, completeOnboarding } = useApp();
  const [step, setStep] = useState<'landing' | 'login' | 'quiz' | 'result'>('landing');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(name || 'Alex Chen', email || 'alex@example.com');
    setStep('quiz');
  };

  const handleDemoLogin = () => { login('Alex Chen', 'alex@example.com'); setStep('quiz'); };
  const handleDemoDashboard = () => { login('Alex Chen', 'alex@example.com'); completeOnboarding('Advanced', 85); };

  const handleAnswer = (idx: number) => {
    setSelectedAnswer(idx);
    setTimeout(() => {
      const newAnswers = [...answers, idx];
      setAnswers(newAnswers);
      setSelectedAnswer(null);
      if (currentQ < quizQuestions.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        const correct = newAnswers.filter((a, i) => a === quizQuestions[i].correct).length;
        const pct = (correct / quizQuestions.length) * 100;
        const level = pct >= 75 ? 'Advanced' : pct >= 45 ? 'Intermediate' : 'Beginner';
        completeOnboarding(level, Math.round(pct));
        setStep('result');
      }
    }, 600);
  };

  const score = answers.filter((a, i) => a === quizQuestions[i]?.correct).length;
  const pct   = Math.round((score / quizQuestions.length) * 100);
  const level = pct >= 75 ? 'Advanced' : pct >= 45 ? 'Intermediate' : 'Beginner';

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${step === 'landing' ? 'bg-[#050505]' : 'bg-[#020305]'} text-white selection:bg-[#00E5FF]/20 selection:text-[#00E5FF]`}>
      <AnimatePresence mode="wait">

        {/* ── Landing ── */}
        {step === 'landing' && (
          <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
            <ImmersiveLanding onEnterApp={() => setStep('login')} />
          </Suspense>
        )}

        {/* ── Auth Shell ── */}
        {step !== 'landing' && (
          <motion.div
            key="auth-shell"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
          >
            {/* Ambient top glow — cyan */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none
              bg-[radial-gradient(ellipse_at_top,rgba(0,229,255,0.07)_0%,transparent_65%)]" />
            {/* Bottom-right — orange */}
            <div className="absolute bottom-0 right-0 w-[500px] h-[400px] pointer-events-none
              bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,138,61,0.04)_0%,transparent_60%)]" />
            {/* Noise texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.025] pointer-events-none" />

            {/* ── Login form ── */}
            {step === 'login' && (
              <motion.div key="login" {...fadeSlide} transition={fadeTransition} className="w-full max-w-[440px] z-10">
                <div className="text-center mb-10">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 shadow-2xl relative"
                    style={{
                      background: 'linear-gradient(135deg, #00E5FF, #4FD1FF)',
                      boxShadow: '0 0 40px rgba(0,229,255,0.4)',
                    }}
                  >
                    <Brain className="w-10 h-10 text-[#020305]" />
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2.5 }}
                      className="absolute inset-0 rounded-3xl border-2 border-[#00E5FF] pointer-events-none"
                    />
                  </motion.div>
                  <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none mb-2"
                    style={{ fontFamily: 'Space Grotesk, sans-serif', textShadow: '0 0 40px rgba(0,229,255,0.2)' }}>
                    Neural Forge
                  </h1>
                  <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#6B8CA6]">
                    Advanced Neural Learning Environment
                  </p>
                </div>

                {/* Card */}
                <div className="rounded-[32px] p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl
                  bg-[rgba(10,15,28,0.9)] border border-[rgba(0,229,255,0.09)]"
                  style={{ boxShadow: '0 0 60px rgba(0,229,255,0.06), 0 30px 80px rgba(0,0,0,0.7)' }}>

                  <div className="absolute top-0 right-0 w-44 h-44 pointer-events-none
                    bg-[radial-gradient(circle_at_top_right,rgba(0,229,255,0.05),transparent_70%)]" />

                  <form onSubmit={handleLogin} className="space-y-5 relative z-10">
                    {[
                      { label: 'Identity', icon: User, type: 'text', placeholder: 'Enter handle', value: name, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value) },
                      { label: 'Network',  icon: Mail, type: 'email', placeholder: 'Email address', value: email, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value) },
                    ].map(({ label, icon: Icon, type, placeholder, value, onChange }) => (
                      <div key={label} className="group space-y-2">
                        <label className="text-[9px] font-black text-[#6B8CA6] uppercase tracking-[0.3em] px-1">{label}</label>
                        <div className="relative">
                          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B8CA6]
                            group-focus-within:text-[#00E5FF] transition-colors duration-300" />
                          <Input
                            type={type} placeholder={placeholder} value={value} onChange={onChange}
                            className="h-14 pl-12 rounded-2xl font-bold text-sm
                              bg-[rgba(255,255,255,0.03)] border border-[rgba(0,229,255,0.1)] text-white
                              focus:border-[rgba(0,229,255,0.4)] focus:shadow-[0_0_20px_rgba(0,229,255,0.12)]
                              placeholder:text-[#4A6A8A] transition-all duration-300"
                          />
                        </div>
                      </div>
                    ))}

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,229,255,0.45)' }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full h-14 rounded-2xl flex items-center justify-center font-black
                        text-[10px] uppercase tracking-[0.25em] gap-3 mt-2 transition-all duration-300
                        text-[#020305]"
                      style={{ background: 'linear-gradient(90deg, #00E5FF, #4FD1FF)', boxShadow: '0 0 20px rgba(0,229,255,0.3)' }}
                    >
                      Establish Link <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </form>

                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[rgba(0,229,255,0.07)]" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-[rgba(10,15,28,0.9)] px-4 text-[8px] font-black uppercase tracking-[0.3em] text-[#4A6A8A]">
                        Neural Bypass
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 relative z-10">
                    <button onClick={handleDemoLogin}
                      className="w-full h-12 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em]
                        flex items-center justify-center gap-3 transition-all duration-300
                        border border-[rgba(0,229,255,0.2)] bg-[rgba(0,229,255,0.05)] text-[#00E5FF]
                        hover:border-[rgba(0,229,255,0.4)] hover:bg-[rgba(0,229,255,0.1)] hover:shadow-[0_0_20px_rgba(0,229,255,0.15)]">
                      <Sparkles className="w-4 h-4" /> Diagnostic Demo
                    </button>
                    <button onClick={handleDemoDashboard}
                      className="w-full h-12 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em]
                        flex items-center justify-center gap-3 transition-all duration-300
                        border border-[rgba(255,138,61,0.15)] bg-[rgba(255,138,61,0.04)] text-[#FF8A3D]
                        hover:border-[rgba(255,138,61,0.3)] hover:bg-[rgba(255,138,61,0.08)]">
                      <Cpu className="w-4 h-4" /> Direct Entry
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Quiz ── */}
            {step === 'quiz' && (
              <motion.div key="quiz" {...fadeSlide} transition={fadeTransition} className="w-full max-w-[520px] z-10">
                <div className="text-center mb-10">
                  <p className="text-[10px] font-black text-[#00E5FF] uppercase tracking-[0.4em] mb-4">Diagnostic Assessment</p>
                  <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Node {currentQ + 1} <span className="text-[#6B8CA6]">/ {quizQuestions.length}</span>
                  </h2>
                  <div className="w-full h-1.5 mt-8 rounded-full overflow-hidden bg-[rgba(255,255,255,0.04)] border border-[rgba(0,229,255,0.08)]">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentQ + 1) / quizQuestions.length) * 100}%` }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      style={{ background: 'linear-gradient(90deg, #00E5FF, #4FD1FF)', boxShadow: '0 0 12px rgba(0,229,255,0.5)' }}
                    />
                  </div>
                </div>

                <div className="rounded-[32px] p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl
                  bg-[rgba(10,15,28,0.9)] border border-[rgba(0,229,255,0.08)]">
                  <div className="absolute top-0 right-0 w-44 h-44 pointer-events-none
                    bg-[radial-gradient(circle_at_top_right,rgba(0,229,255,0.04),transparent_70%)]" />

                  <div className="flex items-center gap-3 mb-6 relative z-10">
                    <span className="px-3 py-1.5 text-[9px] font-black rounded-xl uppercase tracking-widest
                      bg-[rgba(0,229,255,0.08)] text-[#00E5FF] border border-[rgba(0,229,255,0.2)]">
                      {quizQuestions[currentQ].topic}
                    </span>
                    <span className="px-3 py-1.5 text-[9px] font-black rounded-xl uppercase tracking-widest
                      bg-[rgba(255,255,255,0.03)] text-[#6B8CA6] border border-[rgba(255,255,255,0.06)]">
                      {quizQuestions[currentQ].difficulty}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-white leading-snug mb-8 uppercase tracking-tight relative z-10"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {quizQuestions[currentQ].question}
                  </h3>

                  <div className="space-y-3 relative z-10">
                    {quizQuestions[currentQ].options.map((opt, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={selectedAnswer === null ? { scale: 1.01, borderColor: 'rgba(0,229,255,0.25)', backgroundColor: 'rgba(0,229,255,0.04)' } : {}}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswer(idx)}
                        disabled={selectedAnswer !== null}
                        className="w-full text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden"
                        style={{
                          border: selectedAnswer === idx
                            ? idx === quizQuestions[currentQ].correct
                              ? '1px solid rgba(0,229,255,0.5)'
                              : '1px solid rgba(255,138,61,0.5)'
                            : '1px solid rgba(0,229,255,0.07)',
                          background: selectedAnswer === idx
                            ? idx === quizQuestions[currentQ].correct ? 'rgba(0,229,255,0.06)' : 'rgba(255,138,61,0.06)'
                            : 'rgba(255,255,255,0.02)',
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 border transition-all"
                            style={{
                              borderColor: selectedAnswer === idx ? 'rgba(0,229,255,0.3)' : 'rgba(255,255,255,0.08)',
                              background: selectedAnswer === idx ? 'rgba(0,229,255,0.12)' : 'rgba(255,255,255,0.04)',
                              color: selectedAnswer === idx ? '#00E5FF' : '#6B8CA6',
                            }}>
                            {String.fromCharCode(65 + idx)}
                          </div>
                          <span className="text-sm font-black uppercase tracking-wide"
                            style={{ color: selectedAnswer === idx ? '#E6F7FF' : '#A8C7E0' }}>
                            {opt}
                          </span>
                        </div>
                        {selectedAnswer === idx && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 2 }}
                            className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-2xl pointer-events-none"
                            style={{ background: idx === quizQuestions[currentQ].correct ? 'rgba(0,229,255,0.25)' : 'rgba(255,138,61,0.2)' }}
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Result ── */}
            {step === 'result' && (
              <motion.div key="result" {...fadeSlide} transition={fadeTransition} className="w-full max-w-[440px] z-10 text-center">
                <div className="rounded-[40px] p-12 shadow-2xl relative overflow-hidden backdrop-blur-xl
                  bg-[rgba(10,15,28,0.9)] border border-[rgba(0,229,255,0.08)]"
                  style={{ boxShadow: '0 0 80px rgba(0,229,255,0.08), 0 40px 100px rgba(0,0,0,0.7)' }}>

                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 20, delay: 0.4 }}
                    className="w-24 h-24 rounded-[32px] mx-auto mb-8 flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #00E5FF, #4FD1FF)', boxShadow: '0 0 50px rgba(0,229,255,0.4)' }}
                  >
                    <CheckCircle2 className="w-12 h-12 text-[#020305]" />
                  </motion.div>

                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-2"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Neural Link Active
                  </h2>
                  <p className="text-[9px] font-black text-[#6B8CA6] uppercase tracking-[0.3em] mb-10">
                    Diagnostic profile generated
                  </p>

                  <div className="rounded-3xl p-8 mb-8 relative border"
                    style={{ background: 'rgba(0,229,255,0.04)', borderColor: 'rgba(0,229,255,0.12)' }}>
                    <p className="text-[9px] font-black text-[#6B8CA6] uppercase tracking-[0.3em] mb-4">Assigned Tier</p>
                    <p className="text-5xl font-black text-[#00E5FF] tracking-tighter mb-4 uppercase"
                      style={{ fontFamily: 'Space Grotesk, sans-serif', textShadow: '0 0 30px rgba(0,229,255,0.5)' }}>
                      {level}
                    </p>
                    <div className="flex items-center justify-center gap-4 py-3 px-6 rounded-2xl border"
                      style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(0,229,255,0.08)' }}>
                      <span className="text-[10px] font-black text-white tabular-nums">
                        {score} <span className="text-[#6B8CA6] opacity-50">/ {quizQuestions.length}</span>
                      </span>
                      <div className="w-px h-3 bg-[rgba(0,229,255,0.15)]" />
                      <span className="text-[10px] font-black text-[#00E5FF] tabular-nums uppercase tracking-widest">
                        {pct}% Accuracy
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-black text-[#6B8CA6] leading-relaxed px-4 uppercase tracking-wide mb-10">
                    {level === 'Advanced'     ? 'Neural pathways show high plasticity. Redirecting to elite nodes.' :
                     level === 'Intermediate' ? 'Stable neural foundation detected. Commencing skill expansion.' :
                     'Neural bridge established. Starting core stabilization protocol.'}
                  </p>

                  <div className="pt-6 border-t border-[rgba(0,229,255,0.07)]">
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2 }}
                      className="flex items-center justify-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
                      <span className="text-[9px] font-black text-[#00E5FF] uppercase tracking-[0.4em]">
                        Initializing Dashboard...
                      </span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
