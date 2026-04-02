# Lesson Plan: Debug Your Prompt
### Builder Level (Ages 12–13) | Module 10 — Expanded

---

## About This Lesson

In computing, debugging is the process of finding and fixing errors in code. A program that does not work is not a mystery — it has a cause, and that cause has a fix. The programmer's job is not to hope it will magically work next time; it is to systematically identify what went wrong and address it specifically. This mindset is one of the most valuable things computing education gives people, and it applies far beyond programming.

Prompt debugging is the same systematic approach applied to AI conversations. When you get a bad response from an AI — something too vague, too long, off-topic, written at the wrong level, or missing the point entirely — most people's first instinct is to either give up or start again with a slightly different version of the same bad prompt, hoping this time will be different. This is the equivalent of randomly changing lines of code without understanding why they are failing. It wastes time and rarely produces improvement.

The six failure modes you will learn in this lesson are a diagnostic framework — a way of looking at a bad AI output and identifying which specific thing went wrong. This matters because different failure modes have different fixes. If the problem is that the output is too vague (Failure Mode 1), adding more detail to your topic specification will help. But if the problem is that the output is for the wrong audience (Failure Mode 2), adding more topic detail will not help at all — you need to explicitly name your audience. Misdiagnosing the failure mode leads to wrong fixes and continued frustration.

There is also a broader skill here that goes well beyond AI. Systematic troubleshooting is a cognitive habit — a preference for diagnosis before action, for understanding before trying. Engineers, doctors, scientists, and skilled tradespeople all use diagnostic frameworks. The problem with random trial-and-error (in cooking, in fixing technical problems, in relationships, in academic work) is that even when it accidentally works, you do not learn why. Systematic diagnosis teaches you something that you can apply again.

Finally, this lesson touches on something subtle about the nature of AI outputs: sometimes a prompt is excellent and the AI still gives a poor response. This can happen because AI has genuine gaps in knowledge, because it is handling edge cases in unpredictable ways, or simply due to the randomness built into the generation process. Knowing the difference between "my prompt is flawed" and "the AI is genuinely unreliable on this topic" is an important judgment skill.

---

## Key Concepts

- **Debugging:** The systematic process of identifying the specific cause of a problem before attempting to fix it — applied to prompts when AI outputs are poor.
- **Failure mode:** A specific category of prompt failure, each with its own cause and fix — the six modes covered here are: Too Vague, Wrong Audience, Wrong Format, Missing Constraint, Wrong Role, and Context Mismatch.
- **Root cause analysis:** The diagnostic habit of asking "why did this fail?" before jumping to "what should I change?" — the core mental model behind effective debugging.
- **Iterative refinement:** The practice of making targeted, specific changes to a prompt based on a diagnosis of what went wrong — as opposed to starting over or making random changes.
- **Edge case:** An unusual or extreme situation that tests the boundaries of a system (or a prompt) in ways that normal use would not reveal.
- **Diagnostic checklist:** A structured list of questions used to systematically identify the cause of a problem — in this case, the six-question Prompt Debugging Checklist.

---

## How It Works

AI outputs are not random — they are highly structured responses to the patterns and signals in your prompt. This means that bad outputs are almost always traceable to specific prompt problems.

When you write a prompt, every element of it steers the model's probability distribution for the output. A vague topic produces a wide distribution — the AI is essentially making its best guess about what "anything" means. A specific topic narrows that distribution dramatically. Role instructions, format requests, and constraints all further narrow it in specific directions.

The six failure modes correspond to six different types of "missing narrowing" — six ways in which your prompt left the distribution too wide in a specific dimension:

- **Too Vague:** Wide topic distribution — add specifics
- **Wrong Audience:** Wide register/vocabulary distribution — specify the reader
- **Wrong Format:** Wide structure distribution — specify the shape of the output
- **Missing Constraint:** Wide content scope — specify what to exclude or include
- **Wrong Role:** Wide voice/persona distribution — specify who the AI should be
- **Context Mismatch:** Wide purpose distribution — explain why you need this

Understanding this mechanistically makes debugging more intuitive: you are always looking for the dimension that is too wide and narrowing it deliberately.

---

## What You'll Need
- A device with internet access
- A free AI tool (ChatGPT free or Claude free)
- Paper and coloured pens OR a digital document
- About 45 minutes

---

## Watch First
Watch **Module 10: Debug Your Prompt** with a parent or on your own.

Remember: When code does not work, a programmer does not just keep running it and hoping. They debug — they systematically look for what went wrong. Prompting is the same. Bad outputs have causes, and causes have fixes.

---

## Real World Examples

**1. Customer service chatbots and failure patterns**
Every company that deploys an AI customer service chatbot invests significant time in prompt debugging — studying cases where the bot gave poor responses and identifying which failure modes were responsible. This is called "red-teaming" and is a standard part of AI product development. The same failure modes you will learn in this lesson are exactly what product teams look for.

