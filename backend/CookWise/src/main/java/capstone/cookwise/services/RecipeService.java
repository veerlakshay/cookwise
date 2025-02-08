package capstone.cookwise.services;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RecipeService {

    @Autowired
    private ChatModel chatModel;

    public String getRecipesByIngredients(String ingredients) {
        String template = "Generate a recipe from these given ingreadients and"
                + " send response in steps ingredients: " + ingredients;
        String chatResponse = chatModel.call(template);
        return chatResponse;
    }

}
