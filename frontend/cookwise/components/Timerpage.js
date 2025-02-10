import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const TimerPage = () => {
  const [time, setTime] = useState(0); // Time in seconds
  const [isActive, setIsActive] = useState(false); // Timer running state
  const [inputTime, setInputTime] = useState(''); // User input for custom time

  // Effect to handle the timer countdown
  useEffect(() => {
    let interval = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      clearInterval(interval);
      setIsActive(false);
      // Show an alert when the timer reaches zero
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

  // Start the timer
  const startTimer = () => {
    setIsActive(true);
  };

  // Pause the timer
  const pauseTimer = () => {
    setIsActive(false);
  };

  // Reset the timer
  const resetTimer = () => {
    setTime(0);
    setIsActive(false);
  };

  // Handle input change for custom time
  const handleInputChange = (text) => {
    setInputTime(text);
  };

  // Set custom time from input
  const setCustomTime = () => {
    const timeInSeconds = parseInt(inputTime, 10);
    if (!isNaN(timeInSeconds) && timeInSeconds > 0) {
      setTime(timeInSeconds);
    }
  };

  // Format time as MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Cookwise Timer</Text>
      <Text style={styles.timerDisplay}>{formatTime(time)}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter time in seconds"
        value={inputTime}
        onChangeText={handleInputChange}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.setTimeButton} onPress={setCustomTime}>
        <Text style={styles.buttonText}>Set Time</Text>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isActive || time === 0 ? styles.disabledButton : null]}
          onPress={startTimer}
          disabled={isActive || time === 0}
        >
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !isActive ? styles.disabledButton : null]}
          onPress={pauseTimer}
          disabled={!isActive}
        >
          <Text style={styles.buttonText}>Pause</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={resetTimer}>
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
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  timerDisplay: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#E81B0E',
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  setTimeButton: {
    width: '80%',
    backgroundColor: '#E81B0E',
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
    backgroundColor: '#E81B0E',
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
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default TimerPage;