import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme';
import client from '../client';

export default function TransactionsScreen({ navigation }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    client.get('/transactions').then(r => setTransactions(r.data));
  }, []);

  const timeAgo = (date) => {
    const diff = (Date.now() - new Date(date)) / 60000;
    if (diff < 60) return `${Math.floor(diff)} mins ago`;
    return `${Math.floor(diff / 60)} hour(s) ago`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text>◀</Text></TouchableOpacity>
        <Text style={styles.title}>All Transactions</Text>
        <TouchableOpacity><Text style={{ color: colors.success, fontWeight: '600' }}>Export</Text></TouchableOpacity>
      </View>
      {transactions.map((tx, i) => (
        <View key={i} style={styles.item}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{(tx.recipient_name || tx.recipient_phone)[0].toUpperCase()}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{tx.recipient_name || tx.recipient_phone}</Text>
            <Text style={styles.time}>{timeAgo(tx.created_at)}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.amount}>UGX {tx.amount}</Text>
            <Text style={styles.status}>SUCCESS</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: '800' },
  item: { backgroundColor: colors.white, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontWeight: '700' },
  name: { fontWeight: '600' },
  time: { color: '#888', fontSize: 12 },
  amount: { fontWeight: '700' },
  status: { color: colors.success, fontSize: 12, fontWeight: '700' },
});