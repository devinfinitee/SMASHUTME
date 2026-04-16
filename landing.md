# SmashUTME Landing Page PRD

Version: 1.0  
Last Updated: April 9, 2026  
Owner: Product / Growth

---

## 1. Purpose

This PRD defines the goals, requirements, content structure, UX behavior, measurement plan, and acceptance criteria for the SmashUTME marketing landing page.

The landing page is the primary acquisition surface for new visitors and must clearly communicate value, build trust, and convert visitors into signed-up users.

---

## 2. Background and Problem

Many UTME candidates study hard but inefficiently:
- They do not know which topics are truly high-yield.
- They struggle with CBT speed and timing.
- They rely on cramming rather than concept mastery.
- They lack a clear preparation roadmap.

The landing page must position SmashUTME as the focused, practical solution to these exact pain points.

---

## 3. Goals

### Primary Goal
Increase visitor-to-signup conversion from the landing page.

### Secondary Goals
- Improve click-through to `/signup` and `/login`.
- Increase engagement with product proof sections (features, preview, trust signals).
- Improve scroll depth and time on page for qualified traffic.

### Business Goals
- Grow top-of-funnel users.
- Increase activation volume entering onboarding.
- Improve quality of signups likely to complete onboarding and start study sessions.

---

## 4. Target Audience

### Primary Persona: UTME Candidate (16-22)
- Preparing for JAMB/UTME.
- Needs a clear study strategy and CBT readiness.
- Mobile-first browsing behavior.

### Secondary Persona: Parent/Guardian
- Evaluates trust, quality, and outcomes.
- Looks for legitimacy and clear value proposition.

### Tertiary Persona: Referral/Educator Traffic
- Interested in structure, quality, and proof of effectiveness.

---

## 5. Value Proposition and Messaging

### Core Value Proposition
SmashUTME helps candidates study smarter with high-yield topic focus, realistic CBT practice, and concept-first learning.

### Messaging Pillars
1. High-Yield Focus: prioritize what is most likely to be tested.
2. CBT Performance: train for speed, timing, and exam pressure.
3. Concept Mastery: anti-cram explanations and first-principle understanding.
4. Proven Roadmap: practical system based on successful real-world preparation.

### Brand Tone
- Confident, practical, motivating.
- Clear and simple language.
- No vague claims; emphasize concrete outcomes and structure.

---

## 6. Scope

### In Scope
- Full landing page content and layout.
- Hero and conversion CTAs.
- Problem-to-solution storytelling sections.
- Product experience preview.
- Trust and credibility indicators.
- FAQ and final conversion section.
- Mobile and desktop responsiveness.
- Instrumentation for analytics events.

### Out of Scope
- Account creation flow implementation details.
- Pricing/paywall deep logic.
- Post-signup onboarding internals.
- Backend experimentation platform implementation.

---

## 7. User Journey

1. Visitor lands on page.
2. Visitor understands key promise within first viewport.
3. Visitor sees proof and structure (high-yield framework, CBT prep, anti-cram engine).
4. Visitor evaluates trust markers and product previews.
5. Visitor clicks primary CTA (`Start Preparing Free`) or secondary CTA (`Try CBT Practice Demo`).
6. Visitor moves to signup/login and onboarding path.

---

## 8. Information Architecture and Section Requirements

### 8.1 Sticky Header
Purpose: persistent navigation and conversion access.

Required elements:
- Brand logo.
- Links: About, Contact.
- Primary CTA button to `/signup`.

Behavior:
- Sticky with light blur background.
- CTA remains visible on mobile and desktop.

### 8.2 Hero Section
Purpose: communicate main promise quickly and drive first CTA interaction.

Required elements:
- Eyebrow badge (e.g., UTME focus indicator).
- Primary headline (problem reframing + strategic promise).
- Supporting copy that names high-yield, CBT, and confidence outcomes.
- Primary CTA to `/signup`.
- Secondary CTA to `/login` (demo/trial pathway).
- Credibility micro-proof statement.
- Hero visual (study-focused image or product context visual).

Success criteria:
- Users can explain what SmashUTME does in under 5 seconds.
- CTA intent is clear and action-oriented.

### 8.3 Trust Signal Strip
Purpose: reduce skepticism and reinforce legitimacy.

Required items:
- Syllabus alignment.
- CBT simulation accuracy.
- Founder/expert credibility.
- Candidate/beta usage proof.

### 8.4 Problem/Solution Framework Section
Purpose: convert anxiety into confidence via clear solution mapping.

