# Lesson Plan: The Open Source AI World
### Innovator Level (Ages 16–18) | Module 08

---

## Objective
By the end of this lesson, you understand what open-source AI models are, how they differ from closed commercial models, how to access and run them, and why the open vs. closed debate is one of the most consequential arguments happening in technology today.

---

## What You'll Need
- A device with internet access
- A computer with at least 8GB of RAM for the optional local model activity (16GB+ recommended)
- A free Hugging Face account (huggingface.co — free to create)
- Optionally: Ollama installed on your computer (ollama.ai — free, open-source)
- A free AI tool (ChatGPT free or Claude free) for comparison
- Paper and coloured pens OR a digital document
- About 50 minutes

---

## Watch First
Watch **Module 08: The Open Source AI World** with a parent or on your own.

Remember: When a model's weights — the billions of numerical parameters it learned during training — are publicly released, anyone can download, modify, and run them. This is fundamentally different from a model locked inside a company's API. Both approaches have genuine advantages and genuine risks.

---

## Go Deep — Open, Closed, and Everything Between

### Activity 1: Map the AI Landscape (15 mins)

The AI landscape has two poles and a large middle ground. Understanding where different models sit — and why — is foundational knowledge for anyone building with AI.

**Fully Closed Models (Proprietary):**
Examples: GPT-4 (OpenAI), Claude 3 (Anthropic), Gemini (Google)
- The model weights are never released
- You access them only via an API (you send a request, get a response)
- The company decides who can use them, at what cost, and under what terms of service
- The company can change, restrict, or shut down access at any time
- You never know exactly what the model was trained on

**Open-Weight Models:**
Examples: Llama 3 (Meta), Mistral, Qwen, Phi-3 (Microsoft), Falcon
- The model weights are publicly released — you can download the actual model
- Anyone can run them locally, modify them, fine-tune them, or build products on them
- Some have commercial restrictions; others are fully open
- You can inspect (to some degree) what is inside them
- Community improvements, fine-tunes, and variants emerge rapidly

**Fully Open Source (Training Data + Code + Weights):**
Examples: Some smaller models from EleutherAI, BLOOM (BigScience)
- The training data, training code, AND model weights are all released
- This is the rarest and most transparent category
- Allows genuine external audit of what the model learned from

**Your task:**

Go to huggingface.co and browse the Models section. Filter by "Text Generation". Look at the top models by downloads.

For each of five models you find, note:
- Who created it?
- Is it open-weight, proprietary, or fully open-source?
- What is its licence — can you use it commercially?
- How many parameters does it have? (Larger = generally more capable but heavier to run)
- What is it designed for — general conversation, coding, reasoning, a specific language?

Write a brief summary: What patterns do you notice about which organisations are releasing open-weight models, and which are keeping models closed?

---

### Activity 2: Run a Model Locally (Optional but Recommended) (20 mins)

If your computer has 8GB+ RAM, you can run an AI model locally — completely on your own hardware, with no internet connection required, no account, no terms of service, and no company able to see your conversations.

**Step 1 — Install Ollama:**
Go to ollama.ai and download the installer for your operating system. Follow the installation instructions. It takes about 5 minutes.

**Step 2 — Pull a model:**
Open your terminal (Command Prompt on Windows, Terminal on Mac/Linux) and type:
```
ollama pull llama3.2
```
This downloads Meta's Llama 3.2 model (approximately 2GB for the smallest version). You can also try:
- `ollama pull mistral` — Mistral 7B, strong general-purpose model
- `ollama pull phi3` — Microsoft's Phi-3, excellent for its size
- `ollama pull gemma2` — Google's Gemma 2

**Step 3 — Run it:**
```
ollama run llama3.2
```
You now have a fully local AI running entirely on your computer. Type a message and press Enter.

**Step 4 — Compare:**

Ask both your local model and a cloud model (ChatGPT or Claude) the same five questions. Note:
- Response quality — is the local model noticeably worse, similar, or surprisingly good?
- Response speed — is it fast or slow on your hardware?
- Privacy — everything you typed in the local model stayed on your machine
- Cost — this cost you nothing beyond electricity

