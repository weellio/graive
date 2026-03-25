# Lesson Plan: Fine-Tuning and RAG
### Innovator Level (Ages 16–18) | Module 11 — Expanded

---

## Objective
Develop a solid conceptual and practical understanding of Retrieval-Augmented Generation (RAG) and fine-tuning — what they are, how they differ, when to use each, and how they are applied in real products. Build a working manual RAG prototype and design a realistic fine-tuning dataset.

---

## What You'll Need
- A device with internet access
- A free AI tool (ChatGPT free or Claude free)
- Optionally: a free account at LlamaIndex Cloud or Cohere (for the RAG demonstration activity)
- Paper and coloured pens OR a digital document
- About 50–60 minutes

---

## Watch First
Watch **Module 11: Fine-Tuning and RAG** with a parent or on your own.

Remember: The base AI model knows a great deal about the world — but it knows nothing about your specific company, your database, your documents, or your personal knowledge. RAG and fine-tuning are the two main techniques for closing that gap.

---

## The Landscape: How AI Products Use Custom Knowledge

The generic AI assistant — a model that knows a great deal about the world generally but nothing about any specific organisation, dataset, or domain in depth — is powerful but limited for enterprise and specialised applications. When a pharmaceutical company wants an AI assistant to answer questions about its specific drug compounds, or a law firm wants AI that knows its precedent case library, or a school wants an AI tutor calibrated to its specific curriculum, the out-of-the-box model is inadequate. Making AI useful in these contexts requires techniques for connecting the model to specific knowledge — and RAG and fine-tuning are the dominant techniques.

The enterprise AI market has been significantly shaped by this "last mile" problem. Organisations that have invested decades in building proprietary knowledge bases — manuals, case histories, research archives, internal documentation — recognise that these assets could multiply in value if an AI could meaningfully access and reason about them. The challenge is connecting that institutional knowledge to AI in ways that produce accurate, reliable answers rather than confident-sounding hallucinations.

RAG (Retrieval-Augmented Generation) emerged from academic research and became commercially significant when it became clear that large language models could effectively use retrieved context to answer questions more accurately and with better attribution. The original RAG paper from Facebook AI Research (2020) demonstrated that combining a retrieval system with a generative model significantly improved performance on knowledge-intensive tasks. By 2023, RAG had become the default architecture for enterprise AI knowledge applications — customer support bots, internal Q&A tools, research assistants, and documentation search systems.

The RAG ecosystem has matured rapidly into a commercial market. LlamaIndex and LangChain, both founded in 2022, provide open-source frameworks for building RAG systems. Pinecone, Weaviate, Chroma, and several other companies build specialised vector databases for the embedding and retrieval step. Enterprise products from companies like Glean (enterprise search), Guru (knowledge management), and Notion AI (document-based Q&A) use RAG as their core technology. The technical choices — what embedding model to use, how to chunk documents, how many results to retrieve, how to handle conflicting information — have become a specialised engineering discipline.

Fine-tuning has a different commercial story. It was widely anticipated to be the primary technique for customising AI for enterprise applications, but RAG has proven more practical in most cases because: it doesn't require compute resources for retraining, knowledge can be updated by adding new documents rather than retraining, and it provides more transparent attribution (you can see which documents were retrieved). Fine-tuning remains valuable for specific use cases where: the task requires a different style or format of response that's difficult to specify in a system prompt, there's a large amount of domain-specific data available, or the performance improvement from fine-tuning is worth the cost.

The most sophisticated real-world systems often combine both approaches: RAG provides current, specific knowledge, while fine-tuning shapes how the model uses that knowledge — its tone, structure, reasoning style, and domain vocabulary. A medical AI assistant might be fine-tuned on clinical documentation to produce clinically appropriate responses, while simultaneously using RAG to retrieve specific information about the patient case or drug interactions from current databases.

Vector databases — a key component of RAG systems — have become one of the fastest-growing categories in developer infrastructure. A vector database stores numerical representations (embeddings) of text, enabling fast similarity search: "find me the stored texts most semantically similar to this query." The key insight is that semantic similarity can be captured numerically — two texts about the same topic will have similar vector representations even if they share no words in common. This enables natural language search over large document sets without requiring exact keyword matches.

---

## Technical Deep Dive: Embeddings and Vector Search

**What are embeddings?** An embedding is a list of numbers (a vector) that represents the meaning of a piece of text. Embedding models — like OpenAI's text-embedding-3 or the open-source sentence-transformers models — are trained to produce vectors such that semantically similar texts have vectors that are close together in the high-dimensional space. "The cat sat on the mat" and "A feline rested on a rug" would have similar embeddings; "The cat sat on the mat" and "Federal interest rate policy" would have very different embeddings.

