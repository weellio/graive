# Lesson Plan: RAG — Teaching AI Your Own Data
### Creator Level (Ages 18+) | Module 04

---

## Objective
By the end of this lesson, you'll understand how Retrieval-Augmented Generation (RAG) works at every layer — from embedding to chunking to retrieval to generation — and you'll have built a working RAG pipeline from scratch.

---

## What You'll Need
- Python 3.9+ with: `pip install openai chromadb tiktoken`
- API key (OpenAI for embeddings, and OpenAI or Anthropic for generation)
- Some documents to test with (PDF, text files, or copy-paste some articles)
- Code editor
- About 90–120 minutes

---

## Watch First
Watch **Module 04: RAG — Teaching AI Your Own Data** before starting.

Core insight: **LLMs know everything that's publicly available at training time. RAG is how you give them knowledge of what they don't know — your private data, recent events, and niche domains.**

---

## Key Concepts

### The Core Problem RAG Solves

LLMs have two fundamental knowledge limitations:
1. **Training cutoff** — they don't know what happened after training
2. **Context limit** — you can't stuff your entire knowledge base into one prompt

RAG solves both by:
1. Storing your knowledge externally in a vector database
2. At query time: retrieving only the most relevant chunks
3. Injecting those chunks into the LLM prompt as context

```
User query
    ↓
Embed query → Query vector
    ↓
Search vector DB → Top N relevant chunks
    ↓
Inject chunks + query into LLM prompt
    ↓
LLM generates answer grounded in your data
```

> "Without RAG, your AI knows everything and your data. With RAG, your AI knows everything plus your data. That's the difference between a general assistant and a specialist."

### Embeddings: Representing Meaning as Numbers

An embedding is a numerical vector (list of numbers) that represents the semantic meaning of a piece of text.

Key properties:
- Similar text → similar vectors (small distance in vector space)
- Unrelated text → dissimilar vectors (large distance)
- The embedding model determines the quality of semantic understanding
- OpenAI's `text-embedding-3-small` produces 1536-dimensional vectors
- These vectors can be stored and searched efficiently

**Cosine similarity** is the standard way to measure how similar two vectors are:
- 1.0 = identical meaning
- 0.0 = completely unrelated
- -1.0 = opposite meaning (rare in practice)

### Chunking Strategies

Before embedding, you must split documents into chunks. Chunking strategy dramatically affects retrieval quality.

**Fixed-size chunking:**
Split every N tokens/characters. Simple but may split mid-sentence or mid-concept.

**Sentence-based chunking:**
Split at sentence boundaries. Preserves semantic units but chunks vary in size.

**Paragraph-based chunking:**
Split at paragraph breaks. Preserves logical units. Often best for prose.

**Semantic chunking:**
Use an LLM or embedding similarity to detect where meaning shifts. Most sophisticated, most expensive.

**Chunk overlap:**
Include the last N tokens of the previous chunk in the current chunk. Prevents context loss at boundaries.

**Choosing chunk size:**
- Too small → chunks lose context, retrieval misses the point
- Too large → less precise retrieval, more irrelevant content injected
- Typical range: 200–1000 tokens per chunk
- Experiment for your specific content type

### Retrieval Strategies

**Dense retrieval (semantic search):**
Use embedding similarity. Finds semantically related content even if different words.

**Sparse retrieval (keyword/BM25):**
Traditional full-text search. Finds exact keyword matches. Misses paraphrases but catches specific terms.

**Hybrid retrieval:**
Combine dense + sparse. Usually better than either alone for real-world data.

**Re-ranking:**
After initial retrieval, use a more powerful model to rerank results by relevance. Adds latency but improves quality.

---

## Try It — Build a RAG Pipeline

### Activity 1: Embed and Store Documents (25 mins)

```python
import chromadb
from openai import OpenAI
import os

openai_client = OpenAI(api_key="your-key-here")

# Initialize ChromaDB (local, in-memory for this demo)
chroma_client = chromadb.Client()
collection = chroma_client.create_collection(
    name="knowledge_base",
    metadata={"hnsw:space": "cosine"}
)

def get_embedding(text: str) -> list[float]:
    response = openai_client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    """Simple word-based chunking with overlap."""
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        end = start + chunk_size
        chunk = ' '.join(words[start:end])
        chunks.append(chunk)
        start += chunk_size - overlap
    return chunks

def add_document(doc_id: str, text: str, metadata: dict = None):
    chunks = chunk_text(text)
    embeddings = [get_embedding(chunk) for chunk in chunks]
    ids = [f"{doc_id}_chunk_{i}" for i in range(len(chunks))]
    metadatas = [{"source": doc_id, **(metadata or {})} for _ in chunks]

    collection.add(
        documents=chunks,
        embeddings=embeddings,
        ids=ids,
        metadatas=metadatas
    )
    print(f"Added {len(chunks)} chunks from {doc_id}")

# Add some test documents — replace with your own content
documents = {
    "doc1": """
    Machine learning is a subset of artificial intelligence that enables systems to learn
    and improve from experience without being explicitly programmed. It focuses on developing
    computer programs that can access data and use it to learn for themselves.
    The process begins with observations or data, such as examples, direct experience,
    or instruction, to look for patterns in data and make better decisions in the future.
    """,
    "doc2": """
    Deep learning is part of a broader family of machine learning methods based on
    artificial neural networks. Learning can be supervised, semi-supervised or unsupervised.
    Deep learning architectures such as deep neural networks, recurrent neural networks,
    convolutional neural networks, and transformers have been applied to fields including
    computer vision, natural language processing, and speech recognition.
    """
}

for doc_id, text in documents.items():
    add_document(doc_id, text)
```

