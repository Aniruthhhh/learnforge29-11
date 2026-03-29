import { motion } from 'framer-motion';
import { Concept } from '@/types/gamification';
import { Card } from '@/components/ui/card';
import { Target, Link, Zap } from 'lucide-react';

interface ConceptGuideProps {
  concepts: Concept[];
}

export function ConceptGuide({ concepts }: ConceptGuideProps) {
  if (!concepts || concepts.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {concepts.map((concept, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="p-6 bg-card/40 border-border/40 hover:border-primary/30 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10 flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary border border-primary/20">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {concept.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {concept.definition}
                  </p>
                  
                  {concept.relationship && (
                    <div className="flex items-start gap-2 p-2 bg-muted/30 rounded-lg border border-border/20">
                      <Link className="w-3 h-3 text-primary mt-1 shrink-0" />
                      <p className="text-[10px] text-muted-foreground italic leading-tight">
                        <span className="font-bold text-foreground/80 not-italic mr-1">Connection:</span>
                        {concept.relationship}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-full text-primary">
          <Zap className="w-4 h-4" />
        </div>
        <p className="text-xs text-muted-foreground italic">
          AI synthesized these core concepts by identifying recurring patterns and fundamental dependencies in your source material.
        </p>
      </div>
    </div>
  );
}
