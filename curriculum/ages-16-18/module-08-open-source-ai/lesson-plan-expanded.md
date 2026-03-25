# Lesson Plan: The Open Source AI World
### Innovator Level (Ages 16–18) | Module 08 — Expanded

---

## Objective
Understand what open-source AI models are, how they differ from closed commercial models, how to access and run them, and why the open vs. closed debate is one of the most consequential arguments happening in technology today. Evaluate the tradeoffs from multiple perspectives and form a reasoned position.

---

## What You'll Need
- A device with internet access
- A computer with at least 8GB of RAM for the optional local model activity (16GB+ recommended)
- A free Hugging Face account (huggingface.co — free to create)
- Optionally: Ollama installed on your computer (ollama.ai — free, open-source)
- A free AI tool (ChatGPT free or Claude free) for comparison
- Paper and coloured pens OR a digital document
- About 50–60 minutes

---

## Watch First
Watch **Module 08: The Open Source AI World** with a parent or on your own.

Remember: When a model's weights — the billions of numerical parameters it learned during training — are publicly released, anyone can download, modify, and run them. This is fundamentally different from a model locked inside a company's API.

---

## The Landscape: The Open Source Battle for AI's Future

The history of software has been repeatedly shaped by the tension between proprietary and open approaches. In the 1980s, IBM's closed hardware architecture was disrupted by open clones. In the 1990s, Linux and the open-source movement challenged Microsoft's dominance of server software. In the 2000s, Android's open model disrupted the mobile market. Each cycle, the question was the same: who controls the fundamental technology, who can access it, and on what terms? AI is the latest and arguably most consequential version of this story.

The modern open-source AI movement traces its origins to research institutions and projects like EleutherAI, a volunteer-run collective that in 2021 released GPT-Neo and GPT-J — open replications of GPT-3 that anyone could download and run. These models were significantly less capable than commercial alternatives, but their release established the principle and demonstrated feasibility. The crucial acceleration came when Meta AI released the first LLaMA model in early 2023. Llama was trained on data comparable to GPT-3 and released for research purposes — but within days it was leaked publicly, and the community began fine-tuning and extending it at extraordinary speed.

Meta's subsequent release of LLaMA 2 and LLaMA 3 under more permissive licences accelerated the open-source model ecosystem dramatically. By 2024, the performance gap between open-weight models and the top commercial models had narrowed substantially. Llama 3.1 405B, Meta's largest model, performed comparably to GPT-4 on many benchmarks. Mistral, a French startup, released the Mixtral model — a "mixture of experts" architecture that achieved GPT-3.5-level performance in a model that could run on relatively modest hardware. Microsoft's Phi series demonstrated that small, carefully trained models could achieve impressive performance on reasoning tasks. The community produced thousands of fine-tunes, specialised variants, and optimised versions.

The geopolitical dimension of this debate is real and important. AI development is a strategic priority for both the United States and China. The Biden administration's 2023 export controls restricted the export of certain advanced AI chips (primarily NVIDIA's H100 series) to China, aiming to slow Chinese AI development. Open-source model releases complicate this picture: if a US company releases an open-weight model, a Chinese research team can download and run it regardless of chip export controls. The tension between the domestic competitive and innovation benefits of open models and the national security concerns about unrestricted access is a genuine and unresolved policy challenge.

The safety debate around open-source AI is substantive and contested. Closed AI companies — particularly OpenAI and Anthropic — have argued that releasing powerful model weights publicly makes it significantly easier to create "uncensored" variants stripped of safety guidelines, potentially enabling harmful applications. Meta and the open-source community have countered that open models allow security researchers to audit models for vulnerabilities, that the "dangerous capabilities" in current models are already accessible via jailbreaking, and that the safety benefits of centralised control are overstated given the track record of commercial AI systems in producing harmful outputs.

The practical landscape as of 2025 is genuinely complex. Hugging Face hosts over half a million open models. The LLM leaderboards track performance across dozens of benchmarks, with new state-of-the-art results appearing weekly. Consumer hardware has reached the point where a mid-range gaming PC can run models comparable in quality to GPT-3.5. Local AI tools like Ollama, LM Studio, and Jan have made running models locally accessible to non-technical users. The promise of having a capable, private, customisable AI that runs entirely on your own hardware — without any dependency on external services, usage fees, or terms of service — is becoming a practical reality rather than a theoretical possibility.

