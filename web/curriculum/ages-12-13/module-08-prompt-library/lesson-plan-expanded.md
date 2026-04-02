# Lesson Plan: The Prompt Library
### Builder Level (Ages 12–13) | Module 08 — Expanded

---

## About This Lesson

There is a huge difference between knowing that a tool exists and being able to reach for it automatically when you need it. Most students who use AI do so reactively — they have a problem, they open the AI tool, they type something that feels roughly right, and they hope for a useful answer. This works occasionally, but it is inefficient and inconsistent. The people who get genuinely excellent results from AI — in school, in creative work, in professional life — tend to be the ones who have done the work of building a system: a set of tested, refined, ready-to-use prompts that they can reach for without starting from scratch every time.

A prompt library is that system. Think of it as the AI equivalent of a professional's toolkit — a surgeon does not pick up a random sharp object when they need to make an incision; a craftsperson does not guess which tool to use when they need to join two pieces of wood. They have tested tools, in their right place, ready to use. Your prompt library will eventually be similar: organised, tested, ready to deploy.

Building a library also forces you to think at a higher level of abstraction. Writing a single prompt for one specific task is relatively easy. Writing a template that works across many different situations on the same task requires you to identify what is general (the role, the format, the constraint) versus what changes each time (the specific topic or context). This is a genuinely sophisticated thinking skill — it is the difference between writing code that solves one problem and writing code that solves a class of problems.

Beyond school, the habit of maintaining a prompt library is a professional advantage that will grow in value as AI tools become more embedded in working life. The most productive AI users in any field are not necessarily the ones who understand the most about how AI works — they are the ones who have done the systematic work of figuring out which prompts work reliably for their specific needs and have organised those prompts for easy access.

Finally, this lesson introduces you to the meta-skill of evaluating your own prompts critically. It is not enough to write a prompt and use it — you need to be able to assess whether it is working well, identify what is making it fail when it does, and improve it over time. This is the mindset of a craftsperson, not a passive user, and it applies to far more than AI.

---

## Key Concepts

- **Prompt template:** A reusable prompt structure with placeholder brackets that can be filled in for different specific situations — more valuable than a single completed prompt.
- **Prompt library:** An organised, searchable personal collection of tested prompt templates, categorised by use case and tagged with notes about when and how to use them.
- **Abstraction:** The skill of identifying what is general across many situations versus what is specific to one — the core skill required to write effective templates rather than one-off prompts.
- **Template generalisation:** The process of testing a prompt template across multiple different topics to confirm it works broadly, not just for the specific case you wrote it for.
- **Version control:** The practice of keeping notes on previous versions of a prompt and what changed, so you can understand why one version works better than another.
- **Prompt portability:** The quality of a prompt that works across different AI tools (ChatGPT, Claude, etc.), not just the one it was originally written for.

---

## How It Works

A prompt template works because AI models are highly responsive to structural cues. When you specify "you are a [ROLE]," you are telling the model which part of its training distribution to draw from. When you specify "present it as [FORMAT]," you are telling it which structural patterns to follow in its output. When you add "[CONTEXT PLACEHOLDER]," you are identifying the part that varies — and everything else in the template is consistent scaffolding.

The reason templates outperform one-off prompts is that they encode your hard-won experience with what works. Each template you write has been tested and refined — the role is one that generates useful outputs for this task, the format is one that actually serves your needs, the constraints are ones that prevent the specific failure modes you have encountered. When you use the template next week on a different topic, you are benefiting from all that previous refinement automatically.

Templates also make you a faster, more confident AI user. When you have a tested template, the friction of starting a new AI task drops dramatically — you fill in one or two brackets and you are already starting from a position of quality rather than hoping this fresh prompt will work.

---

## What You'll Need
- A device with internet access
- A free AI tool (ChatGPT free or Claude free)
- A place to save your library: a Google Doc, Notion page, a Word document, or a physical notebook
- Paper and coloured pens OR a digital document
- About 50 minutes

---

## Watch First
Watch **Module 08: The Prompt Library** with a parent or on your own.

