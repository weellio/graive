# Lesson Plan: The Modern AI Stack
### Creator Level (Ages 18+) | Module 01

---

## Objective
By the end of this lesson, you'll have a clear mental model of the complete modern AI application stack — from LLMs at the base through APIs, vector databases, and orchestration layers — and understand how each layer contributes to a production AI system.

---

## What You'll Need
- Development environment (VSCode or similar)
- Python 3.9+ or Node.js 18+ installed
- API key for OpenAI or Anthropic (free tier to start)
- Notebook or documentation tool
- About 90–120 minutes

---

## Watch First
Watch **Module 01: The Modern AI Stack** before starting.

Core framework: **Every production AI application has the same fundamental stack. Understanding the full picture before building any part of it is the difference between hacking and engineering.**

---

## Key Concepts

### The Full AI Application Stack

```
┌─────────────────────────────────────┐
│          USER INTERFACE             │  Web, mobile, CLI, API endpoint
├─────────────────────────────────────┤
│        ORCHESTRATION LAYER          │  LangChain, LlamaIndex, custom code
├─────────────────────────────────────┤
│           MEMORY LAYER              │  Short-term (conversation), Long-term (vector DB)
├─────────────────────────────────────┤
│          RETRIEVAL LAYER            │  Vector search, keyword search, hybrid
├─────────────────────────────────────┤
│         VECTOR DATABASE             │  Pinecone, Chroma, Weaviate, pgvector
├─────────────────────────────────────┤
│           AI MODEL API              │  OpenAI, Anthropic, Google, Cohere
├─────────────────────────────────────┤
│       FOUNDATION MODEL (LLM)        │  GPT-4, Claude, Gemini, Llama
└─────────────────────────────────────┘
```

Understanding each layer — what it does, why it exists, when you need it — is the foundation of AI engineering.

> "Many developers jump to building before understanding the stack. They end up solving the wrong problem at the wrong layer. Map the stack first."

### Layer 1: Foundation Models (LLMs)

The base. Pre-trained on massive datasets. You almost never train these yourself — you use them via API or download open-source versions.

Key players:
- **GPT-4o / GPT-4** — OpenAI. Strongest general capability. Multimodal.
- **Claude 3.5 Sonnet** — Anthropic. Strong reasoning, long context, safety focus.
- **Gemini Pro/Ultra** — Google. Strong multimodal, integration with Google services.
- **Llama 3** — Meta. Open source. Run locally or fine-tune freely.
- **Mistral** — European, open source, efficient.

How to choose:
- Need best reasoning? Claude or GPT-4o
- Need cost efficiency at scale? Smaller models or Mistral
- Need to run locally / avoid API dependency? Llama
- Need image understanding? GPT-4o, Claude, Gemini

### Layer 2: AI Model APIs

The interface to the LLM. Your application sends HTTP requests; the model responds.

Core API concepts:
- **Completions endpoint** — send prompt, get completion
- **Chat completions** — structured messages (system, user, assistant turns)
- **Embeddings endpoint** — convert text to vector representations for search
- **Token limits** — every model has a context window (how much text it can process at once)
- **Rate limits** — throttling on API usage
- **Streaming** — receive response token by token rather than waiting for the full response

### Layer 3: Vector Databases

Text can be converted into numerical vectors (embeddings) that represent semantic meaning. Similar text → similar vectors. Vector databases store and search these efficiently.

Why you need them:
- LLMs have context limits — you can't stuff your entire knowledge base into a prompt
- Vector search lets you find relevant chunks dynamically and inject only what's needed
- Enables semantic search (finding meaning, not just keywords)

Key options:
- **Pinecone** — managed, scalable, easy API
- **Chroma** — open source, good for local development
- **Weaviate** — open source, feature-rich
- **pgvector** — Postgres extension — good if you already use Postgres

### Layer 4: Retrieval Layer (RAG)
Retrieval-Augmented Generation — the pattern where you retrieve relevant context from your vector DB and inject it into the LLM prompt. Covered deeply in Module 04.

### Layer 5: Orchestration Layer

Orchestration frameworks manage the complexity of multi-step AI workflows:

- **LangChain** — popular but heavyweight. Chains, agents, memory, tools.
- **LlamaIndex** — focused on data indexing and retrieval
- **Custom code** — often the right choice; frameworks add complexity

Rule of thumb: start without a framework. Add one only when you have a clear reason.

### Layer 6: Memory

LLMs are stateless — they don't remember between conversations by default.

