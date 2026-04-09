import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Check } from 'lucide-react-native';
import { resetPin } from '../../src/services/auth'; // Kept your updated path!

export default function ForgotPin() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (phoneNumber) {
      setLoading(true);
      try {
        await resetPin(phoneNumber);
        setSubmitted(true);
      } catch (error: any) {
        Alert.alert('Reset failed', error.message || 'Unable to send reset link.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (submitted) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace('/login')} style={styles.backButton}>
            <ChevronLeft size={28} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.successContent}>
          <View style={styles.iconCircle}>
            <Check size={40} color="#000" />
          </View>
          <Text style={styles.title}>Request Sent</Text>
          <Text style={styles.subtitle}>Check your phone for a reset link.</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Reset Your PIN</Text>
        <Text style={styles.subtitle}>Enter your phone number to receive a PIN reset link</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="07XXXXXXXX"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, (!phoneNumber || loading) && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!phoneNumber || loading}
        >
          <Text style={styles.buttonText}>{loading ? 'SENDING...' : 'REQUEST RESET'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8E9EB' },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  successContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, marginTop: -60 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EAC435', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '700', color: '#000', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 32, textAlign: 'center' },
  inputGroup: { marginBottom: 32 },
  label: { fontSize: 14, fontWeight: '600', color: '#000', marginBottom: 8 },
  input: { backgroundColor: '#FFF', borderWidth: 2, borderColor: '#E2E8F0', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 16, fontSize: 16, color: '#000' },
  button: { backgroundColor: '#EAC435', paddingVertical: 18, borderRadius: 30, alignItems: 'center' },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { fontWeight: 'bold', color: '#000', fontSize: 16, letterSpacing: 1 },
});