For builders, the practical implications are significant. Open-source models enable fine-tuning with your own data (covered in Module 11) in ways that closed APIs typically don't allow. They enable deployment in air-gapped environments where no internet connection is available. They eliminate usage costs for high-volume applications. They allow inspection of model behaviour in ways not possible with black-box APIs. And they create the possibility of genuinely distributed, community-maintained AI infrastructure rather than a landscape dominated by a handful of powerful companies.

---

## Technical Deep Dive: What Model Weights Are and Why They Matter

**What are model weights?** A neural network is fundamentally a mathematical function with billions of parameters — numbers that determine how the network transforms inputs into outputs. Training a language model involves adjusting these parameters so that the model becomes better at predicting text. After training on hundreds of billions of tokens of text, the model has developed internal representations of language, facts, reasoning patterns, and even something like common sense. All of this is encoded in the weights — the numerical values of those billions of parameters.

**How large are they?** A model with 7 billion parameters, stored in 16-bit floating point format, requires approximately 14 gigabytes of storage. A 70B model requires ~140GB. Running a model requires loading these weights into RAM (or GPU VRAM) — which is why larger models require more capable hardware. "Quantisation" is a technique that reduces the precision of the stored numbers (from 16-bit to 4-bit, for example) to reduce memory requirements at some cost to quality. A quantised 7B model can run on a laptop with 8GB RAM.

**Model architecture.** Most current open-source models use the "transformer" architecture (described in the 2017 Google paper "Attention Is All You Need"). The core component is the attention mechanism: a way for the model to consider the relationships between all tokens in the context window simultaneously. Different models use different attention mechanisms, positional encodings, activation functions, and training data compositions — these architectural choices, along with training data quality and scale, determine model performance.

**Inference vs. training.** Running a model to generate text (inference) requires much less compute than training the model. A model that cost millions of dollars and thousands of GPU-hours to train can run for inference on a consumer laptop. This asymmetry is why local AI is practical — you're benefiting from the enormous investment in training without paying its cost.

**The fine-tuning ecosystem.** The open-source community has developed numerous efficient fine-tuning techniques. LoRA (Low-Rank Adaptation) is the most widely used: rather than updating all model weights during fine-tuning, LoRA adds small "adapter" matrices that capture the fine-tuning information while leaving the original weights unchanged. This makes fine-tuning feasible on consumer-grade GPUs with datasets of a few hundred to a few thousand examples.

---

## Activity 1: Map the AI Landscape (15 mins)

The AI landscape has two poles and a large middle ground. Understanding where different models sit — and why — is foundational knowledge for anyone building with AI.

**Fully Closed Models (Proprietary):**
Examples: GPT-4 (OpenAI), Claude 3 (Anthropic), Gemini (Google)
- The model weights are never released
- You access them only via an API
- The company controls who can use them, at what cost, and under what terms

**Open-Weight Models:**
Examples: Llama 3 (Meta), Mistral, Qwen, Phi-3 (Microsoft), Falcon
- The model weights are publicly released
- Anyone can run them locally, modify them, fine-tune them, or build products on them
- Some have commercial restrictions; others are fully open

**Fully Open Source (Training Data + Code + Weights):**
Examples: Some smaller models from EleutherAI, BLOOM (BigScience)
- The training data, training code, AND model weights are all released
- This is the rarest and most transparent category

**Your task:**

Go to huggingface.co and browse the Models section. Filter by "Text Generation". Look at the top models by downloads.

For each of five models you find, note:
- Who created it?
- Is it open-weight, proprietary, or fully open-source?
- What is its licence — can you use it commercially?
- How many parameters does it have?
- What is it designed for?

Write a brief summary: What patterns do you notice about which organisations are releasing open-weight models, and which are keeping models closed?

---

## Activity 2: Run a Model Locally (Optional but Recommended) (20 mins)

If your computer has 8GB+ RAM, you can run an AI model locally — completely on your own hardware, with no internet connection required.

