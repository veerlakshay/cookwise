# Cookwise - AI-Based Recipe App

## FOL Group ID
INFO-6134-01-25W - 4

## Group Members
1. Lakshay Veer
2. Jaskaran Singh
3. Lakshdeep Singh
4. Bhanusri Uddagiri

## Project Description
Cookwise is an AI-powered recipe application designed to help users make the most out of their available ingredients. The app takes user-provided ingredients as input and suggests one dish that can be prepared. It features a React Native frontend and a Java Spring Boot backend, which integrates OpenAI's API to generate recipe recommendations.



## App Data Sources
- **Type**: 3rd-Party API, Databse
- **Source**: OpenAI API, mongoDB / MySql
- **Usage**: The app relies on the OpenAI API to process ingredients and generate dish suggestions. The app display saved recipies in database on the favorites screen.

## Tech stack
React Native , Spring , Spring Boot , mongoDB / MySql

## App Features
### Member 1: Lakshay Veer (Backend)
1. Accepts a list of ingredients and sends it to the OpenAI API for processing.
2. Validates the user-provided ingredient list to ensure proper API responses.
3. Takes user input and make it into more effective Prompt using Prompt Engineering.
4. Stores favorite recipes in a database.

## Member 2: Lakshdeep Singh
1. Break down the recipe into clear, step-by-step cooking instructions with optional timers for each step.
2. Calculate and display the estimated calories, macronutrients, and other nutrition facts for the suggested recipe.
3. You can select the number of portions needed to be made.
4. Display a list of previously viewed or generated recipes for easy reference.

## Member 3: Jaskaran Singh (Frontend)
1. Dark Mode: Allows users to toggle between light and dark themes for a personalized viewing experience.
2. Timer Page: Provides a cooking timer to assist with recipe preparation.
3. Favorites Recipe Page: Displays a collection of saved recipes.
4. Scroll Feature for Favorites Page: Enables smooth scrolling or paginated loading for easy navigation of favorite recipes.

## Member 4: Bhanusri Uddagiri
1. Allow users to input ingredients, validate the input, and display suggested recipes on the first screen.
2. Create a screen to list favorite recipes or saved recipes and a history of viewed recipes.
3. Allow users to adjust portion sizes and ingredient quantities.
4. Implementing sorting and filtering with simple dropdown menus.

