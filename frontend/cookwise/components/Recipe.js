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
});

export default RecipeDetails;