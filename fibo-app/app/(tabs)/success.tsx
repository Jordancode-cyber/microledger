import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CheckCircle } from 'lucide-react-native';

export default function SuccessScreen() {
  const router = useRouter();
  
  // 1. CATCH THE MEMORY: Grab all parameters passed from confirm.tsx
  const currentParams = useLocalSearchParams();
  const { amount } = currentParams;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <CheckCircle size={80} color="#059669" />
        </View>
        
        <Text style={styles.title}>Transaction Successful!</Text>
        <Text style={styles.subtitle}>The digital change has been sent.</Text>
        
        <Text style={styles.amountText}>{parseInt(amount as string || '0').toLocaleString()} UGX</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.button} 
          // 2. PASS THE MEMORY: Send all those vendor details back to the Dashboard!
          onPress={() => router.replace({ pathname: '/dashboard', params: currentParams })}
        >
          <Text style={styles.buttonText}>BACK TO DASHBOARD</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8E9EB' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  iconCircle: { marginBottom: 24, backgroundColor: '#D1FAE5', borderRadius: 60, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 32, textAlign: 'center' },
  amountText: { fontSize: 40, fontWeight: 'bold', color: '#003366' },
  footer: { padding: 24, paddingBottom: 40 },
  button: { width: '100%', backgroundColor: '#EAC435', paddingVertical: 18, borderRadius: 30, alignItems: 'center' },
  buttonText: { fontWeight: 'bold', fontSize: 16, color: '#000' }
});