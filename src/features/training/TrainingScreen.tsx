import React, { useMemo, useState } from 'react';
import { useStore } from '@/store/useStore';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@ui/Text';
import { Card } from '@ui/Card';
import { Button } from '@ui/Button';
import { colors } from '@ui';
import { Icons } from '@ui/icons';
import { Input } from '../../ui/Input';
import { EmptyState } from '@ui/EmptyState';
import { WorkoutSession, Exercise } from '../../types';
import { localDate } from '@/api';
import { Modal } from '@ui/Modal';

const exercises: Exercise[] = [
  { id: '1', name: 'Flexão de Braços', category: 'peito', primaryMuscle: 'Peito', secondaryMuscles: ['Tríceps', 'Ombros'], equipment: ['bodyweight'], difficulty: 'intermediate', instructions: ['Mãos na largura dos ombros', 'Corpo reto', 'Descer até 90 graus', 'Empurrar de volta'], commonMistakes: ['Arquear as costas', 'Não ir fundo o suficiente'], progressionOptions: ['Flexão inclinada', 'Flexão declinada', 'Flexão diamante'], createdAt: new Date().toISOString() },
  { id: '2', name: 'Agachamento', category: 'pernas', primaryMuscle: 'Quadríceps', secondaryMuscles: ['Glúteos', 'Panturrilhas'], equipment: ['bodyweight'], difficulty: 'beginner', instructions: ['Pés na largura dos ombros', 'Mãos à frente', 'Descer como se sentar', 'Mantém peito erguido'], commonMistakes: ['Rolar os joelhos', 'Não atingir paralelo'], progressionOptions: ['Agachamento sumô', 'Agachamento búlgaro', 'Agachamento com peso'], createdAt: new Date().toISOString() },
  { id: '3', name: 'Remada Curta', category: 'costas', primaryMuscle: 'Costas', secondaryMuscles: ['Bíceps', 'Posterior'], equipment: ['dumbbells'], difficulty: 'intermediate', instructions: ['Mãos na barra', 'Corpo a 45 graus', 'Puxar para o baixo', 'Apertar as escápulas'], commonMistakes: ['Usar impulso', 'Não contrair as costas'], progressionOptions: ['Remada larga', 'Remada unilateral', 'Remada com pegada inversa'], createdAt: new Date().toISOString() },
];



export function Training() {
  const [activeTab, setActiveTab] = useState<'workouts' | 'exercises'>('workouts');
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutSession | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [reps, setReps] = useState('');
  const [selected, setSelected] = useState<WorkoutSession | null>(null);
  const saving = useStore((state) => state.saving);
  const user = useStore((state) => state.user);
  const workoutSessions = useStore((state) => state.workoutSessions);
  const addWorkoutSession = useStore((state) => state.addWorkoutSession);
  const filteredExercises = useMemo(() => exercises.filter((exercise) => exercise.name.toLowerCase().includes(search.toLowerCase())), [search]);

  const showFeedback = (message: string) => {
    setFeedback(message);
    setTimeout(() => setFeedback(null), 1800);
  };

  const startWorkout = () => {
    setCurrentWorkout({
      id: 'new',
      userId: user?.id || '',
      date: localDate(),
      startTime: new Date().toISOString(),
      exercises: [],
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal visible={!!selected} onClose={() => setSelected(null)} title="Detalhes do treino">
        {selected?.exercises.map(exercise => <Text key={exercise.id}>{exercise.exerciseName}: {exercise.sets.map(set => `${set.reps || 0} repetições`).join(', ')}</Text>)}
      </Modal>
      <View style={styles.header}>
        <Text variant="h2" weight="semibold">
          Treino
        </Text>
        <Button variant="outline" size="sm" disabled={!!currentWorkout || saving} onPress={startWorkout}>Novo treino</Button>
      </View>

      {feedback && <Text variant="caption" color="primary" style={styles.feedback}>{feedback}</Text>}
      {currentWorkout && (
        <Card padding="md" variant="elevated" style={{ marginHorizontal: 24, marginBottom: 12 }}>
          <Text variant="body" weight="semibold">Treino em andamento</Text>
          <Text variant="caption" color="muted" style={{ marginTop: 4 }}>Registre seu progresso e finalize quando terminar.</Text>
          <Text variant="caption">{currentWorkout.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0)} séries registradas</Text>
          <Input label="Repetições da série" value={reps} onChangeText={setReps} keyboardType="number-pad" />
          <Button variant="outline" size="sm" onPress={() => setActiveTab('exercises')}>Escolher exercício e registrar série</Button>
          <Button variant="primary" size="sm" isLoading={saving} disabled={!currentWorkout.exercises.length} style={{ marginTop: 12 }} onPress={async () => {
            const session = { ...currentWorkout, endTime: new Date().toISOString(), duration: Math.max(1, Math.round((Date.now() - new Date(currentWorkout.startTime).getTime()) / 60000)), totalSets: currentWorkout.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0), totalReps: currentWorkout.exercises.reduce((sum, exercise) => sum + exercise.sets.reduce((count, set) => count + (set.reps || 0), 0), 0) };
            if (!await addWorkoutSession(session)) return;
            setCurrentWorkout(null);
            showFeedback('Treino salvo no histórico');
          }}>Finalizar treino</Button>
        </Card>
      )}

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'workouts' && styles.activeTab]}
          onPress={() => setActiveTab('workouts')}
        >
          <Text
            variant="caption"
            weight="medium"
            color={activeTab === 'workouts' ? 'primary' : 'muted'}
          >
            Histórico
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'exercises' && styles.activeTab]}
          onPress={() => setActiveTab('exercises')}
        >
          <Text
            variant="caption"
            weight="medium"
            color={activeTab === 'exercises' ? 'primary' : 'muted'}
          >
            Exercícios
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'workouts' && (
        <FlatList
           data={workoutSessions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <WorkoutCard workout={item} onPress={() => setSelected(item)} />}
          contentContainerStyle={styles.listContent}
           ListEmptyComponent={
             <EmptyState
               icon="💪"
               title="Nenhum treino registrado"
               description="Comece uma sessão para acompanhar sua evolução."
               action={{ label: 'Começar novo treino', onPress: startWorkout }}
             />
           }
        />
      )}

      {activeTab === 'exercises' && (
        <View style={styles.exercisesList}>
          <View style={styles.searchContainer}>
            <Icons.Search size={20} color={colors.textMuted} />
            <Input
               placeholder="Buscar exercícios..."
               value={search}
               onChangeText={setSearch}
               containerStyle={{ flex: 1, marginLeft: 8 }}
            />
          </View>
          <FlatList
             data={filteredExercises}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ExerciseCard exercise={item} onAdd={() => {
              if (!currentWorkout) { showFeedback('Inicie um treino primeiro.'); return; }
              const count = Number(reps);
              if (!Number.isInteger(count) || count < 1 || count > 1000) { showFeedback('Informe de 1 a 1000 repetições.'); return; }
              const existing = currentWorkout.exercises.find(exercise => exercise.exerciseId === item.id);
              const set = { id: String(Date.now()), order: (existing?.sets.length || 0) + 1, reps: count, completed: true, createdAt: new Date().toISOString() };
              setCurrentWorkout({ ...currentWorkout, exercises: existing ? currentWorkout.exercises.map(exercise => exercise.exerciseId === item.id ? { ...exercise, sets: [...exercise.sets, set] } : exercise) : [...currentWorkout.exercises, { id: item.id, exerciseId: item.id, exerciseName: item.name, sets: [set] }] });
              showFeedback('Série registrada na sessão');
            }} />}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listContent}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

