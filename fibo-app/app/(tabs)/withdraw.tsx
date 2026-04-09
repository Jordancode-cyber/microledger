import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';
import NumberPad from '../../components/NumberPad';
import { processWithdrawal } from '../../src/services/api'; // Kept your updated path!

export default function WithdrawFloat() {
  const router = useRouter();
  const { phoneNumber } = useLocalSearchParams();
  const [amount, setAmount] = useState('0');
  const [provider, setProvider] = useState<'mtn' | 'airtel' | null>(null);
  const [loading, setLoading] = useState(false);
  const userBalance = 50000; // Mock balance

  const handleNumberPress = (num: string) => {
    setAmount(prev => prev === '0' ? num : prev + num);
  };

  const handleDelete = () => {
    setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
  };

  const handleWithdraw = async () => {
    if (parseInt(amount, 10) > userBalance) {
      Alert.alert('Error', 'Insufficient float balance for this withdrawal.');
      return;
    }

    if (amount !== '0' && provider) {
      setLoading(true);
      try {
        await processWithdrawal({
          amount: parseInt(amount, 10),
          provider,
          phoneNumber: String(phoneNumber || ''),
        });

        Alert.alert(
          'Withdrawal Successful',
          `${parseInt(amount, 10).toLocaleString()} UGX has been sent to your ${provider.toUpperCase()} mobile money account.`,
          [{ text: 'OK', onPress: () => router.push('/dashboard') }],
        );
      } catch (error: any) {
        Alert.alert('Withdrawal failed', error.message || 'Unable to process withdrawal.');
      } finally {
        setLoading(false);
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
        <Text style={styles.headerTitle}>WITHDRAW FLOAT</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.amountContainer}>
          <Text style={styles.currencyLabel}>UGX</Text>
          <Text style={styles.amountText}>{parseInt(amount).toLocaleString()}</Text>
        </View>

        <Text style={styles.label}>Select Receiving Account</Text>
        <View style={styles.providerContainer}>
          <TouchableOpacity 
            style={[styles.providerBtn, provider === 'mtn' && styles.providerMtn]}
            onPress={() => setProvider('mtn')}
            activeOpacity={0.8}
          >
            <Text style={[styles.providerText, provider === 'mtn' && styles.providerTextActive]}>MTN MoMo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.providerBtn, provider === 'airtel' && styles.providerAirtel]}
            onPress={() => setProvider('airtel')}
            activeOpacity={0.8}
          >
            <Text style={[styles.providerText, provider === 'airtel' && styles.providerTextActiveWhite]}>Airtel Money</Text>
          </TouchableOpacity>
        </View>

        <NumberPad onNumberPress={handleNumberPress} onDelete={handleDelete} />

        <TouchableOpacity
          style={[styles.button, (amount === '0' || !provider || loading) && styles.buttonDisabled]}
          onPress={handleWithdraw}
          disabled={amount === '0' || !provider || loading}
        >
          <Text style={styles.buttonText}>{loading ? 'REQUESTING...' : 'REQUEST WITHDRAWAL'}</Text>
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
  amountContainer: { alignItems: 'center', marginBottom: 32 },
  currencyLabel: { fontSize: 16, color: '#666', fontWeight: '600' },
  amountText: { fontSize: 48, fontWeight: 'bold', color: '#003366' },
  label: { width: '100%', fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 12, textAlign: 'center' },
  providerContainer: { flexDirection: 'row', width: '100%', gap: 12, marginBottom: 24 },
  providerBtn: { flex: 1, backgroundColor: '#FFF', paddingVertical: 16, borderRadius: 16, borderWidth: 2, borderColor: '#E2E8F0', alignItems: 'center' },
  providerMtn: { backgroundColor: '#FFCC00', borderColor: '#FFCC00' },
  providerAirtel: { backgroundColor: '#FF0000', borderColor: '#FF0000' },
  providerText: { fontWeight: '700', color: '#666' },
  providerTextActive: { color: '#000' },
  providerTextActiveWhite: { color: '#FFF' },
  button: { width: '100%', backgroundColor: '#EAC435', paddingVertical: 18, borderRadius: 30, alignItems: 'center', marginTop: 10 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { fontWeight: 'bold', fontSize: 16, color: '#000' }
});