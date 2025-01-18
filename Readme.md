# Cookwise - AI-Based Recipe App

## FOL Group ID
INFO-6134-01-25W - 4

## Group Members
1. Lakshay Veer

## Project Description
Cookwise is an AI-powered recipe application designed to help users make the most out of their available ingredients. The app takes user-provided ingredients as input and suggests one dish that can be prepared. It features a React Native frontend and a Java Spring Boot backend, which integrates OpenAI's API to generate recipe recommendations.



## App Data Sources
- **Type**: 3rd-Party API, Databse
- **Source**: OpenAI API, mongoDB / MySql
- **Usage**: The app relies on the OpenAI API to process ingredients and generate dish suggestions. The app display saved recipies in database on the favorites screen.

## App Features
### Member 1: Lakshay Veer (Backend)
1. Backend accepts a list of ingredients and sends it to the OpenAI API for processing.
2. Backend validates the user-provided ingredient list to ensure proper API responses.
3. Backend takes user input and make it into more effective Prompt using Prompt Engineering.
4. Backend stores favorite recipes in a database.