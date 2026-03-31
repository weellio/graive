# Lesson Plan: Ship an AI Product in a Weekend
### Creator Level (Ages 18+) | Module 05

---

## Objective
By the end of this lesson, you'll have a complete map of the tools and tactics needed to take an AI idea from concept to deployed product in 48 hours — using no-code tools, n8n/Make automations, and Vercel deployment — plus a pricing strategy to start earning.

---

## What You'll Need
- Accounts on: Vercel (free), n8n.io (cloud free tier), Make.com (free tier)
- OpenAI or Anthropic API key
- GitHub account
- Code editor (optional — some exercises are no-code)
- About 90 minutes for this lesson + weekend to build

---

## Watch First
Watch **Module 05: Ship an AI Product in a Weekend** before starting.

The shipping mindset: **A product you can ship in a weekend and test with 10 users teaches you more than a perfect product you spend 3 months building in private.**

---

## Key Concepts

### The Weekend Ship Stack

A minimal but complete AI product can be built with:

```
AI API (OpenAI/Anthropic)
       ↓
Automation Layer (n8n or Make)
       ↓
Frontend (Next.js on Vercel OR no-code)
       ↓
Data Storage (Airtable or Supabase)
       ↓
Payments (Stripe)
       ↓
Users
```

You don't need custom backend code for many AI products. Automation tools can handle the glue.

### No-Code AI Tools

**For building interfaces:**
- **Vercel v0** — describe a UI in text, get production-quality React code
- **Bubble** — full-stack no-code web apps with AI integrations
- **Glide** — mobile apps from spreadsheet data
- **Webflow** — beautiful no-code sites with CMS
- **Streamlit** — Python-powered interactive data apps (light code)

**For AI automation:**
- **n8n** — powerful open-source workflow automation with AI nodes
- **Make (formerly Integromat)** — similar to n8n, strong integrations
- **Zapier** — easiest to use, more expensive at scale
- **Langflow / Flowise** — visual LLM pipeline builders

**For AI features without coding:**
- **Retool** — internal tools with AI features
- **Typeform + AI** — smart forms that adapt to answers

### n8n for AI Workflows

n8n is particularly powerful for AI products because it can:
- Receive webhooks (incoming requests from your app)
- Call AI APIs (built-in OpenAI, Anthropic nodes)
- Process and transform data
- Store to Airtable, Notion, Google Sheets
- Send emails, Slack messages, Telegram notifications
- Return results to your frontend

Key n8n AI nodes:
- **OpenAI node** — call GPT models
- **HTTP Request node** — call any AI API
- **AI Agent node** — build agents visually
- **Embeddings + Vector Store** — RAG pipelines
- **Langchain nodes** — advanced chain patterns

### Vercel Deployment

Vercel is the fastest way to deploy a frontend AI application:

1. Push your code to GitHub
2. Connect repo to Vercel
3. Set environment variables (API keys)
4. Auto-deploys on every push

For a Next.js AI app:
```bash
npx create-next-app@latest my-ai-app
cd my-ai-app
npm install ai openai  # Vercel AI SDK
# Build your app
git push
# Connect to Vercel — done
```

The Vercel AI SDK provides:
- Streaming responses
- Edge runtime support
- React hooks for AI state management

### Pricing Strategy

Getting pricing right is as important as building the product. Common mistakes:
- Free forever (you pay API costs, earn nothing)
- Too expensive before you have social proof
- Wrong model (per-use when subscription fits better, or vice versa)

**Framework: Start with the unit economics**

1. What does each AI interaction cost you? (tokens × price per token)
2. How many interactions per user per month?
3. Your cost per user per month = interactions × cost per interaction
4. Your minimum viable price = cost × 3 (to have margin)

**Pricing models:**

| Model | Works best when | Example |
|---|---|---|
| Free + usage limit | Low cost per interaction, build habit | 10 free queries/day |
| Subscription | Regular use, predictable cost | £9/month for unlimited |
| Usage-based | High variance in usage | £0.02 per query |
| Freemium + features | Upsell premium features | Free tier + Pro for £15/month |
| One-time | One-time tools, templates | £29 lifetime access |

> "Charge earlier than feels comfortable. If no one complains about the price, you're probably too cheap. If everyone converts on first ask with no friction — you're definitely too cheap."

---

## Try It — Ship Planning Workshop

### Activity 1: The Weekend Build Plan (20 mins)

Choose a real AI product idea you want to ship. Use this planning template:

**Product:** ___
**Core value proposition (one sentence):** ___

**The absolute minimum feature set to ship and test:**
1. ___
2. ___

