import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from './ThemeContext';

const RecipeDetails = ({ route }) => {
  const { selectedRecipe } = route.params || {};
  const navigation = useNavigation();
  const { theme } = useTheme();

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

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={[styles.backButton, { backgroundColor: theme.primary }]}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.recipeTitle, { color: theme.primary }]}>{selectedRecipe.name}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={[styles.subHeading, { color: theme.text }]}>Ingredients:</Text>
        <View style={styles.ingredientList}>
          {selectedRecipe.ingredients.map((ingredient, index) => (
            <Text key={index} style={[styles.ingredientText, { color: theme.text }]}>
              {ingredient}
            </Text>
          ))}
        </View>

        <Text style={[styles.subHeading, { color: theme.text }]}>Steps:</Text>
        <View style={styles.stepList}>
          {selectedRecipe.steps.map((step, index) => (
            <Text key={index} style={[styles.stepText, { color: theme.text }]}>
              {`${index + 1}. ${step}`}
            </Text>
          ))}
        </View>
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
});

export default RecipeDetails;