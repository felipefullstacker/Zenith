import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@ui/Text';
import { Card } from '@ui/Card';
import { Button } from '@ui/Button';
import { colors } from '@ui';
import { Icons } from '@ui/icons';
import { Input } from '@ui/Input';
import { Modal } from '@ui/Modal';
import { EmptyState } from '@ui/EmptyState';

export function Home() {
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const waterToday = useStore((state) => state.waterToday);
  const warrior = useStore((state) => state.warrior);
  const tasks = useStore((state) => state.tasks);
  const user = useStore((state) => state.user);
  const workouts = useStore((state) => state.workoutSessions);
  const saving = useStore((state) => state.saving);
  const addWater = useStore((state) => state.addWater);
  const checkInWarrior = useStore((state) => state.checkInWarrior);
  const addTask = useStore((state) => state.addTask);
  const completeTask = useStore((state) => state.completeTask);

  const showFeedback = (message: string) => {
    setFeedback(message);
    setTimeout(() => setFeedback(null), 1800);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal visible={showTaskModal} onClose={() => setShowTaskModal(false)} title="Nova tarefa" footer={
        <Button variant="primary" isLoading={saving} onPress={async () => {
          const title = newTaskTitle.trim();
          if (!title) return;
          if (!await addTask({ title, priority: 'medium', dueDate: new Date().toISOString() })) return;
          setNewTaskTitle('');
          setShowTaskModal(false);
          showFeedback('Tarefa adicionada');
        }}>Adicionar</Button>
      }>
        <Input label="Nome da tarefa" placeholder="Ex.: Caminhar 20 minutos" value={newTaskTitle} onChangeText={setNewTaskTitle} autoFocus />
      </Modal>
      <ScrollView contentContainerStyle={[styles.content, { paddingHorizontal: width < 380 ? 16 : 24 }]} showsVerticalScrollIndicator={false}>
        {feedback && <Text variant="caption" color="primary" style={styles.feedback}>{feedback}</Text>}
        <View style={styles.header}>
          <View style={styles.greeting}>
            <Text variant="h2" weight="semibold">
              Olá, {user?.name || 'guerreiro'} 👋
            </Text>
            <Text variant="caption" color="muted">
              {new Date().toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </Text>
          </View>
        </View>

        <View style={styles.widgets}>
          <WidgetCard
            icon="💧"
            title="Hidratação"
             value={`${(waterToday / 1000).toFixed(1)}L / 2.5L`}
             progress={Math.min(waterToday / 2500, 1)}
             action={{ icon: '+', label: 'Registrar' }}
             onAction={async () => { if (await addWater(250)) showFeedback('Hidratação atualizada'); }}
          />
          <WidgetCard
            icon="🔥"
            title="Tarefas concluídas"
            value={`${tasks.filter(task => task.completed).length} / ${tasks.length}`}
            progress={tasks.length ? tasks.filter(task => task.completed).length / tasks.length : 0}
            action={{ icon: '+', label: 'Tarefa' }}
            onAction={() => setShowTaskModal(true)}
          />
          <WidgetCard
            icon="🛡️"
            title="Streak Guerreiro"
             value={`${warrior.streak} Dias`}
             progress={Math.min(warrior.streak / 14, 1)}
             action={{ icon: '📝', label: 'Registrar' }}
             onAction={async () => { if (await checkInWarrior()) showFeedback('Check-in atualizado'); }}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="h3" weight="semibold">
               Sua Rotina
             </Text>
             <Button variant="ghost" style={styles.seeAllButton} onPress={() => setShowTaskModal(true)}>
               <Text variant="caption" color="primary">+ Nova</Text>
             </Button>
           </View>

            <View style={styles.tasks}>
            {tasks.length === 0 ? (
              <EmptyState title="Rotina livre" description="Adicione sua primeira tarefa para organizar o dia." action={{ label: 'Adicionar tarefa', onPress: () => setShowTaskModal(true) }} />
            ) : tasks.map((task) => (
              <TaskItem
                key={task.id}
                title={task.title}
                time={task.dueDate ? new Date(task.dueDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Hoje'}
                duration=""
                priority={task.priority}
                completed={task.completed}
                onPress={async () => { if (!task.completed && await completeTask(task.id)) showFeedback('Tarefa concluída'); }}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="h3" weight="semibold">
               Seus Treinos
             </Text>
             <Button variant="ghost" style={styles.seeAllButton} onPress={() => navigation.navigate('Training')}>
               <Text variant="caption" color="primary">Ver tudo</Text>
             </Button>
          </View>

          <Card padding="lg" variant="elevated" style={styles.workoutCard}>
            <View style={styles.workoutHeader}>
              <View>
                <Text variant="body" weight="semibold">
                  {workouts.length ? 'Último treino registrado' : 'Comece seu primeiro treino'}
                </Text>
                <Text variant="caption" color="muted">
                  {workouts[0]?.date || 'Sem sessões concluídas'}
                </Text>
              </View>
             <Button variant="primary" size="sm" onPress={() => navigation.navigate('Training')}>
                 Iniciar
               </Button>
            </View>
            
            <View style={styles.workoutDetails}>
              <View style={styles.detailItem}>
                <Icons.Dumbbell size={16} color={colors.textMuted} />
                <Text variant="caption" color="muted" style={{ marginLeft: 8 }}>
                  {workouts[0]?.exercises.length || 0} exercícios
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Icons.Activity size={16} color={colors.textMuted} />
                <Text variant="caption" color="muted" style={{ marginLeft: 8 }}>
                  {workouts[0]?.duration || 0} min registrados
                </Text>
              </View>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="h3" weight="semibold">
              Insigths
            </Text>
          </View>

          <Card padding="md">
            <View style={styles.insight}>
              <Icons.TrendingUp size={20} color={colors.success} />
              <View style={styles.insightText}>
                <Text variant="caption" weight="medium">
                  {tasks.filter(task => task.completed).length} tarefas concluídas e {workouts.length} treinos registrados
                </Text>
                <Text variant="caption" color="muted" style={{ marginTop: 4 }}>
                  Continue assim para manter o progresso!
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface WidgetCardProps {
  icon: string;
  title: string;
  value: string;
  progress: number;
  action: { icon: string; label: string };
  onAction: () => void;
}

function WidgetCard({ icon, title, value, progress, action, onAction }: WidgetCardProps) {
  return (
    <Card padding="md" variant="outline" borderRadius="lg" style={styles.widgetCard}>
      <View style={styles.widgetHeader}>
        <Text variant="h3">{icon}</Text>
        <Button variant="ghost" size="sm" onPress={onAction} accessibilityLabel={action.label}>
          {action.icon}
        </Button>
      </View>
      <View style={styles.widgetContent}>
        <Text variant="body" weight="medium">
          {title}
        </Text>
        <Text variant="body" weight="semibold" style={{ marginTop: 4 }}>
          {value}
        </Text>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress * 100}%` },
            ]}
          />
        </View>
      </View>
    </Card>
  );
}

interface TaskItemProps {
  title: string;
  time: string;
  duration?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  onPress: () => void;
}

function TaskItem({ title, time, duration, priority, completed, onPress }: TaskItemProps) {
  const priorityColors = {
    low: colors.success,
    medium: colors.warning,
    high: colors.danger,
  };

  return (
    <View style={styles.taskItem}>
      <View style={styles.taskInfo}>
        <View style={styles.taskHeader}>
          <Text variant="body" weight={completed ? 'normal' : 'medium'}>
            {title}
          </Text>
          {completed && (
            <Icons.CheckCircle size={16} color={colors.success} />
          )}
        </View>
        <View style={styles.taskMeta}>
          <Text variant="caption" color="muted">
            {time} • {duration}
          </Text>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: priorityColors[priority] + '20' },
            ]}
          >
            <View
              style={[
                styles.priorityDot,
                { backgroundColor: priorityColors[priority] },
              ]}
            />
            <Text variant="caption" style={{ marginLeft: 4, color: priorityColors[priority] }}>
              {priority === 'low' ? 'Baixa' : priority === 'medium' ? 'Média' : 'Alta'}
            </Text>
          </View>
        </View>
      </View>
      <Button variant="ghost" size="sm" onPress={onPress} accessibilityLabel={`Concluir ${title}`}>
         <Icons.ChevronRight size={16} color={colors.textMuted} />
       </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 40,
  },
  feedback: {
    marginBottom: 12,
    textAlign: 'center',
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    marginBottom: 8,
  },
  widgets: {
    gap: 16,
    marginBottom: 32,
  },
  widgetCard: {
    position: 'relative',
    overflow: 'hidden',
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  widgetContent: {
    marginBottom: 8,
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.borderMuted,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllButton: {
    padding: 0,
    minHeight: 0,
  },
  tasks: {
    gap: 12,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    padding: 16,
    borderRadius: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  workoutCard: {
    gap: 16,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  workoutDetails: {
    flexDirection: 'row',
    gap: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  insight: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  insightText: {
    flex: 1,
  },
});