Types of memory in AI applications:
- **In-context memory** — the current conversation history passed in each request
- **External memory** — summaries or relevant past interactions retrieved from a database
- **Semantic memory** — facts and knowledge stored in a vector DB
- **Episodic memory** — specific past events/interactions, searchable

---

## Try It — Stack Exploration

### Activity 1: Make Your First API Call (20 mins)

Set up your environment and make a direct API call — no framework, raw HTTP.

**For Python (OpenAI):**
```python
from openai import OpenAI

client = OpenAI(api_key="your-key-here")

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain what a vector database is in 3 sentences."}
    ],
    temperature=0.3,
    max_tokens=200
)

print(response.choices[0].message.content)
print(f"Tokens used: {response.usage.total_tokens}")
```

**For Python (Anthropic):**
```python
import anthropic

client = anthropic.Anthropic(api_key="your-key-here")

message = client.messages.create(
    model="claude-3-5-haiku-20241022",
    max_tokens=200,
    system="You are a helpful assistant.",
    messages=[
        {"role": "user", "content": "Explain what a vector database is in 3 sentences."}
    ]
)

print(message.content[0].text)
```

Run this. Then modify:
1. Change the system prompt to make it respond as a specific expert
2. Change the temperature — compare outputs at 0.0 and 1.0
3. Lower max_tokens — see what gets cut

Observations:
- Effect of temperature change: ___
- Effect of system prompt change: ___
- Token cost for this call (estimate): ___

---

### Activity 2: Embeddings Exploration (20 mins)

Embeddings convert text to vectors. Let's see this concretely.

```python
from openai import OpenAI
import numpy as np

client = OpenAI(api_key="your-key-here")

def get_embedding(text):
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# Compare semantic similarity
texts = [
    "The cat sat on the mat",
    "A feline rested on the rug",
    "The weather today is sunny",
    "Machine learning is a type of artificial intelligence"
]

embeddings = [get_embedding(t) for t in texts]

# Compare each pair
for i in range(len(texts)):
    for j in range(i+1, len(texts)):
        similarity = cosine_similarity(embeddings[i], embeddings[j])
        print(f"Similarity between '{texts[i][:30]}...' and '{texts[j][:30]}...': {similarity:.3f}")
```

Expected: sentences 1 and 2 (same meaning, different words) should have high similarity. Sentence 3 (weather) should be dissimilar from all others.

Your results: ___
What this reveals about embeddings: ___

---

### Activity 3: Stack Mapping for a Real Product (20 mins)

Choose a real AI product idea (your own or a known product like ChatGPT for customer service, GitHub Copilot, etc.).

Map it against the full stack:

| Stack Layer | What this product uses at this layer | Required? Why? |
|---|---|---|
| User Interface | | |
| Orchestration | | |
| Memory | | |
| Retrieval | | |
| Vector Database | | |
| AI API | | |
| Foundation Model | | |

What layers can you simplify or skip for an MVP? ___
What's the single most complex layer for your use case? ___

---

## The Build vs Buy Decision

For each layer, you can build it yourself or use a managed service. Key tradeoffs:

| Layer | Build yourself | Buy/use managed |
|---|---|---|
| LLM | Train your own (costly, complex) | Use API (recommended for most) |
| Vector DB | Open source + self-host | Managed Pinecone/Weaviate |
| Orchestration | Custom Python | LangChain/LlamaIndex |
| UI | Custom frontend | Streamlit, Gradio, Vercel |

**Rule:** Start with managed/existing tools. Move to custom only when you have a specific reason — cost, control, or capability.

---

## Reflect

1. Before this lesson, how much of the AI stack were you aware of? Where were your biggest blind spots?

2. Most "AI products" that beginners build only use layers 6 and 7 (API + LLM). What capabilities do layers 3–5 unlock? Why do they matter for serious applications?

3. What's the risk of using an orchestration framework like LangChain from day one? What would you miss by not building from primitives first?

---

## Challenge
**Build a Minimal Stack:**

Build the simplest possible AI application that uses at least three layers of the stack explicitly:
1. A system prompt (configuring the model layer)
2. A conversation history (memory layer)
3. An embeddings call (retrieval layer — even if just to compute similarity)

Document: what each layer does in your application, and what breaks if you remove it.

My minimal stack application: ___
Layer 1 (model): ___
Layer 2 (memory): ___
Layer 3 (retrieval): ___
Most important lesson learned: ___

---

## Coming Up Next
Module 02: Professional Prompt Engineering — system prompts, few-shot examples, temperature control, and structured output — the craft layer that determines whether your AI application actually works.
