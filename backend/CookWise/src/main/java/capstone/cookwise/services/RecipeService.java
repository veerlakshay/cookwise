package capstone.cookwise.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import capstone.cookwise.payload.Recipe;

@Service
public class RecipeService {

    @Autowired
    private ChatModel chatModel;

    public Recipe getRecipesByIngredients(String inputString) throws IOException {
        String template = this.loadPromptTemplate("prompts/recipe.txt");
        String promptString = this.putValuesInPrompt(template, Map.of("inputString", inputString));
        ChatResponse recipeResponse = chatModel.call(
                new Prompt(promptString)
        );
        String responseString = recipeResponse.getResult().getOutput().getContent();
        ObjectMapper mapper = new ObjectMapper();
        Recipe recipeResponse2 = mapper.readValue(responseString, Recipe.class);
        return recipeResponse2;
    }

    public String loadPromptTemplate(String filename) throws IOException {
        Path filepath = new ClassPathResource(filename).getFile().toPath();
        return Files.readString(filepath);
    }

    public String putValuesInPrompt(String template, Map<String, String> values) {
        for (Map.Entry<String, String> entry : values.entrySet()) {
            template = template.replace("{" + entry.getKey() + "}", entry.getValue());
        }
        return template;
    }

}
