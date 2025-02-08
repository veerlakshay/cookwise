package capstone.cookwise.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<String> getRecipes(
            @RequestParam(value = "ingredients") String ingredients
    ) throws IOException {
        String recipe = recipeService.getRecipesByIngredients(ingredients);
        return ResponseEntity.ok(recipe);
    }
}
