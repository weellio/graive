# Lesson Plan: Why Is AI Sometimes Unfair?
### Builder Level (Ages 12–13) | Module 11

---

## Objective
By the end of this lesson, you'll understand what AI bias is, how it enters AI systems through training data, why certain groups are most affected, and what can be done to make AI fairer.

---

## What You'll Need
- AI tool (ChatGPT or Claude)
- Notebook or Google Doc
- About 40–50 minutes

---

## Watch First
Watch **Module 11: Why Is AI Sometimes Unfair?** before starting.

Central idea: **AI learns from human data, so it absorbs human biases — sometimes making them worse.**

---

## Key Concepts

### What Is Bias in AI?
Bias means the AI systematically treats certain groups differently — usually disadvantaging people based on race, gender, age, disability, or other characteristics.

AI bias is usually not intentional. It's an unintended side effect of how the system was built and trained.

> "AI doesn't choose to be biased. It learns from human-created data, and humans have biases baked into our history, language, and decisions."

### Where Bias Comes From

**Biased training data:**
If you train an AI on historical hiring decisions, and historically women were hired less for technical roles, the AI will learn that pattern and repeat it.

**Unrepresentative data:**
If the training dataset is mostly white faces, a facial recognition system will work better on white faces and make more errors on darker-skinned faces. (This has been proven in real research — the error rates are dramatically different.)

**Biased labels:**
Humans label training data (e.g., "this image is a doctor"). If the humans labelling the data have unconscious biases, those biases get baked in.

**Feedback loops:**
If a biased AI is deployed and its outputs influence the real world (e.g., who gets bail, who gets a loan), those real-world outcomes can then feed back into training data, making the bias worse over time.

### Real Examples of AI Bias

- **COMPAS algorithm** — used in US courts to predict whether someone will reoffend. Shown to be twice as likely to incorrectly flag Black defendants as high-risk compared to white defendants.
- **Amazon's AI hiring tool** (scrapped in 2018) — trained on past hiring data (mostly male), it downgraded CVs from women.
- **Facial recognition systems** — multiple studies show significantly higher error rates for darker-skinned women compared to lighter-skinned men.
- **Medical AI** — a major study found an algorithm used to direct patients to health programmes was less likely to recommend Black patients, because it used past healthcare spending as a proxy for health needs (and historical discrimination meant Black patients spent less).

---

## Try It — Bias Investigation Activities

### Activity 1: Test AI for Stereotypes (15 mins)

One form of bias is stereotypical assumptions. Let's probe this carefully.

Ask your AI these questions and analyse the responses:

1. "Write a short story about a surgeon and a nurse."
   - What genders did the AI assign to each? ___
   - Did it make any assumptions you noticed? ___

2. "Describe a typical teenager's weekend."
   - Whose experience does this describe? ___
   - What's missing? ___

3. "Write about a CEO making an important decision."
   - What did you notice about how the CEO was described? ___

4. "What are the most important inventions in history?"
   - How many of the inventors mentioned were women? ___
   - How many were non-European? ___

Write your overall observation: Does your AI show signs of bias?

My finding: ___
Severity: ___/10 (where 10 = very biased)

---

### Activity 2: The Feedback Loop Thought Experiment (10 mins)

Read this fictional (but realistic) scenario:

> *A city uses an AI system to predict which neighbourhoods need the most police presence. The AI was trained on historical arrest data. Because of historical over-policing of poorer neighbourhoods, those areas have more arrests in the data. So the AI recommends more police in those areas. With more police there, more arrests happen. This data is used to retrain the AI.*

Answer these questions:

1. What is the original source of the bias in the training data?

2. Even if each step seems logical, what's the fundamental problem with this approach?

3. What could the city do differently to make this system fairer?

4. Who is harmed by this feedback loop? Who benefits?

My analysis: ___

---

### Activity 3: Design a Fairer System (10 mins)

You've been hired to build an AI system that recommends students for a prestigious academic programme. You want it to be fair.

The data you have available:
- Past exam scores
- Teacher recommendations
- School attended
- Socioeconomic background
- Attendance record
- Extra-curricular activities
- Previous programme participants' success rates

Answer these questions:

1. Which data sources might introduce bias? Why?

2. Which data sources might mask real talent in disadvantaged students?

3. What would you NOT use — even if it seemed useful — and why?

4. How would you test whether your system was being fair before deploying it?

My design notes: ___
The biggest fairness challenge: ___

---

## The "But the Data Is Accurate" Problem

Some people argue: "If the data shows that [group] performs worse at [thing], isn't the AI just being accurate?"

This is a genuinely complicated argument. Here's how to think about it:

**The historical injustice problem:** If past discrimination caused a group to have less access to education, healthcare, or opportunity — using data from that period "accurately" reflects an unjust history, not inherent differences.

**The perpetuation problem:** Using historically biased data to make future decisions locks people into the effects of past injustice. It makes unfair history permanent.

**The proxy problem:** Often the "accurate" data is measuring something else. Healthcare spending isn't measuring health need — it's measuring how much the system engaged with someone. These are very different things.

> "The question isn't just 'is the data accurate?' It's 'accurate to what?' and 'what are the consequences of using it this way?'"

Do you find this argument convincing? What's strongest about it, and what questions do you still have?

My response: ___

---

## Reflect

1. Has this lesson changed how you think about fairness in technology? In what way?

2. AI systems are used in decisions about loans, jobs, bail, healthcare, and university admissions. If you were affected by a biased AI decision, what would you want to be able to do about it?

3. Who should be responsible for fixing AI bias — the companies who build it, the governments who allow its use, or the organisations who deploy it? Can you have one without the others?

---

## Challenge
**The Audit Brief:**

Choose one area where AI is used to make decisions about people: hiring, criminal justice, healthcare, university admissions, credit scores.

Research what is known about AI bias in that area. Write a one-page brief (bullet points are fine) covering:
- What the AI system does
- What bias has been found (cite real examples if possible)
- Who is most harmed
- What fixes have been proposed
- Your recommendation for what should happen

My chosen area: ___
My key finding: ___
My recommendation: ___

---

## Coming Up Next
Module 12: Design Your Own AI Tool — now that you understand both the power and the pitfalls of AI, let's use that knowledge to imagine and design your own tool.
