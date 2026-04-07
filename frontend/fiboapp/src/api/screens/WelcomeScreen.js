import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.logo}>Fibo</Text>
        <Text style={styles.tagline}>Finance <Text style={{ fontWeight: 'bold' }}>better</Text></Text>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.primary} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.primaryText}>REGISTER</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondary} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.secondaryText}>LOG IN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'space-between', paddingBottom: 60, paddingHorizontal: 24 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logo: { fontSize: 52, fontWeight: '800' },
  tagline: { fontSize: 16, marginTop: 4 },
  buttons: { gap: 16 },
  primary: { backgroundColor: colors.accent, borderRadius: 32, paddingVertical: 18, alignItems: 'center' },
  primaryText: { fontWeight: '700', fontSize: 15, letterSpacing: 1 },
  secondary: { backgroundColor: '#DDDDE0', borderRadius: 32, paddingVertical: 18, alignItems: 'center' },
  secondaryText: { fontWeight: '700', fontSize: 15, letterSpacing: 1, color: colors.text },
});