function WorkoutCard({ workout, onPress }: { workout: WorkoutSession; onPress: () => void }) {
  return (
    <Card padding="md" variant="outline" style={styles.workoutCard}>
      <View style={styles.workoutHeader}>
        <View>
          <Text variant="body" weight="medium">
            {workout.date}
          </Text>
          <Text variant="caption" color="muted">
            {new Date(workout.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} • {workout.duration} min
          </Text>
        </View>
        <Button variant="ghost" size="sm" onPress={onPress}>
          <Icons.ChevronRight size={16} />
        </Button>
      </View>
      <View style={styles.workoutStats}>
        <StatItem icon="💪" label={`${workout.totalSets || 0} Séries`} />
        <StatItem icon="🔁" label={`${workout.totalReps || 0} Repetições`} />
        <StatItem icon="🔥" label={`${workout.rpe || 0} RPE`} />
      </View>
    </Card>
  );
}

function StatItem({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.statItem}>
      <Text variant="body">{icon}</Text>
      <Text variant="caption" style={{ marginLeft: 4 }}>
        {label}
      </Text>
    </View>
  );
}

function ExerciseCard({ exercise, onAdd }: { exercise: Exercise; onAdd: () => void }) {
  return (
    <Card padding="sm" variant="outline" style={styles.exerciseCard}>
      <View style={styles.exerciseIconContainer}>
        <Text variant="h2">💪</Text>
      </View>
      <Text variant="body" weight="medium" numberOfLines={1}>
        {exercise.name}
      </Text>
      <Text variant="caption" color="muted" numberOfLines={1}>
        {exercise.primaryMuscle}
      </Text>
      <Button variant="outline" size="sm" onPress={onAdd} accessibilityLabel={`Registrar série de ${exercise.name}`}>Registrar série</Button>
      <View style={styles.exerciseMeta}>
        <View style={styles.exerciseMetaItem}>
          <Text variant="caption" color="muted">
            {exercise.difficulty === 'beginner' ? 'Iniciante' : exercise.difficulty === 'intermediate' ? 'Intermediário' : 'Avançado'}
          </Text>
        </View>
        <View style={styles.exerciseMetaItem}>
          <Text variant="caption" color="muted">
            {exercise.equipment.length > 0 ? exercise.equipment[0] : 'Peso Corporal'}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  feedback: {
    marginHorizontal: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  tabs: {
    flexDirection: 'row',
    padding: 8,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderMuted,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.surfaceVariant,
  },
  listContent: {
    padding: 24,
    gap: 16,
  },
  columnWrapper: {
    gap: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  exercisesList: {
    flex: 1,
    padding: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  workoutCard: {
    marginBottom: 16,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  exerciseCard: {
    marginBottom: 16,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseIconContainer: {
    marginBottom: 12,
  },
  exerciseMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  exerciseMetaItem: {
    alignItems: 'center',
  },
});
