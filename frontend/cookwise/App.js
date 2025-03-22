import { StatusBar } from 'expo-status-bar';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, StyleSheet } from 'react-native';
import TimerPage from './components/Timerpage';
import HomeScreen from './components/HomeScreen';
import FavoriteRecipes from './components/FavoriteRecipes';
import Recipe from './components/Recipe';
import RecipeHistory from './components/RecipeHistory';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="RecipeDetail" component={Recipe} />
  </Stack.Navigator>
);

const App = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === "Home") {
                iconName = "home";
              } else if (route.name === "Timer") {
                iconName = "timer";
              } else if (route.name === "Favorites") {
                iconName = "heart";
              } else if (route.name === "History") {
                iconName = "time"; // Ionicons has a 'time' icon for history
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "#E81B0E",
            tabBarInactiveTintColor: "gray",
            headerShown: false,
          })}
        >
          <Tab.Screen name="Home" component={HomeStack} />
          <Tab.Screen name="Timer" component={TimerPage} />
          <Tab.Screen name="Favorites" component={FavoriteRecipes} />
          <Tab.Screen name="History" component={RecipeHistory} />
        </Tab.Navigator>
      </NavigationContainer>

      <StatusBar style="light" backgroundColor="#E81B0E" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 20,
  },
});

export default App;
