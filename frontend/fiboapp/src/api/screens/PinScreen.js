import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { colors } from '../../theme';
import { useAuth } from '../../context/AuthContext';

const KEYS = ['1','2','3','4','5','6','7','8','9','0','⌫'];

export default function PinScreen({ route, navigation }) {
  const { mode, phone, role, businessName } = route.params;
  const [pin, setPin] = useState('');
  const { login, register } = useAuth();

  const press = (k) => {
    if (k === '⌫') return setPin(p => p.slice(0, -1));
    if (pin.length < 4) setPin(p => p + k);
  };

  const handleContinue = async () => {
    if (pin.length < 4) return Alert.alert('Error', 'Enter 4-digit PIN');
    try {
      if (mode === 'register') {
        const user = await register({ phone_number: phone, pin, role, business_name: businessName });
        navigation.replace('Main');
      } else {
        await login(phone, pin);
        navigation.replace('Main');
      }
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Input your pin</Text>
      <View style={styles.dots}>
        {[0,1,2,3].map(i => (
          <View key={i} style={[styles.dot, i < pin.length && styles.dotFilled]} />
        ))}
      </View>
      <TouchableOpacity onPress={handleContinue}><Text style={styles.continue}>Continue</Text></TouchableOpacity>
      <View style={styles.keypad}>
        {KEYS.map((k, i) => (
          <TouchableOpacity key={i} style={styles.key} onPress={() => press(k)}>
            <Text style={styles.keyText}>{k}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 40 },
  dots: { flexDirection: 'row', gap: 20, marginBottom: 24 },
  dot: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#222', opacity: 0.15 },
  dotFilled: { opacity: 1 },
  continue: { fontSize: 16, color: colors.text, marginBottom: 40 },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, width: '100%' },
  key: { width: 72, height: 56, justifyContent: 'center', alignItems: 'center' },
  keyText: { fontSize: 24, fontWeight: '400', color: colors.text },
});