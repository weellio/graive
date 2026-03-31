# Lesson Plan: Fine-Tuning and Customising AI Models
### Innovator Level (Ages 16–18) | Module 07

---

## Objective
By the end of this lesson, you'll understand what fine-tuning is, how it differs from prompting, when each approach is appropriate, and how to make an informed decision about which to use for a given use case.

---

## What You'll Need
- AI tool (Claude or ChatGPT)
- Optional: access to OpenAI API (free tier) to explore fine-tuning documentation
- Notebook or Google Doc
- About 60–75 minutes

---

## Watch First
Watch **Module 07: Fine-Tuning and Customising AI Models** before starting.

Core distinction: **Prompting changes how you talk to an AI. Fine-tuning changes the AI itself.**

---

## Key Concepts

### What Is Fine-Tuning?
A base language model like GPT-4 or Claude has learned from a vast general dataset. Fine-tuning is the process of taking that pre-trained model and continuing to train it on a smaller, specialised dataset — adjusting its weights to make it better at specific tasks or to behave in a specific style.

Think of it this way:
- **Pre-training** = going to school for 18 years and learning everything generally
- **Fine-tuning** = a 3-month specialist apprenticeship in one specific trade

After fine-tuning, the model's default behaviour changes. It doesn't need to be reminded in every prompt — the new knowledge and style are baked in.

> "Fine-tuning is what you do when prompting is no longer enough — when you need the model to reliably behave a certain way across every interaction, without depending on a carefully crafted system prompt every time."

### Fine-Tuning vs Prompting

| | Prompting | Fine-Tuning |
|---|---|---|
| What changes | Your instructions | The model's weights |
| Speed | Immediate | Hours to days |
| Cost | Per-query cost only | Training cost + per-query cost |
| Expertise needed | Low-medium | Medium-high |
| Use when | Experimenting, variable tasks | Consistent behaviour needed |
| Data needed | None | Hundreds to thousands of examples |
| Reversible | Yes | No (but you keep the base model) |

### When to Fine-Tune (vs Just Prompt Better)

Fine-tuning is worth it when:
- You need consistent style, tone, or persona across thousands of interactions
- Your task requires knowledge that isn't in the base model (proprietary information, niche domain)
- You need the model to follow a very specific output format reliably
- Inference costs matter and you want a smaller, specialised model rather than a large general one
- You have enough high-quality labelled examples

Fine-tuning is NOT worth it when:
- Your use case changes frequently
- You only need it occasionally
- You haven't first tried to solve it with prompting
- You don't have quality training data

**The golden rule: exhaust prompt engineering first. Fine-tuning is expensive and time-consuming. A good system prompt often achieves 80% of what fine-tuning would.**

### Types of Fine-Tuning

**Supervised fine-tuning (SFT):** You provide input-output pairs and the model learns to produce those outputs. Most common type.

**RLHF (Reinforcement Learning from Human Feedback):** Used by OpenAI and Anthropic to align models with human preferences. Humans rate outputs; the model is trained to produce higher-rated responses.

**LoRA (Low-Rank Adaptation):** A more efficient technique that trains only a small subset of model parameters, dramatically reducing training cost. Popular in the open-source community.

**PEFT (Parameter-Efficient Fine-Tuning):** An umbrella term for techniques like LoRA that fine-tune with fewer resources.

---

## Try It — Fine-Tuning Conceptual Workshop

### Activity 1: Use Case Classification (15 mins)

For each of these scenarios, decide whether you would use **prompting** or **fine-tuning** — and explain your reasoning.

| Scenario | Approach | Reasoning |
|---|---|---|
| A chatbot that answers questions about your school's specific timetable, rooms, and policies | | |
| A writing assistant that helps students improve essay flow and clarity | | |
| A customer service bot for a company with a highly specific brand voice and proprietary product info | | |
| A one-time tool to summarise a batch of 100 articles | | |
| A legal document classifier that must reliably categorise contracts into specific types | | |
| A creative writing partner that needs to adapt to the user's style each time | | |
| A medical AI that must only answer using evidence from a specific set of approved clinical guidelines | | |