**Step 1 — Install Ollama:**
Go to ollama.ai and download the installer for your operating system.

**Step 2 — Pull a model:**
Open your terminal and type:
```
ollama pull llama3.2
```

**Step 3 — Run it:**
```
ollama run llama3.2
```

**Step 4 — Compare:**

Ask both your local model and a cloud model (ChatGPT or Claude) the same five questions. Note:
- Response quality
- Response speed
- Privacy implications
- Cost

If you cannot install Ollama, use the Hugging Face API or Spaces to access open models online.

---

## Activity 3: The Open vs. Closed Debate (15 mins)

**The Case FOR Open-Source AI:**

1. **Democratisation:** Anyone can use powerful AI without per-API-call fees
2. **Transparency:** Open weights allow researchers to audit models for biases and vulnerabilities
3. **Innovation:** Open models can be fine-tuned for specialised uses
4. **Resilience:** If a company shuts down, open-source models continue to exist
5. **Privacy:** Running models locally means data never leaves your device

**The Case FOR Closed/Proprietary AI:**

1. **Safety:** Unrestricted access means anyone can remove safety guardrails
2. **Quality control:** Closed models have centralised safety teams and responsible deployment processes
3. **Accountability:** A company has legal liability; an open-source model with many forks does not
4. **Investment:** Building frontier AI costs hundreds of millions; commercial revenue funds this
5. **Containment:** Some argue powerful capabilities should remain with accountable organisations

**Your task:**

Write a 300-word argument paper taking ONE of the two sides. Then, in a separate paragraph, write the single strongest counter-argument against your position and explain how you would respond to it.

---

## Advanced Activity 1: Licence Deep Dive (20 mins)

Open-source licences are not all the same, and understanding the differences matters enormously for anyone building products. A common misconception is that "open source" means "free to use for anything." Many open-weight model licences have significant restrictions.

Research the following five model licences and compare them:

