import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import BottomNav from '../../components/BottomNav';
import { supabase } from '../../src/supabase';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';

export default function Dashboard() {
  const router = useRouter();
  const currentParams = useLocalSearchParams();
  const { userType, userName, phoneNumber, balance } = currentParams;
  
  const [liveBalance, setLiveBalance] = useState(Number(balance || 0));
  const [recentTx, setRecentTx] = useState<any[]>([]);
  const [loadingTx, setLoadingTx] = useState(true);
  
  const isVendor = String(userType || 'customer').toLowerCase() === 'vendor';
  const displayName = String(userName || (isVendor ? 'Vendor' : 'Customer'));

  useFocusEffect(
    useCallback(() => {
      const fetchDashboardData = async () => {
        if (!phoneNumber) return;
        
        // 1. Update Balance
        const { data: userData } = await supabase.from('users').select('balance').eq('phone_number', String(phoneNumber)).single();
        if (userData) setLiveBalance(Number(userData.balance));

        // 2. Fetch Transactions (Check if phone is sender OR receiver)
        setLoadingTx(true);
        const { data: txData } = await supabase
          .from('transactions')
          .select('*')
          .or(`sender_phone.eq.${phoneNumber},receiver_phone.eq.${phoneNumber}`)
          .order('created_at', { ascending: false })
          .limit(3);

        if (txData) setRecentTx(txData);
        setLoadingTx(false);
      };
      fetchDashboardData();
    }, [phoneNumber])
  );

  // Helper to determine color and icon direction
  const getTxDetails = (tx: any) => {
    const isOut = tx.sender_phone === phoneNumber;
    return {
      isNegative: isOut,
      displayPhone: isOut ? tx.receiver_phone : tx.sender_phone,
      color: isOut ? '#DC2626' : '#059669',
      symbol: isOut ? '-' : '+'
    };
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, <Text style={styles.bold}>{displayName}</Text></Text>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.cardTitle}>{isVendor ? 'AVAILABLE FLOAT' : 'CURRENT COINS'}</Text>
          <Text style={styles.balanceText}>{liveBalance.toLocaleString()} UGX</Text>
          {isVendor && (
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => router.push({ pathname: '/deposit', params: { ...currentParams, balance: liveBalance } })}>
                <Text style={styles.actionBtnText}>DEPOSIT</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => router.push({ pathname: '/withdraw', params: { ...currentParams, balance: liveBalance } })}>
                <Text style={styles.actionBtnText}>WITHDRAW</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => router.push({ pathname: '/transactions', params: { ...currentParams, balance: liveBalance } })}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>

        {loadingTx ? (
           <ActivityIndicator size="small" color="#003366" />
        ) : recentTx.length === 0 ? (
          <View style={styles.emptyState}><Text style={styles.emptyText}>No transactions yet</Text></View>
        ) : (
          recentTx.map((tx) => {
            const { isNegative, displayPhone, color, symbol } = getTxDetails(tx);
            return (
              <View key={tx.id} style={styles.txCard}>
                <View style={[styles.iconBox, { backgroundColor: isNegative ? '#FEE2E2' : '#DBEAFE' }]}>
                  {isNegative ? <ArrowUpRight size={16} color="#DC2626" /> : <ArrowDownLeft size={16} color="#2563EB" />}
                </View>
                <View style={styles.txDetails}>
                  <Text style={styles.txName}>{displayPhone}</Text>
                  <Text style={styles.txDate}>{new Date(tx.created_at).toLocaleDateString()}</Text>
                </View>
                <Text style={[styles.txAmount, { color }]}>{symbol}{tx.amount}</Text>
              </View>
            );
          })
        )}
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
  cardTitle: { color: '#FFF', textAlign: 'center', fontWeight: 'bold', marginBottom: 8, opacity: 0.8 },
  balanceText: { color: '#FFF', fontSize: 36, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  actionRow: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, backgroundColor: '#004080', paddingVertical: 14, borderRadius: 30, alignItems: 'center' },
  actionBtnText: { color: '#FFF', fontWeight: 'bold' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  viewAll: { color: '#00D084', fontWeight: '600' },
  emptyState: { backgroundColor: '#FFF', borderRadius: 16, padding: 32, alignItems: 'center' },
  emptyText: { color: '#666', fontWeight: '600' },
  txCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 16, borderRadius: 16, alignItems: 'center', marginBottom: 8, elevation: 1 },
  iconBox: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  txDetails: { flex: 1 },
  txName: { fontSize: 14, fontWeight: '700', color: '#000' },
  txDate: { fontSize: 12, color: '#666' },
  txAmount: { fontSize: 14, fontWeight: 'bold' }
});