**Stack I'll use:**

| Layer | Tool | Why |
|---|---|---|
| AI model | | |
| Automation / backend | | |
| Frontend | | |
| Data storage | | |
| Payments (if any) | | |
| Deployment | | |

**Day 1 (Saturday) plan:**
Morning (3 hrs): ___
Afternoon (3 hrs): ___
Evening (2 hrs): ___

**Day 2 (Sunday) plan:**
Morning (3 hrs): ___
Afternoon (2 hrs): ___
Evening (1 hr): ___

**Definition of "shipped":** (What specific thing will be true at end of weekend?)
___

**Who are my first 10 users, and how will I reach them?**
___

---

### Activity 2: Build an n8n AI Workflow (30 mins)

Build a simple but functional AI workflow in n8n that you could use in a product.

**Workflow goal:** An AI that receives a URL via webhook, fetches the page content, summarises it, and returns the summary.

Steps to build in n8n:
1. **Webhook node** — receives POST request with `{"url": "..."}`
2. **HTTP Request node** — fetches the URL content
3. **OpenAI node** — summarises the content
4. **Respond to Webhook node** — returns the summary

To test:
```bash
curl -X POST https://your-n8n-url/webhook/summarise \
  -H "Content-Type: application/json" \
  -d '{"url": "https://en.wikipedia.org/wiki/Artificial_intelligence"}'
```

Did it work? ___
Response time: ___ seconds
Quality of summary: ___/10
What you'd add next: ___

---

### Activity 3: Pricing Calculator (15 mins)

Run the numbers for your product:

**Model I'll use:** ___
**Cost per 1000 input tokens:** £___
**Cost per 1000 output tokens:** £___

**Typical interaction:**
- Input tokens: ___
- Output tokens: ___
- Cost per interaction: £___

**Expected usage per user per month:**
- Number of interactions: ___
- Total cost per user per month: £___

**My pricing decision:**
Pricing model: ___
Price: £___ per ___

**Unit economics:**
- Revenue per user per month: £___
- Cost per user per month: £___
- Gross margin: ___% (aim for minimum 60%)

Does this model work? If margin is below 60%, what would you change? ___

---

### Activity 4: The Landing Page Brief (15 mins)

You need a landing page that converts visitors to users. It needs:

1. **Headline** (what you do, for whom, what outcome)
2. **Sub-headline** (how it works in one sentence)
3. **Social proof placeholder** ("Join 100+ users" — even if not true yet, you'll fill it in)
4. **3 key benefits** (not features — benefits to the user)
5. **CTA** (single action: sign up, try free, buy now)
6. **FAQ** (3 most common objections, answered)

Write each section:

Headline: ___
Sub-headline: ___
Benefit 1: ___
Benefit 2: ___
Benefit 3: ___
CTA text: ___

FAQ Question 1: ___ | Answer: ___
FAQ Question 2: ___ | Answer: ___
FAQ Question 3: ___ | Answer: ___

Use Vercel v0 or Webflow to build this page from your brief.

---

## The Launch Checklist

Before you tell anyone about your product:

- [ ] Core feature works end-to-end
- [ ] Error handling is decent (graceful failures, not stack traces)
- [ ] API keys are in environment variables, NOT in code
- [ ] Basic rate limiting or authentication to prevent abuse
- [ ] Privacy policy (use an AI generator for a first draft)
- [ ] You know what success metrics you're tracking
- [ ] You have a way to get feedback (email, form, Slack)
- [ ] Payments work (if charging)
- [ ] You've personally used it 20+ times and it's actually useful

---

## Reflect

1. What's the hardest part of the weekend ship challenge — the building, the pricing, or finding users?

2. Many developers build for weeks before showing anyone. Why is this a trap? What do you learn from even 3 users that 3 weeks of solo building can't teach you?

3. Your pricing will be wrong the first time. That's fine. What mechanism would you use to know when it's time to change it?

---

## Challenge
**Ship Something This Weekend:**

Take your build plan from Activity 1 and actually execute it.

Rules:
- 48 hours maximum
- Must be accessible to external users by Sunday evening
- Must have at least 5 people use it (not just you)
- Must have a feedback mechanism

Post-weekend reflection:
- What I shipped: ___
- How many users tried it: ___
- Most useful piece of feedback: ___
- Biggest thing I'd change: ___
- Am I going to keep building this? Why/why not: ___

---

## Coming Up Next
Module 06: Running a Lean AI Business — cost management, API pricing strategy, customer acquisition, and the SaaS vs usage-based billing decision.