**Dimensionality.** Typical embedding vectors have 768 or 1536 dimensions — lists of 768 or 1536 numbers. Each dimension captures some aspect of meaning (though the dimensions are not directly interpretable as specific concepts). The full 1536-dimensional vector collectively encodes the meaning of the text in a form that allows mathematical comparison.

**Cosine similarity.** The standard way to compare embeddings is cosine similarity — a measure of the angle between two vectors. Vectors pointing in the same direction (similar meaning) have cosine similarity near 1. Vectors pointing in opposite directions (very different meaning) have cosine similarity near -1. In practice, relevance retrieval for RAG looks for the stored documents with the highest cosine similarity to the query embedding.

**Chunking strategy.** Before embedding documents for a RAG system, they must be split into chunks — units of appropriate size for retrieval. Too small (a sentence), and each chunk lacks context. Too large (a full document), and retrieved chunks contain lots of irrelevant information mixed with the relevant part. Chunk sizes of 500–1000 tokens, with overlapping windows to avoid cutting off context at chunk boundaries, are common starting points. The optimal strategy depends on the document type and the query patterns.

**Approximate nearest neighbour search.** Finding the exact closest vectors in a database of millions of embeddings is computationally expensive. Vector databases use approximate nearest neighbour (ANN) algorithms — like HNSW (Hierarchical Navigable Small World) graphs — to find very similar (but not provably the most similar) vectors in milliseconds. The approximation error is typically negligible for practical applications.

---

## Activity 1: Understand the Problem These Techniques Solve (15 mins)

**The Knowledge Gap Problem:**

A language model was trained on data up to a certain date. It knows nothing about:
- Events after its training cutoff
- Your company's internal documentation
- Your personal notes, emails, or files
- A specific industry's niche technical knowledge not well-represented in training data
- Real-time data

**Two Approaches to Solving This:**

**Approach 1 — RAG:**
1. Documents are split into chunks and converted into numerical vectors (embeddings)
2. Vectors are stored in a vector database
3. When a user asks a question, it's also converted to a vector
4. The system finds the most similar chunks
5. Those chunks are added to the prompt as context
6. The AI answers based on retrieved context

**Approach 2 — Fine-Tuning:**
Continue training a pre-trained model on a smaller dataset of your own examples. The model's weights are updated — it "learns" your data and incorporates it into its behaviour.

**Key differences:**

| | RAG | Fine-Tuning |
|---|-----|------------|
| Best for | Giving AI access to specific knowledge/documents | Changing how the AI responds, not just what it knows |
| Updates easily | Yes — add new documents | No — requires retraining |
| Cost | Low | Higher |
| Transparency | High — you can see retrieved documents | Lower — embedded in weights |
| Use case examples | Customer support bot, legal research tool, internal Q&A | Model with specific brand voice, specialist coding assistant |

**Your task:** For each of five product scenarios, decide whether RAG, fine-tuning, or a combination is more appropriate and explain your reasoning:

1. A chatbot for a hospital answering patients' questions using hospital-specific policies
2. A writing assistant that always generates content in a specific author's style
3. A legal research tool searching a specific country's case law database
4. A customer service bot answering questions about product specifications that change monthly
5. A coding assistant trained on a company's proprietary codebase

---

## Activity 2: Build a Simple RAG Prototype (20 mins)

You are going to build the simplest possible version of RAG — manually, without any code.

**Step 1 — Your Knowledge Base:**
Write or paste 5–10 short paragraphs, each covering one distinct fact. Choose a domain you care about: your school's rules, a sport's statistics, a fictional company's product specs, facts about a topic you know well.

**Step 2 — The User Question:**
Write a question that could be answered using one or more of your documents.

**Step 3 — Simulate Retrieval:**
Manually read through your documents and select the 1–3 most relevant to the question.

**Step 4 — Construct the Augmented Prompt:**
```
You are a helpful assistant. Use ONLY the information provided below to answer the question. If the answer is not in the provided information, say "I don't have that information."

RELEVANT INFORMATION:
[Paste your 1-3 selected document chunks here]

QUESTION:
[Your user question]
```

**Step 5 — Run it and compare:**
Paste the full augmented prompt into your AI tool. Then run the same question WITHOUT the context. Compare responses.

Write down:
- What changed between the two responses?
- Did the RAG version stick to the provided information?
- What would happen if you retrieved the wrong documents?
- Where did the "use ONLY the information provided" instruction help or fail?

