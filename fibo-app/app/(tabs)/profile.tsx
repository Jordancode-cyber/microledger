import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// 1. We imported useLocalSearchParams to get the live user data!
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, User, Shield, HelpCircle, LogOut } from 'lucide-react-native';

export default function Profile() {
  const router = useRouter();
  
  // 2. We grab the specific user's details passed from the navigation
  const { userType, userName, phoneNumber } = useLocalSearchParams();

  // 3. Format the data so it always looks good
  const isVendor = String(userType || 'customer').toLowerCase() === 'vendor';
  const displayName = String(userName || (isVendor ? 'Vendor Account' : 'Customer Account'));
  const displayPhone = String(phoneNumber || '');

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        // On logout, we send them completely back to the Welcome screen to clear the data
        { text: "Log Out", style: "destructive", onPress: () => router.replace('/welcome') }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* User Avatar & Info */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <User size={48} color="#FFF" />
          </View>
          
          {/* 4. Displaying the LIVE data! */}
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userPhone}>{displayPhone}</Text>
          
          <View style={[styles.badge, !isVendor && styles.customerBadge]}>
            <Text style={[styles.badgeText, !isVendor && styles.customerBadgeText]}>
              {isVendor ? 'VERIFIED VENDOR' : 'VERIFIED CUSTOMER'}
            </Text>
          </View>
        </View>

        {/* Action Menu */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconBox}><Shield size={20} color="#003366" /></View>
            <Text style={styles.menuText}>Change PIN</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconBox}><HelpCircle size={20} color="#003366" /></View>
            <Text style={styles.menuText}>Help & Support</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
            <View style={[styles.menuIconBox, styles.logoutIconBox]}><LogOut size={20} color="#DC2626" /></View>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8E9EB' },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  content: { flex: 1, paddingHorizontal: 24 },
  avatarSection: { alignItems: 'center', marginBottom: 40 },
  avatarCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#003366', alignItems: 'center', justifyContent: 'center', marginBottom: 16, elevation: 4 },
  userName: { fontSize: 24, fontWeight: '700', color: '#000', marginBottom: 4 },
  userPhone: { fontSize: 16, color: '#666', marginBottom: 12 },
  badge: { backgroundColor: '#EAC435', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#000', letterSpacing: 1 },
  // Added a specific style for when a Customer logs in
  customerBadge: { backgroundColor: '#E2E8F0' },
  customerBadgeText: { color: '#64748B' },
  menuContainer: { gap: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 20, elevation: 1 },
  menuIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  menuText: { fontSize: 16, fontWeight: '600', color: '#333' },
  logoutItem: { backgroundColor: '#FEF2F2' },
  logoutIconBox: { backgroundColor: '#FEE2E2' },
  logoutText: { fontSize: 16, fontWeight: '600', color: '#DC2626' }
});