// Zenith Types & Interfaces

export type Theme = 'dark' | 'light';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colors: Record<string, string>;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  goals?: string[];
  createdAt: string;
  lastLogin?: string;
}

export interface UserProfile {
  userId: string;
  age?: number;
  height?: number; // cm
  weight?: number; // kg
  bodyFat?: number; // percentage
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goals?: string[];
  equipment?: Equipment[];
  createdAt: string;
  updatedAt: string;
}

export type Equipment = 
  | 'bodyweight'
  | 'dumbbells'
  | 'resistance_bands'
  | 'kettlebell'
  | 'pull_up_bar'
  | 'bench'
  | 'yoga_mat';

export interface WorkoutSession {
  id: string;
  userId: string;
  date: string;
  startTime: string;
  endTime?: string;
  duration?: number; // minutes
  exercises: WorkoutExercise[];
  totalSets?: number;
  totalReps?: number;
  rpe?: number;
  difficulty?: 'easy' | 'moderate' | 'hard' | 'very_hard';
  notes?: string;
  createdAt: string;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  sets: Set[];
  notes?: string;
}

export interface Set {
  id: string;
  order: number;
  reps?: number;
  weight?: number;
  time?: number; // seconds
  rpe?: number;
  note?: string;
  completed: boolean;
  createdAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  primaryMuscle: string;
  secondaryMuscles: string[];
  equipment: Equipment[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  commonMistakes: string[];
  progressionOptions: string[];
  imageUrl?: string;
  videoUrl?: string;
  createdAt: string;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly';
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
  streak: number;
  lastCompleted?: string;
  createdAt: string;
}

export interface WaterLog {
  id: string;
  userId: string;
  amount: number; // ml
  timestamp: string;
  createdAt: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

export interface WarriorProgress {
  id: string;
  userId: string;
  startDate: string;
  endDate?: string;
  daysRemaining: number;
  lastCheckIn?: string;
  streak: number;
  relapses: number[];
  triggers: TriggerLog[];
  createdAt: string;
}

export interface TriggerLog {
  id: string;
  warriorProgressId: string;
  trigger: string;
  timestamp: string;
  copingStrategy?: string;
}

export interface BodyMetric {
  id: string;
  userId: string;
  date: string;
  weight?: number;
  bodyFat?: number;
  measurements: BodyMeasurement[];
  photoUrl?: string;
  notes?: string;
  createdAt: string;
}

export interface BodyMeasurement {
  name: string;
  value: number; // cm
}

export interface Achievement {
  id: string;
  userId: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'fitness' | 'habit' | 'warrior' | 'productivity';
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  name: string;
  description?: string;
  frequency: string;
  exercises: PlanExercise[];
  createdAt: string;
  version: number;
}

export interface PlanExercise {
  exerciseId: string;
  sets: number;
  reps: string;
  restSeconds: number;
  notes?: string;
}
