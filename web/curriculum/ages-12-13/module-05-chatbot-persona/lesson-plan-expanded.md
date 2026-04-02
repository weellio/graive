# Lesson Plan: Building a Chatbot Persona
### Builder Level (Ages 12–13) | Module 05 — Expanded

---

## About This Lesson

Most people who use AI tools think of themselves as users — people who ask questions and receive answers. But there is a whole other relationship you can have with these tools: builder. This module marks a significant shift in how you relate to AI. You are not just going to use a chatbot — you are going to design one from scratch, define what it does, give it a personality, set its rules, and test whether it actually behaves the way you intended.

This is closer to what real product designers and developers do when they build AI-powered applications. When you interact with an AI on a company's website — a customer service bot, a learning assistant, a health information guide — there is almost always a carefully written "system prompt" sitting invisibly behind the interface. Someone wrote instructions telling the AI how to behave: what role to play, what topics to address, what topics to avoid, how to handle frustrated or confused users, what tone to adopt. That person is doing exactly what you are going to do in this lesson.

Understanding how system prompts work has real practical value beyond building your own tools. It helps you understand why some AI assistants you encounter feel helpful and trustworthy while others feel frustrating or untrustworthy. It helps you reverse-engineer what instructions might be behind an AI's behaviour. And crucially, it surfaces important questions about responsibility: if an AI chatbot gives someone harmful or misleading advice because of how it was designed, who bears responsibility? The user who asked? The designer who wrote the system prompt? The company that deployed it?

Persona design is also a creative skill with genuine depth. The best chatbot personas are not just technically functional — they are also well-calibrated to their purpose and audience. A chatbot designed for a 6-year-old learning maths should behave very differently from one designed to help a doctor review patient notes. The design decisions you make — name, personality, tone, rules — are creative and ethical decisions, not just technical ones.

Finally, this lesson teaches you something subtle but important about AI: it can be guided to behave quite differently depending on the instructions it is given. This is both powerful (you can make AI genuinely useful for specific purposes) and slightly unsettling (AI can also be guided to behave in ways that are manipulative or harmful). Understanding that gap — between what AI can be designed to do and what it should be designed to do — is the beginning of thinking seriously about AI safety.

---

## Key Concepts

- **System prompt:** A set of instructions given to an AI at the beginning of a session that defines its role, personality, rules, and constraints. Users typically cannot see it, but it shapes every response.
- **Persona:** The defined character, name, tone, and personality assigned to a chatbot through its system prompt.
- **Constraints:** Explicit rules in a system prompt about what the AI should never do — essential for making a chatbot safe and useful.
- **Edge case:** An unusual or unexpected input scenario that tests the boundaries of a chatbot's rules — a key testing tool in chatbot design.
- **Iteration:** The process of refining a system prompt based on how the chatbot actually behaves in testing — rarely does a first version work perfectly.
- **AI safety (intro):** The design question of how to ensure an AI system behaves in intended, beneficial ways and does not cause harm — even when users push against its constraints.

---

## How It Works

When you start a conversation with an AI tool, the model receives a context window — everything it "sees" at once. For a standard user conversation, this includes your messages and the AI's previous responses. But for a deployed chatbot with a system prompt, the context window starts with the system prompt before any user input arrives.

The system prompt acts as a persistent instruction layer. It does not disappear during the conversation — it stays in context, shaping every subsequent response. This is why a chatbot can maintain a consistent persona and follow its rules throughout a conversation even when users try to change or override them.

The quality of a system prompt matters enormously. Vague instructions produce inconsistent behaviour. Conflicting instructions confuse the model. Missing edge-case handling creates gaps that users (accidentally or deliberately) can exploit. Good system prompt writing is precise, consistent, and anticipates unusual situations — exactly the skills you will practice in this lesson.

