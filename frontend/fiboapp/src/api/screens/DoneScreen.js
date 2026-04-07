import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme';

export default function DoneScreen({ navigation }) {
  useEffect(() => {
    const t = setTimeout(() => navigation.replace('Main'), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.icon}><Text style={{ fontSize: 32 }}>✓</Text></View>
      <Text style={styles.text}>TRANSACTION SUCCESFULL</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  icon: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  text: { fontWeight: '700', letterSpacing: 1, fontSize: 16 },
});