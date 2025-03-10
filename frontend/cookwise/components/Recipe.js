import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const Recipe = ({ route, navigation }) => {
  const { selectedRecipe } = route.params;

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
  header:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,  },
  backButtonText: { color: '#fff', fontSize: 16 },
});

export default Recipe;
