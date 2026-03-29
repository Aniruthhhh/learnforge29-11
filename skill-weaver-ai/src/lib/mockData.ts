export interface SkillNode {
  id: string;
  name: string;
  parent: string | null;
  mastery: number; // 0-100
  avgTime: number; // seconds
  accuracy: number; // 0-100
  attempts: number;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
}

export interface Bottleneck {
  id: string;
  topic: string;
  severity: 'low' | 'medium' | 'critical';
  avgTime: number;
  expectedTime: number;
  accuracy: number;
  expectedAccuracy: number;
  message: string;
  suggestion: string;
}

export interface PerformancePoint {
  date: string;
  accuracy: number;
  speed: number;
  efficiency: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const skillTree: SkillNode[] = [
  { id: 'arrays', name: 'Arrays', parent: null, mastery: 78, avgTime: 45, accuracy: 82, attempts: 24, status: 'completed' },
  { id: 'traversal', name: 'Traversal', parent: 'arrays', mastery: 85, avgTime: 30, accuracy: 90, attempts: 12, status: 'completed' },
  { id: 'searching', name: 'Searching', parent: 'arrays', mastery: 72, avgTime: 55, accuracy: 75, attempts: 18, status: 'completed' },
  { id: 'sorting', name: 'Sorting', parent: 'arrays', mastery: 65, avgTime: 70, accuracy: 68, attempts: 15, status: 'in-progress' },
  { id: 'strings', name: 'Strings', parent: null, mastery: 60, avgTime: 60, accuracy: 65, attempts: 20, status: 'in-progress' },
  { id: 'pattern-match', name: 'Pattern Matching', parent: 'strings', mastery: 45, avgTime: 90, accuracy: 48, attempts: 10, status: 'in-progress' },
  { id: 'recursion', name: 'Recursion', parent: null, mastery: 28, avgTime: 120, accuracy: 32, attempts: 22, status: 'in-progress' },
  { id: 'base-case', name: 'Base Cases', parent: 'recursion', mastery: 40, avgTime: 80, accuracy: 45, attempts: 14, status: 'in-progress' },
  { id: 'tree-recursion', name: 'Tree Recursion', parent: 'recursion', mastery: 15, avgTime: 150, accuracy: 20, attempts: 8, status: 'available' },
  { id: 'dp', name: 'Dynamic Programming', parent: null, mastery: 12, avgTime: 180, accuracy: 18, attempts: 6, status: 'available' },
  { id: 'memoization', name: 'Memoization', parent: 'dp', mastery: 8, avgTime: 200, accuracy: 12, attempts: 3, status: 'locked' },
  { id: 'graphs', name: 'Graphs', parent: null, mastery: 5, avgTime: 0, accuracy: 0, attempts: 0, status: 'locked' },
];

export const bottlenecks: Bottleneck[] = [
  {
    id: 'b1',
    topic: 'Recursion',
    severity: 'critical',
    avgTime: 120,
    expectedTime: 40,
    accuracy: 32,
    expectedAccuracy: 70,
    message: 'You are stuck in Recursion — 3x slower than average',
    suggestion: 'Practice 10 easy recursion problems to build intuition before tackling complex ones',
  },
  {
    id: 'b2',
    topic: 'Pattern Matching',
    severity: 'medium',
    avgTime: 90,
    expectedTime: 50,
    accuracy: 48,
    expectedAccuracy: 72,
    message: 'Pattern Matching needs focused attention — accuracy 33% below target',
    suggestion: 'Switch to visual learning: watch 3 pattern matching walkthroughs',
  },
  {
    id: 'b3',
    topic: 'Sorting Algorithms',
    severity: 'low',
    avgTime: 70,
    expectedTime: 45,
    accuracy: 68,
    expectedAccuracy: 80,
    message: 'Sorting is slightly below optimal — minor speed improvement needed',
    suggestion: 'Try implementing merge sort from scratch to solidify understanding',
  },
];

export const performanceHistory: PerformancePoint[] = [
  { date: 'Week 1', accuracy: 35, speed: 20, efficiency: 28 },
  { date: 'Week 2', accuracy: 42, speed: 30, efficiency: 36 },
  { date: 'Week 3', accuracy: 48, speed: 38, efficiency: 43 },
  { date: 'Week 4', accuracy: 55, speed: 45, efficiency: 50 },
  { date: 'Week 5', accuracy: 58, speed: 52, efficiency: 55 },
  { date: 'Week 6', accuracy: 63, speed: 55, efficiency: 59 },
  { date: 'Week 7', accuracy: 68, speed: 60, efficiency: 64 },
  { date: 'Week 8', accuracy: 72, speed: 65, efficiency: 69 },
];

export const topicHeatmap = [
  { topic: 'Arrays', strength: 82, color: 'high' as const },
  { topic: 'Traversal', strength: 90, color: 'high' as const },
  { topic: 'Searching', strength: 75, color: 'medium' as const },
  { topic: 'Sorting', strength: 68, color: 'medium' as const },
  { topic: 'Strings', strength: 65, color: 'medium' as const },
  { topic: 'Pattern Matching', strength: 48, color: 'low' as const },
  { topic: 'Recursion', strength: 32, color: 'critical' as const },
  { topic: 'Base Cases', strength: 45, color: 'low' as const },
  { topic: 'Tree Recursion', strength: 20, color: 'critical' as const },
  { topic: 'Dynamic Programming', strength: 18, color: 'critical' as const },
  { topic: 'Memoization', strength: 12, color: 'critical' as const },
  { topic: 'Graphs', strength: 0, color: 'critical' as const },
];

export const quizQuestions: QuizQuestion[] = [
  { id: 1, question: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correct: 1, topic: 'Searching', difficulty: 'easy' },
  { id: 2, question: 'Which sorting algorithm has the best average-case time complexity?', options: ['Bubble Sort', 'Selection Sort', 'Merge Sort', 'Insertion Sort'], correct: 2, topic: 'Sorting', difficulty: 'medium' },
  { id: 3, question: 'What is the base case in a recursive fibonacci function?', options: ['n == 0', 'n <= 1', 'n == 2', 'n > 0'], correct: 1, topic: 'Recursion', difficulty: 'easy' },
  { id: 4, question: 'Which data structure uses LIFO principle?', options: ['Queue', 'Stack', 'Array', 'Linked List'], correct: 1, topic: 'Arrays', difficulty: 'easy' },
  { id: 5, question: 'What is memoization used for?', options: ['Memory allocation', 'Caching results', 'Sorting data', 'Graph traversal'], correct: 1, topic: 'Dynamic Programming', difficulty: 'medium' },
  { id: 6, question: 'Time complexity of accessing an array element by index?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], correct: 2, topic: 'Arrays', difficulty: 'easy' },
  { id: 7, question: 'Which traversal visits the root node first?', options: ['Inorder', 'Preorder', 'Postorder', 'Level order'], correct: 1, topic: 'Recursion', difficulty: 'medium' },
  { id: 8, question: 'What does KMP algorithm solve?', options: ['Shortest path', 'Pattern matching', 'Minimum spanning tree', 'Sorting'], correct: 1, topic: 'Strings', difficulty: 'hard' },
];

export const recommendations = [
  {
    id: 'r1',
    type: 'focus' as const,
    title: 'Focus on Recursion Fundamentals',
    description: 'Practice 10 easy recursion problems to improve accuracy by ~25%',
    impact: 25,
    effort: 'medium' as const,
    icon: '🎯',
  },
  {
    id: 'r2',
    type: 'strategy' as const,
    title: 'Switch to Visual Learning for Patterns',
    description: 'Watch 3 video walkthroughs on pattern matching to break through the plateau',
    impact: 18,
    effort: 'low' as const,
    icon: '🎬',
  },
  {
    id: 'r3',
    type: 'project' as const,
    title: 'Build a Sorting Visualizer',
    description: 'Apply your sorting knowledge in a real project to solidify understanding',
    impact: 30,
    effort: 'high' as const,
    icon: '🚀',
  },
  {
    id: 'r4',
    type: 'practice' as const,
    title: 'Reduce Difficulty Temporarily',
    description: 'Drop recursion difficulty to Easy for 5 problems to rebuild confidence',
    impact: 15,
    effort: 'low' as const,
    icon: '📉',
  },
];

export const miniProjects = [
  { id: 'p1', title: 'Sorting Visualizer', skill: 'Sorting', difficulty: 'Medium', description: 'Build an interactive sorting algorithm visualizer with animations' },
  { id: 'p2', title: 'Recursive Art Generator', skill: 'Recursion', difficulty: 'Hard', description: 'Create fractal patterns using recursive functions' },
  { id: 'p3', title: 'Pattern Matcher Tool', skill: 'Strings', difficulty: 'Medium', description: 'Build a regex-like pattern matching engine from scratch' },
  { id: 'p4', title: 'Binary Search Game', skill: 'Searching', difficulty: 'Easy', description: 'Create a number guessing game that teaches binary search' },
];
