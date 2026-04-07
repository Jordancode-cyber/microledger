import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Delete } from 'lucide-react-native';

interface NumberPadProps {
  onNumberPress: (num: string) => void;
  onDelete: () => void;
}

export default function NumberPad({ onNumberPress, onDelete }: NumberPadProps) {
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {numbers.map((num) => (
          <TouchableOpacity
            key={num}
            style={styles.button}
            onPress={() => onNumberPress(num)}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>{num}</Text>
          </TouchableOpacity>
        ))}
        {/* Empty bottom left space */}
        <View style={styles.buttonEmpty} />
        
        {/* Zero */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => onNumberPress('0')}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>0</Text>
        </TouchableOpacity>
        
        {/* Delete Button */}
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={onDelete}
          activeOpacity={0.7}
        >
          <Delete size={28} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');
const buttonSize = (width - 120) / 3; // Calculate perfect circle size based on screen width

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    width: buttonSize * 3 + 32, // 3 buttons + 2 gaps
  },
  button: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonEmpty: {
    width: buttonSize,
    height: buttonSize,
  },
  deleteButton: {
    backgroundColor: '#C9CACB',
  },
  buttonText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#000',
  }
});