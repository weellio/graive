# Lesson Plan: Fine-Tuning and RAG
### Innovator Level (Ages 16–18) | Module 11

---

## Objective
By the end of this lesson, you have a solid conceptual understanding of Retrieval-Augmented Generation (RAG) and fine-tuning — what they are, how they differ, when to use each, and how they are applied in real products — even if you have not run the full implementation yourself.

---

## What You'll Need
- A device with internet access
- A free AI tool (ChatGPT free or Claude free)
- Optionally: a free account at LlamaIndex Cloud or Cohere (for the RAG demonstration activity)
- Paper and coloured pens OR a digital document
- About 50 minutes

---

## Watch First
Watch **Module 11: Fine-Tuning and RAG** with a parent or on your own.

Remember: The base AI model knows a great deal about the world — but it knows nothing about your specific company, your database, your documents, or your personal knowledge. RAG and fine-tuning are the two main techniques for closing that gap.

---

## Go Deep — Customising AI with Your Own Data

### Activity 1: Understand the Problem These Techniques Solve (15 mins)

Before learning the solutions, understand the problem precisely.

**The Knowledge Gap Problem:**

A language model like GPT-4 or Llama was trained on data up to a certain date. It knows nothing about:
- Events after its training cutoff
- Your company's internal documentation
- Your personal notes, emails, or files
- A specific industry's niche technical knowledge that was not well-represented in training data
- Real-time data (stock prices, sports scores, live news)

When you ask a base model about your company's product, it either says it does not know — or, dangerously, it hallucinates a plausible-sounding answer.

**Two Approaches to Solving This:**

**Approach 1 — Retrieval-Augmented Generation (RAG):**
Rather than teaching the model new information, you build a system that finds the relevant information at query time and adds it to the prompt.

The workflow:
1. Your documents are split into small chunks and converted into numerical vectors (embeddings) that capture their meaning
2. These vectors are stored in a "vector database"
3. When a user asks a question, their question is also converted to a vector
4. The system finds the chunks whose vectors are most similar to the question (nearest-neighbour search)
5. Those chunks are added to the prompt as context: "Here is relevant information from our documents. Use it to answer the question."
6. The AI answers based on the retrieved context

**Approach 2 — Fine-Tuning:**
You take a pre-trained model and continue training it on a smaller dataset of your own examples. The model's weights are updated — it "learns" your data and incorporates it into its behaviour.

Fine-tuning changes how the model responds, not just what it knows. It is used when you want the model to always respond in a specific format, use a specific writing style, apply a specific expertise consistently, or avoid certain types of outputs.

**Key differences:**

| | RAG | Fine-Tuning |
|---|-----|------------|
| Best for | Giving AI access to specific knowledge/documents | Changing how the AI responds, not just what it knows |
| Updates easily | Yes — add new documents to the database | No — requires retraining |
| Cost | Low (no training required) | Higher (training compute required) |
| Transparency | High — you can see which documents were retrieved | Lower — the behaviour is embedded in weights |
| Risk of hallucination | Reduced (uses retrieved text) | Still present |
| Use case examples | Customer support bot with company knowledge, legal research tool, internal Q&A | A model that always writes in your brand voice, a specialist coding assistant, a medical triage tool |

**Your task:** For each of these five product scenarios, decide whether RAG, fine-tuning, or a combination would be more appropriate — and explain your reasoning:

1. A chatbot for a hospital that answers patients' questions using the hospital's specific policies and procedure documents
2. A writing assistant that always generates content in a specific author's style (warm, conversational, uses humour)
3. A legal research tool that can search and cite from a specific country's case law database
4. A customer service bot that needs to answer questions about product specifications that change every month
5. A coding assistant trained specifically on a company's proprietary codebase to help new developers learn the code faster

---

### Activity 2: Build a Simple RAG Prototype (20 mins)

You are going to build the simplest possible version of RAG — manually, without any code — to understand the core mechanics.

**Manual RAG in 5 steps:**

**Step 1 — Your Knowledge Base:**
Write or paste 5–10 "documents" — these can be short paragraphs, each covering one distinct fact or piece of information. Choose a domain you care about: your school's rules, a sport's statistics, a fictional company's product specs, facts about a topic you know well.

Example (fictional company product):
- "The Pro Plan costs £29/month and includes up to 1000 API calls per day."
- "The Enterprise Plan costs £199/month and includes unlimited API calls, dedicated support, and SLA guarantees."
- "API rate limits reset at midnight UTC every day."
- "The data retention policy stores user data for a maximum of 90 days unless the customer selects extended retention."
- "Customers can export their data at any time from the Settings > Data Export menu."

