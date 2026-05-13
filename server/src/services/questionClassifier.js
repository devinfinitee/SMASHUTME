import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Classify question to appropriate topic using AI
 * @param {string} questionText - The question text
 * @param {Array} availableTopics - List of available topics with names
 * @returns {Promise<Object>} Classification result with topic and confidence
 */
async function classifyQuestionToTopic(questionText, availableTopics) {
  try {
    if (!questionText || questionText.trim().length === 0) {
      throw new Error("Question text is empty");
    }

    if (!availableTopics || availableTopics.length === 0) {
      throw new Error("No topics available for classification");
    }

    // Get unique topic names
    const topicsList = [...new Set(availableTopics.map((t) => t.name))].join(
      ", "
    );

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are an expert UTME exam classifier with extensive knowledge of Nigerian JAMB curriculum.

Your task: Classify this question to EXACTLY ONE of these topics: ${topicsList}

Question: "${questionText}"

IMPORTANT: You MUST respond with ONLY valid JSON (no other text before or after).
The topic MUST be from the provided list above.
confidence should be a number between 0 and 1 (e.g., 0.95)

{
  "topic": "exact topic name from the list",
  "confidence": 0.95,
  "reasoning": "2-3 sentence explanation of why"
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn("No valid JSON found in response:", text);
      return {
        topic: availableTopics[0].name,
        confidence: 0.3,
        reasoning: "AI response parsing failed, assigned to default topic",
      };
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate the response
    if (
      !parsed.topic ||
      !availableTopics.some(
        (t) => t.name.toLowerCase() === parsed.topic.toLowerCase()
      )
    ) {
      console.warn(`AI returned invalid topic: ${parsed.topic}`);
      return {
        topic: availableTopics[0].name,
        confidence: 0.3,
        reasoning: `AI classified to '${parsed.topic}' which doesn't exist, using default topic`,
      };
    }

    return {
      topic: parsed.topic,
      confidence: Math.min(Math.max(parsed.confidence || 0.5, 0), 1), // Ensure 0-1 range
      reasoning: parsed.reasoning || "Classification completed",
    };
  } catch (error) {
    console.error("Classification error:", error);
    // Return safe fallback
    return {
      topic: availableTopics?.[0]?.name || "General",
      confidence: 0.2,
      reasoning: `Classification failed: ${error.message}`,
    };
  }
}

/**
 * Classify multiple questions in sequence
 * @param {Array<string>} questionTexts - Array of question texts
 * @param {Array} availableTopics - List of available topics
 * @param {Function} onProgress - Callback for progress updates
 * @returns {Promise<Array>} Array of classification results
 */
async function classifyQuestionsInBatch(
  questionTexts,
  availableTopics,
  onProgress = null
) {
  const results = [];

  for (let i = 0; i < questionTexts.length; i++) {
    try {
      const classification = await classifyQuestionToTopic(
        questionTexts[i],
        availableTopics
      );
      results.push({
        index: i,
        classification: classification,
        success: true,
      });

      if (onProgress) {
        onProgress({
          current: i + 1,
          total: questionTexts.length,
          percentage: Math.round(((i + 1) / questionTexts.length) * 100),
        });
      }

      // Add delay to avoid rate limiting (500ms between requests)
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      results.push({
        index: i,
        classification: null,
        success: false,
        error: error.message,
      });

      if (onProgress) {
        onProgress({
          current: i + 1,
          total: questionTexts.length,
          percentage: Math.round(((i + 1) / questionTexts.length) * 100),
        });
      }
    }
  }

  return results;
}

/**
 * Get classification confidence assessment
 * @param {number} confidence - Confidence score 0-1
 * @returns {string} Human readable confidence level
 */
function getConfidenceLevel(confidence) {
  if (confidence >= 0.9) return "very high";
  if (confidence >= 0.7) return "high";
  if (confidence >= 0.5) return "moderate";
  if (confidence >= 0.3) return "low";
  return "very low";
}

export {
  classifyQuestionToTopic,
  classifyQuestionsInBatch,
  getConfidenceLevel,
};
