# Lesson Plan: Debug Your Prompt
### Builder Level (Ages 12–13) | Module 10

---

## Objective
By the end of this lesson, you have a systematic debugging checklist you can apply whenever an AI gives you a bad response — so instead of giving up or trying random changes, you diagnose the problem and fix it deliberately.

---

## What You'll Need
- A device with internet access
- A free AI tool (ChatGPT free or Claude free)
- Paper and coloured pens OR a digital document
- About 40 minutes

---

## Watch First
Watch **Module 10: Debug Your Prompt** with a parent or on your own.

Remember: When code does not work, a programmer does not just keep running it and hoping. They debug — they systematically look for what went wrong. Prompting is the same. Bad outputs have causes, and causes have fixes.

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

---

## Share (Optional)
Share the Debugging Checklist with someone who uses AI tools — a friend, classmate, or parent. Walk them through one example of a broken prompt and show how going through the checklist fixes it. Teaching the system is the best way to prove you truly understand it.

---

## Coming Up Next
Module 11: AI in the News — AI is all over the news. But how much of it is real, how much is hype, and how much is outright fear-mongering? You are going to learn to read AI headlines with a critical eye.