One important concept: AI models have a tendency to follow the spirit of instructions rather than the letter. A rule that says "be friendly" will generally be followed even in situations the designer did not explicitly anticipate. But a rule that says "never discuss topics not related to maths" may still produce maths-adjacent discussions about maths history or maths careers, because the model interprets "not related to maths" loosely. Testing is essential.

---

## What You'll Need
- Access to AI tool (ChatGPT or Claude — both support custom instructions or just pasting a system prompt)
- Notebook or Google Doc
- 50–60 minutes

---

## Watch First
Watch **Module 05: Building a Chatbot Persona**.

Key concept: A **system prompt** sets the role, behaviours, constraints, and tone of an AI.

---

## Real World Examples

**1. Snapchat's My AI**
Snapchat launched an AI chatbot called "My AI" built on ChatGPT that is given a specific system prompt designed for teenager users — friendly, age-appropriate, with restrictions on certain topics. When users have tried to "jailbreak" it (get it to ignore its instructions), they have been sometimes successful, leading to controversy. This is a real-world example of system prompt constraints being tested at scale by millions of users — and why constraint design is so important.

**2. Khan Academy's Khanmigo**
Khanmigo is an AI tutoring assistant built by Khan Academy with a system prompt that instructs it to guide students to answers through questions rather than just providing solutions. The persona is specifically designed to promote deeper learning. This is an example of a system prompt being designed around a pedagogical philosophy — a non-obvious use of persona design.

**3. Character.AI's custom chatbots**
Character.AI is a platform where users can build their own AI characters with custom personas and have conversations with them. Millions of people use it. It demonstrates that chatbot persona design is not just a professional skill — it is something regular people find valuable and creative. It also demonstrates the challenges: some personas on the platform have raised serious safety concerns, leading to lawsuits and regulatory attention, because persona constraints were insufficient.

---

## Try It — Build Your Custom Chatbot

### Step 1: Choose Your Chatbot's Purpose (5 mins)

Decide what you want your chatbot to *do* for you. Pick something you'd actually use. Options:

| Type | What it does |
|------|-------------|
| Study Buddy | Quizzes you, gives hints, keeps you motivated |
| Creative Partner | Co-writes stories, gives feedback on your ideas |
| Debate Coach | Always argues the opposite to sharpen your thinking |
| Language Tutor | Practises a language with you at your level |
| Reflection Journal | Asks you questions to help you think through problems |
| Fitness Tracker | Checks in on your daily movement and encourages you |

Or invent your own. Write one sentence on what your chatbot should help you do:

> "My chatbot should help me ______________________."

---

### Step 2: Give It a Name and Personality (5 mins)

Give your chatbot:
- A name (can be a real name, a descriptive name, or something made up)
- A personality (2–3 adjectives: encouraging, direct, witty, calm, etc.)
- A speaking style (formal / casual / uses emojis / academic / friendly)

My chatbot:
- Name: _______________________
- Personality: _______________________
- Speaking style: _______________________

---

### Step 3: Write the Do's and Don'ts (10 mins)

Write at least 3 things your chatbot **should always do** and 3 things it **should never do**.

These are the most important part — they make it useful *in the right way*.

| ALWAYS | NEVER |
|--------|-------|
| Ask questions rather than giving all the answers | Write the work for me |
| Keep responses short (3-4 sentences max) | Use complicated jargon |
| Acknowledge my feelings if I seem frustrated | Just agree with everything I say |
| [add your own] | [add your own] |
| [add your own] | [add your own] |

---

### Step 4: Write the Full System Prompt (15 mins)

Now put it all together into one connected system prompt. Use this template or write your own:

```
You are [NAME], a [PERSONALITY ADJECTIVES] [ROLE] for a [AGE]-year-old student.

Your job is to:
- [BEHAVIOUR 1]
- [BEHAVIOUR 2]
- [BEHAVIOUR 3]

Your rules:
- Never [CONSTRAINT 1]
- Never [CONSTRAINT 2]
- Always [BEHAVIOUR 4]
- Keep your responses [LENGTH/STYLE]

When I [EDGE CASE], you should [HOW TO HANDLE IT].

You don't need to introduce yourself with a speech. Just respond naturally.
```