If you cannot install Ollama, you can still access open models online via Hugging Face Spaces (search for "chat" on huggingface.co/spaces to find free hosted model interfaces).

---

**If the local install is not possible for you:**

Use the Hugging Face API instead. Create your free account and go to the Inference API section. Select a text generation model and run prompts through the web interface. Compare output quality to a commercial model.

---

### Activity 3: The Open vs. Closed Debate (15 mins)

This is one of the most genuinely contested debates in AI. Thoughtful, smart people are on both sides. Your job is to understand both positions deeply.

**The Case FOR Open-Source AI:**

1. **Democratisation:** Anyone — researchers, students, small companies, developing-world developers — can use powerful AI without paying per-API-call fees.
2. **Transparency:** Open weights allow researchers to audit models for biases, security vulnerabilities, and training data issues.
3. **Innovation:** Open models can be fine-tuned, improved, and adapted for specialised uses that a commercial company would never prioritise.
4. **Resilience:** If OpenAI or Anthropic shuts down, closes their API, or changes their terms, open-source models continue to exist and function.
5. **Privacy:** Running models locally means data never leaves your device — critical for sensitive business or personal information.

**The Case FOR Closed/Proprietary AI:**

1. **Safety:** Unrestricted access to powerful AI models means anyone — including those with harmful intent — can fine-tune them to remove safety guardrails.
2. **Quality control:** Closed models have centralised safety teams, red-teaming, and responsible deployment processes.
3. **Accountability:** A company with a product has legal liability. An open-source model with thousands of forks and no central maintainer has none.
4. **Investment:** Building frontier AI models costs hundreds of millions of dollars. Without commercial revenue, that investment would not happen.
5. **Containment:** Some argue the most powerful AI capabilities should remain with accountable organisations, not be released for anyone to use.

**Your task:**

Write a 300-word argument paper taking ONE of the two sides. Make the strongest possible case for your chosen position. Then, in a separate paragraph, write the single strongest counter-argument against your position and explain how you would respond to it.

Choose the side you genuinely believe is more right — or choose the side you find harder to argue, as practice for steelmanning.

---

## Design It!

Create a **"Model Selection Guide"** — a practical one-page decision framework for choosing between a closed commercial AI and an open-source model for different use cases.

Format it as a flowchart or decision table. It should help someone answer: "For this specific situation, should I use a commercial API or an open-source model?"

Consider factors like:
- Privacy requirements (is the data sensitive?)
- Cost constraints
- Need for the latest/most capable model
- Need to customise or fine-tune
- Offline/local operation needed
- Commercial deployment planned
- Speed requirements

For each combination, recommend a category of model and give a real example (e.g. "For high-privacy local use with limited compute: Phi-3 Mini via Ollama").

---

## Reflect
Answer these questions out loud or write them down:

1. You ran (or explored) an AI model outside of the big commercial platforms. How did that change your mental model of what AI is? Does knowing the weights can be downloaded make it feel more like a tool you own, or just a more accessible version of the same thing?
2. Meta releases Llama as open-weight — but Meta is one of the largest technology companies in the world and has its own commercial interests in doing so. Does "open source" from a major corporation mean the same thing as open source from an independent research group? What might Meta's motivations be?
3. If the most capable AI models 10 years from now are only accessible to a few large companies and well-funded governments, what would the world look like? Is that scenario more or less dangerous than a world where the most powerful models are freely available to everyone?

---

## Share (Optional)
If you ran a model locally with Ollama, show someone who has only ever used ChatGPT or Claude. Let them ask it questions. Then explain: "This is running entirely on my computer. No data left this machine." Watch their reaction. The concept of local AI is genuinely surprising to many people, including adults who work in technology.

---

## Coming Up Next
Module 09: AI Security and Prompt Injection — How do people attack AI systems? What is prompt injection, and why is it a serious problem? You are going to learn how adversarial users try to manipulate AI, and how to build defences.
