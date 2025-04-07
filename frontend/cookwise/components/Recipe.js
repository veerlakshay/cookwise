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
        const success = await removeFromFavorites(selectedRecipe.id);
        if (success) {
          setIsFavorite(false);
          Alert.alert('Success', 'Recipe removed from favorites');
        } else {
          Alert.alert('Error', 'Failed to remove recipe from favorites');
        }
      } else {
        const success = await addToFavorites(selectedRecipe);
        if (success) {
          setIsFavorite(true);
          Alert.alert('Success', 'Recipe added to favorites');

          if (route.params?.fromFavorites) {
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

  const renderStepContent = (content) => {
    if (typeof content === 'string') {
      return <Text>{content}</Text>;
    } else if (typeof content === 'object') {
      return (
        <>
          {Object.entries(content).map(([key, value]) => (
            <Text key={key}>
              {key}: {typeof value === 'string' ? value : JSON.stringify(value)}{'\n'}
            </Text>
          ))}
        </>
      );
    }
    return <Text>{String(content)}</Text>;
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Ionicons name="arrow-back" size={26} color={theme.primary} />
        </TouchableOpacity>
        <Text style={[styles.recipeName, { color: theme.primary }]}>
          {selectedRecipe?.name || 'Recipe'}
        </Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.text }]}>Calories</Text>
        <Text style={[styles.value, { color: theme.text }]}>
          {selectedRecipe?.calories || 'N/A'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: theme.text }]}>Steps</Text>
        {selectedRecipe?.preparation && (
          typeof selectedRecipe.preparation === 'object' ? (
            Object.keys(selectedRecipe.preparation)
              .sort((a, b) => parseInt(a) - parseInt(b))
              .map((stepNumber) => {
                const stepContent = selectedRecipe.preparation[stepNumber];
                return (
                  <View key={stepNumber} style={[styles.stepCard, { backgroundColor: theme.card }]}>
                    <Text style={[styles.stepText, { color: theme.text }]}>
                      {stepNumber}. {renderStepContent(stepContent)}
                    </Text>
                  </View>
                );
              })
          ) : (
            <View style={[styles.stepCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.stepText, { color: theme.text }]}>
                {typeof selectedRecipe.preparation === 'string'
                  ? selectedRecipe.preparation
                  : JSON.stringify(selectedRecipe.preparation)}
              </Text>
            </View>
          )
        )}
      </View>

      <View style={styles.favoriteContainer}>
        <TouchableOpacity 
          onPress={toggleFavorite} 
          style={[styles.favoriteButton, { backgroundColor: theme.primary }]}
        >
          <View style={styles.favoriteButtonContent}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color="#fff"
            />
            <Text style={styles.favoriteText}>
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  recipeName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  value: {
    fontSize: 18,
  },
  stepCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  stepText: {
    fontSize: 16,
    lineHeight: 22,
  },
  favoriteContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 50,
  },
  favoriteButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '90%',
  },
  favoriteButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RecipeDetails;