**Step 2 — The User Question:**
Write a question that could be answered using one or more of your documents.
Example: "What happens to my data if I cancel my subscription?"

**Step 3 — Simulate Retrieval:**
Manually read through your documents and select the 1–3 that are most relevant to the question. This is what a vector database does automatically — you are doing it by hand.

**Step 4 — Construct the Augmented Prompt:**
Write a prompt that includes your retrieved documents as context, followed by the question:

```
You are a helpful assistant. Use ONLY the information provided below to answer the question. If the answer is not in the provided information, say "I don't have that information."

RELEVANT INFORMATION:
[Paste your 1-3 selected document chunks here]

QUESTION:
[Your user question]
```

**Step 5 — Run it:**
Paste this full augmented prompt into your AI tool. Note the response.

Now run the same question WITHOUT the context (just ask the question directly). Compare the two responses.

Write down:
- What changed between the two responses?
- Did the RAG version stick to the provided information, or did it add things from outside?
- What would happen if you had retrieved the wrong documents — or no documents at all?
- Where did the prompt instruction "use ONLY the information provided" help or fail?

---

### Activity 3: The Fine-Tuning Thought Experiment (15 mins)

Fine-tuning is harder to demonstrate hands-on without compute resources, but you can understand it deeply through structured thinking.

Fine-tuning works by providing the model with many examples of the format: input → ideal output. The model learns the pattern of what "good" looks like in your domain.

**Design a Fine-Tuning Dataset:**

Choose a task where you want a model to behave consistently — for example:
- A tutoring assistant that always explains concepts using the Socratic method (asks guiding questions rather than giving direct answers)
- A product description writer that always uses a specific brand voice
- A customer support agent that always acknowledges the problem, empathises, then solves it
- A code reviewer that always explains the "why" behind each suggestion

Write 10 training examples in this format:

```json
{
  "input": "[A realistic user message or task]",
  "ideal_output": "[Exactly the kind of response you want the fine-tuned model to produce]"
}
```

For your 10 examples:
- Vary the inputs — different phrasings, different complexity levels
- Keep the outputs consistent in style, tone, and structure — this is the pattern the model will learn
- Include at least 2 "edge case" examples — tricky inputs that require the right behaviour even in unusual situations

After writing your examples, answer:
1. What pattern are you teaching the model? Can you describe it in one sentence?
2. If a user sent an input you had not included in your training examples, how would you expect the fine-tuned model to respond?
3. What are three types of inputs that your fine-tuning might NOT handle well?

---

## Design It!

Create a **"Customisation Architecture Diagram"** for the AI product you designed in Module 10 (or a new AI product if you prefer).

Show:
- The base AI model at the centre
- The RAG system (if applicable) — showing document store, embedding process, retrieval flow
- The fine-tuning layer (if applicable) — showing training data, the fine-tuned model
- The application layer — how your product connects everything to the user
- The data flow — where does data enter, get processed, and produce output?
- The update cycle — how and when does the knowledge base get updated? When does fine-tuning happen again?

Label every component. Add a brief note (1 sentence) next to each explaining why it is needed.

At the bottom, write a one-paragraph "technical summary" describing the customisation approach — the kind of thing you might include in a technical README for a project.

---

## Reflect
Answer these questions out loud or write them down:

1. RAG grounds the AI in specific retrieved documents, which reduces hallucination for factual questions. But what happens when the retrieved documents themselves contain errors, outdated information, or conflicting facts? Does RAG solve the reliability problem, or just move it?
2. Fine-tuning can embed a company's brand voice so deeply into a model that it becomes natural and consistent. Is there a risk that fine-tuning embeds biases or blindspots along with the style? How would you monitor for this?
3. If you could fine-tune an AI model on your own writing, notes, and ideas, the result would be a model that responds somewhat like you. How would you feel about using such a model — or about someone else having access to it? What does this say about data as a reflection of identity?

---

## Share (Optional)
Explain RAG to someone technical using the manual demonstration from Activity 2 as your teaching tool. Ask them: "Given this approach, can you think of situations where retrieval would work really well, and situations where it would fail?" Technical people find the concrete example of manual RAG surprisingly illuminating — it strips away the complexity and shows the elegant core of the idea.

---

## Coming Up Next
Module 12: Innovator Challenge — This is where everything comes together. Your final challenge is to actually ship something real — an automation, a tool, a no-code product, or a well-researched written work. Not a design. Not a plan. Something that exists in the world.
