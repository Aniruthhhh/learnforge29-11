import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flashcard } from '@/types/gamification';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCw, Brain } from 'lucide-react';

interface FlashcardDeckProps {
  cards: Flashcard[];
}

export function FlashcardDeck({ cards }: FlashcardDeckProps) {
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!cards || cards.length === 0) return null;

  const currentCard = cards[index];

  const handleNext = () => {
    setIsFlipped(false);
    setIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="relative w-full max-w-md min-h-[320px] perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={index + (isFlipped ? '-flipped' : '')}
            initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full h-full min-h-[320px] cursor-pointer"
          >
            <Card className={`w-full h-full min-h-[320px] flex flex-col items-center justify-center p-8 text-center border-2 transition-colors duration-500 shadow-2xl relative ${
              isFlipped ? 'bg-primary/5 border-primary/40' : 'bg-card/40 border-border/40 hover:border-primary/30'
            }`}>
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
              
              <div className="relative z-10 w-full flex flex-col items-center">
                <div className="mb-4 flex justify-center">
                  <div className={`p-2.5 rounded-full ${isFlipped ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    <Brain className="w-6 h-6" />
                  </div>
                </div>
                
                <div className="w-full max-h-[200px] overflow-y-auto no-scrollbar py-2">
                  <h3 className="text-lg md:text-xl font-medium text-foreground leading-relaxed">
                    {isFlipped ? currentCard.answer : currentCard.question}
                  </h3>
                </div>
                
                <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border/20">
                  <RotateCw className="w-3 h-3" />
                  <span>Click to Flip</span>
                </div>
              </div>

              {/* Card Badge */}
              <div className="absolute top-4 right-4 text-[10px] font-bold uppercase bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20">
                {currentCard.difficulty}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-6">
        <Button variant="outline" size="icon" onClick={handlePrev} className="rounded-full w-12 h-12 border-border/40 hover:bg-primary/10">
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <div className="text-sm font-bold tabular-nums bg-muted/30 px-4 py-2 rounded-full border border-border/20">
          {index + 1} / {cards.length}
        </div>
        <Button variant="outline" size="icon" onClick={handleNext} className="rounded-full w-12 h-12 border-border/40 hover:bg-primary/10">
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      <p className="text-xs text-muted-foreground max-w-sm text-center italic">
        "Active recall is the fastest way to commit new information to long-term memory."
      </p>
    </div>
  );
}