Structure:
- Multiple cards where each card maps:
  - Common student problem.
  - SmashUTME mechanism/feature.
  - Concrete result/outcome.

Must include:
- Topic overload -> high-yield filtering.
- Timing pressure -> CBT speed training.
- Forgetting quickly -> anti-cram concept learning.
- No roadmap -> guided preparation blueprint.

### 8.5 Product Experience Preview Section
Purpose: help users visualize usage before signup.

Required modules:
- High-yield topic hub preview.
- CBT experience preview.
- Feedback/insight preview.
- Structured progression preview.

### 8.6 Optional Social Proof / Outcomes Block
Purpose: strengthen conversion through evidence.

Possible items:
- Student testimonials (if available).
- Score improvement stats (if validated).
- Completion outcomes.

Constraint:
- Any numerical claim must be verifiable.

### 8.7 FAQ
Purpose: answer top objections before exit.

Required topics:
- Is it free to start?
- How accurate is CBT simulation?
- Does it follow JAMB syllabus?
- Who is it for and how quickly can results improve?

### 8.8 Final CTA Section
Purpose: capture users who consumed full page.

Required elements:
- Strong restatement of value.
- Primary CTA to `/signup`.
- Secondary CTA to `/login` or `/contact`.

---

## 9. Functional Requirements

1. Header CTA routes to `/signup`.
2. Hero primary CTA routes to `/signup`.
3. Hero secondary CTA routes to `/login`.
4. About and Contact links route correctly.
5. Buttons are keyboard accessible and screen-reader friendly.
6. Images include meaningful alt text.
7. Layout adapts cleanly across breakpoints (mobile, tablet, desktop).
8. Core content remains readable under reduced bandwidth and smaller screens.

---

## 10. UX and Visual Requirements

1. Visual hierarchy must prioritize headline, proof, and CTA.
2. High contrast for text and CTA components.
3. Consistent spacing rhythm across sections.
4. No overlapping content at any breakpoint.
5. Mobile-first behavior for CTA placement and readability.
6. Motion should be minimal, purposeful, and non-distracting.

---

## 11. Content Requirements

1. Copy should be benefit-led and specific.
2. Avoid generic education clichés.
3. Keep paragraph lengths short for mobile readability.
4. Use action-oriented CTA labels.
5. Ensure terminology consistency:
   - High-Yield Topics
   - CBT Practice
   - Anti-Cram / Concept Mastery

---

## 12. SEO Requirements

1. Unique page title targeting UTME/JAMB prep intent.
2. Meta description highlighting high-yield + CBT value.
3. Single H1 in hero.
4. Semantic heading structure (H2/H3 by section).
5. Optimized image loading and alt tags.
6. Open Graph metadata for social sharing.

---

## 13. Performance Requirements

Targets:
- Largest Contentful Paint (LCP): <= 2.5s on mid-tier mobile.
- Cumulative Layout Shift (CLS): <= 0.1.
- Interaction to Next Paint (INP): <= 200ms.

Implementation guidance:
- Compress hero/media assets.
- Avoid heavy above-the-fold scripts.
- Lazy-load non-critical visuals.

---

## 14. Accessibility Requirements

1. WCAG 2.1 AA baseline.
2. Focus-visible states for all interactive elements.
3. Proper landmark and heading order.
4. ARIA labels where needed.
5. Color contrast compliance for text and controls.

---

## 15. Analytics and Event Tracking

Track the following events:

1. `landing_view`
- Fires on page view.
- Properties: source, campaign, device.

2. `landing_cta_click`
- Fires for any CTA click.
- Properties: cta_label, cta_position, destination.

3. `landing_section_view`
- Fires on section visibility threshold.
- Properties: section_name, scroll_depth.

4. `landing_scroll_depth`
- Fires at 25%, 50%, 75%, 90%.

5. `landing_nav_click`
- Properties: nav_item, destination.

6. `landing_exit_click`
- Optional for outbound/non-conversion links.

---

## 16. Success Metrics

Primary metric:
- Landing conversion rate to signup initiation.

Secondary metrics:
- CTA click-through rate (hero + final CTA).
- Scroll depth completion to final CTA section.
- Bounce rate reduction.
- Time on page for qualified traffic.

Guardrail metrics:
- Page speed regressions.
- Accessibility score regressions.

---

## 17. Experimentation Plan

Planned A/B tests:

1. Headline framing
- Variant A: Strategy-first framing.
- Variant B: Score-outcome framing.

