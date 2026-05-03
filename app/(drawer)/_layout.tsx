import { Drawer } from 'expo-router/drawer';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';

export default function DrawerLayout() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  return (
    <Drawer
      screenOptions={{
        drawerType: isLargeScreen ? 'permanent' : 'front',
        headerStyle: {
          backgroundColor: Colors.dark.surface,
        },
        headerTintColor: Colors.dark.text,
        drawerStyle: {
          backgroundColor: Colors.dark.surface,
          width: isLargeScreen ? 240 : 280,
        },
        drawerActiveTintColor: Colors.dark.primary,
        drawerInactiveTintColor: Colors.dark.icon,
        drawerLabelStyle: {
          fontWeight: '600',
        },
        sceneContainerStyle: {
          backgroundColor: Colors.dark.background,
        },
      }}>
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Library',
          title: 'Library',
          drawerIcon: ({ color }) => (
            <Ionicons name="library-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="explore"
        options={{
          drawerLabel: 'Explore',
          title: 'Explore',
          drawerIcon: ({ color }) => (
            <Ionicons name="compass-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="history"
        options={{
          drawerLabel: 'History',
          title: 'History',
          drawerIcon: ({ color }) => (
            <Ionicons name="time-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: 'Settings',
          title: 'Settings',
          drawerIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={24} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
