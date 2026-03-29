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
      const response = await fetch('http://localhost:8787/api/chat', {
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
    <div className="flex flex-col h-[500px] bg-card/40 backdrop-blur-xl border border-primary/20 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-border/40 bg-muted/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
            <Brain className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground">Neural Assistant</h4>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Active • GPT-4o</span>
            </div>
          </div>
        </div>
        
        <select 
          value={mode} 
          onChange={(e) => setMode(e.target.value as any)}
          className="bg-background/50 border border-border/40 rounded-lg px-2 py-1 text-[10px] font-bold text-primary focus:outline-none"
        >
          <option value="expert">EXPERT</option>
          <option value="friendly">FRIENDLY</option>
          <option value="beginner">BEGINNER</option>
        </select>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar scroll-smooth"
      >
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-primary text-primary-foreground rounded-tr-none shadow-lg' 
                : 'bg-muted/50 border border-border/40 text-foreground rounded-tl-none'
            }`}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted/50 border border-border/40 p-3 rounded-2xl rounded-tl-none">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/40 bg-muted/10">
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            className="w-full bg-background/50 border border-border/40 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all group-hover:border-primary/30"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-center gap-2 text-[9px] text-muted-foreground">
          <Command className="w-2.5 h-2.5" />
          <span>Press Enter to send</span>
        </div>
      </div>
    </div>
  );
}
