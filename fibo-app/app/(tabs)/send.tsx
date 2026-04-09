import React, { useState } from 'react';
// 1. We added ScrollView to the imports!
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';
import NumberPad from '../../components/NumberPad';

export default function SendMoney() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('0');
  const userBalance = 50000; // Mock balance

  const handleNumberPress = (num: string) => {
    setAmount(prev => prev === '0' ? num : prev + num);
  };

  const handleDelete = () => {
    setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
  };

  const handleConfirm = () => {
    if (amount !== '0' && phoneNumber) {
      if (parseInt(amount) <= userBalance) {
        router.push({
          pathname: '/confirm',
          params: { amount, phoneNumber }
        });
      } else {
        alert('Insufficient float balance');
      }
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SEND CHANGE</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* 2. Replaced <View> with <ScrollView> to make it fluid! */}
      {/* keyboardShouldPersistTaps="handled" is the magic that lets you click the button while the keyboard is open */}
      <ScrollView 
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.amountContainer}>
          <Text style={styles.currencyLabel}>UGX</Text>
          <Text style={styles.amountText}>{parseInt(amount).toLocaleString()}</Text>
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.label}>Customer Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="07XXXXXXXX"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        <NumberPad onNumberPress={handleNumberPress} onDelete={handleDelete} />

        <TouchableOpacity
          style={[styles.button, (amount === '0' || !phoneNumber) && styles.buttonDisabled]}
          onPress={handleConfirm}
          disabled={amount === '0' || !phoneNumber}
        >
          <Text style={styles.buttonText}>CONFIRM & CONTINUE</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8E9EB' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 16, fontWeight: '700', letterSpacing: 1 },
  
  // 3. Changed `flex: 1` to `flexGrow: 1` and added paddingBottom so nothing gets cut off!
  content: { flexGrow: 1, paddingHorizontal: 24, alignItems: 'center', paddingBottom: 40 },
  
  amountContainer: { alignItems: 'center', marginBottom: 32 },
  currencyLabel: { fontSize: 16, color: '#666', fontWeight: '600' },
  amountText: { fontSize: 48, fontWeight: 'bold', color: '#003366' },
  inputCard: { width: '100%', backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginBottom: 20, elevation: 2 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: { borderBottomWidth: 2, borderBottomColor: '#E2E8F0', fontSize: 18, paddingVertical: 8, color: '#000' },
  button: { width: '100%', backgroundColor: '#EAC435', paddingVertical: 18, borderRadius: 30, alignItems: 'center', marginTop: 20 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { fontWeight: 'bold', fontSize: 16 }
});