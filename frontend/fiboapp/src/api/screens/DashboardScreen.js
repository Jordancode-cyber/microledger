import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { colors } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import client from '../client';

export default function DashboardScreen({ navigation }) {
  const { user, refreshUser, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    refreshUser();
    client.get('/transactions').then(r => setTransactions(r.data.slice(0, 5)));
  }, []);

  const initials = (name) => name ? name[0].toUpperCase() : '?';
  const timeAgo = (date) => {
    const diff = (Date.now() - new Date(date)) / 60000;
    if (diff < 60) return `${Math.floor(diff)} mins ago`;
    return `${Math.floor(diff / 60)} hour(s) ago`;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <TouchableOpacity style={styles.profileIcon} onPress={() => navigation.navigate('Profile')}>
        <Text style={{ fontSize: 24 }}>👤</Text>
      </TouchableOpacity>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>CURRENT BALANCE</Text>
        <Text style={styles.balance}>{(user?.balance || 0).toLocaleString()} UGX</Text>
        {user?.role === 'vendor' && (
          <TouchableOpacity style={styles.sendBtn} onPress={() => navigation.navigate('SendChange')}>
            <Text style={styles.sendBtnText}>SEND CHANGE</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.topupBtn}>
          <Text style={styles.topupText}>TOP UP BALANCE</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.txHeader}>
        <Text style={styles.txTitle}>Recent Transactions</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
          <Text style={styles.viewAll}>View all</Text>
        </TouchableOpacity>
      </View>

      {transactions.map((tx, i) => (
        <View key={i} style={styles.txItem}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{initials(tx.recipient_name || tx.recipient_phone)}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.txName}>{tx.recipient_name || tx.recipient_phone}</Text>
            <Text style={styles.txTime}>{timeAgo(tx.created_at)}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.txAmount}>UGX {tx.amount}</Text>
            <Text style={styles.txStatus}>SUCCESS</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 20, paddingTop: 60 },
  profileIcon: { marginBottom: 16 },
  balanceCard: { backgroundColor: colors.primary, borderRadius: 20, padding: 24, marginBottom: 28 },
  balanceLabel: { color: '#aabbdd', fontSize: 12, letterSpacing: 1, marginBottom: 8 },
  balance: { color: colors.white, fontSize: 32, fontWeight: '800', marginBottom: 20 },
  sendBtn: { backgroundColor: colors.accent, borderRadius: 32, paddingVertical: 14, alignItems: 'center', marginBottom: 10 },
  sendBtnText: { fontWeight: '700', fontSize: 14, letterSpacing: 1 },
  topupBtn: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 32, paddingVertical: 14, alignItems: 'center' },
  topupText: { color: colors.white, fontWeight: '700', fontSize: 14, letterSpacing: 1 },
  txHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  txTitle: { fontSize: 18, fontWeight: '700' },
  viewAll: { color: colors.success, fontWeight: '600' },
  txItem: { backgroundColor: colors.white, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontWeight: '700' },
  txName: { fontWeight: '600' },
  txTime: { color: colors.muted, fontSize: 12 },
  txAmount: { fontWeight: '700' },
  txStatus: { color: colors.success, fontSize: 12, fontWeight: '700' },
});