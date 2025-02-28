import { StatusBar } from 'expo-status-bar';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; 
import { SafeAreaView, StyleSheet} from 'react-native';
import TimerPage from './components/Timerpage';
import HomeScreen from './components/HomeScreen';

const Tab = createBottomTabNavigator();


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
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "#E81B0E",
            tabBarInactiveTintColor: "gray",
            headerShown: false,
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen}/>
          <Tab.Screen name="Timer" component={TimerPage} />
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