# Lesson Plan: AI Agents
### Innovator Level (Ages 16–18) | Module 07 — Expanded

---

## Objective
Understand what AI agents are, how agentic workflows differ from single-prompt interactions, and design a multi-step agentic workflow for a real task. Understand the current state of agent deployment in industry and the governance challenges that agentic AI creates.

---

## What You'll Need
- A device with internet access
- A free AI tool (ChatGPT free or Claude free)
- Access to a free automation tool — n8n (n8n.io, self-hosted or cloud free tier) or Make (make.com, free tier) for the optional build section
- Paper and coloured pens OR a digital document
- About 50–60 minutes

---

## Watch First
Watch **Module 07: AI Agents** with a parent or on your own.

Remember: Standard AI use is a single exchange — you ask, it answers. An AI agent is something more: a system that can take actions, use tools, check results, and work toward a goal across multiple steps — sometimes without a human in the loop at each stage. This changes everything about what AI can do.

---

## The Landscape: The Agent Era Has Begun

In 2023, the dominant paradigm for AI use was still the chatbot: a single exchange where a user asks a question and the AI responds. This paradigm, while enormously useful, had a clear ceiling. A chatbot could draft an email but couldn't send it. It could suggest a plan but couldn't execute the steps. It could identify a problem but couldn't take action to address it.

In 2024, that paradigm began shifting rapidly toward agents: AI systems that perceive their environment, make decisions, use tools, take actions, and operate across multiple steps toward a specified goal — often without human intervention at each step. The shift was enabled by improvements in model reasoning capability (models getting better at planning multi-step tasks), the development of "tool use" capabilities (models can now call functions, access APIs, search the web, and execute code), and the creation of agent frameworks (software libraries that make it easier to build systems where multiple AI components work together).

The commercial applications of agents are already significant. In customer service, agents can now handle end-to-end service interactions — not just answering questions but looking up account information, processing refunds, updating records, and escalating to humans only when genuinely needed. In software engineering, agents are being deployed to handle specific development tasks: reviewing code, writing tests, fixing bugs of a specific type, and creating pull requests for human review. In research, agents can be configured to search the web, synthesise information from multiple sources, and compile reports on topics of interest. In business operations, agents are automating multi-step workflows that previously required human judgment at each stage.

The company Devin, launched in 2024, claimed to be the "first fully autonomous AI software engineer" — capable of completing software development tasks end-to-end with minimal human intervention. The actual performance was more nuanced than the marketing suggested, but the direction was clear: software development agents are coming, and they will substantially change how software is written and who writes it. Similarly, companies like Cognition, Cohere, and Salesforce have released agent products for sales, customer service, and enterprise workflow automation.

The theoretical framework for agent design has also matured rapidly. The "ReAct" architecture (Reason + Act), proposed by researchers at Google in 2022, describes a pattern where agents alternate between reasoning about what to do and taking actions, incorporating observations from each action into subsequent reasoning. This pattern has become the basis for most practical agent implementations. More complex architectures involve multiple specialised agents that coordinate with each other — one agent for research, one for writing, one for fact-checking, with an orchestrator agent managing the process.

The governance implications of agentic AI are profound and underexplored. When a single prompt produces a single response, the scope of potential error is bounded. When an agent executes a 20-step workflow — browsing the web, sending emails, updating databases, making purchases — a single misunderstanding of intent at step 1 can propagate through all subsequent steps, creating compounding errors with real-world consequences. The irreversibility problem is central: a chatbot error can be ignored; an agent that has sent a batch of emails, submitted a form to a regulatory body, or made an API-mediated financial transaction has taken actions in the world that may be difficult or impossible to reverse.

The question of accountability is equally important. When a human makes a decision, they bear responsibility for it. When an agent makes a decision, who is responsible? The person who deployed the agent? The person who defined its goals? The company that built the underlying AI model? The legal and ethical frameworks for attributing responsibility for agentic AI actions are still being developed — and the practical decisions about how to build safe, accountable agents must be made now, before those frameworks exist. This makes agent design one of the most important and underserved problems in applied AI ethics.

---

## Technical Deep Dive: How Agents Actually Work

