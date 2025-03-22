
import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Recipe = ({ route, navigation }) => {
  const { selectedRecipe } = route.params;

  useEffect(() => {
    const saveRecipeToHistory = async () => {
      try {
        const history = await AsyncStorage.getItem('recipeHistory');
        let parsedHistory = history ? JSON.parse(history) : [];

        // Avoid duplicates
        parsedHistory = parsedHistory.filter(item => item.id !== selectedRecipe.id);
        parsedHistory.unshift(selectedRecipe); // Add new recipe at the top

        if (parsedHistory.length > 20) parsedHistory.pop(); // Limit history to 20 items

        await AsyncStorage.setItem('recipeHistory', JSON.stringify(parsedHistory));
      } catch (error) {
        console.error("Error saving history:", error);
      }
    };

    saveRecipeToHistory();
  }, [selectedRecipe]);

  return (
    <ScrollView style={styles.container}>
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
  container: { padding: 20 },
  recipeName: { fontSize: 24, fontWeight: 'bold', color: '#E81B0E' },
  subHeading: { fontSize: 20, marginTop: 10, marginBottom: 5, color: '#333' },
  recipeText: { fontSize: 16, color: '#555', marginBottom: 5 },
  backButton: {
    backgroundColor: '#E81B0E',
    padding: 10,
    width: 40,
    borderRadius: 5,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButtonText: { color: '#fff', fontSize: 16 },
});

export default Recipe;
