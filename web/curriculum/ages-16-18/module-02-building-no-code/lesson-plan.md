# Lesson Plan: Building with AI (No-Code)
### Innovator Level (Ages 16–18) | Module 02

---

## Objective
Design and build at least one working AI automation using a no-code tool, and document it clearly enough that someone else could replicate it.

---

## What You'll Need
- A no-code automation tool: n8n (recommended, free at n8n.io) or Make (free tier at make.com)
- Access to an AI API key (free tiers available for Claude via claude.ai or OpenAI)
- Notebook or Google Doc for planning
- 90–120 minutes (building takes longer the first time)

---

## Watch First
Watch **Module 02: Building with AI (No-Code)**.

Key pattern: Trigger → Collect Data → Send to AI → Process Output → Take Action

---

## Phase 1: Design Before You Build (20 mins)

Good automation is designed before it's built. Before touching any tool:

### Choose your automation

Pick something that would genuinely save you time or give you something useful. Simple is better for a first build.

**Recommended starting options:**
1. **Daily topic briefing** — pull news/articles on a topic, summarise with AI, send to email
2. **Reading list summariser** — paste article text, AI extracts key points, saves to doc
3. **Study notes to quiz** — paste notes, AI creates quiz questions from them
4. **Personal weekly review** — you paste in your week's notes, AI generates a structured reflection

Your automation: _______________________

### Map the workflow

Draw this out before building:

```
TRIGGER:        [What starts it?]
         ↓
INPUT DATA:     [What information does it need?]
         ↓
AI PROMPT:      [What do you ask AI to do with it?]
         ↓
AI OUTPUT:      [What format does it return?]
         ↓
ACTION:         [What happens with the output?]
```

### Write the AI prompt in advance

Don't figure out the AI prompt inside the tool. Write it here first:

```
SYSTEM PROMPT (the instructions):
"You are [ROLE]. [WHAT YOU DO]. [YOUR STYLE].

FORMAT: [Exactly how to return the output]"

USER MESSAGE TEMPLATE:
"Here is the [TYPE OF CONTENT]:
[PLACEHOLDER]"
```

Test your prompt manually in a chat interface first. Make sure you like the output before wiring it into an automation.

---

## Phase 2: Build It (45–60 mins)

### Set up your tool

If using n8n:
- Go to n8n.io → Sign up free → Create a new workflow
- Add nodes from the + menu

If using Make:
- Go to make.com → Sign up free → Create a new scenario

### Build your workflow node by node

For each node, configure:
- **What it does** (trigger, HTTP request, AI call, email, etc.)
- **The inputs it receives** from the previous step
- **The outputs it passes** to the next step

Common mistakes to avoid:
- Not testing each node individually before connecting the next
- Writing a vague AI prompt (go back to your pre-written one)
- Forgetting to handle the AI's output format (if you asked for JSON, make sure you parse it as JSON)

### Test it

Run the workflow with real data. Check:
- Does each step work?
- Is the AI output in the right format?
- Does the final action happen correctly?

**If something breaks** — check the specific failing node. Use the node's error log. Most failures are either a missing connection, a wrong variable reference, or an unexpected output format.

---

## Phase 3: Document Your Build (15 mins)

Write a short technical document (this is a real professional skill):

```
AUTOMATION: [NAME]
PURPOSE: [What problem it solves in 1 sentence]

TRIGGER: [What starts it]

STEPS:
1. [Node type]: [What it does] → Output: [what it passes forward]
2. [Node type]: [What it does] → Output: [what it passes forward]
3. [Node type]: [What it does] → Output: [what it passes forward]

AI PROMPT USED:
[paste your system prompt]

HOW TO REPLICATE:
[2–3 sentences someone else would need]

KNOWN LIMITATIONS:
[What doesn't work well or edge cases to be aware of]
```

---

## Level Up — Multi-Step with Conditional Logic

Add an if/then condition to your automation. Example: if the AI flags a news item as "high priority," send a separate urgent notification. Otherwise, include it in the regular daily summary.

This introduces the concept of **branching** — different paths based on different AI outputs — which is how more sophisticated automations work.

---

## Reflect

1. What took longer than you expected? What was easier than you expected?

2. Where in the process was the AI prompt the most important factor in the output quality?

3. What other automation ideas can you think of that would genuinely make your life easier or better? What would you need to learn to build them?

---

## Share (Optional)

Share your automation: what it does, the core AI prompt, and how long it took to build.

---

## Coming Up Next
Module 03: Entrepreneurship in the AI Age — how people are building real businesses with these tools, and what that means for you.
