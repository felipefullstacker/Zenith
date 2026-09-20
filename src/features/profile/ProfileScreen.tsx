import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@ui/Text';
import { Card } from '@ui/Card';
import { Button } from '@ui/Button';
import { Input } from '@ui/Input';
import { colors } from '@ui';
import { signOut } from '@/api';
import { useStore } from '@/store/useStore';

export function Profile() {
  const { width } = useWindowDimensions();
  const { user, profile, warrior, workoutSessions, bodyMetrics, saving, loading, updateUser, updateProfile, addBodyMetric, refresh, logout } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!isEditing) {
      setName(user?.name || ''); setEmail(user?.email || ''); setPhone(user?.phone || '');
      setHeight(profile?.height ? String(profile.height) : '');
    }
  }, [user, profile, isEditing]);
  const save = async () => {
    setError(null);
    const value = Number(height.replace(',', '.'));
    if (height && (!Number.isFinite(value) || value <= 0 || value > 300)) { setError('Informe uma altura válida em centímetros.'); return; }
    if (!await updateUser({ name, email, phone })) return;
    if (height && !await updateProfile({ height: value })) return;
    setIsEditing(false);
  };
  const handleSignOut = async () => {
    setIsSigningOut(true); setError(null);
    try { const failure = await signOut(); if (failure) throw failure; logout(); }
    catch { setError('Não foi possível sair. Tente novamente.'); }
    finally { setIsSigningOut(false); }
  };
  const latestWeight = bodyMetrics[0]?.weight;
  const bmi = latestWeight && profile?.height ? latestWeight / ((profile.height / 100) ** 2) : null;
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={[styles.content, { padding: width < 380 ? 16 : 24 }]} keyboardShouldPersistTaps="handled">
          <Text variant="h2" weight="semibold">Perfil</Text>
          {error && <Text accessibilityRole="alert">{error}</Text>}
          <Card padding="lg">
            <Text variant="h3">{user?.name || 'Seu perfil'}</Text>
            {isEditing ? <View style={styles.fields}>
              <Input label="Nome" value={name} onChangeText={setName} autoComplete="name" />
              <Input label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
              <Input label="Telefone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
              <Input label="Altura (cm)" value={height} onChangeText={setHeight} keyboardType="decimal-pad" />
              <Text variant="caption" color="muted">A alteração de e-mail precisa de confirmação pelo Supabase.</Text>
              <Button isLoading={saving} disabled={loading} onPress={save}>Salvar perfil</Button>
              <Button variant="ghost" disabled={saving} onPress={() => setIsEditing(false)}>Cancelar</Button>
            </View> : <View style={styles.fields}>
              <Text>{user?.email}</Text><Text>{user?.phone || 'Telefone não informado'}</Text>
              <Text variant="caption" color="muted">Membro desde {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '—'}</Text>
              <Button variant="outline" onPress={() => setIsEditing(true)}>Editar perfil</Button>
            </View>}
          </Card>
          <Card padding="lg">
            <Text variant="h3">Evolução física</Text>
            <Text style={styles.row}>Peso: {latestWeight ?? '—'} kg · Altura: {profile?.height ?? '—'} cm · IMC: {bmi?.toFixed(1) ?? '—'}</Text>
            <Input label="Novo peso (kg)" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" />
            <Button isLoading={saving} disabled={!weight.trim() || loading} onPress={async () => { if (await addBodyMetric(Number(weight.replace(',', '.')))) setWeight(''); }}>Registrar medida</Button>
            {bodyMetrics.length === 0 && <Text variant="caption" color="muted">Nenhuma medida registrada.</Text>}
            {bodyMetrics.map(metric => <Text key={metric.id} variant="caption" style={styles.row}>{metric.date}: {metric.weight ?? '—'} kg</Text>)}
          </Card>
          <Card padding="lg">
            <Text variant="h3">Estatísticas registradas</Text>
            <Text style={styles.row}>{warrior.streak} dias consecutivos no Guerreiro</Text>
            <Text style={styles.row}>{workoutSessions.length} treinos concluídos</Text>
            <Text style={styles.row}>{workoutSessions.reduce((sum, session) => sum + (session.duration || 0), 0)} minutos de treino</Text>
          </Card>
          <Button variant="outline" isLoading={loading} disabled={saving} onPress={() => void refresh()}>Sincronizar dados</Button>
          <Text variant="caption" color="muted">Dados vinculados à sua conta. Notificações e upload de arquivos ainda não estão disponíveis.</Text>
          <Button variant="outline" isLoading={isSigningOut} disabled={saving} onPress={handleSignOut}>Sair da conta</Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { gap: 20, paddingBottom: 40 },
  fields: { gap: 12, marginTop: 12 },
  row: { marginVertical: 8 },
});
