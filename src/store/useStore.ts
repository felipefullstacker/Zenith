import { create } from 'zustand';
import { Theme, UserProfile, User, Task, Habit, WorkoutSession, WarriorProgress, BodyMetric } from '../types';
import * as api from '../api';

const emptyWarrior = (): WarriorProgress => ({ id: '', userId: '', startDate: '', daysRemaining: 14, streak: 0, relapses: [], triggers: [], createdAt: '' });
const emptyData = () => ({ profile: null, tasks: [], habits: [], waterToday: 0, workoutSessions: [], warrior: emptyWarrior(), bodyMetrics: [] });
let generation = 0;
let refreshVersion = 0;

interface AppState {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  initialized: boolean;
  loading: boolean;
  saving: boolean;
  error: string | null;
  notice: string | null;
  theme: Theme;
  currentScreen: string;
  tasks: Task[];
  habits: Habit[];
  waterToday: number;
  workoutSessions: WorkoutSession[];
  warrior: WarriorProgress;
  bodyMetrics: BodyMetric[];
  login: (user: User) => void;
  logout: () => void;
  initialize: () => void;
  setTheme: (theme: Theme) => void;
  setCurrentScreen: (screen: string) => void;
  refresh: () => Promise<boolean>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<boolean>;
  updateUser: (user: Partial<User>) => Promise<boolean>;
  addTask: (task: Pick<Task, 'title' | 'priority' | 'dueDate'>) => Promise<boolean>;
  completeTask: (id: string) => Promise<boolean>;
  postponeTask: (id: string) => Promise<boolean>;
  addHabit: (name: string) => Promise<boolean>;
  completeHabit: (id: string) => Promise<boolean>;
  addWater: (amount: number) => Promise<boolean>;
  addWorkoutSession: (session: WorkoutSession) => Promise<boolean>;
  checkInWarrior: () => Promise<boolean>;
  addTrigger: (trigger: string, strategy: string) => Promise<boolean>;
  addBodyMetric: (weight: number) => Promise<boolean>;
}

export const useStore = create<AppState>((set, get) => {
  const mutate = async (operation: (userId: string) => PromiseLike<{ error: unknown }>) => {
    const userId = get().user?.id;
    if (!userId || get().saving || get().loading) return false;
    const version = generation;
    set({ saving: true, error: null, notice: null });
    try {
      const { error } = await operation(userId);
      if (error) throw error;
      if (version !== generation) return false;
      await get().refresh();
      return version === generation;
    } catch (error) {
      if (version === generation) set({ error: error instanceof Error ? error.message : (error as { message?: string })?.message || 'Não foi possível salvar. Tente novamente.' });
      return false;
    } finally {
      if (version === generation) set({ saving: false });
    }
  };
  return {
    ...emptyData(), user: null, isAuthenticated: false, initialized: false, loading: false, saving: false, error: null, notice: null, theme: 'dark', currentScreen: 'Home',
    login: (user) => {
      if (get().user?.id === user.id) { set({ user: { ...get().user!, email: user.email } }); return; }
      generation += 1;
      set({ ...emptyData(), user, isAuthenticated: true, loading: true, saving: false, error: null, notice: null });
      setTimeout(() => { if (get().user?.id === user.id) void get().refresh(); }, 0);
    },
    logout: () => { generation += 1; set({ ...emptyData(), user: null, isAuthenticated: false, loading: false, saving: false, error: null, notice: null, currentScreen: 'Home' }); },
    initialize: () => set({ initialized: true }),
    setTheme: (theme) => set({ theme }),
    setCurrentScreen: (currentScreen) => set({ currentScreen }),
    refresh: async () => {
      const user = get().user;
      if (!user) return false;
      const version = generation;
      const request = ++refreshVersion;
      set({ loading: true, error: null });
      try {
        const data = await api.loadDashboard(user.id);
        if (version !== generation || request !== refreshVersion) return false;
        set({ ...data, warrior: data.warrior || emptyWarrior(), user: { ...get().user!, ...data.user } });
        return true;
      } catch (error) {
        if (version === generation && request === refreshVersion) set({ error: (error as { message?: string })?.message || 'Não foi possível carregar seus dados.' });
        return false;
      } finally {
        if (version === generation && request === refreshVersion) set({ loading: false });
      }
    },
    updateProfile: (profile) => mutate(userId => api.updateUserProfile(userId, profile)),
    updateUser: (user) => mutate(async userId => {
      if (!user.name?.trim()) throw new Error('Informe seu nome.');
      if (user.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email.trim())) throw new Error('Informe um e-mail válido.');
      const result = await api.saveUser(userId, { ...user, name: user.name.trim() });
      if (result.error) return result;
      if (user.email && user.email.trim() !== get().user?.email) {
        const auth = await api.supabase.auth.updateUser({ email: user.email.trim() });
        if (auth.error) return auth;
        if (get().user?.id === userId) set({ notice: 'Perfil salvo. Confirme a alteração de e-mail pelos links enviados.' });
      }
      return result;
    }),
    addTask: (task) => mutate(userId => {
      if (!task.title.trim()) throw new Error('Informe o título da tarefa.');
      return api.createTask({ ...task, title: task.title.trim(), userId, completed: false });
    }),
    completeTask: (id) => mutate(userId => api.saveTask(userId, id, { concluida: true, concluida_em: new Date().toISOString() })),
    postponeTask: (id) => mutate(userId => {
      const task = get().tasks.find(item => item.id === id);
      if (!task) throw new Error('Tarefa não encontrada.');
      const date = task.dueDate ? new Date(task.dueDate) : new Date(); date.setDate(date.getDate() + 1);
      return api.saveTask(userId, id, { data_vencimento: date.toISOString() });
    }),
    addHabit: (name) => mutate(userId => {
      if (!name.trim()) throw new Error('Informe o nome do hábito.');
      return api.createHabit({ userId, name: name.trim(), frequency: 'daily' });
    }),
    completeHabit: (id) => mutate(userId => {
      const habit = get().habits.find(item => item.id === id);
      if (!habit) throw new Error('Hábito não encontrado.');
      return api.completeHabit(userId, habit);
    }),
    addWater: (amount) => mutate(userId => {
      if (!Number.isInteger(amount) || amount <= 0) throw new Error('Quantidade de água inválida.');
      return api.logWater(amount, userId);
    }),
    addWorkoutSession: (session) => mutate(userId => api.createWorkoutSession({ ...session, userId })),
    checkInWarrior: () => mutate(userId => api.checkInWarrior(userId, get().warrior)),
    addTrigger: (trigger, strategy) => mutate(async userId => {
      if (!trigger.trim()) throw new Error('Descreva o gatilho.');
      const warrior = get().warrior;
      if (!warrior.id || warrior.userId !== userId) throw new Error('Faça seu primeiro check-in antes de registrar gatilhos.');
      return api.logTrigger(warrior.id, trigger.trim(), strategy.trim());
    }),
    addBodyMetric: (weight) => mutate(userId => {
      if (!Number.isFinite(weight) || weight <= 0 || weight >= 1000) throw new Error('Informe um peso válido em kg.');
      return api.createBodyMetric({ userId, date: api.localDate(), weight, measurements: [] });
    }),
  };
});
