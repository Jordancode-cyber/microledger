import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Download, ArrowUpRight, ArrowDownLeft, TrendingUp } from 'lucide-react-native';

const MOCK_TRANSACTIONS = [
  { id: '1', type: 'send', amount: 500, name: 'John Doe', date: 'Oct 24, 2026', time: '14:30', status: 'COMPLETED' },
  { id: '2', type: 'auto_sweep', amount: 5000, name: 'MTN Mobile Money', date: 'Oct 24, 2026', time: '09:15', status: 'COMPLETED' },
  { id: '3', type: 'deposit', amount: 50000, name: 'Float Deposit', date: 'Oct 23, 2026', time: '08:00', status: 'COMPLETED' },
];

export default function AllTransactions() {
  const router = useRouter();

  const renderIcon = (type: string) => {
    if (type === 'send') return <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}><ArrowUpRight size={20} color="#DC2626" /></View>;
    if (type === 'auto_sweep') return <View style={[styles.iconBox, { backgroundColor: '#F3E8FF' }]}><TrendingUp size={20} color="#9333EA" /></View>;
    return <View style={[styles.iconBox, { backgroundColor: '#DBEAFE' }]}><ArrowDownLeft size={20} color="#2563EB" /></View>;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TRANSACTION HISTORY</Text>
        <TouchableOpacity style={styles.exportButton}>
          <Download size={24} color="#003366" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {MOCK_TRANSACTIONS.map((tx) => (
          <View key={tx.id} style={styles.txCard}>
            {renderIcon(tx.type)}
            <View style={styles.txDetails}>
              <Text style={styles.txName}>{tx.name}</Text>
              <Text style={styles.txDate}>{tx.date} • {tx.time}</Text>
              <Text style={styles.txStatus}>{tx.status}</Text>
            </View>
            <Text style={styles.txAmount}>
              {tx.type === 'send' ? '-' : '+'}{tx.amount}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8E9EB' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 16, fontWeight: '700', letterSpacing: 1 },
  exportButton: { padding: 8, marginRight: -8 },
  listContainer: { paddingHorizontal: 24, paddingBottom: 40 },
  txCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 16, borderRadius: 20, alignItems: 'center', marginBottom: 12, elevation: 2 },
  iconBox: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  txDetails: { flex: 1 },
  txName: { fontSize: 16, fontWeight: '700', color: '#000', marginBottom: 4 },
  txDate: { fontSize: 12, color: '#666', marginBottom: 4 },
  txStatus: { fontSize: 10, fontWeight: 'bold', color: '#059669', letterSpacing: 1 },
  txAmount: { fontSize: 16, fontWeight: 'bold', color: '#000' }
});