**2. AI writing assistants in newsrooms**
Journalism organisations that have experimented with AI writing assistants have documented specific patterns of failure: writing at the wrong reading level for the audience (Wrong Audience), producing too-formal or too-casual prose (Wrong Role), and producing text that is technically accurate but misses the editorial point of the story (Context Mismatch). Journalists who get good results have learned to write precise prompts that address these specific failure modes.

**3. AI coding assistants and debugging parallels**
GitHub Copilot, the AI coding assistant, produces bad code suggestions in predictable patterns: too generic code when the context is not specified, code that uses the wrong library when no preference is stated, code that is technically correct but violates the style conventions of the project. Developers who work effectively with it have learned to write comments that address these specific failure modes before asking for code generation.

---

## Try It — The Debugging Process

### Activity 1: Learn the Six Failure Modes (15 mins)

Before you can fix a broken prompt, you need to know what kind of broken it is. There are six common failure modes:

**Failure Mode 1 — Too Vague**
*Symptom:* The response is generic, shallow, and could have been about anything.
*Cause:* The prompt did not give enough specifics — subject, context, audience, purpose.
*Fix:* Add details. Answer: who, what, why, for whom, in what format.

**Failure Mode 2 — Wrong Audience**
*Symptom:* The response is too complicated, too simple, or uses the wrong tone (too formal, too casual).
*Cause:* The AI made assumptions about who it was writing for.
*Fix:* Explicitly state the audience. "Explain this to a 12-year-old" vs "Explain this to a university student" produces very different results.

**Failure Mode 3 — Wrong Format**
*Symptom:* You wanted a list but got a wall of text. You wanted a story but got an essay. You wanted 100 words but got 400.
*Cause:* You did not specify format, length, or structure.
*Fix:* Add format instructions. "In 5 bullet points." "As a conversation." "Under 200 words." "Using headings."

**Failure Mode 4 — Missing Constraint**
*Symptom:* The AI went in a direction you did not want — it included things you did not want, or excluded something you needed.
*Cause:* You told it what to do but not what NOT to do, or what was required.
*Fix:* Add constraints. "Do not include..." "You must include..." "Stay focused on..."

**Failure Mode 5 — Wrong Role/Perspective**
*Symptom:* The response sounds like a robot, a textbook, or a news report when you wanted warmth, creativity, or expertise.
*Cause:* You did not tell the AI what role to play or what voice to use.
*Fix:* Give it a persona. "You are a friendly science teacher." "Write this as if you are an enthusiastic 13-year-old." "You are a professional editor."

**Failure Mode 6 — Context Mismatch**
*Symptom:* The response is technically correct but completely misses the point of what you actually needed.
*Cause:* The AI did not know the background — why you are asking, what you already know, what the real goal is.
*Fix:* Add context. "I am asking because..." "I already know [X], so skip that." "The goal of this is..."

**Your task:** For each of the six failure modes, write one example prompt that would trigger that failure. (You do not need to run them — just write them.) For example, a prompt that would trigger Failure Mode 1 might be: "Write something about history."

---

### Activity 2: The Debugging Checklist in Action (15 mins)

Here is the Debugging Checklist. Print it out, copy it into your notes, or memorise it:

```
PROMPT DEBUGGING CHECKLIST

When AI gives you a bad response, go through these questions:

[ ] 1. Did I say WHO this is for? (age, knowledge level, audience)
[ ] 2. Did I say WHAT format I want? (length, structure, bullets, prose)
[ ] 3. Did I give enough CONTEXT? (why I need this, what I already know)
[ ] 4. Did I give it a ROLE? (tutor, editor, creative partner, expert)
[ ] 5. Did I set any CONSTRAINTS? (what to include, what to avoid)
[ ] 6. Is my request SPECIFIC enough? (topic, angle, purpose)

If you answered "no" to any of these — fix that one thing first.
```

Now practise with a broken prompt scenario:

**The broken prompt:** "Help me with my history homework."

This prompt will fail on almost every item on the checklist. Your task:

1. Go through the checklist and tick which items it fails on (you should find most of them are missing)
2. Rewrite the prompt to fix all the failing items
3. Run your improved prompt and compare the output to what you would get from the broken version

Here is one possible improved version to compare yours against (do not look until you have written your own):

> "You are a helpful history tutor for a 12-year-old UK student. I need to write a 300-word analysis of why World War I started. I already know about Franz Ferdinand's assassination but I am confused about how one assassination caused a whole world war. Give me a clear explanation in plain language, then suggest 3 key points I could use in my essay. Use bullet points for the essay points."

How does your improved version compare? What did you include that the example missed? What did the example include that you missed?

---

### Activity 3: Diagnose These Broken Outputs (10 mins)

Read each prompt and the (imagined) response it received. Diagnose which failure mode caused the problem and write the fixed prompt.

