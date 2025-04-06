import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from './ThemeContext';
import RecipeDetails from './Recipe';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const saveHistory = async (recipe) => {
    try {
      const storedHistory = await AsyncStorage.getItem('recipeHistory');
      let history = storedHistory ? JSON.parse(storedHistory) : [];
  
      history = history.filter(item => item.name !== recipe.name);
  
      // Add the newest recipe at the top
      history.unshift(recipe);
  
      await AsyncStorage.setItem('recipeHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  };

  const removeIngredient = (index) => {
    const updatedList = ingredientsList.filter((_, idx) => idx !== index);
    setIngredientsList(updatedList);
  };

  const handleRecipeSelect = (recipeName, fromFavorites = false) => {
    if (recipes[recipeName]) {
      const recipe = { ...recipes[recipeName], name: recipeName };
      if (!recipe.id) {
        recipe.id = Math.floor(Math.random() * 1000000);
      }

      saveHistory(recipe);

      
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
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.heading, { color: theme.primary }]}>CookWise</Text>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <TextInput
          style={[styles.input, { backgroundColor: theme.input, color: theme.text }]}
          placeholder="e.g., eggs, milk"
          placeholderTextColor={theme.placeholder}
          value={ingredient}
          onChangeText={setIngredient}
        />
        <TextInput
          style={[styles.input, { backgroundColor: theme.input, color: theme.text }]}
          placeholder="Number of portions (e.g., 2)"
          placeholderTextColor={theme.placeholder}
          keyboardType="numeric"
          value={portion}
          onChangeText={setPortion}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={addIngredient}>
            <Text style={styles.buttonText}>Add Ingredient</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={callApi}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      {ingredientsList.length > 0 && (
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.subHeading, { color: theme.primary }]}>Ingredients:</Text>
          {ingredientsList.map((item, index) => (
            <View key={index} style={styles.listItemContainer}>
              <Text style={[styles.listItem, { color: theme.text }]}>{index + 1}. {item}</Text>
              <TouchableOpacity
                style={[styles.removeButton, { backgroundColor: theme.primary }]}
                onPress={() => removeIngredient(index)}
              >
                <Text style={styles.buttonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 20 }} />
      ) : recipes ? (
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.subHeading, { color: theme.primary }]}>Recipes:</Text>
          {Object.keys(recipes).map((recipeName) => (
            <TouchableOpacity
              key={recipeName}
              style={[styles.recipeChoice, { backgroundColor: theme.input }]}
              onPress={() => handleRecipeSelect(recipeName)}
            >
              <Text style={[styles.recipeChoiceText, { color: theme.text }]}>{recipeName}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={[styles.noRecipeText, { color: theme.text }]}>No recipe found. Try searching!</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 36,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'cursive',
  },
  card: {
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  subHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  listItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listItem: {
    fontSize: 16,
  },
  removeButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  recipeChoice: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  recipeChoiceText: {
    fontSize: 18,
  },
  noRecipeText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});

export default HomeScreen;