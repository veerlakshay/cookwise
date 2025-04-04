import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@cookwise:favorites';

/**
 * Get all favorite recipes from AsyncStorage
 * @returns {Promise<Array>} Array of favorite recipes
 */
export const getFavoriteRecipes = async () => {
  try {
    const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
    const favorites = favoritesJson ? JSON.parse(favoritesJson) : [];
    // Ensure all recipes have an id
    return favorites.map(recipe => {
      if (!recipe.id) {
        // Generate a random id if none exists
        return { ...recipe, id: Math.floor(Math.random() * 1000000) };
      }
      return recipe;
    });
  } catch (error) {
    console.error('Error getting favorite recipes:', error);
    return [];
  }
};

/**
 * Add a recipe to favorites
 * @param {Object} recipe - The recipe to add to favorites
 * @returns {Promise<boolean>} Success status
 */
export const addToFavorites = async (recipe) => {
  try {
    if (!recipe) {
      console.error('Cannot add to favorites: Recipe is undefined');
      return false;
    }
    
    // Ensure recipe has an id
    if (!recipe.id) {
      recipe.id = Math.floor(Math.random() * 1000000);
    }
    
    const favorites = await getFavoriteRecipes();
    
    // Check if recipe already exists in favorites
    const exists = favorites.some(fav => fav.id === recipe.id);
    if (exists) {
      return true; // Already in favorites
    }
    
    // Add recipe to favorites
    favorites.push(recipe);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return true;
  } catch (error) {
    console.error('Error adding recipe to favorites:', error);
    return false;
  }
};

/**
 * Remove a recipe from favorites
 * @param {number} recipeId - The ID of the recipe to remove
 * @returns {Promise<boolean>} Success status
 */
export const removeFromFavorites = async (recipeId) => {
  try {
    if (!recipeId) {
      console.error('Cannot remove from favorites: Recipe ID is undefined');
      return false;
    }
    
    const favorites = await getFavoriteRecipes();
    const updatedFavorites = favorites.filter(recipe => recipe.id !== recipeId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return true;
  } catch (error) {
    console.error('Error removing recipe from favorites:', error);
    return false;
  }
};

/**
 * Check if a recipe is in favorites
 * @param {number} recipeId - The ID of the recipe to check
 * @returns {Promise<boolean>} Whether the recipe is in favorites
 */
export const isRecipeFavorite = async (recipeId) => {
  try {
    if (!recipeId) {
      console.error('Cannot check if recipe is favorite: Recipe ID is undefined');
      return false;
    }
    
    const favorites = await getFavoriteRecipes();
    return favorites.some(recipe => recipe.id === recipeId);
  } catch (error) {
    console.error('Error checking if recipe is favorite:', error);
    return false;
  }
}; 