import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const t = setTimeout(() => navigation.replace('Welcome'), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Fibo</Text>
      <Text style={styles.tagline}>Finance <Text style={{ fontWeight: 'bold' }}>better</Text></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  logo: { fontSize: 52, fontWeight: '800', color: colors.text },
  tagline: { fontSize: 16, color: colors.text, marginTop: 4 },
});