**The ReAct loop.** The dominant pattern for AI agents is the ReAct (Reason + Act) loop: the model receives the current state of the world and its goal, reasons about what to do next, takes an action (usually by calling a tool or function), observes the result, and repeats. Each cycle, the model has access to the history of all previous observations — it's building up context about what it's tried and what happened.

**Tool use and function calling.** Modern AI APIs support "function calling" — you define a set of functions that the model can call, provide descriptions of what each function does and what parameters it takes, and the model can generate structured calls to these functions as part of its response. The actual execution of the function happens outside the model — in your code — and the result is fed back to the model as context. This architecture means agents can interact with the real world (APIs, databases, files, web browsers) while the model itself remains a text-in, text-out system.

**Memory architectures.** Agents need different kinds of memory. Short-term memory is the context window — everything the agent has seen in the current session. Long-term memory is typically implemented as a database (often a vector database) that the agent can read from and write to, persisting information across sessions. Working memory is information the agent maintains explicitly as part of its current task — a scratchpad of intermediate results, plans, and hypotheses. Different agent architectures make different choices about how to manage these memory types.

**Multi-agent systems.** More complex agentic architectures involve multiple AI models working together. An orchestrator agent receives the high-level goal and decomposes it into sub-tasks, which are delegated to specialised sub-agents. Each sub-agent has its own tools and context. The orchestrator receives sub-agent results and determines next steps. This pattern enables more complex workflows than any single agent could handle, but introduces new coordination challenges and more complex failure modes.

**Grounding and verification.** Agents face the same hallucination problem as standard AI — but with higher stakes because they're taking actions. "Grounding" refers to connecting model outputs to verifiable external information — rather than letting the model generate what it believes to be true, using retrieval or code execution to verify facts before acting on them. Good agent design includes systematic grounding: the agent checks facts against real sources before taking actions based on them.

---

## Activity 1: Understand the Architecture of Agents (15 mins)

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

Think about five things AI is already doing in the world. For each one, identify:
- Does it have a Goal? What is it?
- What Tools does it use?
- Does it have a Decision Loop, or does it just respond once?
- What is its Exit Condition?

Some will clearly be agents; others will be simple prompt-response systems. The exercise is to see the difference.

---

## Activity 2: Design a Multi-Step Workflow (20 mins)

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
  - Decision point: [Does this step branch?]

STEP 2: [same structure]
STEP 3: [same structure]

