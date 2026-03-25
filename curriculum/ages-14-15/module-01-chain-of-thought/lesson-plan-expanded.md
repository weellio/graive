# Lesson Plan: Chain of Thought Prompting
### Thinker Level (Ages 14–15) | Module 01 — Expanded

---

## Objective
By the end of this lesson, you can write a multi-step chain of thought prompt, engage critically with the AI's reasoning process, use iteration to refine an argument, and explain why structured reasoning produces better outcomes than quick-answer thinking.

---

## What You'll Need
- AI tool (ChatGPT or Claude)
- Notebook or Google Doc
- Search engine for the Deep Dive activity
- 50–60 minutes

---

## Watch First
Watch **Module 01: Chain of Thought Prompting**.

Key principle: Make AI show its work. Engage with steps, not just conclusions.

---

## Background

Reasoning is one of the oldest and most studied human activities. Philosophers from Aristotle to Descartes spent their careers trying to understand how valid arguments are built — how you get from premises to conclusions without making logical errors along the way. For most of history, this was considered an exclusively human domain. Then, in the 2020s, researchers discovered something surprising: large language models produced noticeably better outputs when they were prompted to "think step by step" rather than jump straight to an answer. This was not because the model suddenly became smarter — it was because structured reasoning constrained the output in ways that reduced certain types of errors.

Chain of thought (CoT) prompting emerged as one of the most impactful techniques in AI interaction. A 2022 paper from Google Brain showed that prompting a language model to reason through steps before giving an answer dramatically improved its performance on mathematical and logical tasks — sometimes by 40% or more. The technique works because it forces the model to commit to intermediate steps, making it harder to arrive at a conclusion that contradicts its own earlier logic.

But here is what makes this relevant to you beyond just prompting AI: chain of thought is actually a model for how careful thinkers approach hard problems. Lawyers build arguments step by step, anticipating counterarguments at each stage. Scientists form hypotheses, test predictions, and update beliefs as evidence comes in. Philosophers construct proofs where every claim must follow from established premises. When you learn to prompt AI using chain of thought, you are also learning the architecture of rigorous thinking.

The alternative — asking for quick answers without structured reasoning — produces a particular kind of problem that researchers call "confident wrongness." This is when someone (or something) gives a definitive-sounding answer that is actually poorly reasoned or factually wrong. You have seen this in conversations, in social media posts, in political speeches. Learning to recognise the difference between a conclusion that emerged from careful reasoning and one that was just asserted is one of the most valuable intellectual skills you can develop.

There is also a social dimension to this. In an era of instant takes, viral opinions, and outrage cycles, the ability to say "wait, let me think through this properly" is increasingly rare and valuable. Chain of thought is not just a prompting technique — it is a disposition toward hard questions. It is the habit of slowing down when your instinct is to react.

---

## The Big Picture

The ability to structure reasoning clearly connects to almost every high-value career and intellectual activity. Lawyers win cases by building logical argument chains that withstand attack. Engineers diagnose problems by working through fault trees. Doctors reason through differentials — systematically eliminating possibilities based on evidence. Data scientists construct analytical pipelines where each step depends on the last. Even creative writers use structured narrative reasoning to build plots that hold together.

In your lifetime, AI tools will get better and faster. The question is not whether AI can produce answers — it clearly can. The question is whether you can evaluate those answers, identify where the reasoning goes wrong, and push back with intelligence. That is a human skill that becomes more valuable, not less, as AI becomes more capable. The person who can engage critically with AI's reasoning — interrogating its assumptions, identifying logical gaps, asking the right follow-up questions — will consistently get better outcomes than someone who just accepts whatever the machine says.

---

## Key Terms

> **Chain of Thought (CoT):** A prompting technique that asks an AI to work through reasoning steps before giving a final answer, producing more transparent and often more accurate outputs.
>
> **Steelmanning:** Presenting the strongest possible version of an argument you are examining or opposing — the opposite of a strawman.
>
> **Premises:** The assumptions or starting points that an argument builds from. If a premise is false, the conclusion may be invalid even if the logic is correct.
>
> **Inference:** Moving from one claim to another based on evidence or logic.
>
> **Epistemic humility:** The intellectual habit of acknowledging what you do not know and remaining open to revising your beliefs when you encounter new evidence.
>
> **Confirmation bias:** The tendency to seek out, interpret, and remember information in ways that confirm beliefs you already hold.

---

## Try It — The Structured Debate

### Step 1: Choose a Complex Question (5 mins)

Pick a question that is genuinely contested — where reasonable people disagree. Not "is murder bad" (obvious) but something with real tension.

Ideas:
- Should social media platforms be allowed to ban users?
- Is it okay to use AI to write essays for school?
- Should there be an age limit for using TikTok?
- Should robots that take people's jobs be taxed?
- Is it ever right to break a rule you think is unfair?

Your question: _______________________

---

### Step 2: The Bad Version (5 mins)

Ask AI directly: "What do you think about [your question]?"

Copy the response. Rate it:
- Depth (1–5): ____
- Balance (1–5): ____
- Did it change how you think? (yes / no / a bit)

---

### Step 3: Build Your Chain of Thought Prompt (15 mins)

Now build a properly structured CoT prompt. Use this structure as a base and customise it:

