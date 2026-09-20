/**
 * Zenith - Personal Operating System
 * Entry Point
 */

import React, { useEffect } from 'react';
import { AppState } from 'react-native';
import { registerRootComponent } from 'expo';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '@/context/ThemeContext';
import { RootNavigation } from '@/navigation/RootNavigation';
import { supabase } from '@/api';
import { useStore } from '@/store/useStore';
import { User } from '@/types';

function App() {
  const initialize = useStore((state) => state.initialize);
  const login = useStore((state) => state.login);

  useEffect(() => {
    let mounted = true;
    let authChanged = false;

    const restoreSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted && !authChanged && data.session?.user) {
        const user = data.session.user;
        login({
          id: user.id,
          email: user.email ?? '',
          name: user.user_metadata?.name ?? user.email?.split('@')[0] ?? 'Usuário',
          createdAt: user.created_at,
          lastLogin: new Date().toISOString(),
        } as User);
      }
      if (mounted) initialize();
    };

    void restoreSession().catch(() => {
      if (mounted) {
        useStore.setState({ error: 'Não foi possível restaurar a sessão. Entre novamente.' });
        initialize();
      }
    });
    const appStateListener = AppState.addEventListener('change', (state) => {
      if (state === 'active') { supabase.auth.startAutoRefresh(); void useStore.getState().refresh(); }
      else supabase.auth.stopAutoRefresh();
    });
    const dayRefresh = setInterval(() => {
      if (AppState.currentState === 'active' && !useStore.getState().saving) void useStore.getState().refresh();
    }, 60000);
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      authChanged = true;
      initialize();
      if (session?.user) {
        const user = session.user;
        login({
          id: user.id,
          email: user.email ?? '',
          name: user.user_metadata?.name ?? user.email?.split('@')[0] ?? 'Usuário',
          createdAt: user.created_at,
          lastLogin: new Date().toISOString(),
        } as User);
      } else {
        useStore.getState().logout();
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
      appStateListener.remove();
      clearInterval(dayRefresh);
    };
  }, [initialize, login]);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <RootNavigation />
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

registerRootComponent(App);
