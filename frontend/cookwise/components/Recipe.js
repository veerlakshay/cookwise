import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from './ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { addToFavorites, removeFromFavorites, isRecipeFavorite } from '../utils/favoriteStorage';

const RecipeDetails = ({ route }) => {
  const { selectedRecipe } = route.params || {};
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [isFavorite, setIsFavorite] = useState(false);

  // Check if recipe is in favorites when component mounts
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (selectedRecipe && selectedRecipe.id) {
        const favorite = await isRecipeFavorite(selectedRecipe.id);
        setIsFavorite(favorite);
      } else {
        console.warn('Cannot check favorite status: Recipe or recipe ID is undefined');
        setIsFavorite(false);
      }
    };
    
    checkFavoriteStatus();
  }, [selectedRecipe]);

  if (!selectedRecipe) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>Recipe not found</Text>
      </View>
    );
  }

  const goBack = () => {
    navigation.goBack();
  };

  const toggleFavorite = async () => {
    try {
      if (!selectedRecipe || !selectedRecipe.id) {
        console.error('Cannot toggle favorite: Recipe or recipe ID is undefined');
        Alert.alert('Error', 'Cannot add this recipe to favorites');
        return;
      }
      
      if (isFavorite) {
        // Remove from favorites
        const success = await removeFromFavorites(selectedRecipe.id);
        if (success) {
          setIsFavorite(false);
          Alert.alert('Success', 'Recipe removed from favorites');
        } else {
          Alert.alert('Error', 'Failed to remove recipe from favorites');
        }
      } else {
        // Add to favorites
        const success = await addToFavorites(selectedRecipe);
        if (success) {
          setIsFavorite(true);
          Alert.alert('Success', 'Recipe added to favorites');
          
          // If we're on the Favorites screen, refresh the list
          if (route.params?.fromFavorites) {
            // Navigate back to Favorites screen with refresh parameter
            navigation.navigate('Favorites', { refresh: true });
          }
        } else {
          Alert.alert('Error', 'Failed to add recipe to favorites');
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
         <TouchableOpacity
           style={styles.backButton}
           onPress={() => navigation.goBack()}
         >
           <Text style={styles.backButtonText}>←</Text>
         </TouchableOpacity>
         <Text style={styles.recipeName}>{selectedRecipe.name}</Text>
      </View>
       
      <Text style={styles.subHeading}>Calories: {selectedRecipe.calories}</Text>
      <Text style={styles.subHeading}>Steps:</Text>
      {Object.keys(selectedRecipe.preparation)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .map((stepNumber) => (
          <Text key={stepNumber} style={styles.recipeText}>
            {stepNumber}. {selectedRecipe.preparation[stepNumber]}
          </Text>
        ))}
      
      <View style={styles.favoriteContainer}>
        <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorite ? "#E81B0E" : "#fff"} 
          />
          <Text style={styles.favoriteText}>
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  recipeName: { fontSize: 24, fontWeight: 'bold', color: '#E81B0E' },
  subHeading: { fontSize: 20, marginTop: 10, marginBottom: 5, color: '#333' },
  recipeText: { fontSize: 16, color: '#555', marginBottom: 5 },
  backButton: {
    backgroundColor: '#E81B0E',
    padding: 10,
    width: 40,
    borderRadius: 5,
    marginBottom: 10,},
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  recipeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  detailsContainer: {
    marginTop: 20,
  },
  subHeading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  backButtonText: { color: '#E81B0E', fontSize: 16 },
  ingredientList: {
    marginBottom: 20,
  },
  ingredientText: {
    fontSize: 18,
    marginBottom: 5,
  },
  stepList: {
    marginBottom: 20,
  },
  stepText: {
    fontSize: 18,
    marginBottom: 5,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  favoriteContainer: {
    marginTop: 30,
    marginBottom: 30,
    alignItems: 'center',
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E81B0E',
    padding: 15,
    borderRadius: 10,
    width: '80%',
  },
  favoriteText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default RecipeDetails;