Remember: The difference between someone who gets average results from AI and someone who gets excellent results is usually preparation. A prompt library is your secret weapon — prompts you have already tested and refined, ready to use the moment you need them.

---

## Real World Examples

**1. Marketing agencies and prompt banks**
Digital marketing agencies now commonly maintain internal "prompt banks" — shared collections of tested prompts for email copywriting, social media captions, ad headlines, and content briefs. These libraries represent collective tested knowledge and allow new team members to start producing quality work immediately rather than reinventing effective prompts from scratch.

**2. Legal tech tools**
Law firms and legal tech startups are building libraries of prompt templates for common legal tasks — summarising contracts, identifying risk clauses, drafting standard letters. These templates encode legal expertise into the prompt structure, producing consistently useful outputs when filled in with case-specific details.

**3. Teachers and lesson planning tools**
Educators are building personal prompt libraries for generating differentiated explanations, writing quiz questions at different difficulty levels, producing feedback on student work, and planning lesson activities. The template approach means a teacher can generate a quiz on any topic in under a minute using a pre-built, tested template.

---

## Try It — Build Your Library

### Activity 1: Learn the Template Format (10 mins)

A prompt template is a prompt with blank spaces — a fill-in-the-blank structure you can reuse quickly. Here is what makes a great template:

**The Template Formula:**
> **Role** + **Task** + **Context** + **Format** + **Constraint**

- **Role:** Who should the AI act as? ("You are a history tutor", "You are a creative writing coach")
- **Task:** What should it do? ("Explain", "Write", "Summarise", "Give feedback on")
- **Context:** What is the specific situation? ("I am a 12-year-old who struggles with...", "This is for a school project on...")
- **Format:** How should it respond? ("In bullet points", "As a short paragraph", "As a step-by-step guide")
- **Constraint:** Any limits or requirements? ("Under 150 words", "No jargon", "Include at least one real example")

Here is an example template for summarising anything you are studying:

```
You are a patient and clear tutor for a 12-year-old student.
Summarise [TOPIC] in plain English.
I am studying this for [SUBJECT] and I need to understand [SPECIFIC ASPECT].
Format: 5 bullet points, each one sentence long.
Constraint: Do not use technical jargon. If you must use a technical term, define it in brackets immediately after.
```

To use this template, you just fill in the three [BRACKETS].

**Your task:** Take the template above and use it right now. Fill in the brackets with a topic you are actually studying in school (or something you are curious about). Run it and see the result.

Write down: Did the format work well? What would you change in the template to make it better for your needs?

---

### Activity 2: Build Six Core Prompts for Your Library (25 mins)

You are going to build six core prompts that will be useful for your life as a student. Each prompt should be written as a template (with [BRACKET] placeholders for the parts that will change each time).

Work through all six categories. For each one:
1. Write the template from scratch (you can use the formula from Activity 1)
2. Test it once with a real example
3. Rate it: does the output work? Adjust the template until it does.

**Prompt 1 — Essay Starter**
Purpose: Get a structured outline for any school essay.
Start with something like: "You are an essay planning assistant for a student aged 12–13..."
Include: essay topic, subject, key argument you want to make, word count.

**Prompt 2 — Study Explainer**
Purpose: Understand a concept you are confused about.
Start with: "I am struggling to understand [CONCEPT] in [SUBJECT]..."
Include: what you already understand, what specifically confuses you, how you want it explained.

**Prompt 3 — Creative Spark**
Purpose: Get unstuck when you need creative ideas (for stories, art projects, presentations).
Start with: "I need creative ideas for [TYPE OF PROJECT] about [TOPIC]..."
Include: your audience, your style preferences, any constraints you have.

**Prompt 4 — Feedback Requester**
Purpose: Get useful feedback on something you have written.
Start with: "I am going to share a piece of writing. Please give me feedback as a constructive writing coach..."
Include: what type of writing it is, what you want feedback on specifically, your level (school year / age).

**Prompt 5 — Research Starter**
Purpose: Kickstart research on any topic with a strong overview.
Start with: "Give me a research overview of [TOPIC]..."
Include: why you are researching it, how much you already know, what specific questions you need answered.

