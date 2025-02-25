package capstone.cookwise.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private RecipeService recipeService;

    @GetMapping("/test")
    public String testController() {
        return "Working";
    }

    @GetMapping("/get-recipes")
    public ResponseEntity<Recipe> getRecipes(
            @RequestParam(value = "ingredients") String ingredients
    ) throws IOException {

        Recipe recipe = recipeService.getRecipesByIngredients(ingredients);
        return ResponseEntity.ok(recipe);
    }
}
