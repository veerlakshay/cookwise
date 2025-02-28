package capstone.cookwise.payload;

import java.util.Map;

public class Recipe {

    private Map<String, RecipeDetail> recipes;

    public Map<String, RecipeDetail> getRecipes() {
        return recipes;
    }

    public void setRecipes(Map<String, RecipeDetail> recipes) {
        this.recipes = recipes;
    }

    public static class RecipeDetail {

        private Map<String, String> preparation;

        public Map<String, String> getPreparation() {
            return preparation;
        }

        public void setPreparation(Map<String, String> preparation) {
            this.preparation = preparation;
        }
    }
}
