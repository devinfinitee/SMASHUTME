import Subject from "../models/subject.model.js";
import Topic from "../models/topic.model.js";
import Question from "../models/question.model.js";
import PastQuestion from "../models/pastQuestion.model.js";
import { slugify } from "../models/schemaUtils.js";
import multer from "multer";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";

export const listSupportTickets = (_req, res) => {
  res.json({
    message: "Support tickets endpoint ready",
    data: [],
  });
};

export const getRevenueSummary = (_req, res) => {
  res.json({
    message: "Revenue summary endpoint ready",
    data: {
      grossRevenue: 0,
      activeSubscribers: 0,
    },
  });
};

const noteUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

const allowedNoteMimeTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export const parseTopicNoteUploadMiddleware = noteUpload.single("noteFile");

function getExtension(fileName = "") {
  const parts = String(fileName).toLowerCase().split(".");
  return parts.length > 1 ? parts[parts.length - 1] : "";
}

function normalizeLineList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((item) => String(item || "").trim()).filter(Boolean);
  return String(value)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitParagraphs(value = "") {
  return String(value)
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);
}

async function extractTextFromNoteFile(file) {
  const extension = getExtension(file?.originalname);

  if (!allowedNoteMimeTypes.has(file?.mimetype) && !["pdf", "docx"].includes(extension)) {
    throw new Error("Only PDF and DOCX note files are supported.");
  }

  if (extension === "docx") {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return String(result?.value || "").trim();
  }

  const parsed = await pdfParse(file.buffer);
  return String(parsed?.text || "").trim();
}

function parseTopicNoteHeuristics({ topicName, sourceText }) {
  const text = String(sourceText || "").trim();
  const lines = text.split("\n");

  // TRY NEW STRUCTURED FORMAT FIRST (FIELD NAME: format)
  const isStructuredFormat = /^(TOPIC NAME|REFERENCE BOOK|SECTION):/i.test(text);
  
  console.log(`\n🔍 Heuristic Parser: Checking note format...`);
  
  if (isStructuredFormat) {
    console.log(`✅ Detected STRUCTURED FORMAT (FIELD NAME: format)`);
    return parseStructuredNoteFormat({ topicName, text, lines });
  }
  
  console.log(`✅ Using LEGACY FORMAT parser (** HEADING ** format)`);
  const nonEmptyLines = lines.filter(l => l.trim());
  const overview = nonEmptyLines.slice(0, 5).join(" ").slice(0, 1200);

  // Enhanced heading detection with ** heading ** priority
  const sectionMarkers = [
    /^\*{2}\s+(.+?)\s+\*{2}$/,  // ** heading ** format (PRIORITY)
    /^\d+[\).:-]\s+/,
    /^(chapter|section|part)\s+\d+/i,
    /^(dalton|thomson|rutherford|bohr|schrodinger|quantum|electron|proton|neutron)\b/i,
  ];

  const sections = [];
  let current = null;
  let currentContent = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    let isHeading = false;
    let headingTitle = "";

    // Check if this line is a heading
    for (const pattern of sectionMarkers) {
      const match = trimmed.match(pattern);
      if (match) {
        isHeading = true;
        // Extract clean heading text
        if (pattern.source.includes("\\*{2}")) {
          headingTitle = trimmed.replace(/^\*{2}\s+/, "").replace(/\s+\*{2}$/, "").trim();
        } else if (match[1]) {
          headingTitle = match[1];
        } else {
          headingTitle = trimmed.replace(/^\d+[\).:-]\s*/, "").trim();
        }
        break;
      }
    }

    if (isHeading) {
      // Save previous section with accumulated content
      if (current) {
        current.explanation = currentContent.join("\n").trim();
        sections.push(current);
      }

      // Start new section
      current = {
        sectionTitle: headingTitle,
        definition: "",
        explanation: "",
        examples: [],
        jambPoint: "",
        quickTip: "",
        aiExplanation: { paragraphs: [] },
      };
      currentContent = [];
    } else if (current) {
      // Accumulate content for current section
      currentContent.push(trimmed);
    }
  }

  // Don't forget the last section
  if (current) {
    current.explanation = currentContent.join("\n").trim();
    sections.push(current);
  }

  const normalizedSections = sections
    .map((section, index) => {
      const explanation = section.explanation || "";
      const lines = explanation.split("\n");
      
      // Extract definition from first line
      const definition = lines[0]?.slice(0, 150) || section.sectionTitle || "";
      
      // Extract examples (look for keywords)
      const examples = [];
      const exampleKeywords = /(?:e\.g\.|example|for instance|such as|like)[\s:](.+?)(?=\.|$)/gi;
      let match;
      while ((match = exampleKeywords.exec(explanation)) && examples.length < 3) {
        const example = match[1]?.trim();
        if (example && example.length > 5) {
          examples.push(example.slice(0, 100));
        }
      }

      // Extract JAMB points
      let jambPoint = "";
      const jambMatch = explanation.match(/(?:jamb|exam|important|note|remember|key point)[\s:](.+?)(?=\.|$)/i);
      if (jambMatch) {
        jambPoint = jambMatch[1]?.trim()?.slice(0, 150) || "";
      }

      // Extract or create quick tip
      let quickTip = "";
      const tipMatch = explanation.match(/(?:tip:|remember:|memory|trick|mnemonic)[\s:](.+?)(?=\.|$)/i);
      if (tipMatch) {
        quickTip = tipMatch[1]?.trim()?.slice(0, 100) || "";
      }

      // Create summary paragraphs from explanation
      const explanationParagraphs = explanation
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean)
        .slice(0, 3);

      return {
        sectionTitle: section.sectionTitle || `Section ${index + 1}`,
        order: index,
        definition: definition || section.sectionTitle,
        explanation: explanation || definition,
        examples: examples.length > 0 ? examples : [],
        jambPoint: jambPoint || "Focus on definitions and applications in exam contexts.",
        quickTip: quickTip || `Key aspects of ${section.sectionTitle}`,
        aiExplanation: {
          paragraphs: explanationParagraphs.length > 0 
            ? explanationParagraphs 
            : [explanation || "Review this section carefully."],
        },
      };
    })
    .filter((section) => section.sectionTitle);

  const firstSection = normalizedSections[0];

  return {
    topicName: String(topicName || "").trim(),
    overview,
    referenceBook: "",
    jambFocus: ["Definition-based questions", "Application and interpretation questions", "Comparative analysis questions"],
    learningGoals: [
      "Understand the core definitions and concepts",
      "Apply the concepts to exam-style questions",
      "Analyze and compare related concepts",
    ],
    prerequisites: [],
    relatedTopics: [],
    revisionPriority: "high",
    sections: normalizedSections,
    // Legacy compatibility values
    highYieldSummary: overview,
    simpleExplanation: firstSection?.explanation || overview,
    keyDefinitions: normalizedSections.map((section) => section.definition).filter(Boolean).slice(0, 8),
    importantFormulasFacts: normalizedSections.map((section) => section.jambPoint).filter(Boolean).slice(0, 8),
    aiExplanations: {
      whyCorrectIsCorrect: "Correct answers align with core definitions and rule conditions from the section notes.",
      whyOthersAreWrong: "Distractors usually break a condition, misuse a definition, or confuse related terms.",
      simpleBreakdown: "1) Read the stem carefully. 2) Match with core definition. 3) Eliminate options that violate the rule.",
      paragraphs: firstSection?.aiExplanation?.paragraphs || [],
    },
  };
}

