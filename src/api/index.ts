import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { UserProfile, User, WorkoutSession, Habit, Task, BodyMetric, Achievement, WarriorProgress } from '../types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) throw new Error('Configure as variáveis EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY.');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: true },
});

export const localDate = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
export const previousDate = () => { const date = new Date(); date.setDate(date.getDate() - 1); return localDate(date); };
const priorities = { low: 'baixa', medium: 'media', high: 'alta' };
const activities = { sedentary: 'sedentario', light: 'leve', moderate: 'moderado', active: 'ativo', very_active: 'muito_ativo' };
type Row = Record<string, any>;

export const mapTask = (row: Row): Task => ({ id: row.id, userId: row.usuario_id, title: row.titulo, description: row.descricao, priority: row.prioridade === 'alta' ? 'high' : row.prioridade === 'baixa' ? 'low' : 'medium', dueDate: row.data_vencimento, completed: row.concluida, completedAt: row.concluida_em, createdAt: row.criado_em });
export const mapHabit = (row: Row): Habit => ({ id: row.id, userId: row.usuario_id, name: row.nome, description: row.descricao, frequency: row.frequencia === 'semanal' ? 'weekly' : 'daily', daysOfWeek: row.dias_da_semana, streak: row.sequencia, lastCompleted: row.ultimo_concluido_em, createdAt: row.criado_em });
export const mapWorkout = (row: Row): WorkoutSession => ({ id: row.id, userId: row.usuario_id, date: row.data, startTime: row.inicio, endTime: row.fim, duration: row.duracao_minutos, exercises: row.exercicios, totalSets: row.total_series, totalReps: row.total_repeticoes, rpe: row.esforco_percebido, difficulty: row.dificuldade, notes: row.observacoes, createdAt: row.criado_em });
export const mapMetric = (row: Row): BodyMetric => ({ id: row.id, userId: row.usuario_id, date: row.data, weight: row.peso, bodyFat: row.percentual_gordura, measurements: Array.isArray(row.medidas) ? row.medidas : [], photoUrl: row.foto_url, notes: row.observacoes, createdAt: row.criado_em });
export const mapWarrior = (row: Row): WarriorProgress => ({ id: row.id, userId: row.usuario_id, startDate: row.data_inicio, endDate: row.data_fim, daysRemaining: Math.max(0, 14 - row.sequencia), streak: row.sequencia, relapses: row.recaidas, lastCheckIn: row.sequencia > 0 ? row.atualizado_em : undefined, triggers: (row.registros_gatilhos || []).map((trigger: Row) => ({ id: trigger.id, warriorProgressId: trigger.progresso_id, trigger: trigger.gatilho, timestamp: trigger.registrado_em, copingStrategy: trigger.estrategia })), createdAt: row.criado_em });

export async function signIn(email: string, password: string) { return supabase.auth.signInWithPassword({ email, password }); }
export async function signUp(email: string, password: string, name: string) { return supabase.auth.signUp({ email, password, options: { data: { name } } }); }
export async function resendConfirmation(email: string) { return supabase.auth.resend({ type: 'signup', email }); }
export async function signOut() { const { error } = await supabase.auth.signOut(); return error; }

