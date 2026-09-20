import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@ui/Text';
import { Card } from '@ui/Card';
import { Button } from '@ui/Button';
import { colors } from '@ui';
import { Icons } from '@ui/icons';
import { Input } from '@ui/Input';
import { Modal } from '@ui/Modal';
import { localDate } from '@/api';

export function Life() {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const tasks = useStore((state) => state.tasks);
  const habits = useStore((state) => state.habits);
  const waterToday = useStore((state) => state.waterToday);
  const completeTask = useStore((state) => state.completeTask);
  const postponeTask = useStore((state) => state.postponeTask);
  const completeHabit = useStore((state) => state.completeHabit);
  const addWater = useStore((state) => state.addWater);
  const addTask = useStore((state) => state.addTask);
  const addHabit = useStore((state) => state.addHabit);
  const saving = useStore((state) => state.saving);
  const [creating, setCreating] = useState<'task' | 'habit' | null>(null);
  const [title, setTitle] = useState('');
  const nextTask = tasks.find(task => !task.completed);

  useEffect(() => {
    if (!pomodoroRunning) return;
    const timer = setInterval(() => setPomodoroSeconds((seconds) => {
      if (seconds <= 1) {
        setPomodoroRunning(false);
        return 25 * 60;
      }
      return seconds - 1;
    }), 1000);
    return () => clearInterval(timer);
  }, [pomodoroRunning]);

  const showFeedback = (message: string) => {
    setFeedback(message);
    setTimeout(() => setFeedback(null), 1800);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal visible={creating !== null} onClose={() => setCreating(null)} title={creating === 'task' ? 'Nova tarefa' : 'Novo hábito'} footer={<Button isLoading={saving} disabled={!title.trim()} onPress={async () => {
        const saved = creating === 'task' ? await addTask({ title, priority: 'medium' }) : await addHabit(title);
        if (saved) { setCreating(null); setTitle(''); }
      }}>Salvar</Button>}><Input label="Nome" value={title} onChangeText={setTitle} /></Modal>
      <View style={styles.header}>
        {feedback && <Text variant="caption" color="primary" style={styles.feedback}>{feedback}</Text>}
        <Text variant="h2" weight="semibold">
          Sua Vida
        </Text>
        <Button variant="ghost" size="sm" onPress={() => void useStore.getState().refresh()} accessibilityLabel="Atualizar Vida">Atualizar</Button>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text variant="h3" weight="semibold" style={styles.sectionTitle}>
            O Que Fazer Agora?
          </Text>
          <Card padding="lg" variant="elevated" style={styles.nowCard}>
            <View style={styles.nowHeader}>
              <Icons.Clock size={24} color={colors.primary} />
              <Text variant="body" weight="semibold" style={{ marginLeft: 12 }}>
                Próxima Ação
              </Text>
            </View>
            <Text variant="body" weight="medium" style={styles.nowTask}>
              {nextTask?.title || 'Nenhuma tarefa pendente'}
            </Text>
            <View style={styles.nowMeta}>
              <Text variant="caption" color="muted">
                {nextTask?.dueDate ? new Date(nextTask.dueDate).toLocaleDateString('pt-BR') : 'Sem prazo definido'}
              </Text>
            </View>
            <View style={styles.nowActions}>
              <Button variant="outline" size="sm" disabled={!nextTask} isLoading={saving} onPress={async () => { if (nextTask && await completeTask(nextTask.id)) showFeedback('Tarefa concluída'); }}>
                <Icons.CheckCircle size={16} color={colors.success} />
                <Text variant="caption" style={{ marginLeft: 4, color: colors.success }}>
                  Concluir
                </Text>
              </Button>
              <Button variant="ghost" size="sm" disabled={!nextTask || saving} onPress={async () => { if (nextTask && await postponeTask(nextTask.id)) showFeedback('Tarefa adiada por 1 dia'); }}>
                <Text variant="caption" color="muted">+1 dia</Text>
              </Button>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="h3" weight="semibold">
              Suas Tarefas
            </Text>
            <Button variant="ghost" size="sm" onPress={() => setCreating('task')}>
              <Text variant="caption" color="primary">
                + Nova
              </Text>
            </Button>
          </View>

          {tasks.map((item) => (
            <View key={item.id} style={styles.taskItem}>
              <View style={styles.taskInfo}>
                <View style={styles.taskHeader}>
                  <Text variant="body" weight={item.completed ? 'normal' : 'medium'}>{item.title}</Text>
                  {item.completed && <Icons.CheckCircle size={16} color={colors.success} />}
                </View>
                <Text variant="caption" color="muted">{item.dueDate ? new Date(item.dueDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Hoje'}</Text>
              </View>
              <Button variant="ghost" size="sm" disabled={item.completed || saving} accessibilityLabel={`Concluir ${item.title}`} onPress={() => void completeTask(item.id)}>
                <Icons.ChevronRight size={16} color={colors.textMuted} />
              </Button>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="h3" weight="semibold">
              Hábitos
            </Text>
            <Button variant="ghost" size="sm" onPress={() => setCreating('habit')}>
              <Text variant="caption" color="primary">
                + Novo
              </Text>
            </Button>
          </View>

          <View style={styles.habitsGrid}>
            {habits.map((habit) => (
              <Card key={habit.id} padding="sm" variant="outline" style={styles.habitCard}>
                <View style={styles.habitHeader}>
                   <Text variant="h3">💪</Text>
                  <Text variant="caption" color="muted">
                    Streak: {habit.streak}
                  </Text>
                 </View>
                 <Button variant="ghost" size="sm" disabled={saving || (!!habit.lastCompleted && localDate(new Date(habit.lastCompleted)) === localDate())} onPress={() => void completeHabit(habit.id)} accessibilityLabel={`Concluir hábito ${habit.name}`}>
                   {habit.name}
                 </Button>
              </Card>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="h3" weight="semibold">
              Pomodoro
            </Text>
          </View>

          <Card padding="lg" variant="outline" style={styles.pomodoroCard}>
            <View style={styles.pomodoroTimer}>
              <Text variant="h1" weight="semibold" style={styles.timerText}>
                 {`${Math.floor(pomodoroSeconds / 60).toString().padStart(2, '0')}:${(pomodoroSeconds % 60).toString().padStart(2, '0')}`}
              </Text>
              <Text variant="caption" color="muted">
                Foco
              </Text>
            </View>
            <View style={styles.pomodoroControls}>
               <Button variant="outline" size="sm" style={styles.controlButton} onPress={() => setPomodoroRunning(false)}>
                 Pausar
               </Button>
               <Button variant="primary" size="sm" style={styles.controlButton} onPress={() => setPomodoroRunning(true)}>
                 Iniciar
               </Button>
               <Button variant="ghost" size="sm" style={styles.controlButton} onPress={() => setPomodoroSeconds(15 * 60)}>
                 15 min
               </Button>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="h3" weight="semibold">
              Água
            </Text>
          </View>

          <Card padding="lg" variant="elevated" style={styles.waterCard}>
            <View style={styles.waterHeader}>
              <Text variant="body" weight="medium">
                Meta Diária
              </Text>
              <Text variant="body" weight="semibold">
                2.5L
              </Text>
            </View>
            <View style={styles.waterContent}>
              <View style={styles.waterProgress}>
                <View style={styles.waterGlass}>
                  <Icons.WaterDrop size={24} color={colors.primary} />
                  <Text variant="h3" style={{ marginLeft: 8, color: colors.primary }}>
                     {(waterToday / 1000).toFixed(1)}L
                  </Text>
                </View>
                <View style={styles.waterGlass}>
                  <Icons.WaterDrop size={24} color={colors.primary} />
                  <Text variant="h3" style={{ marginLeft: 8, color: colors.primary }}>
                    {Math.max(0, (2500 - waterToday) / 1000).toFixed(1)}L restantes
                  </Text>
                </View>
                <View style={styles.waterGlass}>
                  <Icons.WaterDrop size={24} color={colors.textMuted} />
                  <Text variant="h3" style={{ marginLeft: 8, color: colors.textMuted }}>
                    {Math.round(waterToday / 2500 * 100)}%
                  </Text>
                </View>
              </View>
              <View style={styles.waterActions}>
                 <Button variant="outline" size="sm" style={styles.waterButton} onPress={() => addWater(250)}>
                   +250ml
                 </Button>
                 <Button variant="outline" size="sm" style={styles.waterButton} onPress={() => addWater(500)}>
                   +500ml
                 </Button>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  feedback: {
    flex: 1,
    marginRight: 12,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  nowCard: {
    gap: 16,
  },
  nowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nowTask: {
    marginTop: 4,
  },
  nowMeta: {
    marginTop: 8,
  },
  nowActions: {
    flexDirection: 'row',
    gap: 12,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderMuted,
  },
  taskInfo: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  habitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  habitCard: {
    flexBasis: '48%',
    flexGrow: 1,
    minWidth: 140,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  pomodoroCard: {
    alignItems: 'center',
    gap: 24,
  },
  pomodoroTimer: {
    alignItems: 'center',
  },
  timerText: {
    fontFamily: 'monospace',
  },
  pomodoroControls: {
    flexDirection: 'row',
    gap: 12,
  },
  controlButton: {
    flex: 1,
  },
  waterCard: {
    gap: 16,
  },
  waterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  waterContent: {
    alignItems: 'center',
    gap: 24,
  },
  waterProgress: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-end',
  },
  waterGlass: {
    alignItems: 'center',
  },
  waterActions: {
    flexDirection: 'row',
    gap: 12,
  },
  waterButton: {
    flex: 1,
  },
});
