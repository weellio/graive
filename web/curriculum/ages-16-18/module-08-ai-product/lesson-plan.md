# Lesson Plan: Building an AI-Powered Product
### Innovator Level (Ages 16–18) | Module 08

---

## Objective
By the end of this lesson, you'll have defined an AI product MVP, understand how to integrate an AI API, know how to run basic user tests, and be able to think clearly about monetisation models.

---

## What You'll Need
- AI tool (Claude or ChatGPT) for ideation
- Optional: OpenAI API key (free tier) or access to another AI API
- Notebook or Google Doc
- About 75–90 minutes

---

## Watch First
Watch **Module 08: Building an AI-Powered Product** before starting.

Core mindset shift: **You are no longer a user of AI. You are a builder with AI as your component.**

---

## Key Concepts

### What Is an MVP?
MVP stands for **Minimum Viable Product** — the simplest version of your product that still delivers real value to a real user.

The point of an MVP is not to build the full vision. It's to test whether your core assumption is correct: does this actually solve a problem people have, in a way they'll use?

The most common startup mistake: building too much before testing with real users.

> "A good MVP is the minimum product that lets you learn the maximum amount about whether your idea is worth pursuing."

### The AI Product Stack
A simple AI-powered product typically has these layers:

```
User Interface (web page, app, bot)
        ↓
Your Application Logic (what you've built)
        ↓
AI API (OpenAI, Anthropic, Google, etc.)
        ↓
AI Model (GPT-4, Claude, Gemini, etc.)
```

You don't need to build the AI. You call it via API. Your job is:
- Building the interface users interact with
- Designing the prompts the AI receives
- Deciding what data to pass to the AI
- Deciding what to do with the AI's output
- Handling errors, edge cases, and safety

### API Integration Basics
An API call to an AI model typically requires:

```json
{
  "model": "gpt-4",
  "messages": [
    {"role": "system", "content": "Your system prompt here"},
    {"role": "user", "content": "The user's actual input"}
  ],
  "temperature": 0.7,
  "max_tokens": 500
}
```

Key parameters:
- **system prompt** — the instructions that shape model behaviour (your "configuration")
- **user message** — what the user actually typed/sent
- **temperature** — randomness: 0 = deterministic, 1+ = more creative/varied
- **max_tokens** — limits response length (also limits cost)

### Monetisation Models for AI Products

| Model | How it works | Good for |
|---|---|---|
| Freemium | Free tier, paid for more | Products with clear usage limits |
| Subscription (SaaS) | Monthly/yearly fee | Regular-use tools |
| Usage-based | Pay per API call or credit | Variable-use products |
| One-time purchase | Single price | Tools, templates |
| Enterprise licensing | Custom deals with organisations | B2B products |
| Ad-supported | Free to users, ad revenue | High-volume consumer products |

The key constraint: **your AI API costs are per-token. Your pricing must cover your costs — and that means understanding your unit economics before you launch.**

---

## Try It — Product Development Sprint

### Phase 1: Opportunity Identification (15 mins)

Good AI products solve specific problems where AI's capabilities (language understanding, content generation, classification, summarisation) genuinely help.

Brainstorm problems in these categories. Write 2–3 per category:

**Productivity / learning:** ___

**Creative work:** ___

**Communication:** ___

**Information overload:** ___

**Personal decision-making:** ___

From your list, pick the most promising idea — ideally one you have personal experience with.

**Selected problem:** ___
**Who has this problem:** ___
**How often they face it:** ___
**Current solution they use (if any):** ___
**Why that solution is inadequate:** ___

---

### Phase 2: MVP Definition (15 mins)

Now define your MVP — the absolute minimum you'd need to build to test if this idea works.

**My product's name:** ___

**Core value proposition (one sentence):** ___

**The single most important feature for the MVP:** ___

**What's NOT in the MVP (features for later):**
1. ___
2. ___
3. ___

**What AI capability does this use?**
(language generation / summarisation / classification / Q&A / code generation / other): ___

**What the system prompt needs to do:**
(write a draft system prompt that would make the AI behave correctly for this product)

```
System prompt:
___
```

**Test your system prompt:** Does it produce the right output when you paste it into your AI tool with a realistic user message? Rate it: ___/10

---

### Phase 3: User Test Design (15 mins)

An MVP is only useful if you test it with real users. Design a simple user test.

**My target user for testing:** (specific person or type of person)
___

**What I'll ask them to do:** (the simplest possible version of the core task)
___

**What I'll observe or measure:**
- Did they complete the task? ___
- What confused them? ___
- What did they find useful? ___
- Would they use this again? ___
- Would they pay for it? ___

**Success criteria:** What result would tell me this idea is worth pursuing?
___

**Failure criteria:** What result would tell me this idea doesn't work?
___

If you can, actually run this test with one or two people. Record results:

Tester 1: ___
Tester 2: ___
Most surprising piece of feedback: ___

---

### Phase 4: Unit Economics (15 mins)

Before building or charging for anything, understand your costs.

**Estimate your API costs:**
- Typical input length per query: ___ tokens
- Typical output length per query: ___ tokens
- Model you'd use: ___
- Cost per 1000 tokens (look this up for your chosen model): ___
- Estimated cost per user query: ___

**Revenue model I'd use:** ___

**Price I'd charge:** ___

**Number of queries per paying user per month (estimate):** ___

**Revenue per user per month:** ___
**Cost per user per month:** ___
**Margin per user:** ___

Is this economically viable? At what user volume does it become worth building?

My break-even analysis: ___

---

## The Build Faster Principle

Many AI products can be prototyped without writing a single line of code:
- **Bubble or Webflow** — no-code web apps
- **Zapier or Make** — automation workflows connecting AI to other services
- **Notion AI** — AI features inside a document tool
- **Typeform + AI integration** — AI-powered forms
- **Glide** — no-code mobile apps

The goal of a prototype is to test the idea, not to build the real thing. Get to user feedback in days, not months.

Which of these could you use to prototype your idea?

My prototype approach: ___
Time to first user test: ___ days

---

## Reflect

1. What was the hardest part of defining your MVP — picking the problem, defining the minimum feature set, or thinking about unit economics?

2. How does thinking about cost per query change the way you think about AI products compared to just using AI tools yourself?

3. What's the riskiest assumption in your product concept — the thing that, if wrong, means the whole thing doesn't work? How would you test it?

---

## Challenge
**Ship a Prototype in 72 Hours:**

Take your MVP concept and build the simplest possible working prototype in 72 hours. Rules:
- No more than one core feature
- At least one real person uses it (besides you)
- You collect feedback and write a 200-word reflection on what you learned

This isn't about building something impressive — it's about getting to a real learning loop as fast as possible.

Document:
- What I built: ___
- Tools I used: ___
- One user's reaction: ___
- What I'd change if I built v2: ___
- Would I keep developing this? Why or why not: ___

---

## Coming Up Next
Module 09: AI Law — What You Need to Know — copyright, liability, GDPR, the EU AI Act, and the legal landscape every AI builder needs to understand.
