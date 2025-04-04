import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from './ThemeContext';
import RecipeDetails from './Recipe';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const [ingredient, setIngredient] = useState('');
  const [ingredientsList, setIngredientsList] = useState([]);
  const [recipes, setRecipes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [portion, setPortion] = useState('');

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

  const handleRecipeSelect = (recipeName, fromFavorites = false) => {
    if (recipes[recipeName]) {
      // Ensure the recipe has an ID
      const recipe = { ...recipes[recipeName], name: recipeName };
      if (!recipe.id) {
        recipe.id = Math.floor(Math.random() * 1000000);
      }
      
      navigation.navigate('RecipeDetails', {
        selectedRecipe: recipe,
        fromFavorites: fromFavorites
      });
    } else {
      Alert.alert('Error', 'Recipe not found');
    }
  };

  const callApi = async () => {
    if (ingredientsList.length === 0) {
      Alert.alert('No ingredients', 'Please add at least one ingredient.');
      return;
    }

    setLoading(true);
    const ingredients = ingredientsList.join(',');

    try {
      const url = `http://localhost:8080/recipes/get-recipes?ingredients=${encodeURIComponent(ingredients)}&portions=${portion}`;
      console.log('API URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      console.log('API Response:', result);

      if (!response.ok) {
        if (response.status === 400 && result.error?.message) {
          Alert.alert('Invalid Ingredients', result.error.message);
        } else if (response.status === 204) {
          Alert.alert('No recipes found', 'Try different ingredients.');
        } else {
          Alert.alert('Error', 'Failed to fetch recipes. Please try again later.');
        }
        setRecipes(null);
        return;
      }

      if (!result.recipes || Object.keys(result.recipes).length === 0) {
        Alert.alert('No recipes found', 'Try different ingredients.');
        setRecipes(null);
      } else {
        // Ensure all recipes have IDs
        const recipesWithIds = {};
        Object.keys(result.recipes).forEach((recipeName, index) => {
          const recipe = result.recipes[recipeName];
          recipesWithIds[recipeName] = {
            ...recipe,
            id: recipe.id || index + 1 // Use existing ID or generate a new one
          };
        });
        setRecipes(recipesWithIds);
      }
    } catch (error) {
      console.error('Error calling API:', error);
      Alert.alert('Error', 'Failed to fetch recipes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.heading, { color: theme.primary }]}>CookWise</Text>

      <View style={[styles.inputContainer, { backgroundColor: theme.card }]}>
        <TextInput
          style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
          placeholder="e.g., eggs, milk"
          placeholderTextColor={theme.placeholder}
          value={ingredient}
          onChangeText={setIngredient}
        />
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={addIngredient}>
          <Text style={styles.buttonText}>Add Ingredient</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={callApi} style={[styles.button, { backgroundColor: theme.primary }]}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>

        <TextInput
          style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
          placeholder="Number of portions (e.g., 2)"
          placeholderTextColor={theme.placeholder}
          keyboardType="numeric"
          value={portion}
          onChangeText={setPortion}
        />
      </View>

      {ingredientsList.length > 0 && (
        <View style={styles.ingredientsContainer}>
          <Text style={[styles.subHeading, { color: theme.text }]}>Ingredients:</Text>
          <FlatList
            data={ingredientsList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.listItemContainer}>
                <Text style={[styles.listItem, { color: theme.text }]}>
                  {index + 1}. {item}
                </Text>
                <TouchableOpacity
                  style={[styles.removeButton, { backgroundColor: theme.primary }]}
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
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 20 }} />
      ) : recipes ? (
        <View style={styles.recipeContainer}>
          <FlatList
            data={Object.keys(recipes)}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.recipeChoice, { backgroundColor: theme.card }]}
                onPress={() => handleRecipeSelect(item)}
              >
                <Text style={[styles.recipeChoiceText, { color: theme.text }]}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : (
        <Text style={[styles.noRecipeText, { color: theme.text }]}>No recipe found. Try searching!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 80,
  },
  heading: {
    fontSize: 35,
    textAlign: 'center',
    fontFamily: 'cursive',
    paddingBottom: 20,
  },
  inputContainer: {
    padding: 10,
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
    height: 40,
  },
  button: {
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
  },
  subHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  listItem: {
    fontSize: 18,
    marginBottom: 5,
  },
  listItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  removeButton: {
    padding: 5,
    borderRadius: 5,
  },
  noRecipeText: {
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HomeScreen;