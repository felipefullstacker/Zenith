import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { Home } from '@features/home/HomeScreen';
import { Training } from '@features/training/TrainingScreen';
import { Warrior } from '@features/warrior/WarriorScreen';
import { Life } from '@features/life/LifeScreen';
import { Profile } from '@features/profile/ProfileScreen';
import { Text } from '@ui/Text';
import { colors } from '@ui';
import { Icons } from '@ui/icons';

const Tab = createBottomTabNavigator();

export function MainNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.borderMuted,
          borderTopWidth: 1,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 10,
          height: Platform.OS === 'ios' ? 80 : 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIconStyle: {
          marginBottom: Platform.OS === 'ios' ? 5 : 0,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => <Icons.Home color={color} size={size} />,
          tabBarLabel: ({ color }) => <Text variant="caption" weight="medium" color={color as any}>Início</Text>,
        }}
      />
      <Tab.Screen
        name="Training"
        component={Training}
        options={{
          tabBarIcon: ({ color, size }) => <Icons.Dumbbell color={color} size={size} />,
          tabBarLabel: ({ color }) => <Text variant="caption" weight="medium" color={color as any}>Treino</Text>,
        }}
      />
      <Tab.Screen
        name="Warrior"
        component={Warrior}
        options={{
          tabBarIcon: ({ color, size }) => <Icons.Shield color={color} size={size} />,
          tabBarLabel: ({ color }) => <Text variant="caption" weight="medium" color={color as any}>Guerreiro</Text>,
        }}
      />
      <Tab.Screen
        name="Life"
        component={Life}
        options={{
          tabBarIcon: ({ color, size }) => <Icons.Calendar color={color} size={size} />,
          tabBarLabel: ({ color }) => <Text variant="caption" weight="medium" color={color as any}>Vida</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => <Icons.User color={color} size={size} />,
          tabBarLabel: ({ color }) => <Text variant="caption" weight="medium" color={color as any}>Perfil</Text>,
        }}
      />
    </Tab.Navigator>
  );
}