2. CTA labeling
- Variant A: `Start Preparing Free`.
- Variant B: `Start UTME Prep Free`.

3. Hero social proof placement
- Variant A: beneath CTAs.
- Variant B: in trust strip.

4. Problem-solution card ordering
- Compare strongest pain point first vs progression narrative.

---

## 18. Dependencies

- Routing integrity for `/signup`, `/login`, `/about`, `/contact`.
- Brand assets (logo, hero image).
- Copy approval from product/marketing.
- Analytics instrumentation availability.

---

## 19. Risks and Mitigations

1. Over-claiming outcomes
- Mitigation: validate all performance claims before publishing.

2. Too much copy on mobile
- Mitigation: strict content hierarchy and concise paragraph lengths.

3. Slow hero load on low-end devices
- Mitigation: image optimization and lazy loading for non-critical media.

4. CTA confusion between signup/login
- Mitigation: clear label semantics and position hierarchy.

---

## 20. Acceptance Criteria

The landing page is considered complete when:

1. All required sections in this PRD are present.
2. All CTA and nav routes work exactly as specified.
3. Mobile, tablet, and desktop layouts are responsive with no overlap issues.
4. Accessibility checks pass baseline WCAG 2.1 AA criteria.
5. Analytics events fire with expected properties.
6. Page performance meets target thresholds.
7. Product and growth stakeholders approve copy and positioning.

---

## 21. Open Questions

1. Should `/login` remain the destination for demo flow, or should there be a dedicated `/demo` route?
2. Which social proof claims are fully verified and safe for headline-level placement?
3. Do we need a pricing teaser section on landing, or keep pricing discovery post-signup?
4. Should parent-focused messaging have a dedicated subsection?

---

## 22. Future Enhancements

1. Personalized landing variants by campaign/source.
2. Interactive score estimator widget.
3. Video proof/testimonial module.
4. Dynamic testimonials from verified candidate outcomes.
5. Language/localization support for broader audience reach.

---

## 23. Current Displayed Landing Page Content (As Implemented)

This section captures the exact user-facing copy currently rendered on the landing page.

### 23.1 Header

- Nav items:
  - About
  - Contact
- Header CTA:
  - Mobile label: Start Free
  - Desktop label: Start Preparing Free

### 23.2 Hero

- Eyebrow badge:
  - UTME 2026 Focus Mode
- Main headline:
  - JAMB is not just about reading.
  - It is about reading the right things.
- Supporting paragraph:
  - Stop wasting time on low-yield topics. SmashUTME gives you a focused system built around High-Yield Topics, CBT Practice, and exam-day confidence.
- Hero CTAs:
  - Start Preparing Free
  - Try CBT Practice Demo
- Founder proof card:
  - Built by a Medical Student at LAUTECH who cracked UTME.
  - I built the tool I wish I had.
- Hero image caption:
  - SmashUTME Study View

### 23.3 Trust Strip

- 2026 JAMB Syllabus Aligned
- 100% CBT Simulation Accuracy
- Built by Medical Professionals
- Beta Tested by 50+ Candidates

### 23.4 High-Yield System Section

- Section headline:
  - Most students fail because they study hard. You will pass because you study smart.
- Intro line:
  - This is the High-Yield System behind SmashUTME.

- Problem/Solution cards:
  1. The Problem: Topic Overload
     - The SmashUTME Fix: The 80/20 Topic Filter
     - We analyzed 10+ years of JAMB past questions to isolate the 20% of topics that appear in 80% of exams.
     - Result: You stop wasting time on filler topics and focus on what actually scores marks.

  2. The Problem: Time Runs Out
     - The SmashUTME Fix: CBT Speed Master
     - A real-time pacing engine tracks your Seconds Per Question (SPQ) inside every mock exam.
     - Result: Your brain learns to maintain exam pace and finish with around 15 minutes to spare.

  3. The Problem: Forgetting Fast
     - The SmashUTME Fix: The Anti-Cram Engine
     - We teach from first principles, explaining the logic behind each answer instead of just showing option A.
     - Result: Deep conceptual understanding that stays with you till exam day.

  4. The Problem: No Clear Roadmap
     - The SmashUTME Fix: The Medical Student Blueprint
     - The same schedule, high-yield notes, and shortcuts used to secure admission into LAUTECH Medicine.
     - Result: A proven roadmap from late preparation to medical-school-level outcomes.

- Transitional CTA:
  - Ready to stop reading randomly?
  - Start Your High-Yield Journey

### 23.5 Study Command Center Section

