import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ThemeProvider, useTheme } from './components/ThemeContext'; // Dark mode context
import HomeScreen from './components/HomeScreen';
import TimerPage from './components/Timerpage';
import FavoritesPage from './components/FavoriteRecipes';
import SettingsPage from './components/SettingsPage';
import RecipesPage from './components/Recipe';
import RecipeHistoryPage from './components/RecipeHistory';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Icons for tabs

const Tab = createBottomTabNavigator();

// Custom Tab Bar Icon Component
const CustomTabBarIcon = ({ name, color }) => {
  return <Ionicons name={name} size={24} color={color} />;
};

// App Navigator with Dark Mode
const AppNavigator = () => {
  const { theme } = useTheme(); // Use theme from custom ThemeContext

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Recipes') iconName = 'fast-food';
          else if (route.name === 'Timer') iconName = 'timer';
          else if (route.name === 'Favorites') iconName = 'heart';
          else if (route.name === 'Recipe History') iconName = 'book';
          else if (route.name === 'Settings') iconName = 'settings';
          return <CustomTabBarIcon name={iconName} color={color} />;
        },
        tabBarStyle: [styles.tabBar, { backgroundColor: theme.card }],
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.text === '#333' ? '#555' : '#bbb',
        headerStyle: [styles.header, { backgroundColor: theme.background }],
        headerTitleStyle: [styles.headerTitle, { color: theme.text }],
        headerShown: false, // Hide top header
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Recipes" component={RecipesPage} />
      <Tab.Screen name="Timer" component={TimerPage} />
      <Tab.Screen name="Favorites" component={FavoritesPage} />
      <Tab.Screen name="Recipe History" component={RecipeHistoryPage} />
      <Tab.Screen name="Settings" component={SettingsPage} />
    </Tab.Navigator>
  );
};

// Main App Component
const App = () => {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
};

// Styles for Light & Dark Mode
const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    height: 60,
    paddingBottom: 5,
  },
  header: {
    elevation: 0, // Remove shadow on Android
    shadowOpacity: 0, // Remove shadow on iOS
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default App;