export async function getUserProfile(userId: string) { return supabase.from('perfis').select('*').eq('id', userId).single(); }
export async function updateUserProfile(userId: string, profile: Partial<UserProfile>) {
  return supabase.from('perfis').update({ idade: profile.age, altura: profile.height, objetivos: profile.goals, nivel_atividade: profile.activityLevel ? activities[profile.activityLevel] : undefined }).eq('id', userId).select().single();
}
export async function saveUser(userId: string, user: Partial<User>) {
  return supabase.from('perfis').update({ nome: user.name, telefone: user.phone, biografia: user.bio, avatar_url: user.avatar, objetivos: user.goals }).eq('id', userId).select().single();
}
export async function createTask(task: Omit<Task, 'id' | 'createdAt'>) {
  return supabase.from('tarefas').insert({ usuario_id: task.userId, titulo: task.title, descricao: task.description, prioridade: priorities[task.priority], data_vencimento: task.dueDate, concluida: task.completed }).select().single();
}
export async function getTasks(userId: string, completed?: boolean) {
  let query = supabase.from('tarefas').select('*').eq('usuario_id', userId).order('data_vencimento', { ascending: true, nullsFirst: false });
  if (completed !== undefined) query = query.eq('concluida', completed);
  return query;
}
export async function saveTask(userId: string, id: string, values: { concluida?: boolean; concluida_em?: string; data_vencimento?: string }) {
  return supabase.from('tarefas').update(values).eq('usuario_id', userId).eq('id', id).select().single();
}
export async function createHabit(habit: Omit<Habit, 'id' | 'createdAt' | 'streak'>) {
  return supabase.from('habitos').insert({ usuario_id: habit.userId, nome: habit.name, descricao: habit.description, frequencia: habit.frequency === 'weekly' ? 'semanal' : 'diaria', dias_da_semana: habit.daysOfWeek }).select().single();
}
export async function completeHabit(userId: string, habit: Habit) {
  const now = new Date();
  const last = habit.lastCompleted ? localDate(new Date(habit.lastCompleted)) : '';
  if (last === localDate(now)) return { data: null, error: null };
  const consecutive = habit.frequency === 'weekly' ? !!habit.lastCompleted && now.getTime() - new Date(habit.lastCompleted).getTime() < 8 * 86400000 : last === previousDate();
  let query = supabase.from('habitos').update({ sequencia: consecutive ? habit.streak + 1 : 1, ultimo_concluido_em: now.toISOString() }).eq('usuario_id', userId).eq('id', habit.id);
  query = habit.lastCompleted ? query.eq('ultimo_concluido_em', habit.lastCompleted) : query.is('ultimo_concluido_em', null);
  return query.select().maybeSingle();
}
export async function logWater(amount: number, userId: string) { return supabase.from('registros_agua').insert({ quantidade_ml: amount, usuario_id: userId }); }
export async function getDailyWater(userId: string, date: string) {
  const start = new Date(`${date}T00:00:00`);
  const end = new Date(start); end.setDate(end.getDate() + 1);
  return supabase.from('registros_agua').select('quantidade_ml').eq('usuario_id', userId).gte('registrado_em', start.toISOString()).lt('registrado_em', end.toISOString());
}
export async function createWorkoutSession(session: Omit<WorkoutSession, 'id' | 'createdAt'>) {
  return supabase.from('sessoes_treino').insert({ usuario_id: session.userId, data: session.date, inicio: session.startTime, fim: session.endTime, duracao_minutos: session.duration, exercicios: session.exercises, total_series: session.totalSets, total_repeticoes: session.totalReps, esforco_percebido: session.rpe, dificuldade: session.difficulty, observacoes: session.notes }).select().single();
}
export async function getWorkoutSessions(userId: string) { return supabase.from('sessoes_treino').select('*').eq('usuario_id', userId).order('inicio', { ascending: false }); }
export async function createBodyMetric(metric: Omit<BodyMetric, 'id' | 'createdAt'>) {
  return supabase.from('metricas_corporais').insert({ usuario_id: metric.userId, data: metric.date, peso: metric.weight, percentual_gordura: metric.bodyFat, medidas: metric.measurements, foto_url: metric.photoUrl, observacoes: metric.notes }).select().single();
}
export async function getBodyMetrics(userId: string, limit = 30) { return supabase.from('metricas_corporais').select('*').eq('usuario_id', userId).order('data', { ascending: false }).order('criado_em', { ascending: false }).limit(limit); }
export async function unlockAchievement(achievement: Omit<Achievement, 'id' | 'unlockedAt'>) { return supabase.from('conquistas').insert({ usuario_id: achievement.userId, titulo: achievement.title, descricao: achievement.description, icone: achievement.icon, categoria: achievement.category }); }
export async function getWarrior(userId: string) { return supabase.from('progresso_guerreiro').select('*, registros_gatilhos(*)').eq('usuario_id', userId).order('criado_em', { ascending: false }).limit(1).maybeSingle(); }
export async function checkInWarrior(userId: string, warrior: WarriorProgress) {
  if (!warrior.id) return supabase.from('progresso_guerreiro').insert({ usuario_id: userId, data_inicio: localDate(), sequencia: 1 }).select('*, registros_gatilhos(*)').single();
  const last = warrior.lastCheckIn ? localDate(new Date(warrior.lastCheckIn)) : '';
  if (last === localDate()) return { data: null, error: null };
  let query = supabase.from('progresso_guerreiro').update({ sequencia: last === previousDate() ? warrior.streak + 1 : 1 }).eq('usuario_id', userId).eq('id', warrior.id);
  if (warrior.lastCheckIn) query = query.eq('atualizado_em', warrior.lastCheckIn);
  return query.select('*, registros_gatilhos(*)').maybeSingle();
}
export async function logTrigger(progressId: string, trigger: string, strategy: string) { return supabase.from('registros_gatilhos').insert({ progresso_id: progressId, gatilho: trigger, estrategia: strategy }); }

export async function loadDashboard(userId: string) {
  const results = await Promise.all([getUserProfile(userId), getTasks(userId), supabase.from('habitos').select('*').eq('usuario_id', userId).order('criado_em'), getDailyWater(userId, localDate()), getWorkoutSessions(userId), getWarrior(userId), getBodyMetrics(userId)]);
  for (const result of results) if (result.error) throw result.error;
  const row = results[0].data!;
  const profile: UserProfile = { userId, age: row.idade, height: row.altura, goals: row.objetivos, activityLevel: (Object.keys(activities) as Array<keyof typeof activities>).find(key => activities[key] === row.nivel_atividade), createdAt: row.criado_em, updatedAt: row.atualizado_em };
  return { profile, user: { name: row.nome, phone: row.telefone, bio: row.biografia, avatar: row.avatar_url, goals: row.objetivos }, tasks: (results[1].data || []).map(mapTask), habits: (results[2].data || []).map(mapHabit), waterToday: (results[3].data || []).reduce((sum, item) => sum + item.quantidade_ml, 0), workoutSessions: (results[4].data || []).map(mapWorkout), warrior: results[5].data ? mapWarrior(results[5].data) : null, bodyMetrics: (results[6].data || []).map(mapMetric) };
}
