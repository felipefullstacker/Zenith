import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import { Text } from '@ui/Text';
import { Button } from '@ui/Button';
import { colors } from '@ui';
import { useNavigation } from '@react-navigation/native';

export function Welcome() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text variant="h1" style={{ textAlign: 'center' }}>
            ☯
          </Text>
          <Text variant="h2" weight="semibold" style={{ textAlign: 'center', marginTop: 24 }}>
            Zenith
          </Text>
          <Text variant="body" color="muted" style={{ textAlign: 'center', marginTop: 8 }}>
            O sistema operacional da sua vida
          </Text>
        </View>

        <View style={styles.features}>
          <Feature
            icon="💪"
            title="Treino Inteligente"
            description="Treinos adaptativos para casa com progressão automática"
          />
          <Feature
            icon="🛡️"
            title="Modo Guerreiro"
            description="Autodomínio e superação com rastreamento de progresso"
          />
          <Feature
            icon="📊"
            title="Evolução Total"
            description="Métricas detalhadas e insights de performance"
          />
        </View>

        <View style={styles.ctaContainer}>
          <Button
            onPress={() => navigation.navigate('Login' as never)}
            variant="primary"
            size="lg"
            fullWidth
            style={styles.ctaButton}
          >
            Começar Agora
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

interface FeatureProps {
  icon: string;
  title: string;
  description: string;
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <View style={styles.featureCard}>
      <Text variant="h3" style={{ textAlign: 'center', marginBottom: 8 }}>
        {icon}
      </Text>
      <Text variant="body" weight="semibold" style={{ textAlign: 'center', marginBottom: 4 }}>
        {title}
      </Text>
      <Text variant="caption" color="muted" style={{ textAlign: 'center', opacity: 0.8 }}>
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    ...Platform.select({
      ios: {
        paddingTop: 40,
      },
    }),
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  features: {
    gap: 24,
    marginBottom: 48,
  },
  featureCard: {
    backgroundColor: colors.surfaceVariant,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  ctaContainer: {
    marginBottom: 24,
  },
  ctaButton: {
    minHeight: 56,
  },
});
