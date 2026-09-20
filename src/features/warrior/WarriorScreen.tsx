import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@ui/Text';
import { Card } from '@ui/Card';
import { Button } from '@ui/Button';
import { colors } from '@ui';
import { Icons } from '@ui/icons';
import { Input } from '@ui/Input';
import { localDate } from '@/api';

export function Warrior() {
  const warrior = useStore((state) => state.warrior);
  const checkInWarrior = useStore((state) => state.checkInWarrior);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [trigger, setTrigger] = useState('');
  const [strategy, setStrategy] = useState('');
  const saving = useStore((state) => state.saving);
  const addTrigger = useStore((state) => state.addTrigger);
  const checkedToday = !!warrior.lastCheckIn && localDate(new Date(warrior.lastCheckIn)) === localDate();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text variant="h2" weight="semibold">
            Modo Guerreiro
          </Text>
          <Text variant="caption" color="muted">
            Autodomínio e Superação
          </Text>
        </View>
        <Button variant="primary" size="sm" disabled={saving || checkedToday} accessibilityLabel="Fazer check-in" onPress={() => void checkInWarrior()}>
          <Icons.Flame size={20} color={colors.primary} />
          <Text variant="caption" weight="medium" style={{ marginLeft: 4, color: colors.primary }}>
            {warrior.streak} dias
          </Text>
        </Button>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.progressSection}>
        <Card padding="lg" variant="elevated">
          <View style={styles.progressHeader}>
            <Text variant="h3" weight="semibold">
              Sua Jornada
            </Text>
            <Text variant="caption" color="muted">
              {warrior.startDate || 'Comece com seu primeiro check-in'}
            </Text>
          </View>
          <View style={styles.progressBody}>
            <View style={styles.daysContainer}>
              <View style={styles.daysGrid}>
                {[...Array(14)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dayCircle,
                       i < warrior.streak && styles.activeDay,
                      i === 13 && styles.today,
                    ]}
                  >
                    <Text variant="caption" weight="medium" style={i < warrior.streak ? { color: colors.background } : { color: colors.textMuted }}>
                      {i + 1}
                    </Text>
                  </View>
                ))}
              </View>
              <Text variant="caption" color="muted" style={{ textAlign: 'center', marginTop: 16 }}>
                 {warrior.streak} dias consecutivos
              </Text>
            </View>
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Text variant="h3" weight="semibold" style={styles.sectionTitle}>
          Último Check-in
        </Text>
        <Card padding="md">
          <View style={styles.checkInItem}>
            <View style={styles.checkInContent}>
              <Icons.CheckCircle size={24} color={colors.success} />
              <View style={styles.checkInText}>
                <Text variant="body" weight="medium">
                  {checkedToday ? 'Check-in registrado hoje' : 'Check-in de hoje pendente'}
                </Text>
             <Text variant="caption" color="muted">
               Você está no caminho certo!
             </Text>
             <Button variant="outline" size="sm" isLoading={saving} disabled={checkedToday} onPress={() => void checkInWarrior()} style={{ marginTop: 12 }}>
               Fazer check-in
             </Button>
              </View>
            </View>
            <Text variant="caption" color="muted">
              {warrior.lastCheckIn ? new Date(warrior.lastCheckIn).toLocaleDateString('pt-BR') : 'Sem registro'}
            </Text>
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Text variant="h3" weight="semibold" style={styles.sectionTitle}>
                  Gatilhos Identificados
        </Text>
        <Card padding="md">
          <View style={styles.triggersList}>
            <Input label="Gatilho identificado" value={trigger} onChangeText={setTrigger} />
            <Input label="Estratégia utilizada" value={strategy} onChangeText={setStrategy} />
            <Button isLoading={saving} disabled={!trigger.trim() || !warrior.id} onPress={async () => { if (await addTrigger(trigger, strategy)) { setTrigger(''); setStrategy(''); } }}>Registrar gatilho</Button>
            {!warrior.triggers.length && <Text variant="caption" color="muted">Nenhum gatilho registrado.</Text>}
            {warrior.triggers.map(item => (
              <View key={item.id} style={styles.triggerItem}>
                <View style={styles.triggerInfo}>
                  <Text variant="body">{item.trigger}</Text>
                  <Text variant="caption" color="muted">{new Date(item.timestamp).toLocaleDateString('pt-BR')} · {item.copingStrategy || 'Sem estratégia informada'}</Text>
                </View>
              </View>
            ))}
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Text variant="h3" weight="semibold" style={styles.sectionTitle}>
          Ferramentas de Emergência
        </Text>
        <Card padding="lg" variant="outline">
          <View style={styles.emergencyContainer}>
            <View style={styles.emergencyCard}>
              <Icons.Zap size={40} color={colors.warning} />
              <View style={styles.emergencyText}>
                <Text variant="body" weight="medium">
                  Botão de Emergência
                </Text>
                <Text variant="caption" color="muted">
                  Quebre o ciclo automático
                </Text>
              </View>
               <Button variant="outline" size="lg" style={styles.emergencyButton} onPress={() => setEmergencyActive((active) => !active)}>
                 {emergencyActive ? 'Respire e aguarde' : 'Estou com Vontade'}
               </Button>
            </View>
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Text variant="h3" weight="semibold" style={styles.sectionTitle}>
          Frases de Disciplina
        </Text>
        <Card padding="md" variant="outline">
          <Text variant="body" style={styles.quote}>
            "A disciplina é a chave para a liberdade."
          </Text>
          <Text variant="caption" color="muted" style={{ textAlign: 'right', marginTop: 12 }}>
            — Zenith Wisdom
          </Text>
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
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  progressSection: {
    padding: 24,
    paddingBottom: 0,
  },
  progressHeader: {
    marginBottom: 24,
  },
  progressBody: {
    alignItems: 'center',
  },
  daysContainer: {
    alignItems: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    maxWidth: 300,
    justifyContent: 'center',
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.borderMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDay: {
    backgroundColor: colors.primary,
  },
  today: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  checkInItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkInContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkInText: {
    flex: 1,
  },
  triggersList: {
    gap: 12,
  },
  triggerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  triggerInfo: {
    flex: 1,
  },
  emergencyContainer: {
    alignItems: 'center',
  },
  emergencyCard: {
    backgroundColor: colors.surfaceVariant,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
  },
  emergencyText: {
    marginTop: 12,
    marginBottom: 20,
    textAlign: 'center',
  },
  emergencyButton: {
    width: '100%',
    minHeight: 56,
    backgroundColor: colors.warning,
  },
  quote: {
    textAlign: 'center',
  },
});
