import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { colors } from '../../theme';
import client from '../client';

export default function ConfirmScreen({ route, navigation }) {
  const { phone, name, amount } = route.params;

  const handleApprove = async () => {
    try {
      await client.post('/transactions/send', {
        recipient_phone: phone,
        recipient_name: name,
        amount,
      });
      navigation.replace('Done');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || 'Transaction failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TRANSACTION CONFIRMATION</Text>
      <View style={styles.icon}><Text style={{ fontSize: 28 }}>✓</Text></View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>TRANSACTIONAL SUMMARY</Text>
        {[['Number:', phone], ['Customer Name', name || '—'], ['Amount', amount], ['Transaction type', 'Coin transfer']].map(([l, v]) => (
          <View key={l} style={styles.row}>
            <Text style={styles.rowLabel}>{l}</Text>
            <Text style={styles.rowValue}>{v}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.editBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.editText}>EDIT TRANSACTION</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.approveBtn} onPress={handleApprove}>
        <Text style={styles.approveText}>APPROVE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 24, paddingTop: 60, alignItems: 'center' },
  title: { fontWeight: '700', letterSpacing: 1, marginBottom: 16 },
  icon: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  card: { backgroundColor: colors.white, borderRadius: 20, padding: 24, width: '100%', marginBottom: 32 },
  cardTitle: { fontWeight: '800', textAlign: 'center', marginBottom: 20, fontSize: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  rowLabel: { color: colors.muted },
  rowValue: { fontWeight: '600' },
  editBtn: { backgroundColor: colors.primary, borderRadius: 32, paddingVertical: 18, alignItems: 'center', width: '100%', marginBottom: 12 },
  editText: { color: colors.white, fontWeight: '700', letterSpacing: 1 },
  approveBtn: { backgroundColor: colors.accent, borderRadius: 32, paddingVertical: 18, alignItems: 'center', width: '100%' },
  approveText: { fontWeight: '700', letterSpacing: 1 },
});