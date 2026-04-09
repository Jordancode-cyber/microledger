import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';
import NumberPad from '../../components/NumberPad';
import { supabase } from '../../src/styles/supabase'; // (Or wherever you saved your supabase.ts file)

export default function PinSetup() {
  const router = useRouter();
  const { userType, name, businessName, phoneNumber } = useLocalSearchParams();

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  const handleNumberPress = (num: string) => {
    if (!isConfirming && pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        setTimeout(() => setIsConfirming(true), 300);
      }
    } else if (isConfirming && confirmPin.length < 4) {
      const newConfirmPin = confirmPin + num;
      setConfirmPin(newConfirmPin);
      if (newConfirmPin.length === 4) {
        setTimeout(async () => {
          if (newConfirmPin === pin) {
            try {
              const { user } = await registerUser({
                userType: String(userType || 'customer'),
                phoneNumber: String(phoneNumber || ''),
                pin: newConfirmPin,
                name: String(name || ''),
                businessName: String(businessName || ''),
              });

              const userName = user.business_name || user.name || user.phone_number;
              const balance = String(user.balance ?? 0);
              router.replace({
                pathname: '/dashboard',
                params: {
                  userType: String(user.user_type || userType || 'customer'),
                  userName,
                  balance,
                  phoneNumber: String(user.phone_number || phoneNumber || ''),
                },
              });
            } catch (registerError: any) {
              Alert.alert('Registration failed', registerError.message || 'Unable to create account');
              setConfirmPin('');
              setIsConfirming(false);
              setPin('');
            }
          } else {
            Alert.alert('PINs do not match. Try again.');
            setConfirmPin('');
          }
        }, 300);
      }
    }
  };

  const handleDelete = () => {
    if (isConfirming) {
      setConfirmPin(confirmPin.slice(0, -1));
    } else {
      setPin(pin.slice(0, -1));
    }
  };

  const currentPin = isConfirming ? confirmPin : pin;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          {isConfirming ? 'CONFIRM YOUR PIN' : 'CREATE YOUR PIN'}
        </Text>
        <Text style={styles.subtitle}>
          {isConfirming ? 'Re-enter your 4-digit PIN' : 'Enter a secure 4-digit PIN'}
        </Text>

        <View style={styles.dotsContainer}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={styles.dotOutline}>
              {currentPin.length > i && <View style={styles.dotFilled} />}
            </View>
          ))}
        </View>

        <NumberPad onNumberPress={handleNumberPress} onDelete={handleDelete} />
      </View>
    </View>
  );
}

// Reuse the exact same styles as PinInput!
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8E9EB' },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 24 },
  title: { fontSize: 16, fontWeight: '700', color: '#000', marginBottom: 8, letterSpacing: 1 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 32 },
  dotsContainer: { flexDirection: 'row', gap: 16, marginBottom: 40 },
  dotOutline: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#C9CACB', alignItems: 'center', justifyContent: 'center' },
  dotFilled: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#003366' }
});