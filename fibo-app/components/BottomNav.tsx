import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// 1. Added useLocalSearchParams to the import
import { useRouter, usePathname, useLocalSearchParams } from 'expo-router';
import { Home, Send, History, User } from 'lucide-react-native';

export default function BottomNav({ isVendor = true }) {
  const router = useRouter();
  const pathname = usePathname();
  
  // 2. MAGIC FIX: Grab all the current parameters (userType, phoneNumber, etc.)
  const currentParams = useLocalSearchParams();

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
            // 3. Pass the params inside an object so the next screen remembers them!
            onPress={() => router.push({ pathname: item.path, params: currentParams } as any)}
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