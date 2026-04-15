import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, ArrowUpRight, ArrowDownLeft, RefreshCcw } from 'lucide-react-native';
import BottomNav from '../../components/BottomNav';
import { supabase } from '../../src/supabase';

export default function Transactions() {
  const router = useRouter();
  const currentParams = useLocalSearchParams();
  const { phoneNumber, userType } = currentParams;
  
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isVendor = String(userType).toLowerCase() === 'vendor';

  useFocusEffect(
    useCallback(() => {
      const fetchHistory = async () => {
        if (!phoneNumber) return;
        setLoading(true);
        const { data } = await supabase
          .from('transactions')
          .select('*')
          .or(`sender_phone.eq.${phoneNumber},receiver_phone.eq.${phoneNumber}`)
          .order('created_at', { ascending: false });

        if (data) setTransactions(data);
        setLoading(false);
      };
      fetchHistory();
    }, [phoneNumber])
  );

  const getTxDetails = (tx: any) => {
    // Logic to determine direction and color
    const isOut = tx.sender_phone === phoneNumber;
    const isSweep = tx.transaction_type === 'auto_sweep';
    
    return {
      isNegative: isOut,
      isSweep: isSweep,
      displayPhone: isOut ? tx.receiver_phone : tx.sender_phone,
      color: isSweep ? '#8B5CF6' : (isOut ? '#DC2626' : '#059669'),
      symbol: isOut ? '-' : '+'
    };
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><ChevronLeft size={28} /></TouchableOpacity>
        <Text style={styles.headerTitle}>TRANSACTION HISTORY</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#003366" />
        ) : transactions.length === 0 ? (
          <Text style={styles.emptyText}>No transactions found.</Text>
        ) : (
          transactions.map((tx) => {
            const { isNegative, isSweep, displayPhone, color, symbol } = getTxDetails(tx);
            return (
              <View key={tx.id} style={styles.txCard}>
                <View style={[styles.iconBox, { backgroundColor: isSweep ? '#EDE9FE' : (isNegative ? '#FEE2E2' : '#DBEAFE') }]}>
                  {isSweep ? <RefreshCcw size={20} color="#8B5CF6" /> : (isNegative ? <ArrowUpRight size={20} color="#DC2626" /> : <ArrowDownLeft size={20} color="#2563EB" />)}
                </View>
                <View style={styles.txDetails}>
                  <Text style={styles.txName}>{displayPhone}</Text>
                  <Text style={styles.txDate}>{new Date(tx.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</Text>
                  <Text style={[styles.txTag, { backgroundColor: color + '20', color: color }]}>{tx.transaction_type?.toUpperCase()}</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 10 },
  headerTitle: { fontSize: 16, fontWeight: 'bold' },
  txCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 16, borderRadius: 20, alignItems: 'center', marginBottom: 12, elevation: 1 },
  iconBox: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  txDetails: { flex: 1 },
  txName: { fontSize: 15, fontWeight: 'bold', color: '#000' },
  txDate: { fontSize: 12, color: '#666', marginTop: 2 },
  txTag: { alignSelf: 'flex-start', fontSize: 9, fontWeight: '800', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4 },
  txAmount: { fontSize: 16, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#666', marginTop: 40 }
});