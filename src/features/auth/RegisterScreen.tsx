import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@ui/Text';
import { Input } from '@ui/Input';
import { Button } from '@ui/Button';
import { colors } from '@ui';
import { Icons } from '@ui/icons';
import { useNavigation } from '@react-navigation/native';
import { signUp } from '@/api';

export function Register() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async () => {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim();
    if (!normalizedName || !normalizedEmail || password.length < 6) {
      setError('Preencha os campos e use uma senha com pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setError('');
    setSuccess('');
    setIsLoading(true);
    const { data, error: authError } = await signUp(normalizedEmail, password, normalizedName);
    setIsLoading(false);

    if (authError || !data.user) {
      setError(authError?.message || 'Não foi possível criar sua conta. Tente novamente.');
      return;
    }

    if (data.session) {
      navigation.navigate('Onboarding' as never);
    } else {
      setSuccess('Conta criada. Confirme seu email para concluir o acesso.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text variant="h2" weight="semibold">
              Crie sua conta
            </Text>
            <Text variant="body" color="muted">
              Comece sua jornada no Zenith
            </Text>
          </View>

          <View style={styles.form}>
            {error ? <Text variant="caption" color="danger" style={styles.error}>{error}</Text> : null}
            {success ? <Text variant="caption" color="success" style={styles.error}>{success}</Text> : null}

            <Input
              label="Nome"
              placeholder="Seu nome"
              value={name}
              onChangeText={setName}
              leftIcon={<Icons.User size={20} color={colors.textMuted} />}
            />

            <Input
              label="Email"
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              leftIcon={<Icons.User size={20} color={colors.textMuted} />}
            />

            <Input
              label="Senha"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              leftIcon={<Icons.Lock size={20} color={colors.textMuted} />}
            />

            <Input
              label="Confirmar Senha"
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              leftIcon={<Icons.Lock size={20} color={colors.textMuted} />}
            />

            <Button
              onPress={handleRegister}
              isLoading={isLoading}
              variant="primary"
              size="lg"
              style={styles.registerButton}
            >
              Cadastrar
            </Button>
          </View>

          <View style={styles.footer}>
            <Text variant="caption" color="muted">
              Já tem uma conta?{' '}
            </Text>
            <Button variant="ghost" onPress={() => navigation.navigate('Login' as never)} style={styles.loginButton}>
              Entre agora
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  error: {
    marginBottom: -4,
  },
  registerButton: {
    minHeight: 56,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
    gap: 8,
  },
  loginButton: {
    padding: 0,
    minHeight: 0,
  },
});
