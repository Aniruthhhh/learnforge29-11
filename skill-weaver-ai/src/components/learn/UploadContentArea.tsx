import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, Bot, ArrowRight, Loader2, Youtube, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadContentAreaProps {
  onProcess: (content: string) => void;
  isProcessing: boolean;
}

export function UploadContentArea({ onProcess, isProcessing }: UploadContentAreaProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'text' | 'video'>('upload');
  const [text, setText] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        try {
          const { extractTextFromPdf } = await import('@/lib/pdfParser');
          const text = await extractTextFromPdf(file);
          onProcess(text);
        } catch (err: any) {
          console.error('PDF parsing failed:', err);
          import('sonner').then(({ toast }) => {
            toast.error(`PDF Error: ${err.message || 'Could not read file'}`);
          });
        }
      } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
        file.name.endsWith('.docx') || 
        file.name.endsWith('.doc')
      ) {
        try {
          const { extractTextFromDocx } = await import('@/lib/docxParser');
          const text = await extractTextFromDocx(file);
          onProcess(text);
        } catch (err: any) {
          console.error('DOCX parsing failed:', err);
          import('sonner').then(({ toast }) => {
            toast.error(`Word Doc Error: ${err.message || 'Could not read file'}`);
          });
        }
      } else {
        onProcess(`Simulated content from file: ${file.name}. This is a fallback for unsupported file types.`);
      }
    }
  };

  const handleSubmitText = () => {
    if (text.trim()) onProcess(text);
  };

  const handleSubmitVideo = async () => {
    if (youtubeUrl.trim()) {
      try {
        const response = await fetch('http://127.0.0.1:8787/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: youtubeUrl }),
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Could not get transcript');
        
        onProcess(data.text);
      } catch (err: any) {
        console.error('Transcription error:', err);
        import('sonner').then(({ toast }) => {
          toast.error(err.message || 'Does this video have captions enabled?');
        });
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card border border-border rounded-[32px] p-8 shadow-2xl relative overflow-hidden transition-colors duration-500"
    >
      {/* Structural background grain */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />
      <div className="flex items-center gap-4 mb-10 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.1)]">
          <Bot className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase leading-none mb-1">
            Synthesize <span className="text-primary">Knowledge</span>
          </h2>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.2em]">PDFs, Videos, or Notes — Specialized Path Generation.</p>
        </div>
      </div>

      <div className="flex gap-2 mb-8 bg-foreground/5 p-1 rounded-2xl w-fit border border-border relative z-10">
        {[
          { id: 'upload', label: 'Document', icon: FileText },
          { id: 'video', label: 'Video/URL', icon: Youtube },
          { id: 'text', label: 'Raw Text', icon: Layers },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
              activeTab === tab.id 
                ? 'bg-foreground/10 text-foreground shadow-lg' 
                : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
            }`}
          >
            <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-primary' : ''}`} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'upload' ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="border-2 border-dashed border-border hover:border-primary/30 transition-all rounded-[24px] p-16 text-center cursor-pointer relative group overflow-hidden bg-foreground/[0.02]"
            onClick={handleUploadClick}
          >
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <UploadCloud className="w-14 h-14 text-foreground/20 mx-auto mb-6 group-hover:scale-110 transition-transform group-hover:text-primary duration-500" />
            <h3 className="text-xl font-black text-foreground uppercase tracking-tighter mb-2">Upload Study Material</h3>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] max-w-xs mx-auto">PDF, PPTX, or DOCX (Max 20MB)</p>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.ppt,.pptx,.doc,.docx" />
          </motion.div>
        ) : activeTab === 'video' ? (
          <motion.div
            key="video"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="relative">
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="Paste YouTube link or Video URL..."
                className="w-full bg-foreground/5 border border-border rounded-2xl p-5 pr-14 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <Video className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
            </div>
            <Button 
              className="w-full h-14 bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(var(--primary),0.3)] transition-all"
              onClick={handleSubmitVideo}
              disabled={!youtubeUrl.trim() || isProcessing}
            >
              {isProcessing ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <Video className="w-5 h-5 mr-3" />}
              {isProcessing ? 'Synchronizing Neural Stream...' : 'Analyze Video Content'}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="text"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste notes or articles here..."
              className="w-full h-40 bg-foreground/5 border border-border rounded-2xl p-5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all"
            />
            <Button 
              className="w-full h-14 bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(var(--primary),0.3)] transition-all"
              onClick={handleSubmitText}
              disabled={!text.trim() || isProcessing}
            >
              {isProcessing ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <Layers className="w-5 h-5 mr-3" />}
              {isProcessing ? 'Generating Neural Assets...' : 'Generate Neural Path'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {isProcessing && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-10 p-6 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between transition-colors duration-500"
        >
          <div className="flex items-center gap-4">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <div>
              <p className="text-sm font-black text-foreground uppercase tracking-tighter">
                {activeTab === 'video' ? 'AI is Synchronizing Stream...' : 'AI is Synthesisng Material...'}
              </p>
              <p className="text-[10px] text-primary/60 font-bold uppercase tracking-widest">Building flashcards, concepts, and boss levels</p>
            </div>
          </div>
          <div className="w-32 h-1 bg-foreground/10 rounded-full overflow-hidden">
            <motion.div className="h-full bg-primary" animate={{ x: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

const Layers = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);