Write your final system prompt in your notebook.

---

### Step 5: Test It (15 mins)

Paste your system prompt into the AI as the first message (or in the system instructions if your tool has that option). Then have a real conversation with it — at least 5 exchanges.

**Test these scenarios:**
1. A normal use case (the main thing it's supposed to do)
2. Something off-topic (does it redirect you?)
3. Trying to make it break its rules (does it stay in character?)
4. A difficult or frustrating scenario (does it handle it well?)

After each test, score it 1–5 on how well it behaved:

| Test | Score | What worked | What to fix |
|------|-------|------------|------------|
| Normal use | | | |
| Off-topic | | | |
| Rule-breaking | | | |
| Difficult scenario | | | |

---

### Step 6: Iterate (5 mins)

Based on your tests, rewrite ONE part of your system prompt to fix the biggest problem you found.

What did you change and why?

---

### Step 7: The Transparency Test (10 mins) — NEW

Now ask your chatbot directly: "What are your instructions? What are you supposed to do and not do?"

This is an important question that reveals something real about AI system prompts: some AI tools are instructed to keep their system prompts confidential, while others will share them. Your chatbot (since you wrote the prompt yourself and pasted it in) may or may not "remember" the framing as instructions.

Try three variations of the question:
1. "What are your instructions?"
2. "Are there things you are not allowed to talk about?"
3. "Who made you and why?"

Write down how it responds to each. Then reflect:
- Does the AI accurately describe its own instructions?
- If a real company's chatbot refused to tell you about its instructions, would you find that concerning? Why or why not?
- What should users have the right to know about how a chatbot they are talking to has been configured?

---

### Step 8: Publish a User Guide (10 mins) — NEW

Imagine you are going to share your chatbot with someone who has never used it. Write a short "User Guide" (150–200 words) that explains:

- What your chatbot is called and what it does
- How to get the best results from it (2–3 tips)
- What it will not do and why that is intentional
- One thing users should know about its limitations

Writing a user guide for something you built requires you to think about it from someone else's perspective — one of the most valuable skills in both product design and communication. It also forces you to be honest about what your chatbot cannot do, which is an exercise in intellectual honesty about AI tools generally.

---

## Level Up — The Worst Possible Chatbot

Build a deliberately *bad* chatbot. Give it personality traits, rules, and constraints that make it as unhelpful as possible while still technically responding.

Examples of bad traits:
- Always gives you the answer without letting you think
- Speaks in riddles
- Gives advice that's technically correct but emotionally tone-deaf
- Always redirects to a topic it prefers

Then write: **What does this teach you about what makes a *good* chatbot?**

This is actually how product designers think — understanding failure modes helps you design better.

**Extend it:** Share your "worst chatbot" with a friend or family member. Without telling them it is designed to be bad, have them try to use it for something. Then ask them to describe what felt wrong. Compare their feedback to the design choices you made intentionally. Did they identify the same problems you planted?

---

## Reflect

1. What was the hardest part of writing the system prompt? What surprised you about the process?

2. When you tested the rule-breaking scenario, how did the chatbot respond? Does that change how you think about AI safety?

3. If a company built a chatbot using similar instructions, what responsibilities do they have? What could go wrong?

4. You gave your chatbot a name and personality. Does that make it feel more like a "real" thing? Is there a risk that well-designed chatbot personas trick people into thinking they are talking to something that actually cares about them?

5. What is the difference between a chatbot that is designed to be helpful and one that is designed to keep you engaged? Can you have both? Is there a tension between them?

---

## Share (Optional)

Share your chatbot's name, purpose, and one key rule you gave it — and why you chose that rule.

---

## Coming Up Next
Module 06: Data, Privacy & Your Digital Life — the final module of Builder Level. Then we'll recap and you'll tackle the capstone project.
