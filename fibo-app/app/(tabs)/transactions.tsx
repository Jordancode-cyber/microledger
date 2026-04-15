import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Download, ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';
import BottomNav from '../../components/BottomNav';
import { supabase } from '../../src/supabase'; // Make sure this path is correct!

export default function AllTransactions() {
  const router = useRouter();
  const currentParams = useLocalSearchParams();
  const { userType, phoneNumber } = currentParams;
  const isVendor = String(userType || 'customer').toLowerCase() === 'vendor';

  // State to hold our live database transactions
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch the transactions every time the screen opens
  useFocusEffect(
    useCallback(() => {
      const fetchHistory = async () => {
        setLoading(true);
        if (phoneNumber) {
          const { data, error } = await supabase
            .from('transactions')
            .select('*')
            // Fetch if they are the sender OR the receiver
            .or(`sender_phone.eq.${phoneNumber},receiver_phone.eq.${phoneNumber}`)
            .order('created_at', { ascending: false }); // Newest first

          if (data && !error) {
            setTransactions(data);
          }
        }
        setLoading(false);
      };
      fetchHistory();
    }, [phoneNumber])
  );

  // Determine if money is coming IN or going OUT
  const isMoneyOut = (tx: any) => tx.sender_phone === phoneNumber;

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

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#003366" style={{ marginTop: 50 }} />
        ) : transactions.length === 0 ? (
          <Text style={styles.emptyText}>No transactions yet.</Text>
        ) : (
          transactions.map((tx) => (
            <View key={tx.id} style={styles.txCard}>
              <View style={[styles.iconBox, { backgroundColor: isMoneyOut(tx) ? '#FEE2E2' : '#DBEAFE' }]}>
                {isMoneyOut(tx) ? <ArrowUpRight size={20} color="#DC2626" /> : <ArrowDownLeft size={20} color="#2563EB" />}
              </View>
              <View style={styles.txDetails}>
                {/* Show the OTHER person's number */}
                <Text style={styles.txName}>{isMoneyOut(tx) ? tx.receiver_phone : tx.sender_phone}</Text>
                <Text style={styles.txDate}>{new Date(tx.created_at).toLocaleDateString()} • {new Date(tx.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
                <Text style={styles.txStatus}>COMPLETED</Text>
              </View>
              <Text style={[styles.txAmount, { color: isMoneyOut(tx) ? '#DC2626' : '#059669' }]}>
                {isMoneyOut(tx) ? '-' : '+'}{tx.amount}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <BottomNav isVendor={isVendor} />
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
  txAmount: { fontSize: 16, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#666', marginTop: 50, fontSize: 16 }
});