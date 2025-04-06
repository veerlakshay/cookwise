import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useTheme } from './ThemeContext'; // Import dark mode context
import { getFavoriteRecipes, removeFromFavorites } from '../utils/favoriteStorage';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const FavoriteRecipes = ({ route }) => {
  const { isDarkMode } = useTheme(); // Get dark mode state
  const [favorites, setFavorites] = useState([]); // List of favorite recipes
  const [loading, setLoading] = useState(true); // Loading state for initial load
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
  const navigation = useNavigation();

  // Load favorite recipes from AsyncStorage
  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favoriteRecipes = await getFavoriteRecipes();
      // Filter out any invalid recipes (those without an id)
      const validRecipes = favoriteRecipes.filter(recipe => recipe && recipe.id);
      setFavorites(validRecipes);
    } catch (error) {
      console.error('Error loading favorites:', error);
      Alert.alert('Error', 'Failed to load favorite recipes');
    } finally {
      setLoading(false);
    }
  };

  // Load initial favorites
  useEffect(() => {
    loadFavorites();
  }, []);

  // Refresh favorites when screen comes into focus or when refresh parameter is received
  useFocusEffect(
    React.useCallback(() => {
      // Check if we need to refresh from navigation params
      if (route.params?.refresh) {
        loadFavorites();
        // Clear the refresh parameter
        route.params.refresh = false;
      }
    }, [route.params])
  );

  // Handle pull-to-refresh
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  }, []);

  // Remove recipe from favorites
  const handleRemoveFavorite = async (id) => {
    try {
      if (!id) {
        console.error('Cannot remove favorite: ID is undefined');
        Alert.alert('Error', 'Cannot remove this recipe from favorites');
        return;
      }
      
      const success = await removeFromFavorites(id);
      if (success) {
        setFavorites(prevFavorites => prevFavorites.filter(recipe => recipe && recipe.id !== id));
        Alert.alert('Success', 'Recipe removed from favorites');
      } else {
        Alert.alert('Error', 'Failed to remove recipe from favorites');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  // Navigate to recipe details
  const handleViewRecipe = (recipe) => {
    if (!recipe) {
      console.error('Cannot view recipe: Recipe is undefined');
      Alert.alert('Error', 'Cannot view this recipe');
      return;
    }
    
    // Navigate to the RecipeDetails screen in the Home stack
    navigation.navigate('Home', {
      screen: 'RecipeDetails',
      params: {
        selectedRecipe: recipe,
        fromFavorites: true
      }
    });
  };

  // Render each recipe item
  const renderRecipeItem = ({ item }) => {
    if (!item) {
      return null; // Skip rendering if item is undefined
    }
    
    return (
      <View style={[styles.recipeItem, isDarkMode && styles.darkRecipeItem]}>
        <TouchableOpacity onPress={() => handleViewRecipe(item)}>
          <Text style={[styles.recipeName, isDarkMode && styles.darkRecipeName]}>{item.name || 'Unnamed Recipe'}</Text>
          <Text style={[styles.recipeDescription, isDarkMode && styles.darkRecipeDescription]}>{item.description || 'No description available'}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.favoriteButton, isDarkMode && styles.darkFavoriteButton]} 
          onPress={() => handleRemoveFavorite(item.id)}
        >
          <Text style={[styles.favoriteButtonText, isDarkMode && styles.darkFavoriteButtonText]}>Remove from Favorites</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Render empty state when no favorites
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, isDarkMode && styles.darkEmptyText]}>
        You don't have any favorite recipes yet.
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.heading, isDarkMode && styles.darkHeading]}>Favorite Recipes</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E81B0E" />
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => (item && item.id ? item.id.toString() : Math.random().toString())}
          renderItem={renderRecipeItem}
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#E81B0E']}
              tintColor={isDarkMode ? '#FF6B6B' : '#E81B0E'}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  darkHeading: {
    color: '#fff',
  },
  listContent: {
    paddingBottom: 20, // Add padding at the bottom of the list
  },
  recipeItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  darkRecipeItem: {
    backgroundColor: '#1E1E1E',
    shadowColor: '#000',
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E81B0E',
    marginBottom: 5,
  },
  darkRecipeName: {
    color: '#FF6B6B',
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  darkRecipeDescription: {
    color: '#ccc',
  },
  favoriteButton: {
    backgroundColor: '#E81B0E',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  darkFavoriteButton: {
    backgroundColor: '#FF6B6B',
  },
  favoriteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  darkFavoriteButtonText: {
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  darkEmptyText: {
    color: '#ccc',
  },
});

export default FavoriteRecipes;