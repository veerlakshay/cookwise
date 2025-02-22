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
                + " send response JSON format without any tics , one key should be name and it's value should be name of recipe "
                + " and another key should be steps and its value should be steps object with keys as number of steps and value as step" + ingredients;
        String chatResponse = chatModel.call(template);
        return chatResponse;
    }

}
