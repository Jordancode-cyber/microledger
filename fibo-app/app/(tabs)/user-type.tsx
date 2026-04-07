import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Store, User } from 'lucide-react-native';

export default function UserTypeSelection() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Select Account Type</Text>
        <Text style={styles.subtitle}>Choose how you will be using Fibo</Text>
        
        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push('/register/vendor')}
          >
            <Store size={32} color="#003366" style={styles.icon} />
            <Text style={styles.cardTitle}>VENDOR</Text>
            <Text style={styles.cardSubtitle}>Business / Shop Owner</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push('/register/customer')}
          >
            <User size={32} color="#003366" style={styles.icon} />
            <Text style={styles.cardTitle}>CUSTOMER</Text>
            <Text style={styles.cardSubtitle}>Everyday Shopper</Text>
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
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, marginTop: -60 },
  title: { fontSize: 24, fontWeight: '700', color: '#000', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 48, textAlign: 'center' },
  cardContainer: { width: '100%', maxWidth: 350, gap: 16 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    paddingVertical: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: { marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#000', marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: '#666' }
});