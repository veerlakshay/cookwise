import { StatusBar } from 'expo-status-bar';
import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; 
import { SafeAreaView, StyleSheet, TouchableOpacity, Text, View, TextInput, ScrollView, Alert } from 'react-native';
import TimerPage from './components/Timerpage';


const Tab = createBottomTabNavigator();


const HomeScreen = ({ ingredient, setIngredient, callApi, recipe }) => (
  <View>
    <View style={styles.container}>
      <Text style={styles.heading}>CookWise</Text>
    </View>

    <View>
      <View style={styles.inputContainer}>
        <TextInput
          style={{
            borderWidth: 1,
            padding: 10,
            marginVertical: 10,
            borderRadius: 5,
            backgroundColor: '#fff',
            height:40
          }}
          placeholder="e.g., eggs, milk"
          value={ingredient}
          onChangeText={setIngredient}
        />
        <TouchableOpacity onPress={callApi} style={{
    backgroundColor: "#E81B0E",
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 10,
    height:40,
    alignItems: "center",
  }}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {recipe && recipe.steps ? (
  <ScrollView style={styles.recipeContainer}>
    <Text style={styles.recipeHeading}>{recipe.name}</Text>
    <Text style={styles.subHeading}>Steps:</Text>
    {Object.keys(recipe.steps)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map((stepNumber) => (
        <View key={stepNumber} style={styles.stepContainer}>
          <Text style={styles.recipeText}>
            {stepNumber}. {recipe.steps[stepNumber]}
          </Text>
        </View>
      ))}
  </ScrollView>
) : (
  <Text style={{ color: "black", textAlign: "center", marginTop: 20 }}>
    No recipe found. Try searching!
  </Text>
)}
    </View>
  </View>
);

const App = () => {
  const [ingredient, setIngredient] = useState("");
  const [recipe, setRecipe] = useState(null);
  const Tab = createBottomTabNavigator();

  const callApi = async () => {
    const ingredients = ingredient.replace(/\s/g, "").split(",");
    console.log(ingredients.join(","));

    try {
      const url = http://localhost:8080/recipes/get-recipes?ingredients=${encodeURIComponent(ingredients.join(","))};
      console.log("API URL:", url);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(HTTP Error! Status: ${response.status});
      }

      const result = await response.json();
      console.log("result received", result);
      setRecipe(result);
    } catch (error) {
      console.error('Error calling API:', error);
      Alert.alert("Error", "Failed to fetch recipes. Please try again later.");
    }
  };

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
          <Tab.Screen name="Home">
            {(props) => <HomeScreen {...props} ingredient={ingredient} setIngredient={setIngredient} callApi={callApi} recipe={recipe} />}
          </Tab.Screen>
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
  container: {
    alignItems: 'center',
    backgroundColor: "red",
    marginBottom: 20,
  },
  heading: {
    fontSize: 35,
    textAlign: 'center',
    fontFamily: 'cursive',
    color: '#fff',
    paddingBottom: 10,
  },
  main: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'green'
  },
  inputContainer: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  recipeContainer: {
    marginTop: 20,
  },
  recipeHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#E81B0E',
  },
  subHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
  },
  stepContainer: {
    marginBottom: 10,
  },
  recipeText: {
    fontSize: 16,
    color: '#555',
  },
});

export default App;