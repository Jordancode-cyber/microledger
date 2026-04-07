import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { colors } from '../../theme';

const KEYS = ['1','2','3','4','5','6','7','8','9','0','⌫'];

export default function SendChangeScreen({ navigation }) {
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  const press = (k) => {
    if (k === '⌫') return setAmount(a => a.slice(0, -1));
    setAmount(a => a + k);
  };

  const handleConfirm = () => {
    const amt = parseInt(amount);
    if (!phone) return Alert.alert('Error', 'Enter phone number');
    if (!amt || amt < 100 || amt > 1000) return Alert.alert('Error', 'Amount must be between 100 and 1000 UGX');
    navigation.navigate('Confirm', { phone, name, amount: amt });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}><Text>◀</Text></TouchableOpacity>
      <Text style={styles.title}>INPUT AMOUNT</Text>

      <View style={styles.amountRow}>
        <Text style={styles.currency}>UGX</Text>
        <Text style={styles.amount}>{amount || '0'}</Text>
      </View>

      <Text style={styles.label}>Phone number</Text>
      <TextInput style={styles.input} placeholder="Input phone number" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />

      <Text style={styles.label}>Customer Name</Text>
      <TextInput style={styles.input} placeholder="Input customer name" value={name} onChangeText={setName} />

      <View style={styles.keypad}>
        {KEYS.map((k, i) => (
          <TouchableOpacity key={i} style={styles.key} onPress={() => press(k)}>
            <Text style={styles.keyText}>{k}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleConfirm}>
        <Text style={styles.btnText}>CONFIRM AND SEND</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 24, paddingTop: 60 },
  back: { marginBottom: 8 },
  title: { textAlign: 'center', fontWeight: '700', letterSpacing: 1, marginBottom: 20 },
  amountRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  currency: { fontSize: 28, fontWeight: '800', color: '#aaa' },
  amount: { fontSize: 28, fontWeight: '800' },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  input: { backgroundColor: '#e5e5e5', borderRadius: 12, padding: 14, marginBottom: 16, fontSize: 15 },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', marginBottom: 24 },
  key: { width: '30%', paddingVertical: 14, alignItems: 'center', backgroundColor: colors.white, borderRadius: 16, marginBottom: 10 },
  keyText: { fontSize: 22, fontWeight: '500' },
  btn: { backgroundColor: colors.accent, borderRadius: 32, paddingVertical: 18, alignItems: 'center' },
  btnText: { fontWeight: '700', fontSize: 15, letterSpacing: 1 },
});