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

  const removeIngredient = (index) => {
    const updatedList = ingredientsList.filter((_, idx) => idx !== index);
    setIngredientsList(updatedList);
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
          
          
        </View>
        <View style={styles.list}>
          {showList && (
            <FlatList
              data={ingredientsList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item ,index }) => (<View style={styles.listItemContainer}>
                <Text style={styles.listItem}>{index}. {item}</Text>
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeIngredient(index)}
                >
                  <Text style={styles.buttonText}>Remove</Text>
                </TouchableOpacity>
              </View>)}
            />
          )}
          </View>
      </View>

      <StatusBar style='light' backgroundColor="#E81B0E" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 20, 
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
  listItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  listItem: {
    fontSize: 16,
    color: 'black',
  },
  removeButton: {
    backgroundColor: "#E81B0E",
    paddingVertical: 5,
    borderRadius: 5,
    padding: 5,
    alignItems: "center",
  },
});

export default App;
