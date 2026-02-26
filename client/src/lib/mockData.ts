import type { Subject, Topic, Question } from "../types";

// Mock data for demo purposes
export const mockSubjects: Subject[] = [
  {
    id: 1,
    name: "Mathematics",
    slug: "mathematics",
    icon: "Calculator",
  },
  {
    id: 2,
    name: "Physics",
    slug: "physics",
    icon: "Atom",
  },
  {
    id: 3,
    name: "Chemistry",
    slug: "chemistry",
    icon: "Flask",
  },
  {
    id: 4,
    name: "Biology",
    slug: "biology",
    icon: "Microscope",
  },
];

export const mockTopics: Topic[] = [
  {
    id: 1,
    subjectId: 1,
    name: "Calculus",
    slug: "calculus",
    isHighYield: true,
    content: "# Calculus\n\nCalculus is a branch of mathematics that deals with rates of change and accumulation.",
    summary: "Core mathematical concepts for advanced problem solving",
    commonTraps: ["Forgetting the chain rule", "Sign errors in derivatives"],
  },
  {
    id: 2,
    subjectId: 1,
    name: "Linear Algebra",
    slug: "linear-algebra",
    isHighYield: true,
    content: "# Linear Algebra\n\nLinear algebra is the study of vectors, matrices, and linear transformations.",
    summary: "Essential for understanding systems of equations and transformations",
  },
  {
    id: 3,
    subjectId: 2,
    name: "Mechanics",
    slug: "mechanics",
    isHighYield: true,
    content: "# Mechanics\n\nMechanics is the branch of physics that deals with motion and forces.",
    summary: "Fundamental physics principles governing motion",
  },
  {
    id: 4,
    subjectId: 3,
    name: "Organic Chemistry",
    slug: "organic-chemistry",
    isHighYield: true,
    content: "# Organic Chemistry\n\nOrganic chemistry studies carbon-containing compounds.",
    summary: "Chemistry of carbon compounds and their reactions",
  },
];

export const mockQuestions: Question[] = [
  {
    id: 1,
    topicId: 1,
    content: "What is the derivative of x²?",
    options: {
      A: "x",
      B: "2x",
      C: "x²",
      D: "2x²",
    },
    correctOption: "B",
    explanation: "The derivative of x² is 2x using the power rule.",
  },
  {
    id: 2,
    topicId: 1,
    content: "What is the integral of 2x?",
    options: {
      A: "x²",
      B: "x² + C",
      C: "2",
      D: "2x²",
    },
    correctOption: "B",
    explanation: "The integral of 2x is x² + C, where C is the constant of integration.",
  },
];