---

## Activity 3: The Fine-Tuning Thought Experiment (15 mins)

Design a fine-tuning dataset for a specific task.

Choose a task where you want a model to behave consistently:
- A tutoring assistant using the Socratic method
- A product description writer with a specific brand voice
- A customer support agent following a specific empathy framework
- A code reviewer that always explains the "why" behind suggestions

Write 10 training examples:
```json
{
  "input": "[A realistic user message or task]",
  "ideal_output": "[Exactly the kind of response you want]"
}
```

For your 10 examples:
- Vary the inputs — different phrasings, different complexity
- Keep outputs consistent in style and structure
- Include at least 2 edge cases

After writing your examples:
1. What pattern are you teaching? Describe in one sentence.
2. How would the fine-tuned model handle inputs not in your training examples?
3. What three types of inputs might the fine-tuning NOT handle well?

---

## Advanced Activity 1: RAG Architecture Design (25 mins)

Building a production-quality RAG system involves many design choices that significantly affect quality. Work through each of these architecture decisions for a specific use case of your choice.

**Your use case:** Choose one of these or define your own:
- An AI assistant that answers questions about a specific legal jurisdiction's company law
- An internal HR assistant for a company's policies, benefits, and procedures
- A research tool for a specific scientific field that indexes preprint papers

**Design decision 1: Document ingestion**
- What document formats will you process? (PDF, Word, web pages, plain text)
- How will you handle documents with mixed content (text, tables, images)?
- How will you handle document updates — when a policy changes, how does the knowledge base reflect it?
- What metadata will you store alongside each chunk? (source URL, date, author, document type)

**Design decision 2: Chunking strategy**
- What chunk size will you use? (measured in tokens)
- Will you use overlapping chunks? If so, how much overlap?
- Will you use semantic chunking (splitting at natural boundaries like paragraph breaks) or fixed-size chunking?
- For a legal document, what chunking approach makes most sense, and why?

