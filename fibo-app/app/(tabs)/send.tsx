import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, AlertCircle } from 'lucide-react-native';
import NumberPad from '../../components/NumberPad';

export default function SendMoney() {
  const router = useRouter();
  const currentParams = useLocalSearchParams();
  const { phoneNumber: vendorPhone, balance } = currentParams;
  const userBalance = Number(balance || 0);

  const [customerPhone, setCustomerPhone] = useState('');
  const [amount, setAmount] = useState('0');

  const handleNumberPress = (num: string) => {
    setAmount(prev => {
      const nextValue = prev === '0' ? num : prev + num;
      // THE MICRO-CURRENCY LOCK: Prevent typing any number over 999
      if (parseInt(nextValue) > 999) {
        return prev; 
      }
      return nextValue;
    });
  };

  const handleDelete = () => {
    setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
  };

  const handleConfirm = () => {
    if (amount !== '0' && customerPhone) {
      if (parseInt(amount) > 999) {
        Alert.alert('Limit Reached', 'Fibo is for micro-change only. Maximum amount is 999 UGX.');
        return;
      }
      
      if (parseInt(amount) <= userBalance) {
        router.push({
          pathname: '/confirm',
          params: { 
            ...currentParams, 
            amount, 
            customerPhone: customerPhone,
            senderPhone: vendorPhone
          }
        });
      } else {
        Alert.alert('Error', 'Insufficient float balance to send this amount.');
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

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        
        {/* Added a Limit Badge */}
        <View style={styles.limitBadge}>
          <AlertCircle size={14} color="#059669" />
          <Text style={styles.limitText}>Micro-change limit: 999 UGX</Text>
        </View>

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
            value={customerPhone}
            onChangeText={setCustomerPhone}
          />
        </View>

        <NumberPad onNumberPress={handleNumberPress} onDelete={handleDelete} />

        <TouchableOpacity
          style={[styles.button, (amount === '0' || !customerPhone) && styles.buttonDisabled]}
          onPress={handleConfirm}
          disabled={amount === '0' || !customerPhone}
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
  content: { flexGrow: 1, paddingHorizontal: 24, alignItems: 'center', paddingBottom: 40 },
  limitBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#D1FAE5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 16, gap: 6 },
  limitText: { color: '#059669', fontSize: 12, fontWeight: '700' },
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