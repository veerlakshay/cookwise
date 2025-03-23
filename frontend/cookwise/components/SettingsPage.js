import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useTheme } from './ThemeContext';

const SettingsPage = () => {
  const { isDarkMode, toggleDarkMode, theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.heading, { color: theme.text }]}>Settings</Text>
      <View style={styles.switchContainer}>
        <Text style={[styles.label, { color: theme.text }]}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    marginRight: 10,
  },
});

export default SettingsPage;