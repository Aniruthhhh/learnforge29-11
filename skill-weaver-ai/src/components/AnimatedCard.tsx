import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function AnimatedCard({ children, delay = 0, className = '' }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.6, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionReveal({ children, delay = 0, className = '' }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: 'blur(3px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
