import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useStore } from '@/store/useStore';
import { Spinner } from '@ui/Spinner';
import { Welcome } from '@features/welcome/WelcomeScreen';
import { Login } from '@features/auth/LoginScreen';
import { Register } from '@features/auth/RegisterScreen';
import { Onboarding } from '@features/onboarding/OnboardingScreen';
import { MainNavigation } from './MainNavigation';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Onboarding: undefined;
  Main: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();

export function RootNavigation() {
  const initialized = useStore((state) => state.initialized);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const loading = useStore((state) => state.loading);
  const saving = useStore((state) => state.saving);
  const error = useStore((state) => state.error);
  const notice = useStore((state) => state.notice);
  const refresh = useStore((state) => state.refresh);

  if (!initialized) {
    return <Spinner />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#111827' }}>
      {(loading || saving || error || notice) && (
        <View accessibilityLiveRegion="polite" style={{ padding: 16, paddingTop: 40 }}>
          {(loading || saving) && <ActivityIndicator accessibilityLabel={saving ? 'Salvando' : 'Carregando'} />}
          <Text style={{ color: '#ffffff' }}>{error || notice || (saving ? 'Salvando alterações...' : 'Carregando seus dados...')}</Text>
          {error && isAuthenticated && <Pressable accessibilityRole="button" accessibilityLabel="Recarregar dados" disabled={loading || saving} onPress={() => void refresh()}><Text style={{ color: '#93c5fd', paddingVertical: 8 }}>Recarregar dados</Text></Pressable>}
        </View>
      )}
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        <RootStack.Screen name="Main" component={MainNavigation} />
      ) : (
        <>
          <RootStack.Screen name="Welcome" component={Welcome} />
          <RootStack.Screen name="Login" component={Login} />
          <RootStack.Screen name="Register" component={Register} />
          <RootStack.Screen name="Onboarding" component={Onboarding} />
        </>
      )}
    </RootStack.Navigator>
    </View>
  );
}
