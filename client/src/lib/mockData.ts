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
  {
    id: 5,
    name: "Use of English",
    slug: "use-of-english",
    icon: "BookOpen",
  },
  {
    id: 6,
    name: "Economics",
    slug: "economics",
    icon: "TrendingUp",
  },
  {
    id: 7,
    name: "Government",
    slug: "government",
    icon: "Landmark",
  },
  {
    id: 8,
    name: "Literature in English",
    slug: "literature-in-english",
    icon: "ScrollText",
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
    id: 5,
    subjectId: 1,
    name: "Probability and Statistics",
    slug: "probability-and-statistics",
    isHighYield: true,
    content: "# Probability and Statistics\n\nLearn events, probability laws, and interpretation of data sets.",
    summary: "Frequently tested data interpretation and probability questions",
  },
  {
    id: 6,
    subjectId: 1,
    name: "Trigonometry",
    slug: "trigonometry",
    isHighYield: false,
    content: "# Trigonometry\n\nCore trig identities, ratios, and angle relationships.",
    summary: "Angle and identity manipulation for mixed questions",
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
    id: 7,
    subjectId: 2,
    name: "Waves and Sound",
    slug: "waves-and-sound",
    isHighYield: true,
    content: "# Waves and Sound\n\nStudy wave properties, sound propagation, and resonance.",
    summary: "Common objective questions around wave equations and sound behavior",
  },
  {
    id: 8,
    subjectId: 2,
    name: "Electricity and Magnetism",
    slug: "electricity-and-magnetism",
    isHighYield: true,
    content: "# Electricity and Magnetism\n\nCurrent, voltage, electric fields, and magnetic effects.",
    summary: "Core formulas and circuit interpretation",
  },
  {
    id: 9,
    subjectId: 2,
    name: "Thermal Physics",
    slug: "thermal-physics",
    isHighYield: false,
    content: "# Thermal Physics\n\nHeat transfer, temperature scales, and gas laws.",
    summary: "Conceptual and formula-based heat questions",
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
  {
    id: 10,
    subjectId: 3,
    name: "Chemical Equilibrium",
    slug: "chemical-equilibrium",
    isHighYield: true,
    content: "# Chemical Equilibrium\n\nEquilibrium constants, Le Chatelier principle, and reaction shifts.",
    summary: "Very frequent in JAMB chemistry sections",
  },
  {
    id: 11,
    subjectId: 3,
    name: "Stoichiometry",
    slug: "stoichiometry",
    isHighYield: true,
    content: "# Stoichiometry\n\nMole concept, balancing equations, and yield calculations.",
    summary: "Calculation-heavy area with high scoring potential",
  },
  {
    id: 12,
    subjectId: 3,
    name: "Separation Techniques",
    slug: "separation-techniques",
    isHighYield: false,
    content: "# Separation Techniques\n\nFiltration, distillation, chromatography, and extraction.",
    summary: "Foundational practical chemistry principles",
  },
  {
    id: 99,
    subjectId: 3,
    name: "Atomic Theory and Chemical Bonding",
    slug: "atomic-theory-chemical-bonding",
    isHighYield: true,
    simpleExplanation: `ATOMIC THEORY AND CHEMICAL BONDING

Reference: Lamlad SSCE & UTME Chemistry by FO Ayinde & FOI Asubiojo
JAMB Focus: Atomic Structure, Electronic Configuration, Chemical Bonding, Shapes of Molecules

---

DALTON'S ATOMIC THEORY (1808)

John Dalton proposed that all matter is made up of tiny indivisible particles called atoms. Atoms of the same element are identical in mass and properties. Compounds are formed when atoms of different elements combine in fixed ratios. Chemical reactions involve the rearrangement of atoms, not their creation or destruction.

AI EXPLANATION: Imagine you have a bag of white beans and a bag of brown beans. Dalton said each bean represents an atom. All white beans are exactly the same size and weight. You can mix 2 white beans with 1 brown bean to make a small pile (a compound). If you separate them, you still have the same beans. You cannot turn a white bean into a brown bean, and you cannot destroy a bean. This is how atoms behave in chemical reactions.

---

J.J. THOMSON'S MODEL (1897)

Thomson discovered the electron using a cathode ray tube. He proposed the plum pudding model, where negatively charged electrons were embedded in a sphere of positive charge like plums in a pudding.

AI EXPLANATION: Have you ever eaten a Nigerian puff puff? The dough is like the positive charge, and the small pieces of onion or pepper inside are like the negative electrons. Thomson thought the atom was a ball of positive dough with tiny negative particles scattered inside. He discovered this by passing electricity through a glass tube and seeing a ray that bent towards a positive magnet, proving negative particles exist.

JAMB POINT: Thomson discovered the electron but did not discover the nucleus or proton.

---

RUTHERFORD'S MODEL (1911)

Rutherford performed the gold foil experiment. He fired alpha particles (positive) at a very thin gold foil. Most particles passed straight through, but some were deflected and a few even bounced back. He concluded that the atom has a small, dense, positively charged nucleus at its centre, with electrons orbiting around it. Most of the atom is empty space.

AI EXPLANATION: Imagine you are playing football in a dark room. You kick the ball towards the goal. Most of the time the ball goes in because the goal is empty space. But sometimes the ball hits the goalpost and bounces back. That tells you there is something hard and solid there. This is exactly what Rutherford saw. Most alpha particles passed through the gold foil because atoms are mostly empty space. But a few hit something hard (the nucleus) and bounced back. This proved that every atom has a tiny, heavy, positive centre called the nucleus.

JAMB POINT: This experiment proved the existence of the nucleus and that most of the atom is empty space.

---

BOHR'S MODEL (1913)

Bohr proposed that electrons move in fixed circular paths called energy levels or shells around the nucleus. Each shell has a fixed energy. Electrons can jump to higher shells when they gain energy and fall back to lower shells when they lose energy, emitting light.

AI EXPLANATION: Imagine a popular Lagos bus park. The buses (electrons) cannot park just anywhere. They must park in specific rows (shells). Row 1 is closest to the office, Row 2 is farther, Row 3 is farthest. A bus cannot stop between rows. If you give a bus fuel (energy), it can move from Row 1 to Row 3. When it comes back to Row 1, it releases light. This is why when you heat sodium chloride on a fire, it produces a yellow flame.

JAMB POINT: Bohr's model explained the line spectra of hydrogen atoms.

---

SUBATOMIC PARTICLES

The atom consists of three main subatomic particles: protons, neutrons, and electrons. Protons have a positive charge and are found in the nucleus. Neutrons have no charge (neutral) and are also in the nucleus. Electrons have a negative charge and move around the nucleus in shells.

AI EXPLANATION: Think of the nucleus as the engine room of a ship. Inside the engine room, you have two types of workers: protons (positive) and neutrons (neutral). Protons are like strong men who attract electrons. Neutrons are like security guards who keep protons from fighting each other (because protons would repel each other without neutrons). Outside the engine room, the sailors (electrons) run around the deck. How many protons are in the nucleus tells you what element it is. If you have 1 proton, it is hydrogen. If you have 6 protons, it is carbon. If you have 8 protons, it is oxygen.

---

ATOMIC NUMBER AND MASS NUMBER

Atomic number (Z) is the number of protons in the nucleus. It determines the identity of the element. In a neutral atom, the number of electrons equals the number of protons.

Mass number (A) is the total number of protons and neutrons in the nucleus.

Number of neutrons = Mass number - Atomic number

AI EXPLANATION: Every element has a unique ID card called atomic number. If you see a person with ID number 1, you know it is hydrogen. ID number 6 is carbon. ID number 8 is oxygen. You cannot change the atomic number without changing the element. The mass number is like the total weight of the nucleus. To find how many neutrons are inside, you subtract the ID number (protons) from the total weight (mass number). For example, if carbon has mass number 12 and atomic number 6, then neutrons = 12 - 6 = 6 neutrons.

---

ISOTOPES

Isotopes are atoms of the same element that have the same atomic number (same number of protons) but different mass numbers (different numbers of neutrons).

Examples: Carbon-12 (6 protons, 6 neutrons), Carbon-13 (6 protons, 7 neutrons), Carbon-14 (6 protons, 8 neutrons)

Isotopes have similar chemical properties but different physical properties such as density and boiling point.

AI EXPLANATION: Imagine two identical twin brothers. They look exactly the same (same number of protons), so they behave the same way in social situations (chemical properties). But one brother weighs 70 kg and the other weighs 75 kg because one has more muscle (more neutrons). Their different weights affect physical things like how fast they run (physical properties). Carbon-14 is heavier and radioactive. Scientists use Carbon-14 to find the age of old bones and fossils.

JAMB POINT: Isotopes have the same chemical properties because they have the same number of electrons in the outer shell.

---

ELECTRONIC CONFIGURATION

Electrons are arranged in energy levels or shells around the nucleus. The maximum number of electrons in each shell is given by 2n² where n is the shell number.

Shell 1 (K shell): maximum 2 electrons
Shell 2 (L shell): maximum 8 electrons
Shell 3 (M shell): maximum 18 electrons
Shell 4 (N shell): maximum 32 electrons

Electrons fill from the innermost shell outward. The outermost shell is called the valence shell, and the electrons in it are called valence electrons.

AI EXPLANATION: Imagine a bus with seats. The first row (K) has only 2 seats. Once those 2 seats are filled, the next passengers must sit in the second row (L), which has 8 seats. After L is full, they go to the third row (M) with 18 seats. You cannot put a passenger in the third row if the first two rows still have empty seats. Electrons behave the same way. How many electrons are in the last row (valence electrons) determines how the atom will react with other atoms.

JAMB POINT: The group number of an element in the periodic table equals the number of valence electrons.`,
    highYieldSummary: "Atomic Theory and Chemical Bonding is a priority topic for UTME preparation. Master atomic models, electronic configuration, and bonding types.",
    summary: "Foundational chemistry covering atomic structure, electron configuration, and chemical bonding types",
    keyDefinitions: [
      "Atoms: Tiny indivisible particles that make up all matter",
      "Electrons: Negatively charged subatomic particles orbiting the nucleus",
      "Nucleus: The dense, positively charged center of an atom containing protons and neutrons",
      "Isotopes: Atoms with same protons but different neutrons",
      "Valence electrons: Electrons in the outermost shell determining chemical properties"
    ],
    learningGoals: [
      "Understand the historical development of atomic models from Dalton to Bohr",
      "Explain the structure and components of atoms",
      "Distinguish between atomic number and mass number",
      "Understand electronic configuration and orbital shells",
      "Recognize the importance of valence electrons in chemical bonding"
    ],
    prerequisites: [
      "Basic understanding of matter and energy",
      "Familiarity with the periodic table",
      "Knowledge of basic chemical notation"
    ],
    jambFocus: [
      "Rutherford's gold foil experiment",
      "Bohr's atomic model",
      "Electronic configuration (K, L, M, N shells)",
      "Valence electrons and group numbers",
      "Isotopes and their properties",
      "Mass number and atomic number calculations"
    ]
  },
  {
    id: 13,
    subjectId: 4,
    name: "Ecology",
    slug: "ecology",
    isHighYield: true,
    content: "# Ecology\n\nStudy ecosystems, food chains, and population dynamics.",
    summary: "Frequent direct theory questions",
  },
  {
    id: 14,
    subjectId: 4,
    name: "Genetics",
    slug: "genetics",
    isHighYield: true,
    content: "# Genetics\n\nInheritance patterns, chromosomes, and variation.",
    summary: "Punnett-square and inheritance reasoning",
  },
  {
    id: 15,
    subjectId: 4,
    name: "Human Physiology",
    slug: "human-physiology",
    isHighYield: false,
    content: "# Human Physiology\n\nBody systems and biological regulation.",
    summary: "System function and adaptation principles",
  },
  {
    id: 16,
    subjectId: 5,
    name: "Lexis and Structure",
    slug: "lexis-and-structure",
    isHighYield: true,
    content: "# Lexis and Structure\n\nGrammar, usage, and sentence completion strategies.",
    summary: "High-frequency grammar and usage corrections",
    highYieldSummary: "Lexis and Structure appears frequently in UTME and rewards precise grammar and word-choice skills.",
    keyDefinitions: [
      "Lexis: the vocabulary choices used in context.",
      "Structure: the grammatical arrangement of words in a sentence.",
    ],
    simpleExplanation: "Lexis and Structure tests how correctly you can choose words and form grammatically sound sentences. Focus on agreement, tense consistency, modifiers, and punctuation cues.",
    importantFormulasFacts: [
      "Ensure subject-verb agreement first before checking other options.",
      "Use context clues to resolve near-synonym confusion.",
      "Eliminate options with tense mismatch or faulty parallel structure.",
    ],
    aiExplanations: {
      whyCorrectIsCorrect: "The correct answer satisfies grammar rules and best fits sentence context and meaning.",
      whyOthersAreWrong: "Distractors usually violate agreement, tense flow, idiomatic usage, or logical meaning.",
      simpleBreakdown: "1) Find grammar anchor. 2) Check context meaning. 3) Remove structurally wrong options.",
    },
  },
  {
    id: 17,
    subjectId: 5,
    name: "Comprehension",
    slug: "english-comprehension",
    isHighYield: true,
    content: "# Comprehension\n\nReading passages and extracting meaning accurately.",
    summary: "Inference and direct meaning questions",
    highYieldSummary: "Comprehension tests speed, accuracy, and ability to infer meaning from passage context.",
    keyDefinitions: [
      "Main idea: the central message of the passage.",
      "Inference: a conclusion drawn from implied information.",
    ],
    simpleExplanation: "Read the question first, then scan the relevant paragraph. Match options to evidence in the passage, not assumptions.",
    importantFormulasFacts: [
      "Answer must be supported by text evidence.",
      "Eliminate extreme options not aligned with tone/context.",
    ],
    aiExplanations: {
      whyCorrectIsCorrect: "The right option is directly stated or strongly implied by the exact lines in the passage.",
      whyOthersAreWrong: "Wrong options add outside assumptions or distort the author's tone and scope.",
      simpleBreakdown: "1) Locate evidence line. 2) Compare each option to text. 3) Pick the closest supported meaning.",
    },
  },
  {
    id: 18,
    subjectId: 5,
    name: "Oral English",
    slug: "oral-english",
    isHighYield: false,
    content: "# Oral English\n\nStress, intonation, and pronunciation patterns.",
    summary: "Pronunciation and stress placement questions",
    highYieldSummary: "Oral English focuses on pronunciation patterns, stress placement, and intonation awareness.",
    keyDefinitions: [
      "Stress: emphasis placed on a syllable in a word.",
      "Intonation: rise and fall of voice during speech.",
    ],
    simpleExplanation: "Learn common stress patterns and compare sound contrasts repeatedly. Practice with minimal pairs and spoken examples.",
    importantFormulasFacts: [
      "Nouns and verbs with similar spelling can have different stress patterns.",
      "Context helps resolve intonation-based meaning in questions.",
    ],
    aiExplanations: {
      whyCorrectIsCorrect: "The correct option follows accepted pronunciation/stress conventions used in standard English.",
      whyOthersAreWrong: "Other options usually stress the wrong syllable or confuse similar sounding forms.",
      simpleBreakdown: "1) Break word into syllables. 2) Apply known stress pattern. 3) Validate with pronunciation rule.",
    },
  },
  {
    id: 19,
    subjectId: 6,
    name: "Demand and Supply",
    slug: "demand-and-supply",
    isHighYield: true,
    content: "# Demand and Supply\n\nMarket equilibrium, shifts, and elasticity basics.",
    summary: "Foundational and repeatedly tested market theory",
  },
  {
    id: 20,
    subjectId: 6,
    name: "National Income",
    slug: "national-income",
    isHighYield: true,
    content: "# National Income\n\nGDP concepts, measurement methods, and limitations.",
    summary: "Computation and concept-based objective items",
  },
  {
    id: 21,
    subjectId: 6,
    name: "Money and Banking",
    slug: "money-and-banking",
    isHighYield: false,
    content: "# Money and Banking\n\nCentral bank tools and monetary policy.",
    summary: "Policy and institution-based questions",
  },
  {
    id: 22,
    subjectId: 7,
    name: "Constitutional Development",
    slug: "constitutional-development",
    isHighYield: true,
    content: "# Constitutional Development\n\nEvolution of constitutional frameworks in Nigeria.",
    summary: "Timeline and feature-based question pattern",
  },
  {
    id: 23,
    subjectId: 7,
    name: "Arms of Government",
    slug: "arms-of-government",
    isHighYield: true,
    content: "# Arms of Government\n\nExecutive, legislature, judiciary and checks/balances.",
    summary: "Direct role and function comparison questions",
  },
  {
    id: 24,
    subjectId: 7,
    name: "Citizenship and Rule of Law",
    slug: "citizenship-and-rule-of-law",
    isHighYield: false,
    content: "# Citizenship and Rule of Law\n\nRights, duties, and legal order fundamentals.",
    summary: "Conceptual civic and governance questions",
  },
  {
    id: 25,
    subjectId: 8,
    name: "Poetry",
    slug: "poetry",
    isHighYield: true,
    content: "# Poetry\n\nThemes, devices, and interpretation skills for selected poems.",
    summary: "Imagery, tone, and theme recognition",
  },
  {
    id: 26,
    subjectId: 8,
    name: "Drama",
    slug: "drama",
    isHighYield: true,
    content: "# Drama\n\nPlot, characterization, and dramatic techniques.",
    summary: "Text interpretation and character analysis",
  },
  {
    id: 27,
    subjectId: 8,
    name: "Prose",
    slug: "prose",
    isHighYield: false,
    content: "# Prose\n\nNarrative techniques and thematic interpretation.",
    summary: "Comprehension of prose passages and set texts",
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