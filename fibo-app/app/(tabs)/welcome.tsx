import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.logoContainer}>
        <Text style={styles.logoTitle}>Fibo</Text>
        <Text style={styles.logoSubtitle}>
          Finance <Text style={styles.boldText}>better</Text>
        </Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => router.push('/user-type')}
          style={styles.primaryButton}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>REGISTER</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => router.push('/login')}
          style={styles.secondaryButton}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>LOG IN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E9EB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  logoTitle: {
    fontSize: 72,
    fontWeight: '900',
    color: '#000',
    marginBottom: 8,
    letterSpacing: -2,
  },
  logoSubtitle: {
    fontSize: 20,
    color: '#000',
  },
  boldText: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 350,
    gap: 16,
  },
  primaryButton: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 30,
    backgroundColor: '#EAC435',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  primaryButtonText: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 16,
    letterSpacing: 1,
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 30,
    backgroundColor: '#C9CACB',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 16,
    letterSpacing: 1,
  }
});