import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate concise AI explanation for a question
 * @param {string} questionText - The question text
 * @param {string} topic - The topic/subject of the question
 * @returns {Promise<string>} Concise explanation (2-3 sentences)
 */
async function generateQuestionExplanation(questionText, topic) {
  try {
    if (!questionText || questionText.trim().length === 0) {
      throw new Error("Question text is empty");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are an expert UTME/JAMB tutor specializing in ${topic}.

Provide a CONCISE explanation (maximum 2-3 sentences) for this ${topic} question:

"${questionText}"

Your explanation should:
1. Identify what concept or principle is being tested
2. Give a brief hint on how to approach solving it
3. Mention any common mistakes to avoid

Keep it student-friendly, clear, and under 150 words.
Do NOT include the answer, just explain the concept being tested.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    let explanation = response.text();

    // Clean up and limit explanation
    explanation = explanation
      .trim()
      .replace(/^[A-Za-z]*:/, "") // Remove any leading labels
      .trim();

    // Limit to 500 characters for consistency
    if (explanation.length > 500) {
      explanation = explanation.substring(0, 500).trim() + "...";
    }

    return explanation;
  } catch (error) {
    console.error("Explanation generation error:", error);
    return "Unable to generate explanation. Please review the question manually.";
  }
}

/**
 * Generate explanations for multiple questions
 * @param {Array<{text: string, topic: string}>} questions - Array of questions with text and topic
 * @param {Function} onProgress - Optional progress callback
 * @returns {Promise<Array>} Array of explanations
 */
async function generateExplanationsInBatch(questions, onProgress = null) {
  const results = [];

  for (let i = 0; i < questions.length; i++) {
    try {
      const explanation = await generateQuestionExplanation(
        questions[i].text,
        questions[i].topic
      );

      results.push({
        index: i,
        explanation: explanation,
        success: true,
      });

      if (onProgress) {
        onProgress({
          current: i + 1,
          total: questions.length,
          percentage: Math.round(((i + 1) / questions.length) * 100),
        });
      }

      // Add delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      results.push({
        index: i,
        explanation: null,
        success: false,
        error: error.message,
      });

      if (onProgress) {
        onProgress({
          current: i + 1,
          total: questions.length,
          percentage: Math.round(((i + 1) / questions.length) * 100),
        });
      }
    }
  }

  return results;
}

/**
 * Generate explanation with fallback
 * @param {string} questionText - The question text
 * @param {string} topic - The topic
 * @returns {Promise<string>} Explanation with automatic fallback
 */
async function generateExplanationWithFallback(questionText, topic) {
  try {
    const explanation = await generateQuestionExplanation(questionText, topic);
    if (explanation && explanation.length > 10) {
      return explanation;
    }
  } catch (error) {
    console.error("Fallback explanation error:", error);
  }

  // Return a basic fallback explanation based on topic
  return `This ${topic} question tests your understanding of key concepts in this subject. 
Review the relevant topic section and practice similar questions to improve your skills.`;
}

/**
 * Format explanation for display
 * @param {string} explanation - Raw explanation text
 * @param {number} maxLength - Maximum length (default 300)
 * @returns {string} Formatted explanation
 */
function formatExplanation(explanation, maxLength = 300) {
  if (!explanation) return "";

  let formatted = explanation.trim();

  // Limit length
  if (formatted.length > maxLength) {
    formatted = formatted.substring(0, maxLength).trim() + "...";
  }

  return formatted;
}

/**
 * Validate explanation quality
 * @param {string} explanation - The explanation text
 * @returns {Object} Validation result with quality score
 */
function validateExplanation(explanation) {
  const validation = {
    isValid: false,
    qualityScore: 0,
    issues: [],
  };

  if (!explanation || explanation.length === 0) {
    validation.issues.push("Explanation is empty");
    return validation;
  }

  if (explanation.length < 20) {
    validation.issues.push("Explanation is too short");
  }

  if (explanation.length > 600) {
    validation.issues.push("Explanation is too long");
  }

  // Quality scoring
  let score = 1;

  // Good length
  if (explanation.length >= 80 && explanation.length <= 500) {
    score += 0.3;
  }

  // Has sentence structure
  if (explanation.split(".").length >= 2) {
    score += 0.3;
  }

  // Likely contains concept-related words
  const conceptWords = [
    "concept",
    "principle",
    "method",
    "formula",
    "theorem",
    "approach",
    "calculate",
    "determine",
    "identify",
    "understand",
  ];
  const hasConceptWords = conceptWords.some((word) =>
    explanation.toLowerCase().includes(word)
  );
  if (hasConceptWords) {
    score += 0.4;
  }

  validation.qualityScore = Math.min(score, 1);
  validation.isValid =
    explanation.length >= 20 && explanation.length <= 600 && score >= 0.5;

  return validation;
}

export {
  generateQuestionExplanation,
  generateExplanationsInBatch,
  generateExplanationWithFallback,
  formatExplanation,
  validateExplanation,
};
