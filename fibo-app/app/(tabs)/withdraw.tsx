import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';
import NumberPad from '../../components/NumberPad';
import { processDeposit } from '../../src/services/api'; 

export default function Deposit() {
  const router = useRouter();
  const currentParams = useLocalSearchParams();
  const { phoneNumber } = currentParams;

  const [amount, setAmount] = useState('0');
  const [loading, setLoading] = useState(false);

  // Simple visual logic for the UI to show which network is detected
  const isMTN = ['077', '078', '076'].some(p => String(phoneNumber).startsWith(p));

  const handleConfirm = async () => {
    if (amount === '0' || loading) return;
    setLoading(true);
    try {
      await processDeposit({ amount: parseInt(amount), phoneNumber: String(phoneNumber) });
      router.replace({ pathname: '/success', params: { ...currentParams, amount } });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><ChevronLeft size={28} /></TouchableOpacity>
        <Text style={styles.headerTitle}>DEPOSIT FLOAT</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.networkBadge}>
          <Text style={styles.networkText}>Detected: {isMTN ? 'MTN MoMo' : 'Airtel Money'}</Text>
        </View>
        
        <Text style={styles.amountDisplay}>{parseInt(amount).toLocaleString()} UGX</Text>
        
        <NumberPad 
          onNumberPress={(num) => setAmount(prev => prev === '0' ? num : prev + num)} 
          onDelete={() => setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0')} 
        />

        <TouchableOpacity 
          style={[styles.mainBtn, (amount === '0' || loading) && { opacity: 0.5 }]} 
          onPress={handleConfirm}
          disabled={amount === '0' || loading}
        >
          <Text style={styles.btnText}>{loading ? "PROCESSING..." : "CONFIRM DEPOSIT"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8E9EB' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 10 },
  headerTitle: { fontSize: 16, fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 24, alignItems: 'center', paddingBottom: 40 },
  networkBadge: { backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginTop: 10 },
  networkText: { fontSize: 12, fontWeight: '700', color: '#666' },
  amountDisplay: { fontSize: 54, fontWeight: 'bold', color: '#003366', marginVertical: 30 },
  mainBtn: { width: '100%', backgroundColor: '#EAC435', padding: 20, borderRadius: 30, alignItems: 'center', marginTop: 20 },
  btnText: { fontWeight: 'bold', fontSize: 16 }
});