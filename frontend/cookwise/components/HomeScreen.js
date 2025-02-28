import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, FlatList, ActivityIndicator } from 'react-native';

const HomeScreen = () => {
  const [ingredient, setIngredient] = useState("");  // State for the current ingredient input
  const [ingredientsList, setIngredientsList] = useState([]);  // State to store the list of ingredients
  const [recipe, setRecipe] = useState(null);  
  const [showList, setShowList] = useState(false); 
  const [loading, setLoading] = useState(false); // State for loading

  
  const addIngredient = () => {
    if (ingredient.trim()) {
      setIngredientsList([...ingredientsList, ingredient]);
      setIngredient("");  // Clear the input field after adding
    }
  };

  const removeIngredient = (index) => {
    const updatedList = ingredientsList.filter((_, idx) => idx !== index);
    setIngredientsList(updatedList);
  };

  // Toggle the visibility of the ingredient list
  const toggleList = () => {
    setShowList(!showList); 
  };

  // Call the API to get recipes
  const callApi = async () => {
  
    if (ingredientsList.length === 0) {
      Alert.alert("No ingredients", "Please add at least one ingredient.");
      return;
    }

    setLoading(true); // Start loading
    const ingredients = ingredientsList.join(","); 

    console.log(ingredients);
    try {
      const url = `http://localhost:8080/recipes/get-recipes?ingredients=${encodeURIComponent(ingredients)}`;
      console.log("API URL:", url);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("result received", result);
      if (!result || Object.keys(result).length === 0) {

        Alert.alert("No recipes found", "Try different ingredients.");
        setRecipe(null);
      } else {
        setRecipe(result);
      }
    } catch (error) {
      console.error('Error calling API:', error);
      Alert.alert("Error", "Failed to fetch recipes. Please try again later.");
    }finally {
    setLoading(false); // Stop loading
  }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>CookWise</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="e.g., eggs, milk"
          value={ingredient}
          onChangeText={setIngredient}  // Update ingredient state as user types
        />
        <TouchableOpacity 
          style={styles.button}
          onPress={addIngredient}
        >
          <Text style={styles.buttonText}>Add Ingredient</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={toggleList}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Show List</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={callApi} style={styles.button}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {showList && (
        <FlatList
        data={ingredientsList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.listItemContainer}>
            <Text style={styles.listItem}>{index + 1}. {item}</Text>
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => removeIngredient(index)}
            >
              <Text style={styles.button}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      )}

{loading ? (
      <ActivityIndicator size="large" color="#E81B0E" style={{ marginTop: 20 }} />
    ) : recipe && recipe.steps ? (
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
      <Text style={styles.noRecipeText}>No recipe found. Try searching!</Text>
    )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 35,
    textAlign: 'center',
    fontFamily: 'cursive',
    color: '#E81B0E',
    paddingBottom: 20,
  },
  inputContainer: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    height: 40,
  },
  button: {
    backgroundColor: "#E81B0E",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    margin: 5,
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
  noRecipeText: {
    color: "black",
    textAlign: "center",
    marginTop: 20,
  },
  listItem: {
    fontSize: 18,
    marginBottom: 5,
    color: "#333",
  }
});

export default HomeScreen;