- Section headline:
  - Step Inside Your New Study Command Center.
- Supporting line:
  - The system you were promised is already mapped out for you: what to study, how to perform under pressure, and when you are truly ready.

- Module 1:
  - Label: 1. The High-Yield Topic Hub
  - Headline: Stop guessing what to read first.
  - Body: Stop guessing. See exactly which topics carry 70% of the marks in Chemistry, Physics, and Biology.
  - CTA: View Your Subject Weights
  - Preview labels: Organic Chemistry (12% of Exam), Chemical Equilibrium (8% of Exam), Periodic Trends (7% of Exam)

- Module 2:
  - Label: 2. The CBT Simulation Engine
  - Headline: Train with real exam pressure.
  - Body: Experience the real JAMB interface. No surprises on exam day.
  - CTA: Enter Exam Mode
  - Preview labels: Question 18 of 60, SPQ: 37s, Pacing Timer: 44s, Too Slow

- Module 3:
  - Label: 3. The Smart Progress Tracker
  - Headline: See confidence grow in numbers.
  - Body: Don't just read. Track your mastery. Know exactly when you're ready for the 300+ score.
  - CTA: Open Your Progress Tracker
  - Preview labels: Chemistry Mastery 82%, Admission Probability 73%, Target Score: 300+

### 23.6 Pioneer Beta and Admission Section

- Section label:
  - Pioneer Beta and Admission
- Section headline:
  - Join the First 100 Pioneers.
- Supporting line:
  - This is not just early access. It is your admission-focused inner circle with direct founder support.

- Progress block:
  - 64/100 Spots Taken
  - 36 spots remaining

- Benefit cards:
  - Locked-In Price: Free access for the full 2026 UTME season.
  - Founder Access: Direct feedback loop with a Medical Student (Infinite).
  - Early Features: Get High-Yield updates before public rollout.

- Comparison cards:
  - Traditional Way:
    - Reading 10 hours/day randomly
    - Panic during the CBT timer
    - Cramming past questions
    - Aiming for just a pass
  - SmashUTME Way:
    - 3 hours of High-Yield focus
    - Mastering SPQ (Seconds Per Question)
    - Logic-based understanding
    - Aiming for Medicine, Law, or Engineering

- Founder guarantee:
  - Founder's Personal Guarantee
  - "I did not build SmashUTME to be just another website. I built it because I know the fear of seeing a bulky syllabus and not knowing where to start. This is the tool I used to get into LAUTECH Medicine, and I am personally making sure it works for you too. Let us get you that admission letter."
  - Signature: Victor (Infinite)
  - Role line: Founder, SmashUTME and MBBS Candidate.

### 23.7 Final CTA Section

- Headline:
  - Claim your Pioneer spot before this cohort closes.
- Supporting line:
  - No credit card. Just pure high-yield prep and direct founder guidance.
- Primary CTA:
  - Claim My Pioneer Spot (Free Access)
- Disclaimer line:
  - No credit card. Just pure high-yield prep.

### 23.8 Footer Content

- Footer banner label:
  - SmashUTME Pioneer Circle
- Footer banner headline:
  - This is an admission movement, not just an app.
- Footer banner body:
  - SmashUTME exists for students who are serious about Medicine, Law, Engineering, and competitive admission paths. We train strategy, speed, and confidence with high-yield focus.
  - Built and reviewed by an MBBS candidate who has already passed through the same pressure.

- Footer status card:
  - Pioneer Access Status
  - 64 / 100
  - Spots already claimed for the 2026 cohort.
  - CTA: Claim My Pioneer Spot

- Footer columns:
  - Start Here: Create Free Account, Continue Learning, Explore Subjects
  - Program: High-Yield Method, CBT Speed Framework, Pioneer Benefits
  - Company: About SmashUTME, Contact Team, Founder Story
  - Legal: Terms of Use, Privacy Policy, Exam Disclaimer

- Footer legal line:
  - Copyright: © 2026 SmashUTME. All rights reserved.
  - Tagline: Built in Nigeria for ambitious UTME candidates.

### 23.9 Route Mapping for Displayed CTAs and Links

- About -> /about
- Contact -> /contact
- Header CTA -> /signup
- Hero primary CTA -> /signup
- Hero secondary CTA -> /login
- High-Yield journey CTA -> /signup
- Subject weights CTA -> /signup
- Exam mode CTA -> /signup
- Progress tracker CTA -> /dashboard
- Final CTA -> /signup
- Footer CTA -> /signup