**Case 1:**
Prompt: "Write a poem."
Response received: A generic rhyming poem about seasons, four verses, fairly dull.
Diagnosis: Which failure mode? ______
Your fixed prompt: ______

**Case 2:**
Prompt: "Explain quantum physics to me."
Response received: A deeply technical explanation using terms like "wave-particle duality," "quantum superposition," and "Heisenberg's uncertainty principle" with no definitions.
Diagnosis: Which failure mode? ______
Your fixed prompt: ______

**Case 3:**
Prompt: "Write a persuasive speech about why we should eat less meat."
Response received: A 600-word essay-style piece with five paragraphs, an introduction, body, and conclusion. No speech-like qualities — no "Good morning everyone", no rhetorical questions, no applause cues.
Diagnosis: Which failure mode? ______
Your fixed prompt: ______

**Case 4:**
Prompt: "Give me ideas for my project."
Response received: Ten generic ideas about topics like climate change, recycling, world hunger, and space travel — none of which match the actual subject (a school project about local community history).
Diagnosis: Which failure mode? ______
Your fixed prompt: ______

Check your diagnoses: Cases 1, 2, 3, and 4 map to failure modes 1, 2, 3, and 6 respectively. Did you get them right?

---

### Activity 4: The Compound Failure — Two Problems at Once (10 mins) — NEW

Real prompt failures are often compound — multiple failure modes occurring together in the same prompt. This activity challenges you to identify and fix more complex cases.

Read these prompts and diagnose ALL failure modes present (there will be at least two in each):

**Compound Case A:**
Prompt: "Write something creative about my friend's birthday."
Likely response: A generic poem or card message that could be for anyone, any age, with no personal details.
Diagnosis: List all the failure modes present.
Your fixed prompt: Write a version that fixes every problem you identified.

**Compound Case B:**
Prompt: "Is climate change real?"
Likely response: A long, balanced, academic overview covering the scientific consensus, various perspectives, and major evidence.
The problem: The person was a 12-year-old who already knew climate change was real and wanted help writing a 3-minute presentation for their class.
Diagnosis: List all the failure modes present.
Your fixed prompt: Write a version that fixes every problem.

For each case, identify:
1. How many failure modes were you able to find?
2. Which failure mode caused the biggest gap between what was wanted and what was produced?
3. When you fix multiple failure modes at once, is the result significantly better than fixing just one?

---

### Activity 5: Build Your Own Broken Prompt Challenge (10 mins) — NEW

Now reverse the exercise. You are going to deliberately write bad prompts and see if a classmate (or family member) can diagnose the failure modes.

Write three prompts:
- **Prompt A:** Fails on exactly Failure Mode 1 (Too Vague) and nothing else
- **Prompt B:** Fails on exactly Failure Mode 3 (Wrong Format) and nothing else
- **Prompt C:** Fails on two failure modes of your choice

For each prompt, write the "answer key" — which failure modes it contains and what the fix would be.

If you can share this with someone, have them diagnose the failure modes without seeing your answer key. Compare their diagnosis to yours. Did they find all the problems? Did they find any you missed?

This "teaching" role is very powerful: creating examples that deliberately trigger specific failure modes requires you to understand those failure modes deeply enough to isolate them.

---

## Design It!

Create a **Prompt Debugging Flowchart** — a visual decision tree you could actually use when something goes wrong.

It should work like this:
- Start at the top: "AI gave me a bad response"
- First branch: "Is it too vague/generic?" → Yes → "Add specifics about topic, purpose, audience"
- Continue branching for each of the six failure modes
- Each branch ends with a specific fix action

Make it clear and visual — use arrows, boxes, and short labels. It should fit on one page. When you are done, it should be something you could actually consult the next time you are frustrated with an AI response.

---

## Reflect
Answer these questions out loud or write them down:

1. Before this lesson, what did you do when AI gave you a bad response? Did you have a method, or did you just try things randomly?
2. The debugging checklist is a systematic thinking tool. Can you think of other areas of life where having a systematic checklist helps you solve problems? (Cooking, sport, fixing technical problems, making decisions...)
3. Is it possible for an AI to give a bad response even when your prompt is perfect? What would cause that, and how would you handle it?
4. Which of the six failure modes do you think will be hardest for you to remember to fix? Why? What specific habit or reminder could help?
5. If you had to teach the debugging checklist to someone in under 2 minutes, how would you explain it? What would you prioritise?

---

## Share (Optional)
Share the Debugging Checklist with someone who uses AI tools — a friend, classmate, or parent. Walk them through one example of a broken prompt and show how going through the checklist fixes it. Teaching the system is the best way to prove you truly understand it.

---

## Coming Up Next
Module 11: AI in the News — AI is all over the news. But how much of it is real, how much is hype, and how much is outright fear-mongering? You are going to learn to read AI headlines with a critical eye.