function parseStructuredNoteFormat({ topicName, text, lines }) {
  // Parse the structured format with FIELD NAME: values
  const fields = {};
  let currentField = null;
  let currentValue = [];

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Check if this is a field header (FIELD NAME:)
    const fieldMatch = trimmed.match(/^([A-Z][A-Z\s]+):\s*(.*)/);
    if (fieldMatch) {
      // Save previous field
      if (currentField) {
        const value = currentValue.join("\n").trim();
        if (!fields[currentField]) fields[currentField] = [];
        fields[currentField].push(value);
      }
      
      currentField = fieldMatch[1].toUpperCase();
      currentValue = fieldMatch[2] ? [fieldMatch[2]] : [];
    } else if (currentField && trimmed) {
      // Continue current field value
      currentValue.push(trimmed);
    } else if (currentField && !trimmed && currentValue.length > 0) {
      // Empty line might separate field value
      if (!/^[-=]+$/.test(trimmed)) {
        currentValue.push("");
      }
    }
  }

  // Save last field
  if (currentField) {
    const value = currentValue.join("\n").trim();
    if (!fields[currentField]) fields[currentField] = [];
    fields[currentField].push(value);
  }

  // Extract top-level fields
  const extractField = (fieldName) => {
    const values = fields[fieldName] || [];
    return values[0] || "";
  };

  const extractList = (fieldName) => {
    const value = extractField(fieldName);
    return value
      .split("\n")
      .map(line => line.replace(/^[-•*]\s*/, "").trim())
      .filter(Boolean);
  };

  const topicNameValue = extractField("TOPIC NAME") || topicName || "Untitled Topic";
  const overview = extractField("OVERVIEW");
  const referenceBook = extractField("REFERENCE BOOK");
  const jambFocus = extractList("JAMB FOCUS POINTS");
  const learningGoals = extractList("LEARNING GOALS");
  const prerequisites = extractList("PREREQUISITES");
  const relatedTopics = extractList("RELATED TOPICS");

  // Parse sections (split by ================ separator)
  const sectionBlocks = text.split(/^={20,}/m).slice(1); // Skip the first split before first section
  
  const sections = sectionBlocks.map((block, idx) => {
    const sectionLines = block.split("\n").filter(l => l.trim());
    
    // Extract SECTION name
    const sectionMatch = block.match(/^SECTION:\s*(.+)/m);
    const sectionTitle = sectionMatch ? sectionMatch[1].trim() : `Section ${idx + 1}`;

    // Extract section fields
    const sectionFields = {};
    let sectionCurrentField = null;
    let sectionCurrentValue = [];

    for (const line of sectionLines) {
      const trimmed = line.trim();
      const fieldMatch = trimmed.match(/^([A-Z][A-Z\s]+):\s*(.*)/);
      
      if (fieldMatch) {
        if (sectionCurrentField) {
          sectionFields[sectionCurrentField] = sectionCurrentValue.join("\n").trim();
        }
        sectionCurrentField = fieldMatch[1].toUpperCase();
        sectionCurrentValue = fieldMatch[2] ? [fieldMatch[2]] : [];
      } else if (sectionCurrentField && trimmed) {
        sectionCurrentValue.push(trimmed);
      }
    }

    if (sectionCurrentField) {
      sectionFields[sectionCurrentField] = sectionCurrentValue.join("\n").trim();
    }

    const extractSectionField = (fieldName) => sectionFields[fieldName] || "";
    const extractSectionList = (fieldName) => {
      const value = extractSectionField(fieldName);
      return value
        .split("\n")
        .map(line => line.replace(/^[-•*]\s*/, "").trim())
        .filter(Boolean);
    };

    return {
      sectionTitle: sectionTitle,
      order: idx,
      definition: extractSectionField("DEFINITION"),
      explanation: extractSectionField("EXPLANATION"),
      examples: extractSectionList("EXAMPLES"),
      jambPoint: extractSectionField("JAMB POINT"),
      quickTip: extractSectionField("QUICK TIP"),
      aiExplanation: {
        paragraphs: [extractSectionField("AI EXPLANATION")].filter(Boolean),
      },
    };
  }).filter(section => section.sectionTitle);

  const firstSection = sections[0];

  console.log(`📚 Structured Parser Results:`);
  console.log(`   - Topic: ${topicNameValue}`);
  console.log(`   - Sections found: ${sections.length}`);
  console.log(`   - JAMB Focus Points: ${jambFocus.length}`);
  console.log(`   - Learning Goals: ${learningGoals.length}`);
  console.log(`   - Prerequisites: ${prerequisites.length}`);
  console.log(`   - Related Topics: ${relatedTopics.length}`);

  return {
    topicName: topicNameValue,
    overview: overview,
    referenceBook: referenceBook,
    jambFocus: jambFocus.length > 0 ? jambFocus : ["Definition-based questions", "Application and interpretation questions"],
    learningGoals: learningGoals.length > 0 ? learningGoals : ["Understand the core definitions and concepts", "Apply the concepts to exam-style questions"],
    prerequisites: prerequisites,
    relatedTopics: relatedTopics,
    revisionPriority: "high",
    sections: sections,
    // Legacy compatibility values
    highYieldSummary: overview,
    simpleExplanation: firstSection?.explanation || overview,
    keyDefinitions: sections.map((section) => section.definition).filter(Boolean).slice(0, 8),
    importantFormulasFacts: sections.map((section) => section.jambPoint).filter(Boolean).slice(0, 8),
    aiExplanations: {
      whyCorrectIsCorrect: "Correct answers align with core definitions and rule conditions from the section notes.",
      whyOthersAreWrong: "Distractors usually break a condition, misuse a definition, or confuse related terms.",
      simpleBreakdown: "1) Read the stem carefully. 2) Match with core definition. 3) Eliminate options that violate the rule.",
      paragraphs: firstSection?.aiExplanation?.paragraphs || [],
    },
  };
}

