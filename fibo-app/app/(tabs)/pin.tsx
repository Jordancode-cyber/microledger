import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';
import NumberPad from '../../components/NumberPad';

export default function PinInput() {
  const router = useRouter();
  const { phoneNumber } = useLocalSearchParams();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleNumberPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      
      if (newPin.length === 4) {
        // Automatically check PIN when 4 digits are entered
        setTimeout(() => {
          // TODO: Replace with real Supabase Auth check
          router.replace('/welcome'); // Go to welcome when PIN is entered
        }, 500);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError('');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>ENTER YOUR PIN</Text>
        <Text style={styles.subtitle}>Enter the 4-digit PIN for {phoneNumber || 'your account'}</Text>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* PIN Dots Indicator */}
        <View style={styles.dotsContainer}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={styles.dotOutline}>
              {pin.length > i && <View style={styles.dotFilled} />}
            </View>
          ))}
        </View>

        <NumberPad onNumberPress={handleNumberPress} onDelete={handleDelete} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8E9EB' },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 24 },
  title: { fontSize: 16, fontWeight: '700', color: '#000', marginBottom: 8, letterSpacing: 1 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 32 },
  errorText: { color: 'red', marginBottom: 16, fontWeight: '600' },
  dotsContainer: { flexDirection: 'row', gap: 16, marginBottom: 40 },
  dotOutline: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#C9CACB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotFilled: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#003366', // Fibo Navy
  }
});