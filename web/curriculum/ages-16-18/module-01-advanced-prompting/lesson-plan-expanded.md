# Lesson Plan: Advanced Prompting Systems
### Innovator Level (Ages 16–18) | Module 01 — Expanded

---

## Objective
Build a working prompt chain for a real task, create one reusable template, and use a meta-prompt to improve your own prompting. Understand how professional prompt engineering works at an industry level and why systematic prompting is a foundational skill for anyone building with AI.

---

## What You'll Need
- AI tool (Claude or ChatGPT — both work for this)
- A real task you need to complete (school, personal project, or creative work)
- Notebook or Google Doc
- 45–60 minutes

---

## Watch First
Watch **Module 01: Advanced Prompting Systems**.

The four techniques: prompt chaining, meta-prompts, reusable templates, role separation.

---

## The Landscape: Prompting as a Professional Discipline

The phrase "prompt engineering" appeared as a job title for the first time around 2021. By 2023, companies like Anthropic, OpenAI, and major consulting firms were advertising roles paying $250,000–$375,000 annually specifically for people who could design and optimise prompts for enterprise applications. Then something interesting happened: as AI models became more capable and instruction-following improved dramatically, a debate emerged about whether "prompt engineering" as a specialty would disappear — absorbed into general AI fluency — or evolve into something more sophisticated.

What actually happened was the latter. Prompting evolved. The early era of prompt engineering was dominated by "magic words" — specific phrases discovered through experimentation that reliably improved outputs. "Let's think step by step," for example, was shown in a 2022 paper to dramatically improve reasoning performance on benchmarks. "You are an expert in X" improved domain-specific outputs. These findings spread rapidly through online communities and became common practice. But this first-generation prompting was still fundamentally about single exchanges.

The current era of advanced prompting is about systems. Professional AI engineers at companies like Notion, Stripe, and Shopify don't write prompts; they design prompt architectures — layered systems of instruction, context, and output formatting that produce reliable results at scale. When Notion built its AI writing features, the prompts behind each feature went through dozens of iterations, A/B testing, and refinement cycles before reaching users. The difference between a naive prompt and a production-grade prompt is often an order of magnitude in output quality.

The rise of agent frameworks — systems where AI models plan and execute multi-step tasks — has made prompt design even more important. In agentic systems, the system prompt isn't just instructions for one response; it defines the agent's entire operating model: its goals, its constraints, how it should reason, when it should ask for clarification, and when it should refuse. Poor prompt design in an agent doesn't just produce a bad response — it produces a malfunctioning system that takes wrong actions in the world.

Retrieval-Augmented Generation (RAG) pipelines, covered in depth in Module 11, add another layer of complexity. When an AI model is answering questions about a specific knowledge base, the prompt must instruct the model precisely how to use retrieved information, how to handle contradictions between retrieved documents, and how to signal uncertainty. A single ambiguous instruction can cause systematic errors across thousands of queries.

The market for prompt engineering skills is evolving rapidly. Technical roles increasingly assume strong prompting as a baseline skill rather than a specialty. The distinctive value has shifted toward prompt architecture for complex systems, evaluation and testing of prompts at scale, and what practitioners call "prompt robustness" — designing prompts that work reliably even when users phrase their requests unexpectedly. These skills sit at the intersection of software engineering, technical writing, and cognitive science.

For anyone planning to build AI products, conduct research using AI tools, or work in any field where AI is becoming embedded in workflows, systematic prompting is not a nice-to-have. It is the foundation layer. The gap between someone who understands prompt systems and someone who doesn't is already visible in the quality of their AI-assisted work — and that gap will widen as AI becomes more capable and more deeply integrated into professional environments.

---

## Technical Deep Dive: How Prompting Actually Works

Understanding why prompts work requires a basic model of how large language models process text.

