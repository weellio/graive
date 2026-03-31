# Lesson Plan: Professional Prompt Engineering
### Creator Level (Ages 18+) | Module 02

---

## Objective
By the end of this lesson, you'll be able to write production-quality system prompts, use few-shot examples effectively, control model behaviour with temperature and sampling parameters, and reliably extract structured output from LLMs.

---

## What You'll Need
- Python 3.9+ with OpenAI or Anthropic SDK installed
- API key (OpenAI or Anthropic)
- Code editor
- About 90–120 minutes

---

## Watch First
Watch **Module 02: Professional Prompt Engineering** before starting.

Core principle: **Prompt engineering at the professional level is less about tricks and more about being a precise, clear communicator with a system that takes you extremely literally.**

---

## Key Concepts

### System Prompts: The Foundation of Application Behaviour

A system prompt is the persistent instruction set that shapes how the LLM behaves across an entire application. It's the most powerful tool you have.

A production-quality system prompt typically includes:

1. **Role definition** — who the model is, what it's for
2. **Context** — what application or scenario this is
3. **Capabilities** — what it can do
4. **Constraints** — what it must not do
5. **Output format** — how responses should be structured
6. **Handling edge cases** — what to do when the request is unclear, out of scope, or harmful

**Example (weak system prompt):**
```
You are a helpful customer service agent.
```

**Example (strong system prompt):**
```
You are a customer service agent for Acme Software, a B2B SaaS company.

Your role: Help existing customers resolve technical issues with Acme's project management platform.

You can help with:
- Account and billing questions
- Technical troubleshooting for the web app and mobile apps
- Explaining features and how to use them
- Escalating complex issues to human support

You cannot:
- Discuss competitor products
- Make promises about future features or roadmap
- Change pricing or make exceptions to billing policies
- Access or share any user account data

Tone: Professional, patient, and solution-focused. Never dismissive of frustration. Acknowledge the problem before jumping to solutions.

When you don't know the answer: Say so clearly. Offer to escalate to the human team at support@acme.com.

Response format: Keep responses concise (under 150 words unless a step-by-step guide is needed). Use numbered lists for multi-step instructions.
```

> "The quality of your system prompt is directly proportional to the quality of your AI application. Weak system prompt = unpredictable, unsafe, off-brand AI."

### Few-Shot Prompting

Few-shot prompting means providing example input-output pairs in your prompt so the model learns the pattern you want — without fine-tuning.

**Zero-shot (no examples):**
```
Classify the sentiment of this review: "The product arrived damaged."
```

**Few-shot (3 examples):**
```
Classify the sentiment of product reviews as POSITIVE, NEGATIVE, or NEUTRAL.

Review: "Absolutely love this — exceeded my expectations!"
Sentiment: POSITIVE

Review: "It works, but the setup was confusing."
Sentiment: NEUTRAL

Review: "Broke after two days. Very disappointed."
Sentiment: NEGATIVE

Review: "The product arrived damaged."
Sentiment:
```

Few-shot is valuable when:
- The task requires a specific output format
- You need the model to follow a classification scheme you've defined
- Zero-shot gives inconsistent results
- You can't fine-tune (too expensive, too slow, or too little data)

### Temperature and Sampling Parameters

**Temperature (0.0 to 2.0):**
Controls randomness in output.
- 0.0 = deterministic (same input → same output)
- 0.3–0.5 = factual tasks, analysis, classification
- 0.7–0.9 = creative writing, brainstorming
- 1.0+ = high creativity, potentially incoherent

**Top-p (0.0 to 1.0) / Nucleus Sampling:**
Limits the pool of tokens the model samples from. 0.9 = only sample from tokens that collectively cover 90% of probability mass. Use either temperature OR top-p, not both.

**Top-k:**
Only sample from the k most likely next tokens. Less commonly used than top-p.

**Frequency penalty (0.0 to 2.0):**
Reduces repetition by penalising tokens that have already appeared. Useful for long-form generation.

**Presence penalty (0.0 to 2.0):**
Encourages the model to introduce new topics. Different from frequency penalty.

**Rule of thumb for parameter settings:**

| Task | Temperature | Top-p |
|---|---|---|
| Classification | 0.0 | - |
| Factual Q&A | 0.2 | - |
| Analysis / reasoning | 0.3 | - |
| Code generation | 0.2–0.4 | - |
| Creative writing | 0.7–0.9 | 0.9 |
| Brainstorming | 0.9–1.0 | - |

### Structured Output

Getting LLMs to reliably return structured data (JSON, CSV, XML) is critical for production applications.

**Method 1: Prompt-based JSON:**
Ask for JSON in your prompt and validate/parse the output. Works but unreliable — the model sometimes adds explanation text.

**Method 2: JSON mode (OpenAI):**
Pass `response_format={"type": "json_object"}` — forces JSON output, no surrounding text.

**Method 3: Function calling / tool use:**
Define a schema; the model fills it. Most reliable for structured extraction.

**Method 4: Pydantic + instructor library:**
Define Python classes; the model fills them. Excellent for complex structured extraction.

---

## Try It — Prompt Engineering Workshop

