import { Level, UserProfile } from '../types/gamification';

// Helper to determine next rank based on XP
export const calculateRank = (xp: number): string => {
  if (xp < 100) return 'Novice Scholar';
  if (xp < 300) return 'Apprentice Learner';
  if (xp < 600) return 'Knowledge Seeker';
  if (xp < 1000) return 'Adept Thinker';
  return 'Master Intellect';
};

// Simulate AI generation of game levels based on text
export const generateGameFromText = (text: string): { 
  levels: Level[], 
  flashcards: any[], 
  concepts: any[], 
  summary: string 
} => {
  const snippet = text.slice(0, 30) + '...';
  
  const mockLevels: Level[] = [
    {
      id: 'lvl_1',
      title: 'Level 1: Conceptual Foundation',
      description: 'Test deep understanding, not just definitions.',
      difficulty: 'easy',
      isUnlocked: true,
      isCompleted: false,
      score: 0,
      questions: [
        {
          id: 'q1',
          topic: 'Foundations',
          question: `Regarding "${snippet}", what is the core conceptual dependency?`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 0,
          explanation: 'Simulation mode. Connect OpenAI API for real analysis.',
          difficulty: 'easy',
          category: 'Conceptual'
        }
      ]
    },
    {
      id: 'lvl_2',
      title: 'Level 2: Practical Application',
      description: 'Real-world scenarios and problem-solving.',
      difficulty: 'medium',
      isUnlocked: false,
      isCompleted: false,
      score: 0,
      questions: [
        {
          id: 'q2',
          topic: 'Application',
          question: `How would you apply "${snippet}" to a production-scale system?`,
          options: ['Scaling Out', 'Scaling Up', 'Encapsulation', 'Abstraction'],
          correctAnswer: 0,
          explanation: 'Simulation mode.',
          difficulty: 'medium',
          category: 'Application'
        }
      ]
    },
    {
      id: 'lvl_3',
      title: 'Level 3: Analytical Deep Dive',
      description: 'Trade-offs and cause-effect relationships.',
      difficulty: 'hard',
      isUnlocked: false,
      isCompleted: false,
      score: 0,
      questions: [
        {
          id: 'q3',
          topic: 'Analysis',
          question: `Compare the primary trade-offs of using ${snippet} versus traditional methods.`,
          options: ['Cost vs Speed', 'Safety vs Performance', 'Flexibility vs Rigidity', 'All of the above'],
          correctAnswer: 3,
          explanation: 'Complex systems involve multiple trade-offs.',
          difficulty: 'hard',
          category: 'Analytical'
        }
      ]
    },
    {
      id: 'lvl_4',
      title: 'Level 4: Tricky Misconceptions',
      description: 'Targeting common errors and edge cases.',
      difficulty: 'hard',
      isUnlocked: false,
      isCompleted: false,
      score: 0,
      questions: [
        {
          id: 'q4',
          topic: 'Logic',
          question: `Which of these is a common misconception about ${snippet}?`,
          options: ['It is fully automated', 'It has zero latency', 'It is only for experts', 'It is always cheaper'],
          correctAnswer: 0,
          explanation: 'Real-world documents often highlight that manual intervention is key.',
          difficulty: 'hard',
          category: 'Tricky'
        }
      ]
    },
    {
      id: 'lvl_5',
      title: 'Level 5: Exam-Level Challenge',
      description: 'High-complexity structured thinking.',
      difficulty: 'boss',
      isUnlocked: false,
      isCompleted: false,
      score: 0,
      questions: [
        {
          id: 'q5',
          topic: 'Mastery',
          question: `Synthesize the entire argument for ${snippet} in a future-proof context.`,
          options: ['Paradigm Shift', 'Incremental Gain', 'Legacy Replacement', 'Niche Tool'],
          correctAnswer: 0,
          explanation: 'True mastery identifies long-term paradigm shifts.',
          difficulty: 'boss',
          category: 'Exam-Level',
          answerPoints: ['Point A', 'Point B', 'Point C']
        }
      ]
    }
  ];

  const mockFlashcards = [
    { question: `What is the primary focus of "${snippet}"?`, answer: "Content-specific synthesis and active recall.", difficulty: "easy" },
    { question: "How does the Neural Path adapt?", answer: "By tracking performance across conceptual categories.", difficulty: "medium" }
  ];

  const mockConcepts = [
    { title: "Conceptual Dependency", definition: "A foundational building block required to understand more complex logic.", relationship: "Links Level 1 to Level 5." },
    { title: "Active Recall", definition: "The process of retrieving information from memory without prompts.", relationship: "Powered by the Flashcard system." }
  ];

  return { 
    levels: mockLevels,
    flashcards: mockFlashcards,
    concepts: mockConcepts,
    summary: `DEMO MODE: This is a synthesized summary for "${snippet}". To enable real GPT-4o analysis, please provide your OpenAI API Key.`
  };
};

export const updatePerformanceStats = (
  profile: UserProfile, 
  topic: string, 
  isCorrect: boolean
): UserProfile => {
  const newProfile = { ...profile };
  newProfile.questionsAttempted += 1;
  if (isCorrect) {
    newProfile.xp += 10;
    newProfile.questionsCorrect += 1;
  } else {
    if (!newProfile.weakAreas.includes(topic)) {
      newProfile.weakAreas = [...newProfile.weakAreas, topic];
    }
  }
  newProfile.totalAccuracy = Math.round((newProfile.questionsCorrect / newProfile.questionsAttempted) * 100) || 0;
  newProfile.rank = calculateRank(newProfile.xp);
  return newProfile;
};