For the three scenarios where you chose fine-tuning, identify what data you'd need:

Scenario ___: Data needed: ___
Scenario ___: Data needed: ___
Scenario ___: Data needed: ___

---

### Activity 2: Training Data Design (20 mins)

Good fine-tuning requires good training data. Let's design a dataset.

**Scenario:** You want to fine-tune a model to write responses in the style of a helpful, encouraging science tutor — clear, uses analogies, never dismissive, always breaks down complexity.

Design 5 training examples. Each example is an input-output pair:

**Format:**
```
Input: [student question or message]
Output: [ideal tutor response]
```

Example 1:
Input: ___
Output: ___

Example 2:
Input: ___
Output: ___

Example 3:
Input: ___
Output: ___

Example 4:
Input: ___
Output: ___

Example 5:
Input: ___
Output: ___

Now evaluate your dataset:
- Are all 5 examples consistent in tone and style? ___
- Do they cover different types of difficulty? ___
- Would a model trained on 500 of these examples behave reliably? ___
- What edge cases are you missing? ___

---

### Activity 3: The Prompting-First Test (15 mins)

Before deciding to fine-tune, you should always test whether prompting can do the job.

Take the science tutor scenario from Activity 2. Write the best system prompt you can that would make a standard model behave like this tutor without fine-tuning:

```
System prompt:
[Your prompt here]
```

Test it by asking: "I don't understand why objects fall at the same speed regardless of mass."

Evaluate the response:
- Did it match your ideal tutor voice? ___/10
- Would this prompt work reliably across 1000 different student questions? ___
- What could still go wrong? ___

**Decision:** Based on this test, would you fine-tune — or is prompting sufficient? ___
Why: ___

---

## The Practical Fine-Tuning Pipeline

When you decide to fine-tune, the process typically looks like:

1. **Data collection** — gather input-output pairs that demonstrate the behaviour you want
2. **Data cleaning** — remove duplicates, fix errors, ensure consistency
3. **Data formatting** — convert to the format the training API expects (usually JSONL)
4. **Training run** — upload to API (e.g., OpenAI), configure hyperparameters, run
5. **Evaluation** — test the fine-tuned model on a held-out test set
6. **Iteration** — if performance is poor, collect better data and retrain
7. **Deployment** — use the fine-tuned model via API in your application

The hardest step is usually Step 1 — collecting enough high-quality data.

> "Fine-tuning amplifies whatever is in your data. If your training data has errors, inconsistencies, or biases — your fine-tuned model will too. Garbage in, garbage out — amplified."

---

## Reflect

1. In what domain (personal project, business, social good) would you most want to fine-tune a model if you had the resources? What specifically would you train it to do?

2. Why do you think "exhaust prompting first" is the golden rule? What's the cost of skipping to fine-tuning too quickly?

3. Fine-tuning creates models that are narrower but better at specific things. What's lost when you narrow a model? When is that trade-off worth it?

---

## Challenge
**The Data Quality Audit:**

Find a freely available fine-tuning dataset online (search Hugging Face Datasets or OpenAI's fine-tuning documentation for examples). Examine 20–30 examples.

Evaluate the dataset's quality:
- Consistency of format: ___/10
- Quality and correctness of outputs: ___/10
- Coverage of edge cases: ___/10
- Potential biases you notice: ___
- One thing that would make this dataset significantly better: ___

Would you use this dataset to train a model you'd deploy to real users? Why or why not?

Dataset I examined: ___
My overall quality rating: ___/10
My main concern: ___

---

## Coming Up Next
Module 08: Building an AI-Powered Product — from concept to deployment: how to define an MVP, integrate AI APIs, run user tests, and think about monetisation.
