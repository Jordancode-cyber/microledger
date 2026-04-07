import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/welcome');
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.logoContainer}>
        <Text style={styles.logoTitle}>Fibo</Text>
        <Text style={styles.logoSubtitle}>
          Finance <Text style={styles.boldText}>better</Text>
        </Text>
      </View>

      <View style={styles.iconContainer}>
        <ArrowRight size={32} color="#EAC435" />
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
    marginBottom: 40,
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
  iconContainer: {
    marginTop: 32,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
  }
});