1. **Llama 3 Community Licence** (Meta's current licence)
2. **Apache 2.0** (used by Mistral and others)
3. **MIT Licence** (used by some smaller models)
4. **Creative Commons Attribution** (used by some research models)
5. **A custom restrictive licence** (find an example on Hugging Face)

For each, answer:
- Can you use this model to build a commercial product?
- Can you fine-tune this model and release the fine-tuned version?
- Can you modify the model and keep your modifications private?
- Are there usage restrictions (e.g., can't be used for certain applications)?
- What attribution is required?

Create a simple comparison table. Then: if you were building a commercial AI product and needed to choose an open-source model, which licence type would be most permissive for your purposes? What would be the risks of choosing a model with the most permissive licence?

---

## Advanced Activity 2: Quantisation and Hardware Requirements (25 mins)

One of the practical challenges of running models locally is hardware — larger, more capable models require more RAM and compute. Quantisation is the primary technique for making models more accessible.

This activity develops practical understanding of the compute tradeoffs in local AI deployment.

**Research task:** For each of the following model sizes, research (using the Ollama library, Hugging Face model cards, or community forums) the typical hardware requirements and typical performance characteristics:

| Model size | RAM needed (full precision) | RAM needed (4-bit quantised) | Speed on laptop CPU | Quality vs GPT-3.5 |
|------------|----------------------------|------------------------------|---------------------|-------------------|
| 3B parameters | | | | |
| 7B parameters | | | | |
| 13B parameters | | | | |
| 70B parameters | | | | |

After completing the table, answer:
1. What is the smallest model that produces outputs comparable to GPT-3.5 quality on general tasks?
2. What hardware would you need to run the 70B model comfortably?
3. For a use case where privacy is paramount (e.g., processing sensitive legal documents), and you have a laptop with 16GB RAM, what is the best model you could run locally?
4. What is the "sweet spot" for your current hardware — the largest model that would run responsively?

This kind of hardware-capability analysis is routine for anyone deploying AI in production environments, particularly where cost, privacy, or offline operation are constraints.

---

## Design It!

Create a **"Model Selection Guide"** — a practical one-page decision framework for choosing between a closed commercial AI and an open-source model for different use cases.

Format it as a flowchart or decision table. Consider factors like:
- Privacy requirements (is the data sensitive?)
- Cost constraints
- Need for the latest/most capable model
- Need to customise or fine-tune
- Offline/local operation needed
- Commercial deployment planned
- Speed requirements

For each combination, recommend a category of model and give a real example (e.g. "For high-privacy local use with limited compute: Phi-3 Mini via Ollama").

---

## Case Studies

**Case Study 1: Meta's Strategic Bet on Open Source**
Meta's decision to release Llama as open-weight is not altruism — it's a carefully considered strategic move. Meta's reasoning, articulated by their chief AI scientist Yann LeCun in multiple public statements, includes: open-source development accelerates progress faster than closed development; Meta doesn't primarily compete in the AI model market the way OpenAI does, so the cost of giving away the model is lower than the benefit of driving the ecosystem forward; and open models reduce the regulatory and reputational risk of being seen as a dangerous closed AI company. Critics have argued that Meta's open releases also serve its commercial interests by commoditising AI models and reducing the competitive advantage of rivals like OpenAI and Anthropic, who do compete in the model market.

*Analysis questions: Does corporate open-source release serve the public interest in the same way as academic or community open-source release? What matters more — the outcome (open models exist) or the motivation (corporate strategy vs. genuine commitment to openness)?*

**Case Study 2: The Uncensored Model Problem**
Shortly after Meta's first Llama model was leaked in early 2023, community members began releasing "uncensored" fine-tunes — versions of the model with safety training removed, capable of producing content that the original model would refuse. These ranged from merely adult content to genuinely dangerous material, including detailed instructions for harmful activities. This validated one of the central concerns about open-weight models: once weights are public, safety alignment can be removed by anyone with the right technical knowledge. The response from the safety community has been to develop better techniques for making safety training more robust to removal — a kind of arms race between safety researchers and community fine-tuners.

*Analysis questions: Is the existence of uncensored models primarily a free speech issue, a safety issue, or both? Who bears responsibility for harms caused by fine-tuned variants of an open-source model — the original creator, the fine-tuner, or the person who uses the harmful content?*

**Case Study 3: The French AI Sovereignty Argument**
Mistral AI, founded in 2023 by former DeepMind and Meta researchers in Paris, became one of the most significant players in the open-weight model space. Part of its founding rationale was European AI sovereignty — the argument that Europe should not be entirely dependent on US (and increasingly Chinese) AI infrastructure for its digital economy. By building open-weight models and keeping the research in Europe, Mistral aimed to provide an alternative foundation that European businesses, governments, and researchers could use and build on without dependence on American companies' terms of service, pricing, and data policies. The French government became an early supporter and investor. This sovereignty argument — that open-source AI is a matter of national and regional strategic interest, not just technical preference — has become influential in AI policy discussions globally.

*Analysis questions: Is AI sovereignty a legitimate policy concern or a protectionist argument in technical clothing? What would a world of genuinely diverse AI infrastructure — with capable models maintained by many different countries and communities — look like, and would it be better or worse than the current concentrated landscape?*

---

## Career Paths

**ML Engineer (Open Source Focus)**
Companies and organisations that deploy open-source models — including technology companies, research institutions, government agencies, and AI-focused startups — need engineers who can work with open-weight models: evaluating them, fine-tuning them, optimising them for deployment, and maintaining them in production. This is a technically demanding role requiring strong software engineering plus machine learning fundamentals, but it's a growing area distinct from the "train from scratch" ML engineering of large AI labs.

**Developer Relations / Ecosystem Builder**
The open-source AI ecosystem is sustained partly by people who bridge technical communities and the companies or projects they support. Developer relations roles at companies like Hugging Face, Mistral, or AI hardware companies involve: creating technical content (tutorials, documentation), engaging with the community, understanding developer needs and translating them into product decisions. Strong technical communication skills are as important as technical depth.

**AI Infrastructure Engineer**
Deploying large language models in production — whether open-source or proprietary — requires specialised infrastructure: efficient serving systems that can handle variable load, optimisation for specific hardware, monitoring for quality degradation, and cost management. This is a senior engineering role that sits at the intersection of systems engineering and AI engineering. Companies running AI at scale increasingly need this specialisation.

**AI Policy Researcher (Open Source Angle)**
The open-source AI policy debate — covering questions of safety, sovereignty, innovation, and access — is one of the most active areas in technology policy. Researchers who can combine technical understanding of open-source AI with policy analysis are needed at think tanks, government agencies, and advocacy organisations. This path suits people who want to shape the governance of open-source AI rather than build with it directly.

---

## Reflect
Answer these questions out loud or write them down:

1. You ran (or explored) an AI model outside of the big commercial platforms. How did that change your mental model of what AI is? Does knowing the weights can be downloaded make it feel more like a tool you own, or just a more accessible version of the same thing?
2. Meta releases Llama as open-weight — but Meta is one of the largest technology companies in the world and has its own commercial interests. Does "open source" from a major corporation mean the same thing as open source from an independent research group? What might Meta's motivations be?
3. If the most capable AI models 10 years from now are only accessible to a few large companies and well-funded governments, what would the world look like? Is that scenario more or less dangerous than a world where the most powerful models are freely available to everyone?

---

## Level Up — Your Model Selection Guide

**Specific deliverable:** A complete one-page model selection guide that includes: a decision flowchart or table for choosing between closed and open-source models; real model recommendations for at least five distinct use case categories; a brief explanation of the key tradeoffs (privacy, cost, capability, customisability, support); and a "starter kit" recommendation for a first-time open-source AI experimenter specifying exactly which model to try, which tool to run it with, and one first experiment to try.

Share this guide with someone technical and ask them: "What's missing or wrong?" Their feedback reveals where your reasoning has gaps.

---

## Further Reading

- **Hugging Face documentation and model cards** — model cards on Hugging Face are the primary documentation for open-weight models. Reading several model cards carefully — understanding the training data, intended use, limitations, and licence — builds the practical literacy needed to use open models responsibly.
- **"Open Source AI Is the Path Forward" — Meta AI blog** — Meta's public statement of their rationale for open-sourcing LLaMA. Important to read this primary source alongside critical perspectives to understand the argument on its own terms before evaluating it.
- **The Gradient and The Batch (Andrew Ng's newsletter)** — two newsletters that cover the AI research and application landscape with technical depth accessible to motivated non-specialists. Both cover open-source AI development regularly and with nuance.
- **"The Hardware Lottery" by Sara Hooker (2021)** — a paper examining how AI research directions are shaped by available hardware, with implications for understanding why large-scale AI development is concentrated in organisations with massive compute resources — and what open-source approaches offer as an alternative.

---

## Deep Reflection Questions

1. You ran (or explored) an AI model outside the big commercial platforms. How did that change your mental model of what AI is — is it more like a force of nature, a product, or a tool that can be democratically owned and operated?

2. Meta releases Llama as open-weight. Does "open source" from a major corporation have the same meaning and value as open source from an independent research group? What would you need to know about Meta's motivations to assess this?

3. If the most capable AI models in 10 years are only accessible to a few large companies and well-funded governments, what would the world look like? Is that scenario more or less dangerous than a world where the most powerful models are freely available to everyone? Are both scenarios bad in different ways?

4. The open-source community has produced "uncensored" models — variants with safety training removed. One view is that adults should be able to use AI without restrictions imposed by corporations. Another is that some content is harmful regardless of who requests it. How do you think about this tension? What, if anything, should be off-limits even in an open-source model?

5. Running a local model means your data never leaves your device, which is a genuine privacy advantage. But it also means you're bearing the infrastructure costs (electricity, hardware) that commercial providers normally absorb. As local AI becomes more capable, do you think most people will run models locally, use cloud services, or both for different purposes?

6. The open vs. closed AI debate maps onto older technology debates (Linux vs. Windows, Android vs. iOS). Are there lessons from those historical debates that apply here? Where do the analogies break down in the context of AI?

---

## Share (Optional)
If you ran a model locally with Ollama, show someone who has only ever used ChatGPT or Claude. Let them ask it questions. Then explain: "This is running entirely on my computer. No data left this machine." Watch their reaction.

---

## Coming Up Next
Module 09: AI Security and Prompt Injection — How do people attack AI systems? What is prompt injection, and why is it a serious problem?
