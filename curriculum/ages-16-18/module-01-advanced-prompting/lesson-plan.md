# Lesson Plan: Advanced Prompting Systems
### Innovator Level (Ages 16–18) | Module 01

---

## Objective
Build a working prompt chain for a real task, create one reusable template, and use a meta-prompt to improve your own prompting.

---

## What You'll Need
- AI tool (Claude or ChatGPT — both work for this)
- A real task you need to complete (school, personal project, or creative work)
- Notebook or Google Doc
- 75–90 minutes

---

## Watch First
Watch **Module 01: Advanced Prompting Systems**.

The four techniques: prompt chaining, meta-prompts, reusable templates, role separation.

---

## Exercise 1: Build a Prompt Chain (30 mins)

### Choose your task

Pick something complex you actually need to do. It must have multiple distinct phases. Examples:
- Writing a long-form piece (essay, article, script)
- Researching and planning a project
- Preparing for an interview or presentation
- Making a significant decision
- Creating a business or product concept

Your task: _______________________

### Design your chain

Before running anything, design the chain on paper:

| Step | What this step does | Input (from where?) | Output (what format?) |
|------|--------------------|--------------------|----------------------|
| 1 | | | |
| 2 | | Step 1 output | |
| 3 | | Step 2 output | |
| 4 | | Step 3 output | |

### Run the chain

Run at least the first 3 steps. At each step:
- Evaluate the output before moving to the next step
- Decide if you need to refine before continuing
- Keep notes on what worked and what didn't

**Reflection:** How different was the final output from what you'd have gotten with a single prompt?

---

## Exercise 2: Meta-Prompt Practice (20 mins)

Run this meta-prompt on a task you care about:

```
I want to complete this task using AI: [DESCRIBE YOUR TASK IN 2-3 SENTENCES].

Please help me by:
1. Identifying what information I need to provide for you to do this well
2. Suggesting the ideal prompt structure for this type of task
3. Warning me about common ways this type of request goes wrong
4. Giving me a draft prompt I can use and modify

Then ask me any clarifying questions you need before we begin.
```

After you get the meta-prompt response:
- Evaluate the prompt it wrote for you
- Modify it based on your own knowledge of what you need
- Run the improved version

**What did the meta-prompt reveal that you hadn't thought of?**

---

## Exercise 3: Build a Reusable Template (20 mins)

Identify a task you do repeatedly (or that you'll do repeatedly). Some ideas:
- Summarising articles or research papers
- Getting feedback on your writing
- Brainstorming ideas in any domain
- Preparing for a conversation or debate
- Analysing something from multiple perspectives

Build a template using this structure:

```
[TEMPLATE NAME]

Role: You are [ROLE/PERSONA].
Context: [FIXED CONTEXT — what's always true about this task]
Task: [CORE TASK — with [PLACEHOLDERS] for variable elements]
Format: [CONSISTENT FORMAT REQUIREMENTS]
Constraints: [CONSISTENT RULES]

Variable inputs:
- [PLACEHOLDER 1]: [what goes here]
- [PLACEHOLDER 2]: [what goes here]
```

Test your template on two different specific instances to make sure it generalises.

---

## Exercise 4: Role Separation Analysis (15 mins)

Apply role separation to something you're working on — a decision, a project, or an idea.

Design three different roles that would give you useful perspectives:

| Role | Prompt instruction | What you expect to learn |
|------|-------------------|-------------------------|
| 1: | You are a [ROLE]... | |
| 2: | You are a [ROLE]... | |
| 3: | You are a [ROLE]... | |

Run all three. Then run a synthesis prompt:

> 'Given these three perspectives [paste all three outputs], what would you recommend focusing on first, and why?'

**What did the multi-perspective approach reveal that a single perspective would have missed?**

---

## Level Up — Build a Prompt System for Someone Else

Design a prompt chain or template that someone with no prompting experience could use for a specific task.

Requirements:
- The person doesn't know about AI or prompting
- The template should work with minimal customisation
- Include instructions for how to fill in the variables

Who is it for? What task does it solve? Test it by asking someone else (a family member, a friend) to actually use it with no help from you.

**What had to be simplified for it to work for a non-expert?**

---

## Reflect

1. What's the difference between using AI as a tool and using AI as a system? Where does that distinction matter most?

2. The meta-prompt approach is essentially asking AI to improve its own instructions. What does that tell you about how prompting works?

3. Which of the four techniques do you think will be most useful for you personally, and in what context?

---

## Share (Optional)

Share one reusable template you built and the use case it's designed for. Include the placeholders so others can use it.

---

## Coming Up Next
Module 02: Building with AI (No-Code) — we go from prompting to actually building automations that run without you.
