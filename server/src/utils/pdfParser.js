import pdf from "pdf-parse";

/**
 * Extract text and parse questions from PDF file
 * @param {Buffer} fileBuffer - PDF file buffer from multer
 * @returns {Promise<Array>} Array of extracted questions
 */
async function extractQuestionsFromPDF(fileBuffer) {
  try {
    // Parse PDF and extract text
    const data = await pdf(fileBuffer);
    const text = data.text;

    if (!text || text.trim().length === 0) {
      throw new Error("PDF contains no extractable text");
    }

    // Split by common question delimiters
    // Matches patterns like: "1. ", "1) ", "1] ", or lines starting with single letter like "A) "
    const questionDelimiter = /\n(?=\d+[\.\)\]]\s|[A-Z]\)\s)/;
    let questions = text.split(questionDelimiter);

    // Clean up and filter questions
    questions = questions
      .map((q) => q.trim())
      .filter((q) => q.length > 10) // Filter out very short texts (likely not questions)
      .map((q, idx) => ({
        id: idx + 1,
        text: q,
        extracted: true,
        originalText: q,
      }));

    if (questions.length === 0) {
      throw new Error("No questions could be extracted from PDF");
    }

    console.log(`Successfully extracted ${questions.length} questions from PDF`);
    return questions;
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error(`PDF parsing failed: ${error.message}`);
  }
}

/**
 * Parse question text into structured components
 * Attempts to separate question text from answer options
 * @param {string} questionText - Raw question text
 * @returns {Object} Structured question with main text and options
 */
function parseQuestionStructure(questionText) {
  try {
    // Split by common option patterns
    const lines = questionText.split("\n").filter((line) => line.trim());

    if (lines.length === 0) {
      return {
        mainText: questionText,
        options: [],
      };
    }

    // Find where options start (usually marked with A), B), etc.)
    const optionPattern = /^[A-E]\)\s*/;
    let mainTextEndIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      if (optionPattern.test(lines[i].trim())) {
        mainTextEndIndex = i;
        break;
      }
    }

    const mainText = lines.slice(0, mainTextEndIndex || lines.length).join(" ");
    const options = mainTextEndIndex > 0 ? lines.slice(mainTextEndIndex) : [];

    return {
      mainText: mainText.trim(),
      options: options.map((opt) => opt.trim()).filter((opt) => opt.length > 0),
    };
  } catch (error) {
    console.error("Question structure parsing error:", error);
    return {
      mainText: questionText,
      options: [],
    };
  }
}

/**
 * Validate extracted questions
 * @param {Array} questions - Questions to validate
 * @returns {Object} Validation result
 */
function validateQuestions(questions) {
  const validation = {
    total: questions.length,
    valid: 0,
    invalid: 0,
    errors: [],
  };

  questions.forEach((q, idx) => {
    if (!q.text || q.text.trim().length < 10) {
      validation.invalid++;
      validation.errors.push({
        index: idx,
        reason: "Question text too short",
      });
    } else {
      validation.valid++;
    }
  });

  return validation;
}

export {
  extractQuestionsFromPDF,
  parseQuestionStructure,
  validateQuestions,
};