### Activity 1: System Prompt Iteration (25 mins)

**Task:** Build a system prompt for an AI that helps developers write better commit messages.

**Round 1 — Write your own (10 mins):**
Write the best system prompt you can for this use case. Think about: role, context, capabilities, constraints, output format, edge cases.

Your system prompt v1:
```
[Your prompt here]
```

Test it with: "here's my change: fixed the login bug"
Output: ___
Rating: ___/10

**Round 2 — Iterate (10 mins):**
Identify 3 specific weaknesses in your prompt. Fix them.

Weakness 1: ___ Fix: ___
Weakness 2: ___ Fix: ___
Weakness 3: ___ Fix: ___

Your system prompt v2:
```
[Your improved prompt here]
```

**Round 3 — Edge case test (5 mins):**
Test with these edge cases:
- "changed stuff" (vague input)
- Empty string
- A 500-word explanation of a complex change

Does your prompt handle these gracefully? What still breaks?

---

### Activity 2: Few-Shot Structured Extraction (25 mins)

Build a few-shot prompt that extracts structured information from free-text project descriptions.

**Target output format:**
```json
{
  "project_name": "",
  "main_goal": "",
  "technologies": [],
  "timeline": "",
  "team_size": null
}
```

Write 3 example input-output pairs, then test with a new input.

**Example 1:**
Input: "We're building a mobile app for tracking fitness goals. Using React Native and Firebase. 3 developers, hoping to launch in 6 months."

Output:
```json
{
  "project_name": "Fitness tracking mobile app",
  "main_goal": "Track fitness goals",
  "technologies": ["React Native", "Firebase"],
  "timeline": "6 months",
  "team_size": 3
}
```

**Example 2 (write your own):**
Input: ___
Output: ___

**Example 3 (write your own):**
Input: ___
Output: ___

**Test input:** "My startup is working on an AI-powered customer support tool. We're using Python and GPT-4. Just me for now."

Did your few-shot prompt extract correctly? ___/10
What needed fixing: ___

---

### Activity 3: Temperature Comparison Experiment (20 mins)

Run the same creative writing prompt at three temperatures (0.2, 0.7, 1.2) and compare.

Prompt: "Write the opening sentence of a science fiction novel set on a generation ship that's been travelling for 200 years."

Temperature 0.2 output: ___
Temperature 0.7 output: ___
Temperature 1.2 output: ___

Observations:
- How did sentence complexity change? ___
- How did originality change? ___
- At which temperature would you use this for production? ___
- When would you use 0.2? When 1.2? ___

---

### Activity 4: Structured Output with JSON Mode (20 mins)

Build a product review analyser that reliably returns structured JSON.

```python
from openai import OpenAI
import json

client = OpenAI(api_key="your-key")

def analyse_review(review_text: str) -> dict:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": """Analyse product reviews and return JSON with this exact structure:
{
  "sentiment": "positive|negative|neutral",
  "score": 1-10,
  "key_issues": ["issue1", "issue2"],
  "key_positives": ["positive1", "positive2"],
  "recommendation": "buy|avoid|consider"
}"""
            },
            {"role": "user", "content": f"Review: {review_text}"}
        ],
        temperature=0.1
    )
    return json.loads(response.choices[0].message.content)

# Test
test_reviews = [
    "Great product! Arrived fast and works perfectly. Very happy.",
    "Complete waste of money. Broke after one week. Customer service was useless.",
    "It's okay. Does what it says but nothing special."
]

for review in test_reviews:
    result = analyse_review(review)
    print(f"Review: {review[:50]}...")
    print(f"Result: {result}\n")
```

Reliability of JSON output: ___/10
Any malformed responses? ___
What you'd add to make this production-ready: ___

---

## Prompt Testing Discipline

Production prompts should be tested systematically:

1. **Happy path** — the intended, normal use case
2. **Edge cases** — unusual but valid inputs
3. **Adversarial inputs** — attempts to break or manipulate the prompt
4. **Off-topic inputs** — out-of-scope requests
5. **Ambiguous inputs** — unclear requests
6. **Empty or malformed inputs** — empty strings, weird formatting

Build a test suite for every production prompt. Run it after every change.

Rate your current prompt testing discipline: ___/10

---

## Reflect

1. What was the biggest difference between your v1 and v2 system prompt? What principle did the iteration teach you?

2. When does few-shot prompting outperform a very detailed zero-shot instruction? What's the underlying reason?

3. What's the cost of using temperature=0.9 for a classification task? What's the cost of using temperature=0.0 for creative writing?

---

## Challenge
**The Prompt Test Suite:**

Take a system prompt you've written (from this lesson or a project). Build a formal test suite with at least 10 test cases covering all 6 categories above.

For each test case, define:
- Input
- Expected output or output characteristics
- Pass/fail criteria

Run the tests. Document failures. Iterate on the prompt until all tests pass.

Number of tests: ___
Initial pass rate: ___/10
Final pass rate after iteration: ___/10
Most important lesson learned: ___

---

## Coming Up Next
Module 03: Building AI Agents — what agents are, how tool use works, how memory and planning loops function, and how to build agents using the Claude Agent SDK.