**Design decision 3: Embedding model selection**
- Will you use a commercial embedding model (OpenAI's text-embedding-3) or an open-source model (sentence-transformers)?
- What dimension size will your embeddings be?
- If your use case involves technical legal or scientific language, does the embedding model need to understand this domain specifically?

**Design decision 4: Retrieval tuning**
- How many chunks will you retrieve per query? (k in k-nearest-neighbor retrieval)
- Will you re-rank retrieved chunks after initial retrieval?
- How will you handle queries that are too broad — "tell me about contracts" — that might return many weakly relevant chunks?

**Design decision 5: Response quality**
- How will you instruct the model to use retrieved information vs. its own training knowledge?
- How will you instruct the model to handle situations where retrieved documents conflict with each other?
- How will you implement citation — ensuring the model attributes specific claims to specific source documents?

Write a two-paragraph architecture summary covering your key design choices and the reasoning behind them.

---

## Advanced Activity 2: Evaluation Design (20 mins)

One of the most underappreciated challenges in RAG system development is evaluation: how do you know whether your system is producing good answers? The intuitive approach — read some responses and decide if they seem good — is insufficient for production systems because you can't read thousands of responses, and responses that seem good can still contain subtle errors.

Design an evaluation framework for the RAG use case from Advanced Activity 1.

**Evaluation dimensions:**

1. **Retrieval accuracy:** When the system retrieves chunks to answer a question, are the retrieved chunks actually relevant? How would you measure this? (Consider: manually labelling a set of test queries with the correct source documents, then measuring what fraction of your retrieval results include those documents)

2. **Answer faithfulness:** Does the generated answer accurately reflect only what's in the retrieved documents? How would you detect answers that include information not in the retrieved context (hallucination)?

3. **Answer completeness:** When the answer is in the documents, does the system find and include it? What's the cost of missing relevant information (false negatives) compared to including irrelevant information (false positives)?

4. **Temporal accuracy:** If documents are updated, does the system reflect the updated information? How would you test for stale answers?

5. **Edge case handling:** How does the system handle questions it can't answer from the knowledge base? Does it appropriately say "I don't have that information" or does it fabricate an answer?

For each dimension, specify: the test method (how you'd measure it), the tool or process needed (human review? automated checks?), and the threshold you'd consider acceptable for production deployment.

This evaluation design exercise is what separates a RAG prototype from a production-ready RAG system.

---

## Design It!

Create a **"Customisation Architecture Diagram"** for the AI product you designed in Module 10 (or a new AI product if you prefer).

Show:
- The base AI model at the centre
- The RAG system (if applicable) — showing document store, embedding process, retrieval flow
- The fine-tuning layer (if applicable) — showing training data and the fine-tuned model
- The application layer — how your product connects everything to the user
- The data flow — where data enters, gets processed, and produces output
- The update cycle — how and when the knowledge base gets updated

Label every component. Add a brief note next to each explaining why it is needed.

At the bottom, write a one-paragraph "technical summary" describing the customisation approach.

---

## Case Studies

**Case Study 1: Notion AI's RAG Architecture**
Notion's AI features, launched in 2023, include the ability to ask questions about the content of your Notion workspace — your notes, projects, documents, and databases. The challenge Notion faced was implementing RAG across an extremely varied data type: users' Notion workspaces contain prose notes, structured databases, tables, embedded media, and deeply nested pages. Their implementation required careful choices about how to chunk and embed different content types, how to handle the relational structure of Notion databases (not just retrieving relevant pages but understanding the relationships between pages), and how to keep the index up to date as users add and edit content. The product's quality depends almost entirely on these technical choices — and getting them right is why dedicated companies in the RAG infrastructure space (LlamaIndex, Weaviate) have built substantial businesses.

*Analysis questions: What specific challenges does RAG over a personal knowledge base (like a Notion workspace) present that don't arise in RAG over a corporate document repository? How would you test whether Notion's retrieval is actually finding the most relevant content for a user's query?*

**Case Study 2: OpenAI's GPT-4 Fine-Tuning for Legal Applications**
Several legal technology companies have used OpenAI's fine-tuning API to create models calibrated for specific legal tasks. A specific example: fine-tuning a model on thousands of examples of contract clause analysis, where each input is a clause and the ideal output is a structured analysis identifying: the type of clause, the obligations created, the risks to each party, and any standard market deviations. The fine-tuned model produces consistently structured, legally appropriate analyses that follow the format expected by legal professionals — something that would be difficult to achieve reliably with system prompt instructions alone. The business implication: a legal technology company that has invested in high-quality fine-tuning data and the resulting model has a genuine proprietary asset that competitors cannot easily replicate.

*Analysis questions: What makes the fine-tuning data itself — the thousands of well-labelled legal clause analyses — a valuable proprietary asset? Who creates that data, and what does it cost? How does this relate to the "data as moat" concept from Module 03?*

**Case Study 3: Perplexity's Citation Architecture**
Perplexity AI is a search engine that uses RAG at its core: for every query, it retrieves current web pages, and the AI generates an answer grounded in those retrieved sources with explicit citations. The design challenge is significant: web pages are noisy, contradictory, and varying in quality. Perplexity has invested in: source quality filtering (not all web pages are equally reliable), multi-source synthesis (combining information from several sources into a coherent answer), and attribution precision (citing the specific claim from the specific source). Their success has shown that RAG applied to web search is a viable alternative to traditional search for many query types — and that the quality of the retrieval and synthesis architecture is the core competitive differentiator.

*Analysis questions: Perplexity is built entirely on top of web content and AI models — it doesn't create original content or train its own foundation model. Is that a defensible business? What would it take to replicate Perplexity? What does Perplexity's success or failure tell you about where value is created in AI systems?*

---

## Career Paths

**ML Engineer (RAG/Search Specialisation)**
The technical implementation of RAG systems — choosing and deploying embedding models, configuring vector databases, tuning retrieval parameters, evaluating quality — is a specialised ML engineering role. This is distinct from training models from scratch; it's about deploying and optimising existing models for specific retrieval applications. Entry requires strong software engineering plus ML fundamentals plus practical experience with the RAG toolchain (LangChain, LlamaIndex, vector databases). This is one of the most practical paths into AI engineering that doesn't require a research background.

**AI/ML Platform Engineer**
Large organisations deploying AI internally need engineers who maintain the AI infrastructure — the vector databases, the fine-tuning pipelines, the model serving infrastructure, the evaluation systems. This infrastructure engineering role is increasingly distinct from application-level AI work and requires expertise in distributed systems, DevOps, and ML operations. It's a senior role but with clear career paths from software engineering with ML experience.

**Data Scientist (Knowledge Engineering Focus)**
Making RAG systems work well requires deep understanding of the data: how to structure and clean documents, how to design effective chunking strategies, how to evaluate retrieval quality. This is as much a data curation and management challenge as a technical one. Data scientists who combine ML knowledge with careful attention to data quality and curation are the practical builders of production RAG systems.

**AI Research Engineer (Efficient NLP)**
Academic and industrial research on making retrieval more efficient, embedding models more capable, and RAG systems more reliable is active and growing. Research engineers at AI labs and at companies like Cohere, Anthropic, and OpenAI work on the fundamental techniques underlying RAG and fine-tuning. This path requires graduate-level ML background but represents the frontier of what's possible in knowledge-intensive AI applications.

---

## Reflect
Answer these questions out loud or write them down:

1. RAG grounds the AI in specific retrieved documents, which reduces hallucination for factual questions. But what happens when the retrieved documents themselves contain errors, outdated information, or conflicting facts? Does RAG solve the reliability problem, or just move it?
2. Fine-tuning can embed a company's brand voice deeply into a model. Is there a risk that fine-tuning embeds biases or blindspots along with the style? How would you monitor for this?
3. If you could fine-tune an AI model on your own writing, notes, and ideas, the result would be a model that responds somewhat like you. How would you feel about using such a model — or about someone else having access to it?

---

## Level Up — Build It

**Specific deliverable:** A complete RAG system design document for a specific use case of your choice. The document should be 800–1000 words and include: (1) the use case with a specific, named customer and their specific problem; (2) the knowledge base description — what documents, how many, how often updated; (3) a detailed architecture diagram showing every component from document ingestion through user query to response; (4) key design decisions with explicit reasoning (chunking strategy, embedding model, retrieval parameters, response instructions); (5) the evaluation framework with specific metrics and thresholds; and (6) a deployment plan — where it would run, what tools you'd use, rough cost estimate.

If you want to go further: build the manual RAG demonstration from Activity 2 with your own real knowledge base — your course notes, a set of articles you've read, or a topic you know well — and evaluate its performance systematically across 10 test queries.

---

## Further Reading

- **LlamaIndex documentation (llamaindex.ai/docs)** — the most practical and up-to-date technical documentation for building RAG systems. The "getting started" and "use cases" sections are particularly useful for understanding how RAG is implemented in practice. The documentation assumes Python knowledge but is conceptually valuable even without coding.
- **"Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" (Lewis et al., 2020)** — the original RAG paper from Facebook AI Research. Available free on arXiv. The core ideas are clearly explained and the paper is shorter and more accessible than most ML research papers. Reading original papers builds the ability to evaluate claims about AI techniques directly.
- **Hugging Face "NLP Course"** — a free, comprehensive course on natural language processing that covers the transformer architecture, embeddings, fine-tuning, and practical implementation. The conceptual sections are valuable even if you don't work through the coding exercises. Available at huggingface.co/learn.
- **"Patterns for Building LLM-Based Systems and Products" by Eugene Yan** — a widely shared article covering practical patterns for building RAG systems, fine-tuning pipelines, and evaluation frameworks. Practitioner-written, specific, and grounded in real deployment experience.

---

## Deep Reflection Questions

1. RAG grounds AI answers in retrieved documents, reducing hallucination for factual questions. But what happens when the retrieved documents contain errors, are outdated, or contradict each other? Does RAG solve the reliability problem, or just move it one level up?

2. Fine-tuning can embed a specific organisation's norms, style, and assumptions deeply into a model. What are the risks of this? Could fine-tuning entrench institutional blindspots, biases, or outdated assumptions that would be challenged in a general-purpose model?

3. If you could fine-tune an AI model on your own writing, notes, and ideas — creating a model that responds somewhat like you — what would you do with it? Would you find it useful or unsettling? What does the appeal (or discomfort) you feel reveal about how you think of identity and AI?

4. RAG and fine-tuning both rely on large amounts of high-quality data. Who currently has that data? What does this imply about which organisations are best positioned to build highly customised AI systems? Does this create new forms of inequality between organisations with large proprietary knowledge bases and those without?

5. The evaluation problem — reliably measuring whether an AI system is producing good outputs — is one of the hardest practical challenges in AI deployment. What makes it hard? And what are the consequences of deploying AI systems with inadequate evaluation, in high-stakes contexts like healthcare, legal, or financial applications?

6. RAG connects AI to specific external knowledge sources. Fine-tuning connects AI to specific training examples. Neither guarantees accuracy. At what point is an AI system reliable enough to use without human verification of its outputs? Who should make that determination, and on what basis?

---

## Share (Optional)
Explain RAG to someone technical using the manual demonstration from Activity 2 as your teaching tool. Ask them: "Given this approach, can you think of situations where retrieval would work really well, and situations where it would fail?"

---

## Coming Up Next
Module 12: Innovator Challenge — This is where everything comes together. Your final challenge is to ship something real.
