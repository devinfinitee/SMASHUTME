import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import ReactMarkdown from "react-markdown";
import { useTopic, useUpdateProgress } from "@/hooks/use-topics";
import { AiHelper } from "@/components/ai-helper";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/app-shell";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Lightbulb,
  Sparkles,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function TopicStudy() {
  const [, params] = useRoute("/topics/:slug");
  const { data: topic, isLoading } = useTopic(params?.slug || "");
  const { mutate: updateProgress } = useUpdateProgress();
  const [activeTab, setActiveTab] = useState<"notes" | "questions">("notes");
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);

  // Mock topic for testing - remove later
  const mockTopic = {
    _id: "test-123",
    name: "Atomic Theory and Chemical Bonding",
    slug: "atomic-theory-chemical-bonding",
    subject: {
      name: "Chemistry",
      slug: "chemistry",
    },
    simpleExplanation: `ATOMIC THEORY AND CHEMICAL BONDING

Reference: Lamlad SSCE & UTME Chemistry by FO Ayinde & FOI Asubiojo
JAMB Focus: Atomic Structure, Electronic Configuration, Chemical Bonding, Shapes of Molecules

DALTON'S ATOMIC THEORY (1808)

John Dalton proposed that all matter is made up of tiny indivisible particles called atoms. Atoms of the same element are identical in mass and properties. Compounds are formed when atoms of different elements combine in fixed ratios. Chemical reactions involve the rearrangement of atoms, not their creation or destruction.

AI EXPLANATION: Imagine you have a bag of white beans and a bag of brown beans. Dalton said each bean represents an atom. All white beans are exactly the same size and weight. You can mix 2 white beans with 1 brown bean to make a small pile (a compound). If you separate them, you still have the same beans. You cannot turn a white bean into a brown bean, and you cannot destroy a bean. This is how atoms behave in chemical reactions.

J.J. THOMSON'S MODEL (1897)

Thomson discovered the electron using a cathode ray tube. He proposed the plum pudding model, where negatively charged electrons were embedded in a sphere of positive charge like plums in a pudding.

AI EXPLANATION: Have you ever eaten a Nigerian puff puff? The dough is like the positive charge, and the small pieces of onion or pepper inside are like the negative electrons. Thomson thought the atom was a ball of positive dough with tiny negative particles scattered inside. He discovered this by passing electricity through a glass tube and seeing a ray that bent towards a positive magnet, proving negative particles exist.

JAMB POINT: Thomson discovered the electron but did not discover the nucleus or proton.

RUTHERFORD'S MODEL (1911)

Rutherford performed the gold foil experiment. He fired alpha particles (positive) at a very thin gold foil. Most particles passed straight through, but some were deflected and a few even bounced back. He concluded that the atom has a small, dense, positively charged nucleus at its centre, with electrons orbiting around it. Most of the atom is empty space.

AI EXPLANATION: Imagine you are playing football in a dark room. You kick the ball towards the goal. Most of the time the ball goes in because the goal is empty space. But sometimes the ball hits the goalpost and bounces back. That tells you there is something hard and solid there. This is exactly what Rutherford saw. Most alpha particles passed through the gold foil because atoms are mostly empty space. But a few hit something hard (the nucleus) and bounced back. This proved that every atom has a tiny, heavy, positive centre called the nucleus.

JAMB POINT: This experiment proved the existence of the nucleus and that most of the atom is empty space.

BOHR'S MODEL (1913)

Bohr proposed that electrons move in fixed circular paths called energy levels or shells around the nucleus. Each shell has a fixed energy. Electrons can jump to higher shells when they gain energy and fall back to lower shells when they lose energy, emitting light.

AI EXPLANATION: Imagine a popular Lagos bus park. The buses (electrons) cannot park just anywhere. They must park in specific rows (shells). Row 1 is closest to the office, Row 2 is farther, Row 3 is farthest. A bus cannot stop between rows. If you give a bus fuel (energy), it can move from Row 1 to Row 3. When it comes back to Row 1, it releases light. This is why when you heat sodium chloride on a fire, it produces a yellow flame.

JAMB POINT: Bohr's model explained the line spectra of hydrogen atoms.

SUBATOMIC PARTICLES

The atom consists of three main subatomic particles: protons, neutrons, and electrons. Protons have a positive charge and are found in the nucleus. Neutrons have no charge (neutral) and are also in the nucleus. Electrons have a negative charge and move around the nucleus in shells.

AI EXPLANATION: Think of the nucleus as the engine room of a ship. Inside the engine room, you have two types of workers: protons (positive) and neutrons (neutral). Protons are like strong men who attract electrons. Neutrons are like security guards who keep protons from fighting each other (because protons would repel each other without neutrons). Outside the engine room, the sailors (electrons) run around the deck. How many protons are in the nucleus tells you what element it is. If you have 1 proton, it is hydrogen. If you have 6 protons, it is carbon. If you have 8 protons, it is oxygen.

ATOMIC NUMBER AND MASS NUMBER

Atomic number (Z) is the number of protons in the nucleus. It determines the identity of the element. In a neutral atom, the number of electrons equals the number of protons.

Mass number (A) is the total number of protons and neutrons in the nucleus.

Number of neutrons = Mass number - Atomic number

AI EXPLANATION: Every element has a unique ID card called atomic number. If you see a person with ID number 1, you know it is hydrogen. ID number 6 is carbon. ID number 8 is oxygen. You cannot change the atomic number without changing the element. The mass number is like the total weight of the nucleus. To find how many neutrons are inside, you subtract the ID number (protons) from the total weight (mass number). For example, if carbon has mass number 12 and atomic number 6, then neutrons = 12 - 6 = 6 neutrons.

ISOTOPES

Isotopes are atoms of the same element that have the same atomic number (same number of protons) but different mass numbers (different numbers of neutrons).

Examples: Carbon-12 (6 protons, 6 neutrons), Carbon-13 (6 protons, 7 neutrons), Carbon-14 (6 protons, 8 neutrons)

Isotopes have similar chemical properties but different physical properties such as density and boiling point.

AI EXPLANATION: Imagine two identical twin brothers. They look exactly the same (same number of protons), so they behave the same way in social situations (chemical properties). But one brother weighs 70 kg and the other weighs 75 kg because one has more muscle (more neutrons). Their different weights affect physical things like how fast they run (physical properties). Carbon-14 is heavier and radioactive. Scientists use Carbon-14 to find the age of old bones and fossils.

JAMB POINT: Isotopes have the same chemical properties because they have the same number of electrons in the outer shell.

ELECTRONIC CONFIGURATION

Electrons are arranged in energy levels or shells around the nucleus. The maximum number of electrons in each shell is given by 2n² where n is the shell number.

Shell 1 (K shell): maximum 2 electrons
Shell 2 (L shell): maximum 8 electrons
Shell 3 (M shell): maximum 18 electrons
Shell 4 (N shell): maximum 32 electrons

Electrons fill from the innermost shell outward. The outermost shell is called the valence shell, and the electrons in it are called valence electrons.

AI EXPLANATION: Imagine a bus with seats. The first row (K) has only 2 seats. Once those 2 seats are filled, the next passengers must sit in the second row (L), which has 8 seats. After L is full, they go to the third row (M) with 18 seats. You cannot put a passenger in the third row if the first two rows still have empty seats. Electrons behave the same way. How many electrons are in the last row (valence electrons) determines how the atom will react with other atoms.

JAMB POINT: The group number of an element in the periodic table equals the number of valence electrons.

OCTET RULE

The octet rule states that atoms bond to achieve a stable electronic configuration of 8 electrons in their outermost shell. Hydrogen and helium achieve a duplet rule of 2 electrons.

AI EXPLANATION: Why do atoms want to bond? Because they want to be like the rich, stable people called noble gases (Helium, Neon, Argon). Noble gases have 8 electrons in their outer shell (or 2 for Helium), so they are happy and do not react with anyone. Other atoms are not happy because their outer shell is not full. They will do anything to get 8 electrons. Some atoms will give away their extra electrons (metals like sodium). Some atoms will take electrons from others (non-metals like chlorine). Some atoms will share electrons with others (like carbon and hydrogen). The goal is always the same: get 8 electrons in the outer shell.

IONIC BOND (ELECTROVALENT BOND)

An ionic bond is formed by the complete transfer of electrons from one atom to another. It usually occurs between a metal and a non-metal. The metal loses electrons to become a positive ion (cation), and the non-metal gains electrons to become a negative ion (anion). The oppositely charged ions attract each other.

Example: Sodium (Na) loses 1 electron to become Na⁺. Chlorine (Cl) gains 1 electron to become Cl⁻. Na⁺ and Cl⁻ attract to form NaCl.

AI EXPLANATION: Imagine you have N1000 (sodium) and your friend has N0 (chlorine). You give your N1000 to your friend. Now you have N0 and you become positive because you gave something away. Your friend now has N1000 and becomes negative because they received something. Because opposites attract, you and your friend now stick together. This is exactly what happens when sodium and chlorine meet to form table salt.

PROPERTIES OF IONIC COMPOUNDS

Ionic compounds have high melting and boiling points because strong electrostatic forces hold the ions together. They are soluble in water but insoluble in organic solvents. They conduct electricity when molten or dissolved in water because the ions are free to move. They are hard but brittle.

AI EXPLANATION: Have you ever tried to break a piece of salt? It is hard but when you hit it, it shatters. Why do ionic compounds have high melting points? Because the attraction between positive and negative ions is very strong. You need a lot of heat to separate them. Why do they conduct electricity when melted or dissolved? Because in solid form, the ions are locked in place and cannot move. But when you melt salt or dissolve it in water, the ions become free to move around, and moving charges conduct electricity.

COVALENT BOND

A covalent bond is formed by the sharing of electrons between atoms. It usually occurs between non-metal atoms. Each atom contributes one or more electrons to the shared pair.

Types of covalent bonds:
Single covalent bond: shares one pair of electrons (H-H, H-Cl)
Double covalent bond: shares two pairs of electrons (C=C in ethene, O=C=O in CO₂)
Triple covalent bond: shares three pairs of electrons (C≡C in ethyne, N≡N in N₂)

AI EXPLANATION: Imagine you and your friend both need a pen to write an exam. Neither of you has a pen, but you find one pen on the floor. You decide to share it. You hold one end, your friend holds the other end. This is a covalent bond. Instead of one atom giving away an electron and another taking it (like ionic), both atoms bring one electron each and they share the pair. Why do they share? Because both atoms need electrons to complete their outer shell, but neither wants to lose an electron completely.

PROPERTIES OF COVALENT COMPOUNDS

Covalent compounds have low melting and boiling points because the intermolecular forces between molecules are weak. They are usually insoluble in water but soluble in organic solvents. They do not conduct electricity because there are no free ions or electrons. They are soft and often volatile.

AI EXPLANATION: Think of sugar. It melts easily on a stove. Why? Because the molecules of sugar are not held together by strong forces like in salt. The forces between covalent molecules are weak, so they separate easily with little heat. Why does sugar not conduct electricity? Because sugar molecules are neutral; they have no free electrons or ions to carry current. If you put a bulb in sugar water, it will not light.

COORDINATE (DATIVE) COVALENT BOND

A coordinate covalent bond is a special type of covalent bond where both shared electrons are donated by one atom. Once formed, it is identical to a normal covalent bond.

Examples:
Ammonium ion (NH₄⁺): NH₃ donates a lone pair to H⁺
Hydronium ion (H₃O⁺): H₂O donates a lone pair to H⁺

AI EXPLANATION: In normal sharing, each person brings one pen to share. In coordinate bonding, one person brings both pens to share, and the other person brings nothing but still gets to use them. How does this happen? Some atoms have a pair of electrons that are not being used (called a lone pair). They can offer this whole pair to another atom that needs electrons. In NH₄⁺, nitrogen forms four bonds, but it normally only forms three. The fourth bond is coordinate.

JAMB POINT: In NH₄⁺, the bond between NH₃ and H⁺ is a coordinate bond, but all four N-H bonds are identical once formed.

METALLIC BOND

A metallic bond is the force of attraction between positive metal ions and a sea of delocalised electrons. The valence electrons are free to move throughout the metal lattice.

AI EXPLANATION: Imagine a bowl of Nigerian jollof rice. The rice grains are like positive metal ions. The stew (the red liquid) is like the sea of electrons flowing all around the rice grains. The stew holds all the rice grains together, but the stew itself can flow freely. Why do metals conduct electricity? Because the free electrons can carry electric current easily. Why are metals malleable? When you hit a metal, the metal ions can slide past each other without breaking because the electron sea holds everything together.

PROPERTIES OF METALS

Metals are good conductors of heat and electricity because of the mobile electrons. They are malleable (can be hammered into sheets) and ductile (can be drawn into wires). They have high melting and boiling points, are lustrous (shiny), and are sonorous (ring when struck).

AI EXPLANATION: Why does a metal spoon feel cold when you touch it? Because heat travels quickly from your hand into the metal. The free electrons carry heat energy very fast. Why can you bend a metal spoon but not a piece of salt? Because the metal ions can slide past each other. The electron sea acts like a cushion. Why are metals shiny? Light hits the sea of free electrons and bounces back, giving a shiny appearance.

SHAPES OF SIMPLE MOLECULES (VSEPR THEORY)

The Valence Shell Electron Pair Repulsion (VSEPR) theory states that electron pairs around a central atom repel each other and arrange themselves as far apart as possible. This determines the shape of the molecule.

AI EXPLANATION: Imagine four students in a classroom. If you tell them to stay as far apart as possible, one will go to each corner of the room. This is what electron pairs do. They push away from each other because they have the same negative charge. The positions where the electron pairs end up become the positions of the atoms.

COMMON MOLECULAR SHAPES FOR JAMB

2 bond pairs, 0 lone pairs: Linear shape, bond angle 180°. Example: CO₂, BeCl₂.

3 bond pairs, 0 lone pairs: Trigonal planar shape, bond angle 120°. Example: BF₃, SO₃.

4 bond pairs, 0 lone pairs: Tetrahedral shape, bond angle 109.5°. Example: CH₄, CCl₄.

3 bond pairs, 1 lone pair: Pyramidal shape, bond angle 107°. Example: NH₃, PH₃.

2 bond pairs, 2 lone pairs: Bent or V-shaped, bond angle 104.5°. Example: H₂O, OF₂.

AI EXPLANATION: Why is carbon dioxide (CO₂) a straight line? The carbon atom has two double bonds to oxygen. These two electron pairs push away from each other to opposite sides, making a 180° straight line. Why is water bent? It has two bonds and two lone pairs. The two lone pairs push very hard, squeezing the hydrogens even closer, giving an angle of 104.5°. How can you remember this? More lone pairs mean smaller angles because lone pairs push harder than bonding pairs.

ELECTRONEGATIVITY

Electronegativity is the tendency of an atom to attract shared electrons towards itself in a covalent bond. It increases across a period (left to right) and decreases down a group. Fluorine has the highest electronegativity (4.0). The difference in electronegativity between two atoms determines the bond type.

Electronegativity difference > 1.7: Ionic bond
Electronegativity difference 0.5 - 1.7: Polar covalent bond
Electronegativity difference < 0.5: Non-polar covalent bond

AI EXPLANATION: Imagine a tug of war. Some atoms are very strong and pull the rope (shared electrons) towards themselves. Fluorine is the strongest. If the difference in strength is very big (more than 1.7), the weaker atom gives up and the bond becomes ionic. If the difference is medium (0.5 to 1.7), the rope stays in the middle but is pulled slightly to one side. This is a polar covalent bond, like in water (H₂O). If the difference is small (less than 0.5), the rope stays exactly in the middle. This is a non-polar covalent bond, like in H₂.

JAMB POINT: Fluorine (4.0) is the most electronegative element. Francium (0.7) is the least electronegative.

IMPORTANT THINGS TO NOTE FOR JAMB

1. Atomic number (Z) = number of protons. It determines the element. Mass number (A) = protons + neutrons. Number of neutrons = A - Z.

2. Isotopes have the same number of protons but different numbers of neutrons. They have the same chemical properties but different physical properties.

3. Electronic configuration: K=2, L=8, M=18, N=32. Electrons fill from innermost shell outward. Valence electrons are in the outermost shell.

4. The octet rule: Atoms bond to achieve 8 electrons in their outer shell (or 2 for hydrogen and helium).

5. Ionic bonds form between metals and non-metals. Ionic compounds have high melting points, dissolve in water, conduct electricity when molten or dissolved.

6. Covalent bonds form between non-metals. Covalent compounds have low melting points, do not conduct electricity, may be gases, liquids, or soft solids.

7. Coordinate covalent bonds form when one atom donates both electrons. Common examples: NH₄⁺ (ammonium) and H₃O⁺ (hydronium).

8. Metallic bonds involve a sea of delocalised electrons. This explains why metals conduct electricity, are malleable, and have high melting points.

9. VSEPR theory: Lone pairs repel more strongly than bond pairs. Water has 104.5°, ammonia has 107°, methane has 109.5°.

10. Electronegativity increases across a period and decreases down a group. Fluorine is most electronegative.

MNEMONICS AND MEMORY TIPS

1. To remember the order of atomic theorists: "Dalton's Tiny Balls, Thomson's Pudding, Rutherford's Nuclear, Bohr's Orbits"

2. To remember subatomic particles and their charges: "Protons are Positive, Neutrons are Neutral, Electrons are Evil (negative)"

3. To remember the maximum electrons in the first four shells: "King Loves Monkeys" → K=2, L=8, M=18, N=32

4. To remember the types of bonds: "I Come Metally" → Ionic, Covalent, Metallic

5. To remember the VSEPR shapes and bond angles: "Linear Lovers (180°), Triangular Planar (120°), Tetrahedral (109.5°), Pyramidal (107°), Bent Water (104.5°)"

6. To remember the trend of electronegativity: "FONClBrISCH" → Fluorine, Oxygen, Nitrogen, Chlorine, Bromine, Iodine, Sulphur, Carbon, Hydrogen

7. To remember the difference between ionic and covalent: "Metal + Non-metal = Ionic. Non-metal + Non-metal = Covalent."

8. To remember why water is bent: "Lone pairs push harder than bonding pairs. Two lone pairs in water make it bent."

JAMB QUICK TIPS

1. Rutherford's gold foil experiment proved the existence of the nucleus. Most alpha particles passed through (atom is mostly empty space). Few were deflected (positive nucleus).

2. Isotopes have the same chemical properties but different physical properties. The reason is they have the same number of electrons but different mass.

3. Number of neutrons = Mass number - Atomic number. Never subtract in the wrong order.

4. Electronegativity difference: >1.7 = ionic, 0.5 to 1.7 = polar covalent, <0.5 = non-polar covalent.

5. NH₄⁺ contains a coordinate covalent bond. All four N-H bonds are identical once formed.

6. Bond angle in water is 104.5°. Bond angle in ammonia is 107°. Bond angle in methane is 109.5°.

7. Diamond is hard and non-conductive. Graphite is soft and conductive. Both are allotropes of carbon.

8. Noble gases (Group 18) do not bond because they already have full outer shells.`,
    isHighYield: true,
    highYieldSummary: "High-Yield: Atomic Theory and Chemical Bonding is a priority topic for UTME preparation.",
    keyDefinitions: [
      "Atoms: Tiny indivisible particles that make up all matter",
      "Electrons: Negatively charged subatomic particles orbiting the nucleus",
      "Nucleus: The dense, positively charged center of an atom containing protons and neutrons",
      "Isotopes: Atoms with same protons but different neutrons",
      "Valence electrons: Electrons in the outermost shell determining chemical properties"
    ],
    learningGoals: [
      "Understand the historical development of atomic models",
      "Explain the structure of atoms",
      "Distinguish between different types of chemical bonds"
    ],
    prerequisites: [
      "Basic understanding of matter and energy",
      "Familiarity with the periodic table"
    ],
    jambFocus: [
      "Rutherford's experiment",
      "Electronic configuration",
      "Octet rule"
    ]
  };

  // Questions based on the topic content
  const topicQuestions = [
    {
      id: 1,
      question: "According to Dalton's Atomic Theory, what is the smallest particle of matter that cannot be broken down further?",
      options: [
        "Molecule",
        "Atom",
        "Ion",
        "Electron"
      ],
      correctAnswer: "Atom",
      explanation: "Dalton proposed that atoms are the smallest indivisible particles that make up all matter. They cannot be created, destroyed, or transformed into other elements."
    },
    {
      id: 2,
      question: "What did J.J. Thomson discover using the cathode ray tube?",
      options: [
        "The nucleus",
        "The electron",
        "The neutron",
        "The proton"
      ],
      correctAnswer: "The electron",
      explanation: "Thomson discovered the electron and proposed the plum pudding model. He found that atoms contain negatively charged particles embedded in positive charge."
    },
    {
      id: 3,
      question: "What did Rutherford's gold foil experiment prove?",
      options: [
        "Atoms are solid throughout",
        "The nucleus contains only protons",
        "Most of the atom is empty space and has a dense nucleus",
        "Electrons are located at the center"
      ],
      correctAnswer: "Most of the atom is empty space and has a dense nucleus",
      explanation: "Most alpha particles passed through the foil (empty space), but some were deflected, proving the existence of a small, dense, positively charged nucleus."
    },
    {
      id: 4,
      question: "What is the atomic number of an element?",
      options: [
        "The number of neutrons",
        "The total number of protons and neutrons",
        "The number of protons",
        "The number of electrons in outer shell"
      ],
      correctAnswer: "The number of protons",
      explanation: "Atomic number (Z) is defined as the number of protons in the nucleus. It uniquely identifies each element and equals the number of electrons in a neutral atom."
    },
    {
      id: 5,
      question: "How many electrons can the second shell (L shell) hold?",
      options: [
        "2 electrons",
        "8 electrons",
        "18 electrons",
        "32 electrons"
      ],
      correctAnswer: "8 electrons",
      explanation: "The maximum electrons in shell 2 (L) is 8. Memory trick: K=2, L=8, M=18, N=32 follows the formula 2n² where n is the shell number."
    },
    {
      id: 6,
      question: "What does the Octet Rule state?",
      options: [
        "Atoms must have 2 electrons in the outer shell",
        "Atoms bond to achieve 8 electrons in their outer shell",
        "All bonds must be ionic",
        "Atoms lose all valence electrons"
      ],
      correctAnswer: "Atoms bond to achieve 8 electrons in their outer shell",
      explanation: "The octet rule explains that atoms bond to achieve a stable configuration of 8 electrons in the outermost shell (or 2 for hydrogen and helium, the duplet rule)."
    },
    {
      id: 7,
      question: "What type of bond forms between sodium and chlorine?",
      options: [
        "Covalent bond",
        "Ionic bond",
        "Metallic bond",
        "Hydrogen bond"
      ],
      correctAnswer: "Ionic bond",
      explanation: "Sodium (metal) loses an electron to chlorine (non-metal), creating Na⁺ and Cl⁻ ions that attract each other. This is an ionic/electrovalent bond."
    },
    {
      id: 8,
      question: "What is a covalent bond?",
      options: [
        "Transfer of electrons from one atom to another",
        "Sharing of electrons between two atoms",
        "Attraction between positive metal ions and electron sea",
        "Bond formed only between identical atoms"
      ],
      correctAnswer: "Sharing of electrons between two atoms",
      explanation: "A covalent bond forms when two atoms share one or more pairs of electrons. It usually occurs between non-metal atoms."
    },
    {
      id: 9,
      question: "What does VSEPR theory determine about molecules?",
      options: [
        "The number of valence electrons",
        "The shape of the molecule",
        "The boiling point",
        "The type of bonding"
      ],
      correctAnswer: "The shape of the molecule",
      explanation: "VSEPR (Valence Shell Electron Pair Repulsion) theory states that electron pairs repel each other and arrange themselves as far apart as possible, determining molecular shape."
    },
    {
      id: 10,
      question: "Which element has the highest electronegativity?",
      options: [
        "Oxygen",
        "Nitrogen",
        "Chlorine",
        "Fluorine"
      ],
      correctAnswer: "Fluorine",
      explanation: "Fluorine (4.0) is the most electronegative element. It has the strongest tendency to attract shared electrons in a covalent bond."
    }
  ];

  // Use mock topic or real topic
  const displayTopic = (topic || mockTopic) as any;

  useEffect(() => {
    if (topic && params?.slug) {
      updateProgress({ slug: params.slug, status: "in_progress" });
    }
  }, [topic, params?.slug, updateProgress]);

  const subjectName = displayTopic?.subject?.name || "Subject";
  const subjectSlug = displayTopic?.subject?.slug || "";

  if (isLoading) {
    return (
      <AppShell searchPlaceholder="Search topics, concepts, or formulas...">
        <div className="p-6 md:p-10">
          <div className="mx-auto max-w-4xl space-y-8 animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/4" />
            <div className="h-40 bg-slate-200 rounded-3xl" />
            <div className="h-72 bg-slate-200 rounded-3xl" />
          </div>
        </div>
      </AppShell>
    );
  }

  const masteryLevel = displayTopic.isHighYield ? 72 : 58;
  const highYieldSummary = displayTopic.highYieldSummary || displayTopic.summary || `Focus here first. ${displayTopic.name} is commonly tested in UTME.`;
  const keyDefinitions = displayTopic.keyDefinitions && displayTopic.keyDefinitions.length > 0
    ? displayTopic.keyDefinitions
    : ["Key terms for this topic will be listed here."];
  const simpleExplanationText = displayTopic.simpleExplanation || displayTopic.content || "";

  const importantFormulasFacts = displayTopic.importantFormulasFacts && displayTopic.importantFormulasFacts.length > 0
    ? displayTopic.importantFormulasFacts
    : ["No important formulas/facts have been added yet."];
  const sections = Array.isArray(displayTopic.sections)
    ? [...displayTopic.sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];
  const hasSections = sections.length > 0;
  const learningGoals = displayTopic.learningGoals && displayTopic.learningGoals.length > 0 ? displayTopic.learningGoals : [];
  const prerequisites = displayTopic.prerequisites && displayTopic.prerequisites.length > 0 ? displayTopic.prerequisites : [];
  const jambFocus = displayTopic.jambFocus && displayTopic.jambFocus.length > 0 ? displayTopic.jambFocus : [];
  const aiExplanation = {
    whyCorrectIsCorrect:
      displayTopic.aiExplanations?.whyCorrectIsCorrect ||
      "The correct option follows directly from the key concept and tested rule for this topic.",
    whyOthersAreWrong:
      displayTopic.aiExplanations?.whyOthersAreWrong ||
      "Other options usually miss a definition, rule condition, or required step in the reasoning.",
    simpleBreakdown:
      displayTopic.aiExplanations?.simpleBreakdown ||
      "1) Identify the tested concept. 2) Apply the right rule. 3) Eliminate distractors quickly.",
  };

  // Helper functions for questions
  const allAnswersProvided = topicQuestions.every(q => answers[q.id]);
  const calculateScore = () => {
    let correct = 0;
    topicQuestions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: topicQuestions.length,
      percentage: Math.round((correct / topicQuestions.length) * 100),
      passed: correct >= Math.ceil(topicQuestions.length * 0.7) // 70% to pass
    };
  };

  const score = showResults ? calculateScore() : null;

  return (
    <AppShell searchPlaceholder="Search topics, concepts, or formulas...">
      <main className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="reading-canvas mx-auto max-w-4xl pt-2 md:pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="bg-primary-container text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded tracking-widest">
                  {subjectName.toUpperCase()}
                </span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container-high border border-outline-variant/15">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-on-surface">
                    Exam Weightage: <span className="text-primary-container font-extrabold">{displayTopic.isHighYield ? "15%" : "8%"}</span>
                  </span>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-on-surface tracking-tight">{displayTopic.name}</h1>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase text-on-surface-variant tracking-widest">Mastery Level</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-32 h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-primary-container" style={{ width: `${masteryLevel}%` }} />
                </div>
                <span className="text-xs font-bold text-primary">{masteryLevel}%</span>
              </div>
            </div>
          </div>

          <article className="bg-surface-container-lowest clinical-shadow rounded-3xl border border-outline-variant/15 overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b border-outline-variant/15 bg-surface-container-high">
              <button
                onClick={() => {
                  setActiveTab("notes");
                  setShowResults(false);
                }}
                className={`flex-1 px-6 py-4 font-bold text-center transition-all ${
                  activeTab === "notes"
                    ? "border-b-2 border-primary text-primary bg-surface-container-lowest"
                    : "text-on-surface-variant hover:bg-surface-container-lowest"
                }`}
              >
                <BookOpen className="w-4 h-4 inline mr-2" />
                Notes & Explanations
              </button>
              <button
                onClick={() => setActiveTab("questions")}
                className={`flex-1 px-6 py-4 font-bold text-center transition-all relative ${
                  activeTab === "questions"
                    ? "border-b-2 border-primary text-primary bg-surface-container-lowest"
                    : "text-on-surface-variant hover:bg-surface-container-lowest"
                }`}
              >
                <Lightbulb className="w-4 h-4 inline mr-2" />
                Questions
                {allAnswersProvided && !showResults && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full text-white text-xs flex items-center justify-center">✓</span>
                )}
              </button>
            </div>

            <div className="px-5 sm:px-8 md:px-12 py-8 md:py-16 space-y-8">
              {activeTab === "notes" ? (
                <>
                  <section className="max-w-none">
                    <h2 className="text-2xl font-bold text-on-surface mb-4">High-Yield Summary</h2>
                    <p className="text-on-surface-variant leading-relaxed text-lg">{highYieldSummary}</p>
              </section>

              {(displayTopic.overview || displayTopic.referenceBook || learningGoals.length > 0 || prerequisites.length > 0 || jambFocus.length > 0) && (
                <section className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Learning Goals */}
                    {learningGoals.length > 0 && (
                      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xl">🎯</span>
                          <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-900">Learning Goals</h4>
                        </div>
                        <ul className="space-y-2">
                          {learningGoals.map((goal, index) => (
                            <li key={`${goal}-${index}`} className="flex gap-2 text-sm text-emerald-900">
                              <span className="font-bold flex-shrink-0">✓</span>
                              <span>{goal}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Prerequisites */}
                    {prerequisites.length > 0 && (
                      <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xl">📖</span>
                          <h4 className="text-sm font-bold uppercase tracking-widest text-blue-900">Prerequisites</h4>
                        </div>
                        <ul className="space-y-2">
                          {prerequisites.map((item, index) => (
                            <li key={`${item}-${index}`} className="flex gap-2 text-sm text-blue-900">
                              <span className="font-bold flex-shrink-0">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* JAMB Focus - Full Width */}
                  {jambFocus.length > 0 && (
                    <div className="rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">⭐</span>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-amber-900">JAMB Exam Focus Areas</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {jambFocus.map((item, index) => (
                          <span key={`${item}-${index}`} className="inline-flex items-center rounded-full bg-amber-300 text-amber-900 text-xs font-bold px-4 py-2 shadow-sm">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {displayTopic.referenceBook && (
                    <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50 p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">📕</span>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-purple-900">Reference</h4>
                      </div>
                      <p className="text-sm text-purple-900">{displayTopic.referenceBook}</p>
                    </div>
                  )}

                  {displayTopic.overview && (
                    <div className="rounded-2xl border border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100/50 p-6 md:col-span-2">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">📝</span>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900">Overview</h4>
                      </div>
                      <p className="text-sm text-slate-800 leading-relaxed">{displayTopic.overview}</p>
                    </div>
                  )}
                </section>
              )}

              <section>
                <div className="bg-tertiary-fixed/20 p-6 border-l-4 border-tertiary-fixed-dim rounded-r-lg relative my-2">
                  <div className="absolute -top-3 -left-3 bg-tertiary-fixed-dim text-white w-7 h-7 flex items-center justify-center rounded-full shadow-sm">
                    <Lightbulb className="h-4 w-4" />
                  </div>
                  <p className="text-on-tertiary-fixed font-semibold italic">
                    {topic.isHighYield
                      ? `High-Yield: ${topic.name} is a priority topic for UTME preparation.`
                      : "Build understanding from the core definitions before moving to advanced drills."}
                  </p>
                </div>
              </section>

              <section>
                <div className="border-l-4 border-primary-container pl-6 py-2 mb-6">
                  <h3 className="text-lg font-bold text-on-surface uppercase tracking-tight">📚 Key Definitions & Concepts</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {keyDefinitions.map((definition, index) => {
                    const [term, ...defParts] = definition.split(':');
                    const def = defParts.join(':').trim();
                    
                    return (
                      <div key={`${definition}-${index}`} className="p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:shadow-md transition-all">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-on-surface mb-1">{term.trim()}</p>
                            <p className="text-xs text-on-surface-variant leading-relaxed">{def || definition}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-bold text-on-surface">Complete Notes & Explanations</h2>
                
                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                  <div className="p-6 md:p-8 space-y-6">
                    {simpleExplanationText.split('\n').map((line: any, idx: any) => {
                      const trimmedLine = line.trim();
                      if (!trimmedLine) return null;
                      
                      // Check if this is a section header (ALL CAPS or capitalized with parentheses)
                      const isSectionHeader = /^[A-Z][A-Z\s\(\)\d]+$/.test(trimmedLine) && trimmedLine.length > 5;
                      
                      // Check if this is an AI EXPLANATION
                      if (trimmedLine.startsWith('AI EXPLANATION:')) {
                        const text = trimmedLine.replace('AI EXPLANATION:', '').trim();
                        return (
                          <div key={`ai-${idx}`} className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4 space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500" />
                              <p className="text-xs font-bold uppercase tracking-widest text-blue-700">💡 AI Explanation</p>
                            </div>
                            <p className="text-sm text-slate-800 leading-relaxed italic">
                              {text}
                            </p>
                          </div>
                        );
                      }
                      
                      // Check if this is a JAMB POINT
                      if (trimmedLine.startsWith('JAMB POINT:')) {
                        const text = trimmedLine.replace('JAMB POINT:', '').trim();
                        return (
                          <div key={`jamb-${idx}`} className="rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4 space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-amber-500" />
                              <p className="text-xs font-bold uppercase tracking-widest text-amber-700">⭐ JAMB Point</p>
                            </div>
                            <p className="text-sm text-slate-800 leading-relaxed font-semibold">
                              {text}
                            </p>
                          </div>
                        );
                      }
                      
                      // Section headers
                      if (isSectionHeader) {
                        return (
                          <div key={`header-${idx}`} className="mt-8 mb-4 pt-6 border-t border-slate-200">
                            <h3 className="text-lg font-bold text-on-surface tracking-tight">{trimmedLine}</h3>
                          </div>
                        );
                      }
                      
                      // Regular paragraphs
                      return (
                        <p key={`p-${idx}`} className="text-sm md:text-base text-slate-700 leading-relaxed">
                          {trimmedLine}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* Important Things to Note Section */}
              <section className="space-y-4">
                <div className="border-l-4 border-red-500 pl-6 py-2">
                  <h3 className="text-lg font-bold text-on-surface uppercase tracking-tight">📌 Important Things to Note</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    "Atomic number (Z) = number of protons. It determines the element. Mass number (A) = protons + neutrons. Number of neutrons = A - Z.",
                    "Isotopes have the same number of protons but different numbers of neutrons. They have the same chemical properties but different physical properties.",
                    "Electronic configuration: K=2, L=8, M=18, N=32. Electrons fill from innermost shell outward. Valence electrons are in the outermost shell.",
                    "The octet rule: Atoms bond to achieve 8 electrons in their outer shell (or 2 for hydrogen and helium).",
                    "Ionic bonds form between metals and non-metals. Ionic compounds have high melting points, dissolve in water, conduct electricity when molten or dissolved.",
                    "Covalent bonds form between non-metals. Covalent compounds have low melting points, do not conduct electricity, may be gases, liquids, or soft solids.",
                    "Coordinate covalent bonds form when one atom donates both electrons. Common examples: NH₄⁺ (ammonium) and H₃O⁺ (hydronium).",
                    "Metallic bonds involve a sea of delocalised electrons. This explains why metals conduct electricity, are malleable, and have high melting points.",
                    "VSEPR theory: Lone pairs repel more strongly than bond pairs. Water has 104.5°, ammonia has 107°, methane has 109.5°.",
                    "Electronegativity increases across a period and decreases down a group. Fluorine is most electronegative."
                  ].map((point, idx) => (
                    <div key={`important-${idx}`} className="flex gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                      <span className="text-xl font-bold text-red-600 flex-shrink-0">{idx + 1}.</span>
                      <p className="text-sm text-slate-700 leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Mnemonics and Memory Tips */}
              <section className="space-y-4">
                <div className="border-l-4 border-purple-500 pl-6 py-2">
                  <h3 className="text-lg font-bold text-on-surface uppercase tracking-tight">🧠 Mnemonics & Memory Tips</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "Order of Atomic Theorists", mnemonic: "Dalton's Tiny Balls, Thomson's Pudding, Rutherford's Nuclear, Bohr's Orbits" },
                    { title: "Subatomic Particles & Charges", mnemonic: "Protons are Positive, Neutrons are Neutral, Electrons are Evil (negative)" },
                    { title: "First Four Electron Shells", mnemonic: "King Loves Monkeys → K=2, L=8, M=18, N=32" },
                    { title: "Types of Bonds", mnemonic: "I Come Metally → Ionic, Covalent, Metallic" },
                    { title: "VSEPR Shapes & Bond Angles", mnemonic: "Linear Lovers (180°), Triangular (120°), Tetrahedral (109.5°), Pyramidal (107°), Bent (104.5°)" },
                    { title: "Electronegativity Order", mnemonic: "FONClBrISCH → F, O, N, Cl, Br, I, S, C, H" },
                    { title: "Ionic vs Covalent", mnemonic: "Metal + Non-metal = Ionic. Non-metal + Non-metal = Covalent." },
                    { title: "Why Water is Bent", mnemonic: "Lone pairs push harder than bonding pairs. Two lone pairs make water bent." }
                  ].map((item, idx) => (
                    <div key={`mnemonic-${idx}`} className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg border border-purple-200">
                      <p className="text-xs font-bold uppercase tracking-widest text-purple-900 mb-2">{item.title}</p>
                      <p className="text-sm font-semibold text-purple-800 italic">{item.mnemonic}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* JAMB Quick Tips */}
              <section className="space-y-4">
                <div className="border-l-4 border-amber-600 pl-6 py-2">
                  <h3 className="text-lg font-bold text-on-surface uppercase tracking-tight">⚡ JAMB Quick Tips</h3>
                </div>
                <div className="space-y-3">
                  {[
                    "Rutherford's gold foil experiment proved the existence of the nucleus. Most alpha particles passed through (atom is mostly empty space). Few were deflected (positive nucleus).",
                    "Isotopes have the same chemical properties but different physical properties. The reason is they have the same number of electrons but different mass.",
                    "Number of neutrons = Mass number - Atomic number. Never subtract in the wrong order.",
                    "Electronegativity difference: >1.7 = ionic, 0.5 to 1.7 = polar covalent, <0.5 = non-polar covalent.",
                    "NH₄⁺ contains a coordinate covalent bond. All four N-H bonds are identical once formed.",
                    "Bond angle in water is 104.5°. Bond angle in ammonia is 107°. Bond angle in methane is 109.5°.",
                    "Diamond is hard and non-conductive. Graphite is soft and conductive. Both are allotropes of carbon.",
                    "Noble gases (Group 18) do not bond because they already have full outer shells."
                  ].map((tip, idx) => (
                    <div key={`jamb-tip-${idx}`} className="flex gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-300">
                      <span className="text-2xl">💡</span>
                      <p className="text-sm text-slate-800 leading-relaxed"><span className="font-bold">Tip {idx + 1}:</span> {tip}</p>
                    </div>
                  ))}
                </div>
              </section>

              {hasSections && (
                <section className="space-y-5">
                  <h2 className="text-2xl font-bold text-on-surface">Section Breakdown</h2>
                  {sections.map((section, index) => {
                    const sectionParagraphs = section.aiExplanation?.paragraphs || [];

                    return (
                      <article key={`${section.sectionTitle}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
                        <header>
                          <h3 className="text-xl font-bold text-slate-900">{section.sectionTitle}</h3>
                          {section.definition && <p className="text-sm text-slate-600 mt-1">{section.definition}</p>}
                        </header>

                        {section.explanation && (
                          <div className="text-slate-700 leading-relaxed">
                            <ReactMarkdown>{section.explanation}</ReactMarkdown>
                          </div>
                        )}

                        {section.illustrationImageUrl && (
                          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                            <img
                              src={section.illustrationImageUrl}
                              alt={`${section.sectionTitle} illustration`}
                              className="w-full max-h-80 object-cover"
                              loading="lazy"
                            />
                          </div>
                        )}

                        {section.examples && section.examples.length > 0 && (
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-700 mb-2">Examples</p>
                            <ul className="list-disc ml-5 space-y-1 text-sm text-slate-700">
                              {section.examples.map((example, exampleIndex) => (
                                <li key={`${example}-${exampleIndex}`}>{example}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {section.jambPoint && (
                          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-1">JAMB Point</p>
                            <p className="text-sm text-amber-900">{section.jambPoint}</p>
                          </div>
                        )}

                        {section.quickTip && (
                          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-1">Quick Tip</p>
                            <p className="text-sm text-emerald-900">{section.quickTip}</p>
                          </div>
                        )}

                        {sectionParagraphs.length > 0 && (
                          <div className="rounded-lg border border-brand-blue/20 bg-brand-blue/5 p-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-brand-blue mb-2">AI Explanation</p>
                            <div className="space-y-2">
                              {sectionParagraphs.map((paragraph, paragraphIndex) => (
                                <p key={`${paragraph}-${paragraphIndex}`} className="text-sm text-slate-700 leading-relaxed">
                                  {paragraph}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </section>
              )}

              <section className="bg-on-surface text-surface-container-lowest p-8 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-4 h-4 text-tertiary-fixed-dim" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-surface-variant">Important Formulas / Facts</h3>
                </div>
                <ul className="space-y-3">
                  {importantFormulasFacts.map((fact, index) => (
                    <li key={`${fact}-${index}`} className="text-surface-variant text-sm leading-relaxed list-disc ml-5">
                      {fact}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="pt-4">
                <h2 className="text-2xl font-bold text-on-surface mb-4">AI Explanations</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div className="rounded-xl border border-brand-blue/20 bg-brand-blue/5 p-5">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-brand-blue mb-2">Why Correct Answer Is Correct</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{aiExplanation.whyCorrectIsCorrect}</p>
                  </div>
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-amber-700 mb-2">Why Others Are Wrong</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{aiExplanation.whyOthersAreWrong}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-700 mb-2">Simple Breakdown</p>
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{aiExplanation.simpleBreakdown}</p>
                  </div>
                </div>
              </section>
                </>
              ) : (
                <>
                  {/* Questions Tab Content */}
                  <section className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-on-surface mb-2">Knowledge Check: {displayTopic.name}</h2>
                      <p className="text-on-surface-variant">Answer all questions below to unlock the next topic. You need 70% to pass.</p>
                    </div>

                    <div className="space-y-6">
                      {topicQuestions.map((q, index) => (
                        <div key={q.id} className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 hover:border-primary/30 transition-colors">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                                {index + 1}
                              </div>
                            </div>
                            <div className="flex-grow">
                              <p className="text-base font-bold text-on-surface mb-4">{q.question}</p>
                              
                              <div className="space-y-2 mb-4">
                                {q.options.map((option) => (
                                  <label key={option} className="flex gap-3 p-3 rounded-lg border border-outline-variant/15 cursor-pointer hover:bg-surface-container transition-colors"
                                    style={{
                                      backgroundColor: answers[q.id] === option ? '#e0f2fe' : 'transparent',
                                      borderColor: answers[q.id] === option ? '#0284c7' : undefined
                                    }}
                                  >
                                    <input
                                      type="radio"
                                      name={`question-${q.id}`}
                                      value={option}
                                      checked={answers[q.id] === option}
                                      onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                                      className="mt-1"
                                    />
                                    <span className="text-sm text-on-surface">{option}</span>
                                    
                                    {showResults && (
                                      <>
                                        {option === q.correctAnswer && (
                                          <CheckCircle className="w-5 h-5 text-green-500 ml-auto flex-shrink-0" />
                                        )}
                                        {answers[q.id] === option && option !== q.correctAnswer && (
                                          <XCircle className="w-5 h-5 text-red-500 ml-auto flex-shrink-0" />
                                        )}
                                      </>
                                    )}
                                  </label>
                                ))}
                              </div>

                              {showResults && (
                                <div className={`text-sm p-3 rounded-lg ${
                                  answers[q.id] === q.correctAnswer
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                  <p className="font-semibold mb-1">{answers[q.id] === q.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}</p>
                                  <p>{q.explanation}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {showResults && score && (
                      <div className={`rounded-2xl p-8 text-center border-2 ${
                        score.passed
                          ? 'bg-green-50 border-green-300'
                          : 'bg-amber-50 border-amber-300'
                      }`}>
                        <h3 className={`text-3xl font-black mb-2 ${score.passed ? 'text-green-700' : 'text-amber-700'}`}>
                          {score.percentage}%
                        </h3>
                        <p className={`text-lg font-bold mb-2 ${score.passed ? 'text-green-700' : 'text-amber-700'}`}>
                          {score.correct} out of {score.total} correct
                        </p>
                        <p className={`text-sm ${score.passed ? 'text-green-600' : 'text-amber-600'}`}>
                          {score.passed 
                            ? '🎉 Great! You passed! You can now move to the next topic.'
                            : '📚 You need 70% to pass. Review the material and try again.'}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      {!showResults ? (
                        <button
                          onClick={() => setShowResults(true)}
                          disabled={!allAnswersProvided}
                          className={`flex-1 px-6 py-3 rounded-lg font-bold uppercase tracking-widest transition-all ${
                            allAnswersProvided
                              ? 'bg-primary text-on-primary hover:bg-primary-container active:scale-95'
                              : 'bg-surface-container text-on-surface-variant cursor-not-allowed opacity-50'
                          }`}
                        >
                          Check Answers
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setShowResults(false);
                            setAnswers({});
                          }}
                          className="flex-1 px-6 py-3 rounded-lg font-bold uppercase tracking-widest bg-surface-container text-on-surface hover:bg-surface-container-high transition-all"
                        >
                          Try Again
                        </button>
                      )}
                    </div>
                  </section>
                </>
              )}
            </div>

            <div className="bg-surface-container px-5 sm:px-8 md:px-12 py-5 md:py-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              <Link href={subjectSlug ? `/subjects/${subjectSlug}` : "/user/dashboard"}>
                <button className="flex items-center justify-center gap-2 text-on-surface-variant font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Previous Topic
                </button>
              </Link>
              <Link href={activeTab === "questions" && !score?.passed ? "#" : `/topics/${topic.slug}/quiz`}>
                <button 
                  disabled={activeTab === "questions" && !score?.passed}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded shadow-sm font-bold text-xs uppercase tracking-widest transition-all active:scale-95 ${
                    activeTab === "questions" && !score?.passed
                      ? 'bg-surface-container text-on-surface-variant cursor-not-allowed opacity-50'
                      : 'bg-primary text-on-primary hover:bg-primary-container'
                  }`}
                >
                  Next: Take Quiz
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </article>
        </div>
      </main>

      <AiHelper topicContext={`Topic: ${topic.name}. Content: ${topic.content}`} />
    </AppShell>
  );
}
