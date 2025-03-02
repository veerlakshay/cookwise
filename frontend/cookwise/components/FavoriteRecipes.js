import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

const FavoriteRecipes = () => {
  const [favorites, setFavorites] = useState([]); // List of favorite recipes
  const [loading, setLoading] = useState(false); // Loading state for pagination
  const [page, setPage] = useState(1); // Current page for pagination

  // Mock data for favorite recipes 
  const mockRecipes = [
    { id: 1, name: 'Pasta Carbonara', description: 'Creamy pasta with bacon and eggs.' },
    { id: 2, name: 'Chicken Tikka Masala', description: 'Spicy chicken curry with creamy tomato sauce.' },
    { id: 3, name: 'Vegetable Stir Fry', description: 'Healthy stir-fried vegetables with soy sauce.' },
    { id: 4, name: 'Beef Burger', description: 'Juicy beef patty with cheese and veggies.' },
    { id: 5, name: 'Chocolate Cake', description: 'Rich and moist chocolate cake.' },
  ];

  // Simulate loading favorite recipes 
  const loadFavorites = (pageNumber) => {
    setLoading(true);
    setTimeout(() => {
      const newRecipes = mockRecipes.slice((pageNumber - 1) * 2, pageNumber * 2); // Load 2 recipes per page
      setFavorites((prev) => [...prev, ...newRecipes]);
      setLoading(false);
    }, 1000); // Simulate network delay
  };

  // Load initial favorites
  useEffect(() => {
    loadFavorites(page);
  }, []);

  // Load more recipes when reaching the end of the list
  const handleLoadMore = () => {
    if (!loading) {
      setPage((prev) => prev + 1);
      loadFavorites(page + 1);
    }
  };

  // Remove recipe from favorites
  const handleRemoveFavorite = (id) => {
    setFavorites((prevFavorites) => prevFavorites.filter(recipe => recipe.id !== id));
  };

  // Render each recipe item
  const renderRecipeItem = ({ item }) => (
    <View style={styles.recipeItem}>
      <Text style={styles.recipeName}>{item.name}</Text>
      <Text style={styles.recipeDescription}>{item.description}</Text>
      <TouchableOpacity style={styles.favoriteButton} onPress={() => handleRemoveFavorite(item.id)}>
        <Text style={styles.favoriteButtonText}>Remove from Favorites</Text>
      </TouchableOpacity>
    </View>
  );

  // Render footer for loading indicator
  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#E81B0E" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Favorite Recipes</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRecipeItem}
        onEndReached={handleLoadMore} // Triggered when reaching the end of the list
        onEndReachedThreshold={0.5} // Load more when 50% of the list is scrolled
        ListFooterComponent={renderFooter} // Show loading indicator at the bottom
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
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
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E81B0E',
    marginBottom: 5,
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  favoriteButton: {
    backgroundColor: '#E81B0E',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  favoriteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingContainer: {
    padding: 10,
    alignItems: 'center',
  },
});

export default FavoriteRecipes;