EXIT CONDITION: [How does the workflow know it is done?]
HUMAN REVIEW POINT: [Where does a human need to check or approve?]
FAILURE HANDLING: [What happens if a step fails?]
```

---

## Activity 3: The Autonomy Dial (15 mins)

One of the most important design decisions in agentic AI is how much autonomy to give the agent.

**The Autonomy Dial goes from 0 to 10:**

- **0 (Full Human Control):** The AI suggests each next step, but a human approves every action before it is taken.
- **5 (Supervised Autonomy):** The AI executes routine steps automatically, but pauses for human review at key decision points or before irreversible actions.
- **10 (Full Autonomy):** The AI executes the entire workflow to completion without any human input.

**The dial depends on:**
- How reversible are the actions?
- How much do you trust the AI's judgement for this specific task?
- What are the consequences of an error?
- How time-sensitive is the task?

**Your task:**

Take the workflow you designed in Activity 2. For each step, mark it with a dial setting (0, 5, or 10) and justify your choice.

Then answer:
1. What is the most dangerous step in your workflow — the one where an AI error could cause the most harm?
2. If you set the whole workflow to 10 (full autonomy), what is the worst realistic thing that could happen?
3. Where would you personally set the overall dial for this workflow, and why?

---

## Advanced Activity 1: Failure Mode Analysis (20 mins)

Professional systems engineers conduct "failure mode and effects analysis" (FMEA) — systematically identifying how a system can fail, estimating the likelihood and impact of each failure, and designing mitigations. Apply this discipline to agent design.

Take the workflow you designed in Activity 2. For each step, complete:

| Step | Failure mode | Likelihood (Low/Med/High) | Impact if it fails (Low/Med/High) | Mitigation |
|------|-------------|--------------------------|----------------------------------|------------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

**Failure modes to consider for AI steps:**
- Hallucination (generates false information confidently)
- Misunderstanding the goal (does the right actions for the wrong interpretation)
- Incomplete output (stops before finishing)
- Format failure (produces output in the wrong format for the next step)
- Context overflow (forgets earlier information as context grows)

**For non-AI steps:**
- API failure (external service is down or returns an error)
- Rate limiting (too many requests in too short a time)
- Authentication failure (credentials expired or revoked)
- Data format mismatch (output format changed unexpectedly)

After completing the table, identify your top three risks (highest likelihood × impact) and describe a specific mitigation for each.

This analysis should be done before building any production agent — it's the difference between a system that occasionally fails mysteriously and one that fails gracefully and informatively.

---

## Advanced Activity 2: Multi-Agent Architecture Design (25 mins)

Simple agents handle one task end-to-end. Complex agentic systems use multiple specialised agents that coordinate. Design a multi-agent architecture for a more complex scenario.

**Scenario:** An AI research assistant that handles a researcher's workflow:
- Monitors specific academic databases and news sources for new content relevant to their research interests
- Reads and summarises new content
- Identifies connections between new content and the researcher's existing notes
- Drafts a weekly digest email with the most relevant new findings
- Suggests potential follow-up questions or research directions

**Your task:** Design this as a multi-agent system. Identify:

1. **The Orchestrator Agent:** What is its role? What information does it receive and what decisions does it make?

2. **Specialist Sub-Agents:** Define at least 3 specialist agents, each with a specific role. For each, describe:
   - What they do
   - What tools they use
   - What they receive as input
   - What they produce as output

3. **Communication protocol:** How do agents pass information between each other? What format is used?

4. **Coordination challenges:** Where might the agents produce conflicting or redundant outputs? How does the orchestrator resolve these?

5. **Human touchpoints:** Where does the human researcher interact with the system? What should always require their approval vs. what can the system do autonomously?

Draw a diagram showing the agents, their relationships, and the data flows between them.

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

## Case Studies

**Case Study 1: GitHub Copilot Workspace — From Suggestion to Execution**
GitHub's evolution from Copilot (code suggestion) to Copilot Workspace (agent-like task completion) illustrates the progression from tool to agent. While early Copilot provided single-line completions, Workspace accepts a natural language description of a task ("fix the bug in the authentication module" or "add error handling to these three functions") and can plan, implement, and even commit code changes with varying levels of human oversight. The product is designed with explicit human checkpoints: the agent proposes a plan before executing it, shows diffs before applying them, and requires human approval before any git operations. This design reflects genuine thought about the autonomy dial — the irreversible action of modifying a codebase requires human confirmation even in a highly automated workflow.

*Analysis questions: What would need to change about Copilot Workspace's design for you to trust it with production code without human review? What residual risk would remain even with the best human oversight design?*

**Case Study 2: Klarna's AI Agent — Customer Service at Scale**
Klarna, the Swedish payments company, deployed an AI customer service agent in early 2024 and published striking statistics: the agent handled two-thirds of all customer service chats in its first month, equivalent to the work of 700 full-time human agents. Response times dropped from 11 minutes to under 2 minutes. Customer satisfaction scores were equivalent to human agents on most metrics. The deployment also resulted in Klarna reducing its human customer service headcount significantly. The case study illustrates both the transformative capability of agents and the stark employment implications. It also raises questions about what was lost in the transition — the human judgment, relationship, and escalation capability that skilled agents bring.

*Analysis questions: What customer service scenarios would you want human agents to handle rather than AI? How should Klarna — and other companies making similar transitions — treat the workers displaced by AI agents? What obligations, if any, do companies have in this situation?*

**Case Study 3: AutoGPT and the Limits of Fully Autonomous Agents**
AutoGPT, released as an open-source project in early 2023, was one of the first widely accessible "autonomous" AI agents — a system that could break down a goal into sub-tasks and work toward it without human intervention at each step. It became one of the most-starred GitHub projects in history within days. But practical experience with AutoGPT revealed fundamental limitations: it would get stuck in loops, take actions it hadn't been authorised to take, fail unpredictably on multi-step tasks, and burn through API credits rapidly. The experience demonstrated that current AI models, while impressive, lack the reliable long-horizon planning and error correction that truly autonomous agents require. The gap between "agent demo" and "production-ready agent" is substantially larger than the gap between "single-prompt demo" and "production chatbot."

*Analysis questions: What specific capabilities would an AI model need to develop to close the gap between demo and production-quality agents? Given current limitations, where do you think agents are ready for production use, and where are they not?*

---

## Career Paths

**AI Agent Engineer**
Building agent systems requires a combination of: prompt engineering (designing the instructions that guide agent behaviour), software engineering (building the tools the agent uses, handling infrastructure), systems design (architecting how components interact), and evaluation (testing agent behaviour systematically across many scenarios). This is one of the most in-demand specialisations in applied AI engineering. Entry requires strong software engineering foundations plus AI/ML fluency.

**Agentic Systems Architect**
At larger organisations, a more senior role involves designing the overall architecture of agent systems — deciding which tasks to automate, how to structure multi-agent systems, where to include human oversight, and how to ensure safety and accountability. This role combines deep technical knowledge with systems thinking and risk awareness. It typically requires several years of engineering experience.

**AI Safety Researcher (Agents Focus)**
The specific safety challenges of agentic AI — compounding errors, unintended consequences, goal misspecification at scale — are an active area of research at AI labs and academic institutions. Researchers in this area work on: formal verification of agent behaviour, interpretability of agent decision-making, techniques for safe exploration, and alignment of agent goals with human values. Requires graduate-level technical background.

**Operations AI Lead**
Companies deploying agents at scale need someone responsible for their ongoing operation: monitoring performance, identifying failure modes, managing human oversight processes, and iterating on agent design based on real-world data. This role combines operational judgment with technical understanding and is becoming a standard function at AI-forward companies.

---

## Reflect
Answer these questions out loud or write them down:

1. As AI agents become more capable of taking actions autonomously, what new responsibilities do the people who design and deploy them have? Who is responsible when an agent makes a mistake?
2. Agentic AI is already being used in real businesses — scheduling, customer service, content generation, data analysis. What jobs or tasks do you think will be most affected by this in the next five years?
3. You designed a human review point into your workflow. What does the existence of that review point tell you about the limits of trust you currently place in AI? What would need to change for you to remove it?

---

## Level Up — Build It

Create a **visual workflow diagram** for the workflow you designed, then go one step further:

**Specific deliverable:** A complete agent specification document that includes: (1) the visual workflow diagram with decision points and human review markers; (2) the autonomy dial setting for each step with justification; (3) a failure mode analysis covering at least 5 failure scenarios; (4) the exact system prompt you would use for the AI steps in your workflow; and (5) a testing plan — how you would verify the agent behaves as intended before deploying it in a real scenario.

---

## Further Reading

- **"Agents" chapter in the LangChain documentation** — LangChain is a popular open-source framework for building agent applications. Its documentation provides clear, practical explanations of agent architectures, tools, and memory systems that are directly applicable to building real agents.
- **"Levels of AGI" paper by Google DeepMind (2023)** — a framework for thinking about different levels of AI capability and autonomy. Useful for contextualising where current agents sit on the capability spectrum and what advances would be needed for more autonomous systems.
- **"AI Safety Fundamentals" by BlueDot Impact** — a structured curriculum on AI safety that includes material on agent alignment, goal specification, and the technical challenges of building AI systems that reliably pursue intended goals. Free online.
- **"The Coming Wave" by Mustafa Suleyman** — the co-founder of DeepMind's book about the coming era of AI and synthetic biology. Contains substantive analysis of agentic AI and its implications for society, governance, and human agency. Written by someone with deep technical knowledge and first-hand experience building frontier AI systems.

---

## Share (Optional)
Share your workflow diagram with someone interested in technology or business. Walk them through it step by step. Ask: "If you were building this, which step would you be most nervous about letting AI handle unsupervised?" Their answer might reveal something you have not thought about.

---

## Coming Up Next
Module 08: The Open Source AI World — Not all AI is built by Google, OpenAI, or Anthropic. You are going to explore the world of open-source models, local AI, Hugging Face, and Ollama — and understand why the battle between open and closed AI matters enormously.
