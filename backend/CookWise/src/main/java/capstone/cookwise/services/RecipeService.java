package capstone.cookwise.services;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import capstone.cookwise.payload.Recipe;

@Service
public class RecipeService {

    private static final Logger logger = LoggerFactory.getLogger(RecipeService.class);

    @Autowired
    private ChatModel chatModel;

    public Recipe getRecipesByIngredients(String inputString) throws IOException {
        String template = this.loadPromptTemplate("prompts/recipe.txt");
        String promptString = this.putValuesInPrompt(template, Map.of("inputString", inputString));
        ChatResponse recipeResponse = chatModel.call(new Prompt(promptString));
        String responseString = recipeResponse.getResult().getOutput().getContent().trim();

        logger.debug("Raw AI response: " + responseString);
        responseString = sanitizeResponse(responseString);

        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(responseString, Recipe.class);
        } catch (JsonProcessingException e) {
            logger.error("Failed to parse AI response as JSON: " + responseString, e);
            throw new IOException("Invalid response format received from AI", e);
        }
    }

    private String sanitizeResponse(String response) {
        if (response == null || response.isEmpty()) {
            return "";
        }
        response = response.trim();

        // If the response starts with {json, remove this part
        if (response.startsWith("{json")) {
            response = response.substring(5).trim();
        }

        // Remove any surrounding backticks or unnecessary characters
        response = response.replaceAll("`", "").trim();

        // Ensure the response starts and ends with curly braces for valid JSON
        if (!response.startsWith("{")) {
            response = "{" + response;
        }
        if (!response.endsWith("}")) {
            response = response + "}";
        }

        return response;
    }

    public String loadPromptTemplate(String filename) throws IOException {
        try (InputStream inputStream = new ClassPathResource(filename).getInputStream()) {
            return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            logger.error("Failed to load the prompt template from file: {}", filename, e);
            throw e;
        }
    }

    public String putValuesInPrompt(String template, Map<String, String> values) {
        if (values == null || values.isEmpty()) {
            logger.warn("No values provided for prompt placeholders");
            return template;
        }

        for (Map.Entry<String, String> entry : values.entrySet()) {
            String placeholder = "\\{" + entry.getKey() + "\\}";
            template = template.replaceAll(placeholder, entry.getValue() != null ? entry.getValue() : "");
        }
        return template;
    }
}
