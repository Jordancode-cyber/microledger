import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { sendMoney } from '../../src/services/api';

export default function ConfirmTransaction() {
  const router = useRouter(); // Fixed: Ensure R is uppercase in the call
  const params = useLocalSearchParams();
  const { amount, customerPhone, senderPhone } = params;
  const [isSending, setIsSending] = useState(false);

  const handleFinalSend = async () => {
    if (isSending) return;
    setIsSending(true);

    try {
      await sendMoney({
        amount: parseInt(amount as string),
        senderPhone: String(senderPhone),
        customerPhone: String(customerPhone)
      });

      router.replace({
        pathname: '/success',
        params: { ...params }
      });
    } catch (error: any) {
      Alert.alert("Transfer Failed", error.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.label}>Sending Change to</Text>
      <Text style={styles.phone}>{customerPhone}</Text>
      <Text style={styles.amount}>{parseInt(amount as string).toLocaleString()} UGX</Text>

      <TouchableOpacity 
        style={[styles.btn, isSending && { opacity: 0.7 }]} 
        onPress={handleFinalSend}
        disabled={isSending}
      >
        <Text style={styles.btnText}>{isSending ? "SENDING..." : "APPROVE TRANSACTION"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', padding: 24 },
  label: { fontSize: 16, color: '#666' },
  phone: { fontSize: 24, fontWeight: 'bold', marginVertical: 8 },
  amount: { fontSize: 48, fontWeight: '900', color: '#003366', marginBottom: 40 },
  btn: { width: '100%', backgroundColor: '#003366', padding: 20, borderRadius: 30, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 }
});