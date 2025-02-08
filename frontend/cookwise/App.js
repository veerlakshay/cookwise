import { StatusBar } from 'expo-status-bar';
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity, Text, View, TextInput, FlatList } from 'react-native';

const App = () => {
  const [ingredient, setIngredient] = useState("");
  const [ingredientsList, setIngredientsList] = useState([]);
  const [showList, setShowList] = useState(false); 

  const addIngredient = () => {
    if (ingredient.trim()) {
      setIngredientsList([...ingredientsList, ingredient]);
      setIngredient(""); 
    }
  };

  const toggleList = () => {
    setShowList(!showList); 
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.heading}>CookWise</Text>
      </View>

      <View style={styles.main}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="e.g., eggs, milk"
            value={ingredient}
            onChangeText={setIngredient}
          />
          <View style={styles.buttons}>
            <TouchableOpacity 
              onPress={addIngredient}
              style={styles.addButton}
            >
              <Text style={styles.buttonText}>Add Ingredient</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={toggleList}
              style={styles.addButton}
            >
              <Text style={styles.buttonText}>Show List</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.list}>
          {showList && (
            <FlatList
              data={ingredientsList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <Text style={styles.listItem}>{item}</Text>}
            />
          )}
          </View>
          
        </View>
      </View>

      <StatusBar style='auto' />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 50, 
  },
  container: {
    alignItems: 'center',
    backgroundColor:"#E81B0E",
    marginBottom: 20,
  },
  heading: {
    fontSize: 35,
    textAlign: 'center',
    fontFamily: 'cursive',
    color: '#fff',
    borderBottomColor: 'red',
    borderBottomWidth: 2,
    paddingBottom: 10,
  },
  main: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputContainer: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  buttons: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: "#E81B0E",
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  listItem: {
    paddingVertical: 5,
    fontSize: 16,
    color: 'black',
  },
  list:{
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  }
});

export default App;