Did the documents add successfully? ___
Number of chunks created: ___

---

### Activity 2: Retrieval (20 mins)

```python
def retrieve(query: str, n_results: int = 3) -> list[dict]:
    query_embedding = get_embedding(query)
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results,
        include=["documents", "distances", "metadatas"]
    )

    retrieved = []
    for i in range(len(results['documents'][0])):
        retrieved.append({
            "text": results['documents'][0][i],
            "distance": results['distances'][0][i],
            "source": results['metadatas'][0][i]['source']
        })
    return retrieved

# Test retrieval
test_queries = [
    "What is machine learning?",
    "How do neural networks work?",
    "What is supervised learning?",
    "Tell me about transformers"
]

for query in test_queries:
    results = retrieve(query, n_results=2)
    print(f"\nQuery: {query}")
    for r in results:
        print(f"  Distance: {r['distance']:.3f} | Source: {r['source']}")
        print(f"  Text: {r['text'][:100]}...")
```

Test results:
- Did semantically related queries retrieve relevant chunks? ___
- What distance threshold would you use to filter out irrelevant results? ___
- Did any query retrieve surprisingly irrelevant content? ___

---

### Activity 3: Full RAG Pipeline (25 mins)

```python
def rag_answer(question: str, n_chunks: int = 3) -> str:
    # Step 1: Retrieve relevant chunks
    chunks = retrieve(question, n_results=n_chunks)

    # Step 2: Build context from chunks
    context = "\n\n---\n\n".join([
        f"Source: {c['source']}\n{c['text']}"
        for c in chunks
    ])

    # Step 3: Build the augmented prompt
    prompt = f"""Answer the question based ONLY on the provided context.
If the answer is not in the context, say "I don't have information about that in my knowledge base."
Do not use prior knowledge — only what's in the context.

Context:
{context}

Question: {question}

Answer:"""

    # Step 4: Generate answer
    response = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a precise assistant. Answer only from the provided context."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.1,
        max_tokens=500
    )

    answer = response.choices[0].message.content

    return {
        "answer": answer,
        "sources": [c['source'] for c in chunks],
        "retrieved_chunks": len(chunks)
    }

# Test the full pipeline
test_questions = [
    "What is machine learning?",
    "What are examples of deep learning architectures?",
    "What is quantum computing?"  # Should say "not in knowledge base"
]

for question in test_questions:
    result = rag_answer(question)
    print(f"\nQ: {question}")
    print(f"A: {result['answer']}")
    print(f"Sources: {result['sources']}")
```

Results:
- Did it correctly refuse to answer the out-of-scope question? ___
- Quality of in-scope answers: ___/10
- Did it hallucinate anything not in the context? ___

---

## Advanced RAG Patterns

### Metadata Filtering
Add metadata to chunks (date, category, author, document type) and filter at retrieval time:

```python
results = collection.query(
    query_embeddings=[query_embedding],
    n_results=5,
    where={"source": "doc1"}  # Only search in doc1
)
```

### Hybrid Search
Combine semantic and keyword search. ChromaDB supports this; other DBs like Weaviate have built-in hybrid search.

### Hypothetical Document Embedding (HyDE)
Instead of embedding the query directly, ask the LLM to generate a hypothetical answer, then embed that. Often improves retrieval for short queries.

```python
def hyde_retrieve(query: str) -> list[dict]:
    # Generate hypothetical answer
    hypothetical = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": f"Write a short paragraph answering: {query}"}],
        max_tokens=150
    ).choices[0].message.content

    # Use hypothetical answer as query embedding
    return retrieve(hypothetical, n_results=3)
```

---

## Reflect

1. What's the key trade-off in chunk size? What would go wrong with chunks of 50 tokens? With chunks of 5000 tokens?

2. In a production RAG system, how would you know if retrieval quality is degrading over time? What would you measure?

3. RAG requires you to decide in advance what knowledge to include. What types of questions would RAG always fail to answer well — regardless of implementation quality?

---

## Challenge
**Build a RAG Application on Your Own Documents:**

Choose a real set of documents that are relevant to a project or interest:
- A collection of research papers
- Product documentation
- A set of articles on a topic you care about
- Your own notes or writing

Build a complete RAG pipeline with:
- Proper chunking (experiment with at least 2 chunk sizes)
- Metadata filtering (by document, date, or category)
- A quality evaluation: test 10 questions, rate each answer 1–5

Report:
- Documents indexed: ___ | Total chunks: ___
- Best chunk size you found: ___
- Average answer quality at best chunk size: ___/10
- Types of questions where RAG worked well: ___
- Types of questions where RAG failed: ___

---

## Coming Up Next
Module 05: Ship an AI Product in a Weekend — no-code tools, n8n automations, Vercel deployment, and the pricing strategy conversation you need to have before you launch.