```
I want to think through this question carefully: [YOUR QUESTION]

Please don't give me a quick answer. Instead, work through these steps:

Step 1: Who are the main stakeholders? What does each group care about?
Step 2: What does the best available evidence say about this issue?
         Separate what's well-established from what's still debated.
Step 3: What's the strongest argument in FAVOUR of [position A]?
Step 4: What's the strongest argument AGAINST [position A] (i.e., in favour of [position B])?
Step 5: What key piece of information would most change your view?
Step 6: Only now — give me your tentative view, with caveats.
```

Paste your full customised prompt into your notebook before running it.

---

### Step 4: Run the Prompt and Engage (20 mins)

Run your CoT prompt. Read the full response carefully.

Now pick ONE step where you disagree, have more information, or think the AI missed something important.

Write a follow-up message that:
1. Names the specific step you are pushing back on
2. Explains what you think is wrong or missing
3. Asks it to revise that step specifically

**Your pushback message:** _______________________

After the AI revises — did the conclusion change? Did the quality improve?

---

### Step 5: The Flip (10 mins)

Now run the same prompt but explicitly ask the AI to take the *opposite* position to what it concluded:

> "I want you to steelman the other side now. Argue as compellingly as possible for [opposite view], even if you disagree. What's the best case for that position?"

After reading this:
- Which argument did you find more convincing overall?
- Did the AI's steelman version change your view at all?

---

## Deep Dive — Reasoning Failures in the Wild

This activity takes you beyond AI prompting into the real world of argumentation.

**Your task:** Find a real argument — not a made-up example, but something someone actually published or said.

Good sources:
- A newspaper opinion piece (Guardian, Times, BBC News Opinion)
- A YouTube video making a specific claim about society, politics, or technology
- A social media post that went viral because of its argument, not just its emotion
- A speech excerpt from a politician or public figure

**Step 1:** Identify the core claim being made (one sentence: "They are arguing that...")

**Step 2:** Map the chain of reasoning:
- What premises are they starting from? (What assumptions must be true for their argument to hold?)
- What evidence do they cite?
- What is the logical step from evidence to conclusion?

**Step 3:** Find the weakest link. In any chain of reasoning, there is usually one step that is less well-supported than the others. Where is the gap in this argument?

**Step 4:** Run this prompt with the AI:
```
Someone is arguing that [CLAIM].
Here are the steps of their argument as I understand them: [YOUR MAPPING]
Help me evaluate this chain of reasoning:
1. Are there any hidden premises I missed?
2. Is any step logically invalid (even if the premises were true)?
3. What evidence would someone need to check to assess this properly?
4. What is the strongest version of the counterargument?
```

**Step 5:** Write a 150-word evaluation of the argument you found. Is it sound? What would need to be true for it to convince you?

---

## Level Up — The Chain of Thought Audit

Take a real argument you have seen or heard recently — a news opinion piece, a YouTube video's main claim, a post you have seen.

Ask the AI to reconstruct its chain of reasoning:

```
Someone is arguing that [CLAIM]. Help me reverse-engineer their reasoning.
What premises must they be assuming?
Where could someone reasonably disagree?
Is any step logically weak?
What evidence would you need to evaluate this argument properly?
```

What did this reveal about the argument?

**Extension:** Now apply the same audit to a belief you hold yourself. Pick something you believe fairly strongly — about society, education, technology, or anything else. Ask AI to steelman the opposing view. Does the exercise change anything about how confident you feel?

---

## Debate This

Use these questions for a class or partner discussion. There are no simple right answers — the goal is to reason carefully through the tension.

1. **Is structured reasoning always better than intuition?** Many great decisions in history were made quickly, on instinct, by people who did not have time to work through every step. Are there situations where chain of thought reasoning is actually a disadvantage — where too much deliberation leads to worse outcomes?

2. **Does asking AI to "show its work" mean we understand the reasoning?** When a language model produces a chain of thought, is that actually the reasoning process it used — or is it generating a plausible-sounding explanation after the fact? What is the difference between a real explanation and a convincing one?

3. **Should schools teach formal logic and argumentation as a core subject?** Given how much misinformation circulates online, would it make more sense to spend a year of secondary school teaching students how arguments work — identifying premises, recognising fallacies, evaluating evidence — instead of or alongside traditional subjects?

---

## Reflect

1. What is the difference between AI giving you an answer and AI showing you *how it got there*? Why does that difference matter?

2. When you pushed back on a step, did you feel like you were thinking more actively? What made that different from just reading the output?

3. Can you think of a time in real life — a conversation, a debate, a decision — where breaking the reasoning into explicit steps would have helped?

4. The "bad version" test at the start produced a quick answer. Did it feel satisfying in the moment? What is the psychological appeal of quick, confident answers — and why might that be dangerous?

5. If chain of thought prompting makes AI responses better, what does that imply about how humans should approach their own reasoning? Are there everyday situations where you rush to conclusions in the same way an AI does without CoT?

---

## Share (Optional)

Share the question you worked through and one thing the chain of thought process revealed that a direct question would have missed.

---

## Coming Up Next
Module 02: AI Ethics: Bias & Fairness — where does bias come from in AI, who is most affected, and what responsibility do we have?
