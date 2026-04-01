import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Send, User, Bot, Sparkles, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function StudyBuddyPanel() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm your Neural Assistant. I've analyzed your content—ask me anything about it!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState<'beginner' | 'friendly' | 'expert'>('expert');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userInput: input, 
          chatHistory: messages,
          mode: mode 
        }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I lost my connection to the neural grid. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] glass-card-holo rounded-2xl overflow-hidden shadow-2xl relative">
      <div className="neural-mesh opacity-10" />

      {/* Header */}
      <div className="p-4 border-b border-primary/10 bg-primary/5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 animate-hologram-flicker">
            <Brain className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Neural Assistant</h4>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse shadow-[0_0_6px_#00E5FF]" />
              <span className="text-[8px] text-[#6B8CA6] font-bold uppercase tracking-widest">Active • Mesh Linked</span>
            </div>
          </div>
        </div>
        
        <select 
          value={mode} 
          onChange={(e) => setMode(e.target.value as any)}
          className="bg-[rgba(10,15,28,0.6)] border border-primary/20 rounded-lg px-2 py-1 text-[8px] font-black text-primary focus:outline-none uppercase tracking-widest cursor-pointer hover:border-primary/40 transition-colors"
        >
          <option value="expert">EXPERT</option>
          <option value="friendly">FRIENDLY</option>
          <option value="beginner">BEGINNER</option>
        </select>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-5 no-scrollbar scroll-smooth relative z-10"
      >
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-3 rounded-2xl text-[11px] font-medium leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-[#00E5FF] text-slate-950 font-bold rounded-tr-none shadow-[0_4px_20px_rgba(0,229,255,0.3)]' 
                : 'bg-slate-900/40 backdrop-blur-md border border-[rgba(0,229,255,0.2)] text-[#E2E8F0] rounded-tl-none shadow-xl'
            }`}>
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-1.5 mb-1 opacity-50">
                  <Bot className="w-3 h-3" />
                  <span className="text-[8px] font-black uppercase tracking-tighter">Transmission</span>
                </div>
              )}
              {msg.content}
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-900/40 backdrop-blur-md border border-[rgba(0,229,255,0.1)] p-3 rounded-2xl rounded-tl-none ring-1 ring-[#00E5FF]/20">
              <div className="flex gap-1.5">
                {[0, 0.2, 0.4].map((delay) => (
                  <motion.span 
                    key={delay}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay }}
                    className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full shadow-[0_0_6px_#00E5FF]" 
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-primary/10 bg-primary/5 relative z-10">
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Query the neural grid..."
            className="w-full bg-[rgba(10,15,28,0.6)] border border-primary/20 rounded-xl py-3.5 pl-4 pr-12 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all group-hover:border-primary/40 focus:border-primary/50"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary text-slate-950 hover:bg-[#4FD1FF] transition-all disabled:opacity-30 disabled:grayscale shadow-[0_0_15px_rgba(0,229,255,0.3)]"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-2.5 flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] text-[#6B8CA6]">
          <Command className="w-2.5 h-2.5" />
          <span>System Ready • Press Enter to transmit</span>
        </div>
      </div>
    </div>
  );
}
