import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';
import { sendMoney } from '../../src/services/api'; // Path to your api.ts

export default function Confirm() {
  const router = useRouter();
  
  // 1. Grab ALL current parameters so we can pass them along later
  const currentParams = useLocalSearchParams();
  const { amount, customerPhone, senderPhone } = currentParams;
  
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      await sendMoney({
        amount: parseInt(amount as string),
        senderPhone: String(senderPhone), 
        // 2. ADDED THIS: Tell the API exactly who receives the money!
        customerPhone: String(customerPhone) 
      });
      
      // 3. ADDED THIS: Pass ALL params to success so the app doesn't forget you are a Vendor!
      router.push({ pathname: '/success', params: currentParams });
      
    } catch (error: any) {
      Alert.alert('Send failed', error.message || 'Unable to send money');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><ChevronLeft size={28} /></TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>TRANSACTION SUMMARY</Text>
        
        <View style={styles.receiptCard}>
          <Text style={styles.amountLabel}>Total Amount</Text>
          <Text style={styles.amountText}>{parseInt(amount as string).toLocaleString()} UGX</Text>
          
          <View style={styles.divider} />
          
          <View style={styles.row}><Text style={styles.rowLabel}>To Number:</Text><Text style={styles.rowValue}>{customerPhone}</Text></View>
          <View style={styles.row}><Text style={styles.rowLabel}>Type:</Text><Text style={styles.rowValue}>Digital Change</Text></View>
          <View style={styles.row}><Text style={styles.rowLabel}>Fee:</Text><Text style={styles.freeText}>0 UGX</Text></View>
        </View>

        <TouchableOpacity 
          style={[styles.btnApprove, loading && styles.btnDisabled]} 
          onPress={handleApprove}
          disabled={loading}
        >
          <Text style={styles.btnText}>
            {loading ? 'SENDING...' : 'APPROVE & SEND'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8E9EB' },
  header: { padding: 24, paddingTop: 60 },
  content: { flex: 1, paddingHorizontal: 24, alignItems: 'center' },
  title: { fontSize: 14, fontWeight: '700', letterSpacing: 1, marginBottom: 24 },
  receiptCard: { width: '100%', backgroundColor: '#FFF', borderRadius: 24, padding: 24, elevation: 4, marginBottom: 40 },
  amountLabel: { textAlign: 'center', color: '#666', fontSize: 14 },
  amountText: { textAlign: 'center', color: '#003366', fontSize: 36, fontWeight: 'bold', marginVertical: 8 },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 16, borderStyle: 'dashed' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  rowLabel: { color: '#666', fontSize: 14 },
  rowValue: { fontWeight: '600', fontSize: 14 },
  freeText: { fontWeight: 'bold', color: '#00D084', fontSize: 14 },
  btnApprove: { width: '100%', backgroundColor: '#EAC435', padding: 18, borderRadius: 30, alignItems: 'center' },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontWeight: 'bold', fontSize: 16 }
});