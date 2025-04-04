import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from './ThemeContext';
import { useFocusEffect } from '@react-navigation/native';


const RecipeHistory = ({ navigation }) => {
  const [history, setHistory] = useState([]);
  const { theme } = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      const fetchHistory = async () => {
        const storedHistory = await AsyncStorage.getItem('recipeHistory');
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        } else {
          setHistory([]);
        }
        if (history.length > 20) {
          history = history.slice(0, 20);
        }
      };

      fetchHistory();
    }, [])
  );


  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>Previously Viewed Recipes</Text>
      <FlatList
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.item, { backgroundColor: theme.card }]} 
            onPress={() => navigation.navigate('RecipeDetails', { selectedRecipe: item })}
          >
            <Text style={[styles.recipeText, { color: theme.text }]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  recipeText: {
    fontSize: 16,
  },
});

export default RecipeHistory;