**Prompt 6 — Your Choice**
Purpose: You decide — what prompt would be most useful for your specific life?
Ideas: a debate prep prompt, a language learning prompt, a homework checker, a workout planner, a recipe creator, a game strategy analyser.

---

### Activity 3: Organise Your Library (10 mins)

A library is only useful if it is organised. Now you are going to set up your prompt library properly so you can actually find and use these prompts in the future.

Open your chosen storage tool (Google Doc, Notion, notebook, etc.) and create a section called **"My Prompt Library"**.

Organise it with these headings:
- **School: Understanding & Studying**
- **School: Writing & Essays**
- **Creative Projects**
- **Feedback & Improvement**
- **Personal / Other**

Place each of your six prompts under the right heading. For each prompt, add:
- The template itself
- One example of it filled in with real content
- One note about what it is best used for

Then add three blank rows at the bottom of each section labelled **"TO ADD"** — because your library should keep growing. Every time you write a great prompt in the future, add it here.

---

### Activity 4: Cross-Tool Portability Test (10 mins) — NEW

Not all AI tools respond identically to the same prompt. This activity tests whether your templates are portable — whether they work across different tools.

If you have access to more than one AI tool (e.g., both ChatGPT and Claude), take one of your templates from Activity 2 and run it on both tools with identical input.

Compare:
- Was the format the same?
- Was the length similar?
- Was the quality of information comparable?
- Did one tool follow the constraints more precisely?

If you only have access to one tool, try a different test: run the same template twice on the same tool for the same topic. AI has some randomness built in — how similar or different were the two outputs?

Write down what you discovered. A truly robust template should work well across tools and produce reasonably consistent quality across runs.

---

### Activity 5: The "Stress Test" — Push Your Templates to the Edges (10 mins) — NEW

The best way to find weaknesses in a template is to try to break it. For each of your six prompts, try at least one edge case: a situation where the template might fail.

For example:
- Your Essay Starter template — what happens if the essay topic is something very niche or unusual the AI might know little about?
- Your Study Explainer template — what if the concept you enter is something AI is known to misunderstand (like some areas of cutting-edge physics)?
- Your Creative Spark template — what if the constraints you add are contradictory or very unusual?

For each edge case you test, write:
1. What broke or produced a poor result?
2. What change to the template would prevent this failure?
3. Should you add a note to your library entry warning users about this limitation?

A template with documented limitations is more useful than one that claims to work for everything — because it tells you when to trust it and when to verify.

---

## Design It!

Design a **"Library Card"** for your most useful prompt (the one you think you will use most often).

Draw it like a real library card. Include:
- A title for the prompt (e.g. "The Essay Planner")
- The full template text
- A "best used for" section
- A "do not use for" section (situations where this prompt would not work well)
- A rating you give it (1–5 stars) based on your testing
- A small icon or symbol representing what it does

Make it look like something you would genuinely want to keep.

---

## Reflect
Answer these questions out loud or write them down:

1. Before this lesson, did you ever re-use a prompt you had written before? How might having a library change how you use AI going forward?
2. Why is it important that your templates have [BRACKET] placeholders rather than just saving a completed prompt? What does that flexibility give you?
3. You built prompts for school — but thinking bigger, what other areas of life might benefit from a prompt library? Think about careers, creative work, or personal life.
4. A prompt library is only useful if you maintain it. What would you need to do to keep yours up to date? What habits would ensure it does not become outdated or cluttered?
5. If you shared your prompt library with a classmate who had never written their own prompts, do you think they could use it effectively? What would be the gap between your library and their ability to use it?

---

## Share (Optional)
Share your "Feedback Requester" prompt (Prompt 4) with a friend or classmate. Ask them to test it on something they have written. Does it work for them as well as it does for you? This is a great way to discover whether your template is truly general-purpose or whether it is too tailored to your own style.

---

## Coming Up Next
Module 09: AI and Music — How does AI actually generate music? You are going to explore the tools, try making something, and tackle the thorny question of who owns what an AI creates.