function extractJsonFromText(rawText) {
  const text = String(rawText || "").trim();
  if (!text) return null;

  const fencedMatch = text.match(/```json\s*([\s\S]*?)```/i);
  const candidate = fencedMatch ? fencedMatch[1] : text;
  const firstBrace = candidate.indexOf("{");
  const lastBrace = candidate.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) return null;

  try {
    return JSON.parse(candidate.slice(firstBrace, lastBrace + 1));
  } catch {
    return null;
  }
}

function buildParsePrompt(rawNote) {
  return `You are a curriculum parser for a Nigerian UTME preparation platform called SmashUTME.

A teacher has pasted raw physics notes. Your job is to parse these notes and return a structured JSON object that exactly matches the schema below.

RULES:
- Return ONLY valid JSON. No markdown. No backticks. No explanation. No preamble.
- If a field cannot be found in the notes, use an empty string "" for string fields or an empty array [] for array fields.
- sections array must follow the exact structure below — one object per section heading found in the notes.
- Keep all text faithful to the original notes — do not invent content.
- revision_priority must be exactly one of: "High" | "Medium" | "Low"
- For examples field, concatenate all examples into a single string separated by newlines or use the original format found
- For ai_explanation_paragraph, provide a single comprehensive paragraph explaining the section

REQUIRED JSON SCHEMA:
{
  "topic_name": "string",
  "reference_book": "string",
  "revision_priority": "High | Medium | Low",
  "overview": "string",
  "jamb_focus_points": ["string", "string"],
  "learning_goals": ["string", "string"],
  "prerequisites": ["string", "string"],
  "related_topics": ["string", "string"],
  "sections": [
    {
      "section_number": 1,
      "section_title": "string",
      "definition": "string",
      "jamb_point": "string",
      "explanation": "string",
      "examples": "string",
      "quick_tip": "string",
      "ai_explanation_paragraph": "string"
    }
  ]
}

PARSING INSTRUCTIONS:
1. Extract topic_name from the note header or main title
2. Extract reference_book from sources cited in the note
3. Extract revision_priority from any indicators (HIGH YIELD, CRITICAL, etc.) — default to "High"
4. Extract overview from the introductory paragraph or summary section
5. Extract jamb_focus_points by looking for emphasized JAMB test areas (default 3-5 items)
6. Extract learning_goals from stated objectives (default 3-5 items)
7. Extract prerequisites for understanding the topic (default 2-3 items)
8. Extract related_topics from connections mentioned in the notes (default 2-3 items)
9. For each SECTION heading:
   - section_title: the exact heading name
   - section_number: sequential numbering starting from 1
   - definition: 1-2 sentence core definition
   - explanation: fuller explanation with context
   - examples: all examples presented as a concatenated string
   - jamb_point: what JAMB typically tests about this section
   - quick_tip: memory aid, mnemonic, or exam trick
   - ai_explanation_paragraph: single comprehensive paragraph explaining the section thoroughly

RAW NOTES TO PARSE:
${rawNote}

CRITICAL: Return ONLY the JSON object - no markdown, no backticks, no explanation before or after.`;
}

