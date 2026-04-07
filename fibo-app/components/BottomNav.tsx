import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Home, Send, History, User } from 'lucide-react-native';

export default function BottomNav({ isVendor = true }) {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = isVendor 
    ? [
        { path: '/dashboard', icon: Home, label: 'Home' },
        { path: '/send', icon: Send, label: 'Send' },
        { path: '/transactions', icon: History, label: 'History' },
        { path: '/profile', icon: User, label: 'Profile' },
      ]
    : [
        { path: '/dashboard', icon: Home, label: 'Home' },
        { path: '/transactions', icon: History, label: 'History' },
        { path: '/profile', icon: User, label: 'Profile' },
      ];

  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        return (
          <TouchableOpacity 
            key={item.path} 
            style={styles.navItem} 
            onPress={() => router.push(item.path as any)}
          >
            <Icon size={24} color={isActive ? '#000' : '#9CA3AF'} />
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-evenly', backgroundColor: '#FFF', paddingVertical: 12, paddingBottom: 24, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  navItem: { alignItems: 'center', flex: 1 },
  label: { fontSize: 12, color: '#9CA3AF', marginTop: 4, fontWeight: '500' },
  activeLabel: { color: '#000', fontWeight: '700' }
});