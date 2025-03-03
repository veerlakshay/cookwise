import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';

const HomeScreen = () => {
  const [ingredient, setIngredient] = useState('');
  const [ingredientsList, setIngredientsList] = useState([]);
  const [recipes, setRecipes] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  const addIngredient = () => {
    if (ingredient.trim()) {
      setIngredientsList([...ingredientsList, ingredient]);
      setIngredient('');
    }
  };


  const removeIngredient = (index) => {
    const updatedList = ingredientsList.filter((_, idx) => idx !== index);
    setIngredientsList(updatedList);
  };


  const callApi = async () => {
    if (ingredientsList.length === 0) {
      Alert.alert('No ingredients', 'Please add at least one ingredient.');
      return;
    }

    setLoading(true);
    const ingredients = ingredientsList.join(',');

    try {
      const url = `http://localhost:8080/recipes/get-recipes?ingredients=${encodeURIComponent(
        ingredients
      )}`;
      console.log('API URL:', url);
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
      console.log('API Response:', result);
      if (!result.recipes || Object.keys(result.recipes).length === 0) {
        Alert.alert('No recipes found', 'Try different ingredients.');
        setRecipes(null);
      } else {
        setRecipes(result.recipes);
        setSelectedRecipe(null);
      }
    } catch (error) {
      console.error('Error calling API:', error);
      Alert.alert('Error', 'Failed to fetch recipes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };


  const handleRecipeSelect = (recipeName) => {
    setSelectedRecipe({ ...recipes[recipeName], name: recipeName });
  };


  const goBackToRecipes = () => {
    setSelectedRecipe(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>CookWise</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="e.g., eggs, milk"
          value={ingredient}
          onChangeText={setIngredient}
        />
        <TouchableOpacity style={styles.button} onPress={addIngredient}>
          <Text style={styles.buttonText}>Add Ingredient</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={callApi} style={styles.button}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Display ingredients list */}
      {ingredientsList.length > 0 && (
        <View style={styles.ingredientsContainer}>
          <Text style={styles.subHeading}>Ingredients:</Text>
          <FlatList
            data={ingredientsList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.listItemContainer}>
                <Text style={styles.listItem}>
                  {index + 1}. {item}
                </Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeIngredient(index)}
                >
                  <Text style={styles.buttonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#E81B0E" style={{ marginTop: 20 }} />
      ) : recipes ? (
        <View style={styles.recipeContainer}>
          {/* Display recipe choices */}
          {!selectedRecipe && (
            <FlatList
              data={Object.keys(recipes)}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.recipeChoice}
                  onPress={() => handleRecipeSelect(item)}
                >
                  <Text style={styles.recipeChoiceText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          {/* Display selected recipe details */}
          {selectedRecipe && (
            <ScrollView>
              {/* Recipe Header with Back Button */}
              <View style={styles.recipeHeader}>
                <TouchableOpacity
                  style={styles.smallBackButton}
                  onPress={goBackToRecipes}
                >
                  <Text style={styles.smallBackButtonText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.recipeHeading}>{selectedRecipe.name}</Text>
              </View>

              <Text style={styles.subHeading}>
                Calories: {selectedRecipe.calories}
              </Text>
              <Text style={styles.subHeading}>Steps:</Text>
              {Object.keys(selectedRecipe.preparation)
                .sort((a, b) => parseInt(a) - parseInt(b))
                .map((stepNumber) => (
                  <View key={stepNumber} style={styles.stepContainer}>
                    <Text style={styles.recipeText}>
                      {stepNumber}. {selectedRecipe.preparation[stepNumber]}
                    </Text>
                  </View>
                ))}
            </ScrollView>
          )}
        </View>
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
    paddingBottom: 80, // Add padding to avoid overlap with the tab bar
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
    backgroundColor: '#E81B0E',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    margin: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  ingredientsContainer: {
    marginTop: 10,
  },
  recipeContainer: {
    marginTop: 20,
  },
  recipeChoice: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  recipeChoiceText: {
    fontSize: 18,
    color: '#333',
  },
  recipeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  recipeHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E81B0E',
    marginLeft: 10,
  },
  smallBackButton: {
    backgroundColor: '#E81B0E',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
  },
  smallBackButtonText: {
    color: '#fff',
    fontSize: 18,
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
    color: 'black',
    textAlign: 'center',
    marginTop: 20,
  },
  listItem: {
    fontSize: 18,
    marginBottom: 5,
    color: '#333',
  },
  listItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  removeButton: {
    backgroundColor: '#E81B0E',
    padding: 5,
    borderRadius: 5,
  },
});

export default HomeScreen;