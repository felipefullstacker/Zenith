import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@ui/Text';
import { Button } from '@ui/Button';
import { Card } from '@ui/Card';
import { Input } from '@ui/Input';
import { colors } from '@ui';
import { Icons } from '@ui/icons';
export function Onboarding() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    goals: [] as string[],
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <Text variant="h1">👤</Text>
      </View>
      <Text variant="h2" weight="semibold" style={styles.title}>
        Quem é você?
      </Text>
      <Text variant="body" color="muted" style={styles.subtitle}>
        Vamos começar com algumas informações básicas
      </Text>

      <View style={styles.form}>
        <Input
          label="Nome"
          placeholder="Seu nome"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          leftIcon={<Icons.User size={20} color={colors.textMuted} />}
        />

        <Input
          label="Idade"
          placeholder="Ex: 30"
          value={formData.age}
          onChangeText={(text) => setFormData({ ...formData, age: text })}
          keyboardType="numeric"
          leftIcon={<Icons.Activity size={20} color={colors.textMuted} />}
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <Text variant="h1">📏</Text>
      </View>
      <Text variant="h2" weight="semibold" style={styles.title}>
        Seu Corpo
      </Text>
      <Text variant="body" color="muted" style={styles.subtitle}>
        Informações para calcular seu perfil físico
      </Text>

      <View style={styles.form}>
        <Input
          label="Altura (cm)"
          placeholder="Ex: 175"
          value={formData.height}
          onChangeText={(text) => setFormData({ ...formData, height: text })}
          keyboardType="numeric"
          leftIcon={<Icons.Activity size={20} color={colors.textMuted} />}
        />

        <Input
          label="Peso (kg)"
          placeholder="Ex: 70"
          value={formData.weight}
          onChangeText={(text) => setFormData({ ...formData, weight: text })}
          keyboardType="numeric"
          leftIcon={<Icons.Activity size={20} color={colors.textMuted} />}
        />
      </View>
    </View>
  );

  const renderStep3 = () => {
    const goalOptions = [
      { id: 'muscle', icon: '💪', label: 'Ganhar Massa' },
      { id: 'fat', icon: '🔥', label: 'Perder Gordura' },
      { id: 'strength', icon: '🛡️', label: 'Aumentar Força' },
      { id: 'health', icon: '❤️', label: 'Melhorar Saúde' },
      { id: 'endurance', icon: '⚡', label: 'Aumentar Resistência' },
    ];

    return (
      <View style={styles.stepContainer}>
        <View style={styles.iconContainer}>
          <Text variant="h1">🎯</Text>
        </View>
        <Text variant="h2" weight="semibold" style={styles.title}>
          Seus Objetivos
        </Text>
        <Text variant="body" color="muted" style={styles.subtitle}>
          O que você quer alcançar no Zenith?
        </Text>

        <View style={styles.optionsContainer}>
          {goalOptions.map((goal) => (
            <Button
              key={goal.id}
              variant={formData.goals.includes(goal.id) ? 'primary' : 'outline'}
              size="lg"
              style={styles.optionButton}
              onPress={() => {
                setFormData({
                  ...formData,
                  goals: formData.goals.includes(goal.id)
                    ? formData.goals.filter((g) => g !== goal.id)
                    : [...formData.goals, goal.id],
                });
              }}
            >
              <Text variant="h3" style={{ marginRight: 12 }}>
                {goal.icon}
              </Text>
              <Text weight="semibold" style={{ flex: 1, textAlign: 'center' }}>
                {goal.label}
              </Text>
            </Button>
          ))}
        </View>
      </View>
    );
  };

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <Text variant="h1">🚀</Text>
      </View>
      <Text variant="h2" weight="semibold" style={styles.title}>
        Pronto para começar?
      </Text>
      <Text variant="body" color="muted" style={styles.subtitle}>
        Vamos criar seu perfil personalizado e começar sua jornada
      </Text>

      <View style={styles.summary}>
        <Text variant="label" weight="medium" style={styles.summaryLabel}>
          Resumo do Perfil
        </Text>
        <View style={styles.summaryItem}>
          <Text variant="caption" color="secondary">
            Nome:
          </Text>
          <Text variant="caption" weight="medium">
            {formData.name || 'Não informado'}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text variant="caption" color="secondary">
            Idade:
          </Text>
          <Text variant="caption" weight="medium">
            {formData.age ? `${formData.age} anos` : 'Não informado'}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text variant="caption" color="secondary">
            Altura:
          </Text>
          <Text variant="caption" weight="medium">
            {formData.height ? `${formData.height} cm` : 'Não informado'}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text variant="caption" color="secondary">
            Peso:
          </Text>
          <Text variant="caption" weight="medium">
            {formData.weight ? `${formData.weight} kg` : 'Não informado'}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text variant="caption" color="secondary">
            Objetivos:
          </Text>
          <Text variant="caption" weight="medium">
            {formData.goals.length > 0
              ? formData.goals.map((g) => {
                  const goal = goalOptions.find((o) => o.id === g);
                  return goal?.label;
                }).join(', ')
              : 'Não informado'}
          </Text>
        </View>
      </View>
    </View>
  );

  const goalOptions = [
    { id: 'muscle', icon: '💪', label: 'Ganhar Massa' },
    { id: 'fat', icon: '🔥', label: 'Perder Gordura' },
    { id: 'strength', icon: '🛡️', label: 'Aumentar Força' },
    { id: 'health', icon: '❤️', label: 'Melhorar Saúde' },
    { id: 'endurance', icon: '⚡', label: 'Aumentar Resistência' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(step / 4) * 100}%` },
            ]}
          />
        </View>
        <Text variant="caption" color="muted" style={styles.stepIndicator}>
          Passo {step} de 4
        </Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardAvoid}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        {step > 1 && (
          <Button variant="ghost" onPress={handleBack} style={styles.backButton}>
            Voltar
          </Button>
        )}
        <View style={{ flex: 1 }} />
        <Button
          variant="primary"
          onPress={handleNext}
          style={styles.nextButton}
          rightIcon={<Icons.ChevronRight size={20} />}
        >
          {step === 4 ? 'Concluir' : 'Próximo'}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.borderMuted,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  stepIndicator: {
    textAlign: 'right',
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 24,
  },
  stepContainer: {
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  summary: {
    backgroundColor: colors.surfaceVariant,
    padding: 24,
    borderRadius: 16,
  },
  summaryLabel: {
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: colors.borderMuted,
  },
  backButton: {
    marginRight: 16,
    padding: 0,
    minHeight: 0,
  },
  nextButton: {
    minWidth: 120,
  },
});
