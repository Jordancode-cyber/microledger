import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { colors } from '../../theme';

export default function RegisterScreen({ navigation }) {
  const [role, setRole] = useState('customer');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');

  const handleNext = () => {
    if (!phone) return Alert.alert('Error', 'Enter phone number');
    if (role === 'vendor' && !businessName) return Alert.alert('Error', 'Enter business name');
    navigation.navigate('Pin', { mode: 'register', phone, role, businessName });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <View style={styles.toggle}>
        {['customer', 'vendor'].map(r => (
          <TouchableOpacity key={r} style={[styles.tab, role === r && styles.activeTab]} onPress={() => setRole(r)}>
            <Text style={[styles.tabText, role === r && styles.activeTabText]}>{r.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input} keyboardType="phone-pad" placeholder="07XXXXXXXX"
        value={phone} onChangeText={setPhone}
      />

      {role === 'vendor' && (
        <>
          <Text style={styles.label}>Business Name</Text>
          <TextInput style={styles.input} placeholder="e.g. Jordan's Shop Mart" value={businessName} onChangeText={setBusinessName} />
        </>
      )}

      <TouchableOpacity style={styles.btn} onPress={handleNext}>
        <Text style={styles.btnText}>NEXT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 24, paddingTop: 80 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 32 },
  toggle: { flexDirection: 'row', backgroundColor: '#ddd', borderRadius: 32, marginBottom: 32, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 28 },
  activeTab: { backgroundColor: colors.primary },
  tabText: { fontWeight: '700', fontSize: 13, color: colors.muted },
  activeTabText: { color: colors.white },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6, color: colors.text },
  input: { backgroundColor: colors.white, borderRadius: 12, padding: 14, marginBottom: 20, fontSize: 15 },
  btn: { backgroundColor: colors.accent, borderRadius: 32, paddingVertical: 18, alignItems: 'center', marginTop: 16 },
  btnText: { fontWeight: '700', fontSize: 15, letterSpacing: 1 },
});