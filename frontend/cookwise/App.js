import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ThemeProvider, useTheme } from './components/ThemeContext'; // Dark mode context
import HomeScreen from './components/HomeScreen';
import TimerPage from './components/Timerpage';
import FavoritesPage from './components/FavoriteRecipes';
import SettingsPage from './components/SettingsPage';
import RecipesPage from './components/Recipe';
import { createStackNavigator } from '@react-navigation/stack';
import RecipeHistoryPage from './components/RecipeHistory';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Icons for tabs
import RecipeDetails from './components/Recipe';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Custom Tab Bar Icon Component
const CustomTabBarIcon = ({ name, color }) => {
  return <Ionicons name={name} size={24} color={color} />;
};

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="RecipeDetails" component={RecipeDetails} />
  </Stack.Navigator>
);

const HistoryStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="RecipeHistory" component={RecipeHistoryPage} />
    <Stack.Screen name="RecipeDetails" component={RecipeDetails} />
  </Stack.Navigator>
);

// App Navigator with Dark Mode
const AppNavigator = () => {
  const { theme } = useTheme(); // Use theme from custom ThemeContext

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
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
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Timer" component={TimerPage} />
      <Tab.Screen name="Favorites" component={FavoritesPage} />
      <Tab.Screen name="Recipe History" component={HistoryStack} />
      <Tab.Screen name="Settings" component={SettingsPage} />
    </Tab.Navigator>
  );
};

// Main App Component
const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ThemeProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </ThemeProvider>
    </SafeAreaView>
    
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
  container:{
    flex: 1
  }
});

export default App;