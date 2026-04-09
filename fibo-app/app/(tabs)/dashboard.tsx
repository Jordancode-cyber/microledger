import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import BottomNav from '../../components/BottomNav';

export default function Dashboard() {
  const router = useRouter();
  const { userType, userName, balance } = useLocalSearchParams();
  
  const isVendor = String(userType || 'customer').toLowerCase() === 'vendor';
  const displayName = String(userName || (isVendor ? 'UCU Main Canteen' : 'John Doe'));
  const displayBalance = Number(balance ?? (isVendor ? 50000 : 50000));

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, <Text style={styles.bold}>{displayName}</Text></Text>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.cardTitle}>{isVendor ? 'AVAILABLE FLOAT' : 'CURRENT COINS'}</Text>
          <Text style={styles.balanceText}>{displayBalance.toLocaleString()} UGX</Text>

          {isVendor && (
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/deposit')}>
                <Text style={styles.actionBtnText}>DEPOSIT</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/withdraw')}>
                <Text style={styles.actionBtnText}>WITHDRAW</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => router.push('/transactions')}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No transactions yet</Text>
          {isVendor && <Text style={styles.emptySub}>Start by sending change to your customers</Text>}
        </View>
      </ScrollView>

      <BottomNav isVendor={isVendor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8E9EB' },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 60 },
  header: { marginBottom: 24 },
  greeting: { fontSize: 20, color: '#333' },
  bold: { fontWeight: 'bold' },
  balanceCard: { backgroundColor: '#003366', borderRadius: 24, padding: 24, elevation: 4, marginBottom: 32 },
  cardTitle: { color: '#FFF', textAlign: 'center', fontWeight: 'bold', marginBottom: 8, letterSpacing: 1, opacity: 0.8 },
  balanceText: { color: '#FFF', fontSize: 36, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  actionRow: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, backgroundColor: '#004080', paddingVertical: 14, borderRadius: 30, alignItems: 'center' },
  actionBtnText: { color: '#FFF', fontWeight: 'bold' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  viewAll: { color: '#00D084', fontWeight: '600' },
  emptyState: { backgroundColor: '#FFF', borderRadius: 16, padding: 32, alignItems: 'center' },
  emptyText: { color: '#666', fontWeight: '600', marginBottom: 8 },
  emptySub: { color: '#999', fontSize: 12 }
});