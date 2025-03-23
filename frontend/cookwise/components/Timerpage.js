import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from './ThemeContext';

const TimerPage = () => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [inputTime, setInputTime] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    let interval = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      clearInterval(interval);
      setIsActive(false);
      Alert.alert(
        'Time\'s Up!',
        'Your timer has finished.',
        [
          { text: 'OK', onPress: () => console.log('Alert closed') }
        ]
      );
    }

    return () => clearInterval(interval);
  }, [isActive, time]);

  const startTimer = () => {
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setTime(0);
    setIsActive(false);
  };

  const handleInputChange = (text) => {
    setInputTime(text);
  };

  const setCustomTime = () => {
    const timeInSeconds = parseInt(inputTime, 10);
    if (!isNaN(timeInSeconds) && timeInSeconds > 0) {
      setTime(timeInSeconds);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.heading, { color: theme.text }]}>Cookwise Timer</Text>
      <Text style={[styles.timerDisplay, { color: theme.primary }]}>
        {formatTime(time)}
      </Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
        placeholder="Enter time in seconds"
        placeholderTextColor={theme.placeholder}
        value={inputTime}
        onChangeText={handleInputChange}
        keyboardType="numeric"
      />
      <TouchableOpacity 
        style={[styles.setTimeButton, { backgroundColor: theme.primary }]} 
        onPress={setCustomTime}
      >
        <Text style={styles.buttonText}>Set Time</Text>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={startTimer}
          disabled={isActive || time === 0}
        >
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={pauseTimer}
          disabled={!isActive}
        >
          <Text style={styles.buttonText}>Pause</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.primary }]} 
          onPress={resetTimer}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  timerDisplay: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  setTimeButton: {
    width: '80%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TimerPage;