**Tokens and context windows.** Language models do not process words; they process tokens — chunks of text that roughly correspond to syllables or short words. "Prompting" is two tokens. "AI" is one token. The model has a context window — a maximum number of tokens it can consider at once. Modern models like GPT-4o and Claude 3.5 Sonnet have context windows of 128,000 to 200,000 tokens. Everything in that window — your system prompt, the conversation history, the current message — is processed together when the model generates a response.

**Attention and position.** Not all parts of the prompt receive equal weight. Transformer models use attention mechanisms that consider relationships between all tokens simultaneously. Research has shown that language models tend to weight the beginning and end of context more strongly than the middle — a phenomenon called the "lost in the middle" problem. This has a direct practical implication: the most critical instructions belong at the start of the system prompt and the immediate preceding message, not buried in the middle of long context.

**The instruction-following gap.** There is a consistent gap between what a prompt says and what the model actually does. This gap exists for several reasons: training data ambiguity (the model has seen many examples of ignoring instructions in training data), competing objectives (the model is trained to be helpful and harmless simultaneously, creating tension), and semantic ambiguity (the model's interpretation of a word may differ from yours). Effective prompt engineering is largely about closing this gap — being precise enough that the model's interpretation matches your intention.

**Temperature and sampling.** When an AI model generates text, it doesn't deterministically output the "best" word — it samples from a probability distribution. Temperature controls how spread that distribution is. High temperature (close to 1.0) produces more varied, creative outputs. Low temperature (close to 0) produces more predictable, consistent outputs. For production applications with templates, lower temperatures are generally preferable. For creative or exploratory work, higher temperatures encourage diversity.

**System vs. user prompts.** Commercial APIs distinguish between a system message (persistent instructions that set the model's role and constraints) and user messages (the conversation). The model is trained to treat system messages as authoritative configuration and user messages as requests within that configuration. This distinction matters for template design: fixed instructions belong in the system prompt; variable inputs belong in user messages.

**Chain-of-thought prompting.** When you ask a model to "think step by step," you are activating chain-of-thought reasoning — prompting the model to generate intermediate reasoning steps before producing a final answer. This dramatically improves performance on tasks requiring multi-step reasoning because each generated step becomes context for the next. The model is, in effect, using its own intermediate outputs as scratch paper.

---

## Build It: Your First Production-Grade Prompt System

Using a free AI tool (Claude or ChatGPT), build a complete prompt system for a real task you care about. This exercise simulates what professional prompt engineers actually do.

**Choose your domain.** Pick a task you either do regularly or care about doing well: analysing news articles, preparing for debates, reviewing your own writing, researching a topic, generating study materials from notes, or planning a project.

**Step 1 — Write a naive prompt.** Ask your AI tool to help with your chosen task using whatever prompt comes naturally to you. Don't overthink it. Save this output.

**Step 2 — Decompose the task.** Break your task into its component sub-tasks. If you're analysing a news article, those sub-tasks might be: extract main claims, identify evidence types, assess source quality, identify missing perspectives, produce a summary judgment. Map these explicitly.

**Step 3 — Write a production system prompt.** Craft a system prompt that includes:
- A precise role definition for the AI
- The exact output format you want (use headers, specific section names, required elements)
- Explicit instructions about what to include AND what to exclude
- A quality standard ("Always cite specific evidence from the text. Never make claims beyond what the text supports.")
- An instruction for handling edge cases or ambiguities

**Step 4 — Test and iterate.** Run your production prompt on three different inputs. For each, note: where did the output match your standard? Where did it fall short? Revise your system prompt to address the gaps. Run the revised version. This iteration cycle is the actual work of prompt engineering.

**Step 5 — Document your system.** Write a brief spec (half a page) describing: what this prompt system does, the role definition used, the output format, any constraints, and known limitations. Professional prompt engineers document their work so others can understand, replicate, and improve it.

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

## Exercise 5: Prompt Stress Testing (Advanced) (15 mins)

A well-designed prompt should produce good outputs not just when users phrase their requests clearly, but also when they're vague, incomplete, or unusual. This is called prompt robustness.

Take the template you built in Exercise 3. Deliberately test it with:
1. An unusually brief input (much less detail than you'd normally provide)
2. An input that's slightly off-topic or doesn't fit the template perfectly
3. An input with an edge case — something your template wasn't designed for

For each test: did the template handle it gracefully? Did it produce a reasonable output, or did it fail or produce something unhelpful? Revise your template to be more robust to at least one of these edge cases.

Document the edge case you found and how you addressed it. This is precisely what production prompt engineers do before deploying prompts in real applications.

---

## Exercise 6: The Constraint Experiment (15 mins)

Constraints are one of the most powerful but underused elements of prompting. Most people prompt AI with what they want; fewer people specify what they explicitly do NOT want.

Take any prompt you've written in a previous exercise. Add five explicit constraints — things you want the AI to avoid, not do, or exclude. Examples: "Never use bullet points — use flowing prose only." "Do not include generic advice that would apply to any situation — be specific to the case I described." "Do not begin any sentence with 'I'." "Do not summarise what I've already said — only add new information."

Run the constrained version and the unconstrained version on the same input. Compare the outputs. Which constraints made the biggest difference? Which constraints were ignored or produced unexpected effects?

The insight here is that negative instructions (what NOT to do) are often as important as positive instructions (what TO do) in controlling model behaviour.

---

## Case Studies: Advanced Prompting in the Real World

**Case Study 1: GitHub Copilot's Prompt Architecture**
GitHub Copilot — the AI code completion tool used by millions of developers — operates on a carefully engineered prompt system that runs invisibly behind every suggestion. When you type code, Copilot doesn't just send your current line to a model; it constructs a sophisticated context window including your file's imports, nearby function definitions, comments, and code patterns. The prompt instructs the model to complete code that is consistent with the existing style, uses available libraries, and fits the project context. When GitHub released Copilot Enterprise, they added organisation-specific context — company coding standards and internal documentation embedded in the prompt system. The lesson: even a simple "autocomplete" feature requires careful prompt architecture at scale.

*Analysis questions: What would happen if Copilot's prompt was less carefully designed? What kinds of errors would become more common? How do you think GitHub tests and improves its prompt system over time?*

**Case Study 2: Perplexity AI's Citation Prompting**
Perplexity AI is a search engine that provides AI-generated answers with citations. A central challenge in building this product was designing prompts that instructed the model to cite sources accurately rather than hallucinating citations. Their prompt system had to specify: always cite the source text, never invent source URLs, present uncertainty when sources conflict, and distinguish between direct quotes and paraphrased content. Getting this right required extensive iteration because language models have a strong tendency to produce confident-sounding output even when they lack a reliable source. The product's quality depends almost entirely on how precisely these prompting constraints are specified and enforced.

*Analysis questions: What are the risks of getting citation prompting wrong in a product people use for research? How would you design a testing framework to evaluate citation accuracy before releasing a product like this?*

**Case Study 3: Intercom's Customer Service AI**
Intercom, a customer support platform, built AI assistance that answers customer service tickets. Their challenge was designing prompts that made the AI helpful for routine queries while knowing when to escalate to a human agent. The prompt architecture included: instructions about the company's product and policies (via RAG), a clear escalation decision rule, a tone guide (professional but warm), and a set of forbidden responses (never promise specific outcomes, never discuss competitor products, never apologise in ways that imply legal liability). Building this prompt system required collaboration between product, legal, and customer success teams — each group needed to contribute their knowledge of what the AI should and should not say.

*Analysis questions: Who should be involved in designing prompts for a customer-facing AI system? What could go wrong if only engineers design the prompt without input from legal or customer service teams?*

---

## Career Paths: Who Uses These Skills

**Prompt Engineer / AI Product Specialist**
Some organisations still hire specifically for prompt engineering — particularly companies building products on top of foundation models where prompt quality directly determines product quality. Day-to-day work involves designing, testing, and iterating on prompts, building evaluation frameworks to measure output quality, and collaborating with product managers and engineers to embed prompts in product features. This role is increasingly being absorbed into broader "AI product manager" or "AI engineer" titles.

**AI Product Manager**
Product managers at companies building AI-native products need deep prompting fluency. They're responsible for defining what AI features should do, reviewing the quality of AI outputs, and making tradeoffs between capabilities, safety, and cost. The ability to write and evaluate prompts is the difference between a PM who can actively shape AI features and one who can only describe requirements to engineers.

**AI Researcher (Applied)**
Applied AI researchers at companies like DeepMind, Meta AI, and Anthropic work on understanding how prompting techniques affect model performance, conducting systematic studies on techniques like chain-of-thought, tool use, and few-shot learning. This path typically requires a technical background (computer science, mathematics) and an interest in both engineering and scientific inquiry.

**AI Educator / Content Creator**
As AI literacy becomes a significant educational need, people who can explain prompting clearly — through writing, video, or curriculum development — have a growing audience. Channels and courses teaching advanced prompting techniques attract significant readership among professionals. This path suits people who enjoy both building skills and communicating them.

---

## Level Up — Build a Prompt System for Someone Else

Design a prompt chain or template that someone with no prompting experience could use for a specific task.

Requirements:
- The person doesn't know about AI or prompting
- The template should work with minimal customisation
- Include instructions for how to fill in the variables

Who is it for? What task does it solve? Test it by asking someone else (a family member, a friend) to actually use it with no help from you.

**Specific deliverable:** A documented prompt system with a one-page user guide. The user guide should explain: what the template does, how to fill in the variables, what to do if the output isn't quite right, and what the template is NOT good for. Someone who has never prompted an AI before should be able to use your system successfully on their first attempt.

**What had to be simplified for it to work for a non-expert?**

---

## Further Reading

- **"The Prompt Engineering Guide"** by DAIR.AI — a comprehensive, community-maintained technical resource covering prompt techniques from zero-shot to complex chain-of-thought approaches. Searchable and updated regularly.
- **"Building LLM Applications for Production"** by Chip Huyen — a practitioner-focused deep dive into the engineering considerations for deploying AI-powered products, with a strong emphasis on prompt design for reliability.
- **Anthropic's "Prompt Engineering" documentation** — Anthropic publishes detailed guidance on effective prompting for Claude specifically, including worked examples for different task types and guidance on avoiding common failure modes.
- **"Sparks of Artificial General Intelligence"** (Microsoft Research, 2023) — a substantial research paper exploring GPT-4's capabilities that includes significant insight into how model behaviour changes with different prompting approaches. Accessible to a motivated non-specialist reader.

---

## Deep Reflection Questions

1. What's the difference between using AI as a tool and using AI as a system? Where does that distinction matter most — in your personal use, or in building things for others?

2. The meta-prompt approach is essentially asking AI to improve its own instructions. What does that tell you about how prompting works — and what does it suggest about the relationship between user intent and model output?

3. Which of the four techniques (prompt chaining, meta-prompts, reusable templates, role separation) do you think will be most useful for you personally, and in what specific context? Why that one over the others?

4. Professional prompt engineers sometimes talk about "prompt brittleness" — prompts that work brilliantly on the cases you tested but fail unexpectedly on cases you didn't anticipate. What would a systematic approach to testing prompt robustness look like? How would you know when a prompt was "good enough"?

5. As AI models become more capable at following instructions, does the importance of skilled prompting go up or down? Make the case for both positions, then choose one.

6. You've now built prompts that produce significantly different outputs from the same underlying task. What does this reveal about the nature of AI outputs — are they objective answers, or are they heavily constructed by whoever wrote the prompt? What are the implications of that for how you evaluate AI-generated content?

---

## Share (Optional)

Share one reusable template you built and the use case it's designed for. Include the placeholders so others can use it.

---

## Coming Up Next
Module 02: Building with AI (No-Code) — we go from prompting to actually building automations that run without you.
