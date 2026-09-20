import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@ui/Text';
import { Input } from '@ui/Input';
import { Button } from '@ui/Button';
import { Card } from '@ui/Card';
import { colors } from '@ui';
import { Icons } from '@ui/icons';
import { useNavigation } from '@react-navigation/native';
import { resendConfirmation, signIn } from '@/api';
import { useStore } from '@/store/useStore';

export function Login() {
  const navigation = useNavigation();
  const login = useStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    const normalizedEmail = email.trim();
    if (!normalizedEmail || !password) {
      setError('Informe seu email e sua senha.');
      return;
    }

    setError('');
    setMessage('');
    setIsLoading(true);
    const { data, error: authError } = await signIn(normalizedEmail, password);
    setIsLoading(false);

    if (authError || !data.user) {
      if (authError?.message.toLowerCase().includes('email not confirmed')) {
        const { error: resendError } = await resendConfirmation(normalizedEmail);
        setError('Seu email ainda não foi confirmado. Verifique a caixa de entrada.');
        if (!resendError) setMessage('Enviamos um novo link de confirmação para seu email.');
      } else {
        setError(authError?.message || 'Não foi possível entrar. Tente novamente.');
      }
      return;
    }

    login({
      id: data.user.id,
      email: data.user.email || normalizedEmail,
      name: data.user.user_metadata?.name || normalizedEmail.split('@')[0],
      createdAt: data.user.created_at,
    });
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
              Bem-vindo de volta
            </Text>
            <Text variant="body" color="muted">
              Entre na sua conta Zenith
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              leftIcon={<Icons.User size={20} color={colors.textMuted} />}
            />

            {error ? <Text variant="caption" color="danger" style={styles.error}>{error}</Text> : null}
            {message ? <Text variant="caption" color="success" style={styles.error}>{message}</Text> : null}

            <Input
              label="Senha"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              leftIcon={<Icons.Lock size={20} color={colors.textMuted} />}
            />

            <View style={styles.forgotPasswordContainer}>
              <Text variant="caption" color="primary">
                Esqueceu a senha?
              </Text>
            </View>

            <Button
              onPress={handleLogin}
              isLoading={isLoading}
              variant="primary"
              size="lg"
              style={styles.loginButton}
            >
              Entrar
            </Button>
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text variant="caption" color="muted">
              ou
            </Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtons}>
            <Button
              variant="secondary"
              style={styles.socialButton}
            >
              Google
            </Button>
            <Button
              variant="secondary"
              style={styles.socialButton}
            >
              Apple
            </Button>
          </View>

          <View style={styles.footer}>
            <Text variant="caption" color="muted">
              Não tem uma conta?{' '}
            </Text>
            <Button variant="ghost" onPress={() => navigation.navigate('Register' as never)} style={styles.registerButton}>
              Cadastre-se
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
    marginTop: -4,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: -8,
  },
  loginButton: {
    minHeight: 56,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  socialButtons: {
    gap: 12,
  },
  socialButton: {
    minHeight: 48,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
    gap: 8,
  },
  registerButton: {
    padding: 0,
    minHeight: 0,
  },
});
