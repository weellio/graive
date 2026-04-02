# Lesson Plan: AI Agents
### Innovator Level (Ages 16–18) | Module 07

---

## Objective
By the end of this lesson, you understand what AI agents are, how agentic workflows differ from single-prompt interactions, and you can design a multi-step agentic workflow for a real task — even without building it yet.

---

## What You'll Need
- A device with internet access
- A free AI tool (ChatGPT free or Claude free)
- Access to a free automation tool — n8n (n8n.io, self-hosted or cloud free tier) or Make (make.com, free tier) for the optional build section
- Paper and coloured pens OR a digital document
- About 50 minutes

---

## Watch First
Watch **Module 07: AI Agents** with a parent or on your own.

Remember: Standard AI use is a single exchange — you ask, it answers. An AI agent is something more: a system that can take actions, use tools, check results, and work toward a goal across multiple steps — sometimes without a human in the loop at each stage. This changes everything about what AI can do.

---

## Go Deep — From Prompt to Agent

### Activity 1: Understand the Architecture of Agents (15 mins)

An AI agent has four key components. Understanding these lets you design them properly.

**The Four Components:**

**1. A Goal (or Objective)**
Unlike a chatbot that responds to one question at a time, an agent has a goal it is trying to achieve. Example: "Research the top 5 competitors for this product and summarise their pricing."

**2. Tools**
An agent can use tools beyond just generating text. Common tools include:
- Web search (look up current information)
- Code execution (write and run code to process data)
- File reading and writing (read a CSV, write a report)
- API calls (send emails, create calendar events, post to a platform)
- Memory (remember what happened in earlier steps)

**3. A Decision Loop**
The agent does not just act once. It uses a loop: Observe the situation → Think about what to do next → Act → Observe the result → Think → Act again... until the goal is achieved or it gives up.

This is often called the ReAct pattern (Reason + Act).

**4. An Exit Condition**
How does the agent know it is done? Good agent design always includes a clear stopping condition — otherwise the agent can loop forever or take unintended actions.

**Your task — Map existing AI use to the agent model:**

Think about five things AI is already doing in the world (you can use examples from earlier modules — recommendation systems, content moderation, customer service chatbots, etc.). For each one, identify:
- Does it have a Goal? What is it?
- What Tools does it use?
- Does it have a Decision Loop, or does it just respond once?
- What is its Exit Condition?

Some will clearly be agents; others will be simple prompt-response systems. The exercise is to see the difference.

---

### Activity 2: Design a Multi-Step Workflow (20 mins)

Now you are going to design an agentic workflow for a real task — one that requires multiple steps, decisions, and tools.

**Choose one of these scenarios (or design your own):**

**Scenario A — Research Assistant:**
Goal: Produce a 500-word briefing document on any topic, automatically compiled from multiple sources, with key facts highlighted and sources cited.

**Scenario B — Job Application Helper:**
Goal: Given a job description and a CV, automatically analyse the match, identify gaps, suggest improvements to the CV, and draft a personalised cover letter.

**Scenario C — Content Calendar:**
Goal: Given a topic and a target audience, generate a 4-week social media content calendar with one post idea per day, a draft caption for each, and a suggested image description.

**Scenario D — Personal Learning Planner:**
Goal: Given a skill someone wants to learn and how many hours per week they have, generate a structured learning plan with resources, milestones, and weekly tasks.

**Your own scenario:** Think about something you do regularly that involves multiple steps and could benefit from automation.

**Design your workflow using this structure:**

```
WORKFLOW NAME: [Title]
GOAL: [What should be achieved when this workflow finishes?]
TRIGGER: [What starts the workflow? A message? A schedule? A file upload?]

STEP 1:
  - Action: [What does this step do?]
  - Tool used: [AI generation / web search / code / API / file operation]
  - Input: [What information does this step need?]
  - Output: [What does this step produce?]
  - Decision point: [Does this step branch? e.g. "If the result is X, go to Step 2A. If Y, go to Step 2B."]

STEP 2: [same structure]

STEP 3: [same structure]

... (add as many steps as needed)

EXIT CONDITION: [How does the workflow know it is done?]
HUMAN REVIEW POINT: [Where does a human need to check or approve before the workflow continues?]
FAILURE HANDLING: [What happens if a step fails or returns an unexpected result?]
```

The last three items — Exit Condition, Human Review Point, and Failure Handling — are often forgotten in agent design. Thoughtful agents include them explicitly.

---

### Activity 3: The Autonomy Dial (15 mins)

One of the most important design decisions in agentic AI is how much autonomy to give the agent. This is sometimes called the "human-in-the-loop" question.

**The Autonomy Dial goes from 0 to 10:**

- **0 (Full Human Control):** The AI suggests each next step, but a human approves every action before it is taken.
- **5 (Supervised Autonomy):** The AI executes routine steps automatically, but pauses for human review at key decision points or before irreversible actions.
- **10 (Full Autonomy):** The AI executes the entire workflow to completion without any human input. The human only sees the final result.

**The dial depends on:**
- How reversible are the actions? (Sending an email is irreversible. Drafting a document is not.)
- How much do you trust the AI's judgement for this specific task?
- What are the consequences of an error?
- How time-sensitive is the task?

**Your task:**

Take the workflow you designed in Activity 2. For each step, mark it with a dial setting (0, 5, or 10) and justify your choice.

Then answer:
1. What is the most dangerous step in your workflow — the one where an AI error could cause the most harm? What safeguard would you add?
2. If you set the whole workflow to 10 (full autonomy), what is the worst realistic thing that could happen?
3. Where would you personally set the overall dial for this workflow, and why?

---

## Design It!

Create a **visual workflow diagram** for the workflow you designed in Activity 2.

Use boxes, arrows, and diamond shapes (for decision points). Show:
- Each step as a labelled box
- The tools used (add a small icon or label)
- Decision branches (diamond shapes with Yes/No paths)
- The human review points (highlight these in a different colour)
- The exit condition (a double border box at the end)

At the top, add the autonomy dial setting you chose, with a brief justification.

This diagram should be clear enough that someone who has never seen your workflow before could follow the process end-to-end.

---

## Reflect
Answer these questions out loud or write them down:

1. As AI agents become more capable of taking actions autonomously, what new responsibilities do the people who design and deploy them have? Who is responsible when an agent makes a mistake?
2. Agentic AI is already being used in real businesses — scheduling, customer service, content generation, data analysis. What jobs or tasks do you think will be most affected by this in the next five years?
3. You designed a human review point into your workflow. What does the existence of that review point tell you about the limits of trust you currently place in AI? What would need to change for you to remove it?

---

## Share (Optional)
Share your workflow diagram with someone interested in technology or business. Walk them through it step by step. Ask: "If you were building this, which step would you be most nervous about letting AI handle unsupervised?" Their answer might reveal something you have not thought about.

If you have access to n8n or Make, try building a simplified version of your workflow — even just two or three steps. The gap between designing a workflow and actually building it is where the real learning happens.

---

## Coming Up Next
Module 08: The Open Source AI World — Not all AI is built by Google, OpenAI, or Anthropic. You are going to explore the world of open-source models, local AI, Hugging Face, and Ollama — and understand why the battle between open and closed AI matters enormously.
