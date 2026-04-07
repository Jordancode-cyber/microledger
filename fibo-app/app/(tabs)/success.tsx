import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Check } from 'lucide-react-native';

export default function Success() {
  const router = useRouter();
  const { amount } = useLocalSearchParams();

  useEffect(() => {
    const timer = setTimeout(() => router.replace('/dashboard'), 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <View style={styles.circleOuter}>
        <View style={styles.circleInner}>
          <Check size={40} color="#EAC435" strokeWidth={4} />
        </View>
      </View>
      <Text style={styles.title}>TRANSACTION SUCCESSFUL</Text>
      <Text style={styles.subtitle}>{amount} UGX sent securely</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8E9EB', alignItems: 'center', justifyContent: 'center' },
  circleOuter: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#EAC435', alignItems: 'center', justifyContent: 'center', elevation: 8, marginBottom: 32 },
  circleInner: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666' }
});