package capstone.cookwise.controller;

import java.io.IOException;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import capstone.cookwise.payload.Recipe;
import capstone.cookwise.services.RecipeService;

@RestController
@RequestMapping("/recipes")
public class RecipeController {

    private static final Logger logger = LoggerFactory.getLogger(RecipeController.class);

    @Autowired
    private RecipeService recipeService;

    @GetMapping("/test")
    public String testController() {
        return "Recipe API is working on port 8080";
    }

    @GetMapping("/get-recipes")
    public ResponseEntity<?> getRecipes(@RequestParam(value = "ingredients", required = false) String ingredients, @RequestParam(value = "portions", required = false) String portions) {
        if (ingredients == null || ingredients.trim().isEmpty()) {
            logger.warn("Ingredients parameter is empty");
            return ResponseEntity.badRequest().body("Ingredients parameter cannot be empty.");
        }

        if (portions == null || portions.trim().isEmpty()) {
            portions = "4"; // Default to 4 portions if not specified
        }

        try {
            Recipe recipe = recipeService.getRecipesByIngredients(ingredients, portions);
            if (recipe == null || recipe.getRecipes().isEmpty()) {
                logger.info("No recipes found for ingredients: {}", ingredients);
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No recipes found for the given ingredients.");
            }
            return ResponseEntity.ok(recipe);
        } catch (IOException e) {
            logger.error("Error fetching recipes for ingredients: {}", ingredients, e);

            // Check if the error message matches invalid ingredient case
            if (e.getMessage().contains("Invalid ingredients provided")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                        Map.of("error", Map.of("message", "Invalid ingredients provided. Please enter proper ingredients."))
                );
            }

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch recipes due to server error.");
        } catch (Exception e) {
            logger.error("Unexpected error: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }

}