async function enrichTopicNoteWithGemini({ topicName, extractedText, fallbackStructured }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log("⚠️ GEMINI_API_KEY not found, using fallback parser");
    return fallbackStructured;
  }

  console.log("\n" + "=".repeat(80));
  console.log("📝 PARSING NOTE WITH GEMINI");
  console.log("=".repeat(80));
  console.log(`Topic: ${topicName}`);
  console.log(`Extracted text length: ${extractedText.length} characters`);
  console.log(`Using first 22000 chars for Gemini...`);

  const textToProcess = extractedText.slice(0, 22000);
  const prompt = buildParsePrompt(textToProcess);

  console.log("\n" + "─".repeat(80));
  console.log("📤 SENDING PROMPT TO GEMINI (first 500 chars):");
  console.log("─".repeat(80));
  console.log(prompt.slice(0, 500) + "...\n");

  try {
    const startTime = Date.now();
    console.log("⏳ Waiting for Gemini API response...");

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.15,
          topP: 0.95,
          topK: 20,
          maxOutputTokens: 4096,
        },
      }),
    });

    const responseTime = Date.now() - startTime;
    console.log(`✅ Gemini responded in ${responseTime}ms`);
    console.log(`Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      console.error(`❌ API Error: ${response.status} ${response.statusText}`);
      const errorBody = await response.json().catch(() => ({}));
      console.error("Error details:", errorBody);
      return fallbackStructured;
    }

    const body = await response.json().catch((err) => {
      console.error("❌ Failed to parse Gemini response JSON:", err.message);
      return {};
    });

    const candidateText = body?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    console.log("\n" + "─".repeat(80));
    console.log("📥 GEMINI RESPONSE (RAW TEXT):");
    console.log("─".repeat(80));
    console.log(candidateText.slice(0, 1000));
    if (candidateText.length > 1000) {
      console.log(`\n... (${candidateText.length - 1000} more characters)\n`);
    }

    const parsed = extractJsonFromText(candidateText);

    if (!parsed || typeof parsed !== "object") {
      console.error("❌ Failed to extract valid JSON from Gemini response");
      console.log("Raw response:", candidateText);
      return fallbackStructured;
    }

    console.log("\n" + "─".repeat(80));
    console.log("✅ SUCCESSFULLY PARSED JSON:");
    console.log("─".repeat(80));
    console.log(`Topic Name: ${parsed.topic_name}`);
    console.log(`Reference Book: ${parsed.reference_book}`);
    console.log(`Revision Priority: ${parsed.revision_priority}`);
    console.log(`Overview (first 200 chars): ${String(parsed.overview || "").slice(0, 200)}...`);
    console.log(`JAMB Focus Points: ${Array.isArray(parsed.jamb_focus_points) ? parsed.jamb_focus_points.length : 0} items`);
    console.log(`Learning Goals: ${Array.isArray(parsed.learning_goals) ? parsed.learning_goals.length : 0} items`);
    console.log(`Prerequisites: ${Array.isArray(parsed.prerequisites) ? parsed.prerequisites.length : 0} items`);
    console.log(`Related Topics: ${Array.isArray(parsed.related_topics) ? parsed.related_topics.length : 0} items`);
    console.log(`Sections Found: ${Array.isArray(parsed.sections) ? parsed.sections.length : 0}`);

    if (Array.isArray(parsed.sections) && parsed.sections.length > 0) {
      console.log("\n📚 SECTIONS PARSED:");
      parsed.sections.forEach((section, idx) => {
        console.log(`  ${idx + 1}. "${section.section_title}"`);
        console.log(`     - Definition: ${String(section.definition || "").slice(0, 60)}...`);
        console.log(`     - Examples: ${String(section.examples || "").slice(0, 60)}...`);
        console.log(`     - AI Explanation: ${String(section.ai_explanation_paragraph || "").slice(0, 60)}...`);
      });
    }
  } catch (error) {
    console.error("❌ ERROR in enrichTopicNoteWithGemini:", error.message);
    console.error(error.stack);
    return fallbackStructured;
  }

  // Map from snake_case schema to internal camelCase format
  const sections = Array.isArray(parsed.sections)
    ? parsed.sections
        .map((section, index) => ({
          sectionTitle: String(section?.section_title || "").trim(),
          order: Number.isFinite(Number(section?.section_number)) ? Number(section.section_number) - 1 : index,
          definition: String(section?.definition || "").trim(),
          explanation: String(section?.explanation || "").trim(),
          examples: String(section?.examples || "").split("\n").map(e => e.trim()).filter(Boolean),
          jambPoint: String(section?.jamb_point || "").trim(),
          quickTip: String(section?.quick_tip || "").trim(),
          aiExplanation: {
            paragraphs: String(section?.ai_explanation_paragraph || "").trim() 
              ? [String(section.ai_explanation_paragraph).trim()] 
              : [],
          },
        }))
        .filter((section) => section.sectionTitle)
    : [];

  if (sections.length === 0) {
    return fallbackStructured;
  }

  const merged = {
    ...fallbackStructured,
    topicName: String(parsed.topic_name || fallbackStructured.topicName || "").trim(),
    overview: String(parsed.overview || fallbackStructured.overview || "").trim(),
    referenceBook: String(parsed.reference_book || fallbackStructured.referenceBook || "").trim(),
    jambFocus: normalizeLineList(parsed.jamb_focus_points),
    learningGoals: normalizeLineList(parsed.learning_goals),
    prerequisites: normalizeLineList(parsed.prerequisites),
    relatedTopics: normalizeLineList(parsed.relatedTopics),
    revisionPriority: ["low", "medium", "high", "critical"].includes(String(parsed.revisionPriority || "").toLowerCase())
      ? String(parsed.revisionPriority).toLowerCase()
      : fallbackStructured.revisionPriority,
    sections,
  };

  const firstSection = merged.sections[0];
  merged.highYieldSummary = merged.overview || fallbackStructured.highYieldSummary;
  merged.simpleExplanation = firstSection?.explanation || merged.overview || fallbackStructured.simpleExplanation;
  merged.keyDefinitions = merged.sections.map((section) => section.definition).filter(Boolean).slice(0, 8);
  merged.importantFormulasFacts = merged.sections.map((section) => section.jambPoint).filter(Boolean).slice(0, 8);
  merged.aiExplanations = {
    ...fallbackStructured.aiExplanations,
    paragraphs: firstSection?.aiExplanation?.paragraphs || fallbackStructured.aiExplanations?.paragraphs || [],
  };

  console.log("\n" + "─".repeat(80));
  console.log("✅ FINAL MERGED RESULT:");
  console.log("─".repeat(80));
  console.log(`Total Sections Processed: ${merged.sections.length}`);
  console.log(`JAMB Focus Points: ${merged.jambFocus.length}`);
  console.log(`Learning Goals: ${merged.learningGoals.length}`);
  console.log(`Key Definitions Extracted: ${merged.keyDefinitions.length}`);
  console.log(`Important Facts: ${merged.importantFormulasFacts.length}`);
  console.log("=" .repeat(80) + "\n");

  return merged;
}

export const parseTopicNoteFile = async (req, res) => {
  try {
    const topicName = normalizeText(req.body?.topicName);
    const file = req.file;

    console.log("\n" + "=".repeat(80));
    console.log("🚀 PARSE TOPIC NOTE FILE ENDPOINT CALLED");
    console.log("=".repeat(80));
    console.log(`File Name: ${file?.originalname || "unknown"}`);
    console.log(`File Size: ${file?.size || 0} bytes`);
    console.log(`Topic Name: ${topicName}`);

    if (!file) {
      console.warn("❌ No file provided");
      return res.status(400).json({ error: "Please upload a note file in PDF or DOCX format." });
    }

    console.log("\n📄 Step 0: Extracting text from file...");
    const extractedText = await extractTextFromNoteFile(file);
    console.log(`✅ Extracted ${extractedText.length} characters from ${file.originalname}`);

    if (!extractedText || extractedText.length < 20) {
      console.warn("❌ Extracted text too short");
      return res.status(400).json({ error: "Unable to extract enough text from the uploaded note file." });
    }

    console.log("\n📋 Step 1: Running fallback heuristic parser...");
    const fallbackStructured = parseTopicNoteHeuristics({ topicName, sourceText: extractedText });
    console.log(`✅ Fallback parser produced ${fallbackStructured.sections?.length || 0} sections`);

    console.log("\n🤖 Step 2: Sending to Gemini for AI parsing...");
    const structured = await enrichTopicNoteWithGemini({
      topicName,
      extractedText,
      fallbackStructured,
    });

    console.log("\n" + "=".repeat(80));
    console.log("✅ PARSE COMPLETE - RETURNING RESPONSE");
    console.log("=".repeat(80));

    return res.status(200).json({
      message: "Note parsed successfully.",
      data: structured,
      meta: {
        fileName: file.originalname,
        usedGemini: Boolean(process.env.GEMINI_API_KEY),
        sectionsCount: structured.sections?.length || 0,
        jambPointsCount: structured.jambFocus?.length || 0,
      },
    });
  } catch (error) {
    console.error("❌ Parse topic note file error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unable to parse note file.",
    });
  }
};

export const parseTopicNoteText = async (req, res) => {
  try {
    const topicName = normalizeText(req.body?.topicName);
    const extractedText = normalizeText(req.body?.text);

    console.log("\n" + "=".repeat(80));
    console.log("🚀 PARSE TOPIC NOTE TEXT ENDPOINT CALLED");
    console.log("=".repeat(80));
    console.log(`Topic Name: ${topicName}`);
    console.log(`Text Length: ${extractedText.length} characters`);

    if (!extractedText || extractedText.length < 20) {
      console.warn("❌ Text too short");
      return res.status(400).json({ error: "Provided text is too short or empty." });
    }

    console.log("\n📋 Step 1: Running fallback heuristic parser...");
    const fallbackStructured = parseTopicNoteHeuristics({ topicName, sourceText: extractedText });
    console.log(`✅ Fallback parser produced ${fallbackStructured.sections?.length || 0} sections`);

    console.log("\n🤖 Step 2: Sending to Gemini for AI parsing...");
    const structured = await enrichTopicNoteWithGemini({
      topicName,
      extractedText,
      fallbackStructured,
    });

    console.log("\n" + "=".repeat(80));
    console.log("✅ PARSE COMPLETE - RETURNING RESPONSE");
    console.log("=".repeat(80));

    return res.status(200).json({
      message: "Text parsed successfully.",
      data: structured,
      meta: {
        fileName: "Pasted Text",
        usedGemini: Boolean(process.env.GEMINI_API_KEY),
        sectionsCount: structured.sections?.length || 0,
        jambPointsCount: structured.jambFocus?.length || 0,
      },
    });
  } catch (error) {
    console.error("❌ Parse topic note text error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unable to parse text note.",
    });
  }
};

// Normalize incoming values so downstream validation behaves consistently.
function normalizeText(value) {
  return String(value || "").trim();
}

// Tags can come as CSV text or array; convert both to a clean string array.
function normalizeTags(value) {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeText(item)).filter(Boolean);
  }

  const text = normalizeText(value);
  if (!text) return [];
  return text.split(",").map((item) => normalizeText(item)).filter(Boolean);
}

// Keep difficulty bounded to supported enum values.
function normalizeDifficulty(value) {
  const normalized = normalizeText(value).toLowerCase();
  if (["easy", "medium", "hard"].includes(normalized)) {
    return normalized;
  }
  return "medium";
}

// Accept only the canonical objective options.
function normalizeCorrectOption(value) {
  const normalized = normalizeText(value).toUpperCase();
  if (["A", "B", "C", "D"].includes(normalized)) {
    return normalized;
  }
  return null;
}

// Resolve subject by exact name first, then by slug fallback.
async function resolveSubject(subjectName) {
  const name = normalizeText(subjectName);
  if (!name) return null;

  const subjectByName = await Subject.findOne({ name });
  if (subjectByName) return subjectByName;

  const subjectBySlug = await Subject.findOne({ slug: slugify(name) });
  if (subjectBySlug) return subjectBySlug;

  return null;
}

// Resolve topic under the chosen subject, or create a minimal shell when missing.
async function resolveOrCreateTopic({ subjectId, topicName }) {
  const normalizedTopicName = normalizeText(topicName);
  if (!normalizedTopicName) return null;

  const topicSlug = slugify(normalizedTopicName);
  let topic = await Topic.findOne({ subject: subjectId, slug: topicSlug });
  if (topic) return topic;

  topic = await Topic.findOne({ subject: subjectId, name: normalizedTopicName });
  if (topic) return topic;

  return Topic.create({
    subject: subjectId,
    name: normalizedTopicName,
    slug: topicSlug,
    summary: `Imported from admin question upload for ${normalizedTopicName}.`,
    content: `Imported topic shell for ${normalizedTopicName}.`,
    simpleExplanation: `Imported topic shell for ${normalizedTopicName}.`,
    highYieldSummary: `Imported topic shell for ${normalizedTopicName}.`,
    keyDefinitions: [],
    importantFormulasFacts: [],
    aiExplanations: {
      whyCorrectIsCorrect: null,
      whyOthersAreWrong: null,
      simpleBreakdown: null,
    },
    status: "active",
  });
}

// Validate one uploaded row and return either row-level errors or normalized payload.
function validateUploadRow(rawRow, index) {
  const rowNumber = index + 1;
  const fieldErrors = [];

  const subject = normalizeText(rawRow.subject);
  const topic = normalizeText(rawRow.topic);
  const content = normalizeText(rawRow.question || rawRow.content);
  const optionA = normalizeText(rawRow.optionA ?? rawRow.a);
  const optionB = normalizeText(rawRow.optionB ?? rawRow.b);
  const optionC = normalizeText(rawRow.optionC ?? rawRow.c);
  const optionD = normalizeText(rawRow.optionD ?? rawRow.d);
  const correctOption = normalizeCorrectOption(rawRow.correctOption || rawRow.answer);
  const examYearRaw = Number(rawRow.year ?? rawRow.examYear);
  const questionNumberRaw = Number(rawRow.questionNumber);

  if (!subject) fieldErrors.push("subject is required");
  if (!topic) fieldErrors.push("topic is required");
  if (!content) fieldErrors.push("question/content is required");
  if (!optionA || !optionB || !optionC || !optionD) fieldErrors.push("options A-D are required");
  if (!correctOption) fieldErrors.push("correctOption must be A, B, C, or D");
  if (!Number.isInteger(examYearRaw) || examYearRaw < 1978 || examYearRaw > 2100) fieldErrors.push("valid year is required");
  if (!Number.isInteger(questionNumberRaw) || questionNumberRaw <= 0) fieldErrors.push("questionNumber must be a positive integer");

  if (fieldErrors.length > 0) {
    return {
      valid: false,
      rowNumber,
      error: fieldErrors.join("; "),
    };
  }

  return {
    valid: true,
    rowNumber,
    normalized: {
      subject,
      topic,
      content,
      options: {
        A: optionA,
        B: optionB,
        C: optionC,
        D: optionD,
      },
      correctOption,
      explanation: normalizeText(rawRow.explanation) || null,
      examYear: examYearRaw,
      questionNumber: questionNumberRaw,
      paper: normalizeText(rawRow.paper) || "UTME",
      examBody: normalizeText(rawRow.examBody) || "JAMB",
      difficulty: normalizeDifficulty(rawRow.difficulty),
      tags: normalizeTags(rawRow.tags),
      sourceUrl: normalizeText(rawRow.sourceUrl) || null,
    },
  };
}

export const uploadPastQuestions = async (req, res) => {
  try {
    const { items } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Upload payload must include a non-empty items array.",
      });
    }

    if (items.length > 500) {
      return res.status(400).json({
        error: "Upload supports a maximum of 500 rows per request.",
      });
    }

    // Track per-row outcomes so admins can see exactly what imported or failed.
    const results = [];
    const touchedSubjectIds = new Set();
    let importedCount = 0;
    let skippedCount = 0;

    // Process row-by-row so bad rows can be skipped without aborting the whole upload.
    for (let index = 0; index < items.length; index += 1) {
      const parsed = validateUploadRow(items[index], index);

      if (!parsed.valid) {
        skippedCount += 1;
        results.push({ row: parsed.rowNumber, status: "skipped", reason: parsed.error });
        continue;
      }

      const row = parsed.normalized;
      const subject = await resolveSubject(row.subject);
      if (!subject) {
        skippedCount += 1;
        results.push({ row: parsed.rowNumber, status: "skipped", reason: `Unknown subject: ${row.subject}` });
        continue;
      }

      const topic = await resolveOrCreateTopic({ subjectId: subject._id, topicName: row.topic });
      if (!topic) {
        skippedCount += 1;
        results.push({ row: parsed.rowNumber, status: "skipped", reason: `Unable to resolve topic: ${row.topic}` });
        continue;
      }

      // Upsert canonical Question record keyed by subject/topic/year/question-number.
      const questionDoc = await Question.findOneAndUpdate(
        {
          subject: subject._id,
          topic: topic._id,
          "sourceMeta.examYear": row.examYear,
          "sourceMeta.questionNumber": row.questionNumber,
        },
        {
          subject: subject._id,
          topic: topic._id,
          sourceType: "past-question",
          questionType: "objective",
          content: row.content,
          options: row.options,
          correctOption: row.correctOption,
          explanation: row.explanation,
          difficulty: row.difficulty,
          tags: row.tags,
          status: "published",
          sourceMeta: {
            examBody: row.examBody,
            examYear: row.examYear,
            paper: row.paper,
            questionNumber: row.questionNumber,
            sourceUrl: row.sourceUrl,
          },
          isPastQuestion: true,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );

      // Upsert PastQuestion source record and link back to the canonical Question.
      await PastQuestion.findOneAndUpdate(
        {
          subject: subject._id,
          topic: topic._id,
          examYear: row.examYear,
          questionNumber: row.questionNumber,
        },
        {
          subject: subject._id,
          topic: topic._id,
          examBody: row.examBody,
          examYear: row.examYear,
          paper: row.paper,
          questionNumber: row.questionNumber,
          content: row.content,
          options: row.options,
          correctOption: row.correctOption,
          explanation: row.explanation,
          sourceUrl: row.sourceUrl,
          tags: row.tags,
          mappedQuestion: questionDoc._id,
          status: "imported",
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );

      touchedSubjectIds.add(String(subject._id));
      importedCount += 1;
      results.push({ row: parsed.rowNumber, status: "imported", subject: subject.name, topic: topic.name });
    }

    // Recompute subject-level counters for dashboard/admin analytics consistency.
    const touchedSubjectIdsArray = Array.from(touchedSubjectIds);
    for (const subjectId of touchedSubjectIdsArray) {
      const [questionCount, totalPastQuestions] = await Promise.all([
        Question.countDocuments({ subject: subjectId }),
        PastQuestion.countDocuments({ subject: subjectId }),
      ]);

      await Subject.updateOne(
        { _id: subjectId },
        {
          $set: {
            "metadata.questionCount": questionCount,
            "metadata.totalPastQuestions": totalPastQuestions,
          },
        },
      );
    }

    return res.status(200).json({
      message: "Past question upload completed.",
      summary: {
        totalRows: items.length,
        importedCount,
        skippedCount,
      },
      results,
    });
  } catch (error) {
    console.error("Upload past questions error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unable to upload past questions.",
    });
  }
};

function buildAutoSolvePrompt(questionData) {
  const { questionBody, optionA, optionB, optionC, optionD, correctOption, subject } = questionData;

  return `You are a senior Nigerian UTME/JAMB examiner and curriculum expert with over 25 years of experience setting, solving, and reviewing JAMB questions across all major subjects.

Your task is to solve and explain a JAMB past question that is being uploaded into a CBT practice platform. The explanation you generate will be permanently stored in the database and shown directly to students whenever they click "View Explanation."

This is NOT a live tutoring session. Your explanation must therefore be complete, clear, vivid, and reusable for thousands of students without requiring additional AI follow-up.

Your goal is to:
- Identify the correct answer accurately
- Explain the concept clearly and deeply
- Explain why the correct answer is correct
- Explain why the other options are wrong
- Help students truly understand the topic instead of memorising blindly
- Make the explanation simple enough for an average Nigerian secondary school student to understand easily

IMPORTANT FORMATTING RULES:
- No backticks
- Use clear and simple English
- Avoid sounding robotic or overly academic
- Be educational and precise
- For calculation questions, show all formulas, substitutions, and arithmetic steps clearly
- For theory questions, explain the underlying principle properly
- Use familiar Nigerian examples where useful
- If unsure about the correct answer, mention your confidence level

The explanation must feel like a brilliant teacher patiently breaking the concept down step by step until the student fully understands it.

QUESTION SUBJECT: ${subject || "General"}

QUESTION DATA:
Question: ${questionBody}

Options:
A. ${optionA}
B. ${optionB}
C. ${optionC}
D. ${optionD}

Correct Answer: ${correctOption}

Please provide your response in the following JSON format (no markdown, no code blocks, just pure JSON):
{
  "correct_answer": "${correctOption}",
  "confidence": "high|medium|low",
  "full_explanation": "Complete multi-paragraph explanation teaching the concept from foundation, explaining the reasoning clearly, removing confusion, exposing common JAMB traps, and helping students solve similar questions independently in future",
  "why_correct": "Specific explanation of why option ${correctOption} is correct",
  "why_others_wrong": {
    "A": "Why A is wrong (if not correct)",
    "B": "Why B is wrong (if not correct)",
    "C": "Why C is wrong (if not correct)",
    "D": "Why D is wrong (if not correct)"
  },
  "key_concept": "The main concept being tested",
  "common_mistakes": "Common errors students make on this type of question",
  "exam_tip": "A memory aid, trick, or pattern to help students recognize and solve similar questions quickly"
}

CRITICAL: Return ONLY the JSON object - no markdown, no code blocks, no explanation before or after. Make sure the full_explanation is comprehensive, teaches the concept deeply, and would be sufficient for a student to understand this topic.`;
}

export const autoSolveQuestion = async (req, res) => {
  try {
    const { questionBody, optionA, optionB, optionC, optionD, correctOption, subject } = req.body || {};

    console.log("\n" + "=".repeat(80));
    console.log("🤖 AUTO-SOLVE QUESTION ENDPOINT CALLED");
    console.log("=".repeat(80));
    console.log(`Subject: ${subject || "General"}`);
    console.log(`Question length: ${String(questionBody || "").length} characters`);
    console.log(`Correct Answer: ${correctOption}`);

    // Validate inputs
    if (!questionBody || String(questionBody).trim().length < 10) {
      return res.status(400).json({ error: "Question body must be at least 10 characters." });
    }

    if (!optionA || !optionB || !optionC || !optionD) {
      return res.status(400).json({ error: "All four options (A, B, C, D) are required." });
    }

    if (!["A", "B", "C", "D"].includes(String(correctOption).toUpperCase())) {
      return res.status(400).json({ error: "Correct answer must be A, B, C, or D." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: "AI service not available. Please configure GEMINI_API_KEY." });
    }

    console.log("\n📤 Building prompt for Gemini...");
    const prompt = buildAutoSolvePrompt({
      questionBody: String(questionBody).trim(),
      optionA: String(optionA).trim(),
      optionB: String(optionB).trim(),
      optionC: String(optionC).trim(),
      optionD: String(optionD).trim(),
      correctOption: String(correctOption).toUpperCase(),
      subject: String(subject || "").trim(),
    });

    console.log(`✅ Prompt built, sending to Gemini...`);
    console.log(`Prompt preview (first 400 chars): ${prompt.slice(0, 400)}...`);

    const startTime = Date.now();
    console.log("⏳ Waiting for Gemini API response...");

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.25,
          topP: 0.95,
          topK: 20,
          maxOutputTokens: 2048,
        },
      }),
    });

    const responseTime = Date.now() - startTime;
    console.log(`✅ Gemini responded in ${responseTime}ms`);
    console.log(`Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      console.error(`❌ API Error: ${response.status} ${response.statusText}`);
      const errorBody = await response.json().catch(() => ({}));
      console.error("Error details:", errorBody);
      return res.status(502).json({
        error: "AI service temporarily unavailable. Please try again.",
      });
    }

    const body = await response.json().catch((err) => {
      console.error("❌ Failed to parse Gemini response JSON:", err.message);
      return {};
    });

    const candidateText = body?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    console.log("\n📥 GEMINI RESPONSE (RAW TEXT):");
    console.log("─".repeat(80));
    console.log(candidateText.slice(0, 800));
    if (candidateText.length > 800) {
      console.log(`\n... (${candidateText.length - 800} more characters)\n`);
    }

    const parsed = extractJsonFromText(candidateText);

    if (!parsed || typeof parsed !== "object") {
      console.error("❌ Failed to extract valid JSON from Gemini response");
      console.log("Raw response:", candidateText);
      return res.status(502).json({
        error: "Invalid response format from AI service. Please try again.",
      });
    }

    console.log("\n" + "─".repeat(80));
    console.log("✅ SUCCESSFULLY PARSED EXPLANATION:");
    console.log("─".repeat(80));
    console.log(`Correct Answer: ${parsed.correct_answer}`);
    console.log(`Confidence: ${parsed.confidence}`);
    console.log(`Key Concept: ${parsed.key_concept}`);
    console.log(`Full Explanation (first 300 chars): ${String(parsed.full_explanation || "").slice(0, 300)}...`);
    console.log(`Common Mistakes: ${String(parsed.common_mistakes || "").slice(0, 100)}...`);
    console.log(`Exam Tip: ${String(parsed.exam_tip || "").slice(0, 100)}...`);
    console.log("\n" + "=".repeat(80) + "\n");

    // Return the full explanation as the primary content
    return res.status(200).json({
      message: "Question solved successfully.",
      data: {
        explanation: String(parsed.full_explanation || "").trim(),
        correctAnswer: String(parsed.correct_answer || correctOption).toUpperCase(),
        confidence: String(parsed.confidence || "high").toLowerCase(),
        keyConcept: String(parsed.key_concept || "").trim(),
        whyCorrect: String(parsed.why_correct || "").trim(),
        whyOthersWrong: parsed.why_others_wrong || {
          A: "",
          B: "",
          C: "",
          D: "",
        },
        commonMistakes: String(parsed.common_mistakes || "").trim(),
        examTip: String(parsed.exam_tip || "").trim(),
      },
      meta: {
        responseTime: `${responseTime}ms`,
        model: "gemini-1.5-flash",
      },
    });
  } catch (error) {
    console.error("❌ Auto-solve question error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unable to generate explanation.",
    });
  }
};

