# Lesson Plan: Running a Lean AI Business
### Creator Level (Ages 18+) | Module 06

---

## Objective
By the end of this lesson, you'll have a clear framework for managing AI API costs, have made an informed decision between SaaS and usage-based billing, understand the key customer acquisition channels for AI products, and have mapped the unit economics of a sustainable AI business.

---

## What You'll Need
- Spreadsheet tool (Google Sheets or Excel)
- Your AI product concept from previous modules (or a new one)
- About 90 minutes

---

## Watch First
Watch **Module 06: Running a Lean AI Business** before starting.

Core reality check: **Many "AI startups" are just margin-negative businesses wrapping an AI API. Knowing your numbers — and managing costs aggressively — is the difference between a business and an expensive side project.**

---

## Key Concepts

### The AI Cost Structure

Building on an AI API means your cost structure is fundamentally different from traditional software:

**Traditional SaaS cost structure:**
- Infrastructure costs are relatively fixed and predictable
- As you add users, margins typically improve (economies of scale)
- Gross margins of 70–90% are normal

**AI product cost structure:**
- Cost of goods sold (COGS) scales with every query
- More usage = more cost (variable costs dominate)
- Gross margins of 40–70% are common; below 40% is dangerous
- Your costs are directly tied to user behaviour you can't fully control

**The power users problem:** In any AI product, a small percentage of users will generate a disproportionate amount of usage — and cost. A single power user might generate 10× the API cost of an average user. Unlimited subscriptions are dangerous if you haven't modelled this.

> "In traditional SaaS, one more active user is almost free. In AI products, one more active user has a real marginal cost. This changes everything about how you price, limit, and incentivise usage."

### API Pricing Fundamentals

Current (2024-2025) pricing ranges (approximate — always check current pricing):

| Model | Input (per 1M tokens) | Output (per 1M tokens) | Good for |
|---|---|---|---|
| GPT-4o-mini | ~$0.15 | ~$0.60 | High-volume, cost-sensitive |
| GPT-4o | ~$2.50 | ~$10.00 | Quality-critical |
| Claude 3.5 Haiku | ~$0.80 | ~$4.00 | Fast, efficient |
| Claude 3.5 Sonnet | ~$3.00 | ~$15.00 | Complex reasoning |
| Llama 3 (self-hosted) | ~$0.10-0.30 | ~$0.10-0.30 | Scale, independence |

**Token counting rules of thumb:**
- 1 token ≈ 0.75 words in English
- 1,000 tokens ≈ 750 words ≈ 1.5 pages
- A typical customer service interaction: 500–2000 tokens
- A long document analysis: 5,000–50,000 tokens

### Cost Optimisation Strategies

1. **Use the cheapest model that's good enough.** GPT-4o-mini is 20x cheaper than GPT-4o. For many tasks it's 90% as good. Test before assuming you need the expensive model.

2. **Cache common responses.** If many users ask the same questions, cache the AI response and serve it directly. Dramatic cost savings for FAQ-style products.

3. **Compress prompts.** Every word in your system prompt costs money. Audit and remove redundancy regularly.

4. **Set appropriate max_tokens.** Don't allow 4096 tokens when your use case rarely needs more than 500.

5. **Batch where possible.** Some APIs offer batch processing at lower cost for non-real-time use cases.

6. **Use smaller models for pre-processing.** Use a cheap model to classify or filter queries; only route complex ones to expensive models.

7. **Monitor continuously.** Track cost per user, cost per query, and cost per $ of revenue — weekly.

### SaaS vs Usage-Based Billing

**Subscription (SaaS):**
- Predictable revenue → easier to plan
- Simple for customers to understand
- You absorb usage variance (power users can kill margins)
- Best when: usage is relatively predictable and consistent per user

**Usage-based:**
- Revenue scales with customer value delivered
- No risk of high-usage customers destroying margins
- More complex billing; harder for customers to predict costs
- Best when: usage varies enormously between customers

**Hybrid (most common in practice):**
- Base subscription + usage above a threshold
- Example: £15/month includes 1000 queries; additional queries at £0.02 each
- Protects you from power users while providing predictable base revenue

**Credit systems:**
- Sell credits upfront (reduces billing friction, improves cash flow)
- 1 credit = 1 query, or vary by complexity
- Expires encourage re-purchase

### Customer Acquisition for AI Products

Channels that work well for AI products:

**Product-led growth:**
- Free tier → conversion to paid
- AI products that provide immediate, obvious value convert well
- The "wow moment" must happen before the paywall

**Content marketing:**
- Tutorial videos of your AI product in action
- Blog posts about the problem you solve
- SEO around queries people have about your AI's use case

**Communities:**
- Reddit, Discord, Twitter/X — AI enthusiast communities
- Show HN (Hacker News) — strong for technical AI products
- ProductHunt — good for launches, less for sustained growth

**Integration/distribution:**
- Build where users already are (Slack apps, Chrome extensions, VS Code extensions)
- Partnerships with complementary tools

**B2B direct sales:**
- For AI products with clear ROI ($X saved per month), sales can work at higher price points
- LinkedIn outreach for decision-makers
- Demos that show ROI clearly

---

## Try It — Business Model Workshop

### Activity 1: Unit Economics Deep Dive (25 mins)

Build a unit economics model for your AI product in a spreadsheet.

**Inputs to model:**

```
Average queries per user per month: ___
Average input tokens per query: ___
Average output tokens per query: ___
Model you'll use: ___
Input cost per 1M tokens: $___
Output cost per 1M tokens: $___

Calculated:
Cost per query: $___
Cost per user per month: $___

Other monthly costs per user:
- Storage: $___
- Other infrastructure: $___
Total COGS per user per month: $___

Your price per user per month: $___
Gross margin per user: $___
Gross margin %: ___%
```

**Power user scenario:**
Now model your top 5% of users — assume they use 10× average.
Cost for a power user per month: $___
If your standard plan is unlimited — does this break your economics? ___
How would you address it? ___

**Scale model:**
At 100 users: Revenue $___/month | Costs $___/month | Profit $___/month
At 1000 users: Revenue $___/month | Costs $___/month | Profit $___/month
At 10,000 users: Revenue $___/month | Costs $___/month | Profit $___/month

---

### Activity 2: Pricing Model Decision (15 mins)

Based on your unit economics, decide your pricing model.

Apply this decision framework:

**Q1:** Is usage highly variable between users?
- Yes → lean toward usage-based or hybrid
- No → subscription is safer

**Q2:** Can customers predict their usage easily?
- Yes → usage-based works for them
- No → subscription is more customer-friendly

**Q3:** Do you need predictable revenue?
- Yes → subscription or hybrid
- Fine with variable → usage-based

**Q4:** What's your power user risk?
- High risk → definitely not unlimited subscription

**My pricing model decision:** ___

**My pricing:**
- Plan name: ___
- Price: ___
- What's included: ___
- What's extra (if hybrid): ___

**What I'll change at 100 users:** ___

---

### Activity 3: 90-Day Acquisition Plan (20 mins)

Design a realistic customer acquisition plan for your first 90 days.

**Day 1–30: Finding the first 10 paying customers**
These won't come from SEO or ads. They come from direct outreach to people you know, communities you're in, and personal credibility.

My plan:
- Week 1: ___
- Week 2: ___
- Week 3: ___
- Week 4: ___

Target: 10 paying customers by day 30.

**Day 31–60: Scaling to 50 customers**
Now you have real users. Use their feedback, testimonials, and case studies.

Channels I'll focus on: ___
Content I'll create: ___
Communities I'll engage: ___

**Day 61–90: Finding your growth channel**
By day 90, you should have identified the ONE channel that works best for your product.

How I'll know which channel is working: ___
What I'll double down on: ___

**Goal at day 90:** ___ paying customers, generating $___/month

---

### Activity 4: Financial Sustainability Test (15 mins)

Answer these honestly:

1. At your current pricing, what is the minimum number of paying customers you need to cover your own API costs? ___

2. At what number of customers does this become genuinely profitable (covering your time at a reasonable hourly rate)? ___

3. What's your runway on savings/free tier limits before you NEED revenue? ___

4. What is the single biggest cost risk (what would make your unit economics break)? ___

5. If your main AI provider raised prices by 3×, what would you do? ___

---

## The Lean AI Business Dashboard

Track these metrics weekly:

| Metric | Week 1 | Week 2 | Week 3 | Week 4 |
|---|---|---|---|---|
| Total users | | | | |
| Paying users | | | | |
| Total API spend ($) | | | | |
| Revenue ($) | | | | |
| Gross margin (%) | | | | |
| Cost per new user ($) | | | | |
| Churn rate (%) | | | | |

**Key ratios to watch:**
- API cost as % of revenue: target <40%
- Month-over-month user growth: target >20% early stage
- Churn: <5% monthly for healthy SaaS

---

## Reflect

1. What surprised you most about the unit economics? Did the numbers change how you think about your product or pricing?

2. Many successful AI founders say "charge more than feels comfortable." After running the numbers, do you agree? What's the risk of undercharging?

3. AI API costs are set by providers and can change. What's your strategy for managing dependency on a single AI provider? At what scale would you consider self-hosting open-source models?

---

## Challenge
**The Business Plan One-Pager:**

Write a one-page business plan for your AI product covering:
- Problem and solution (2 sentences each)
- Target customer (be specific — not "everyone" or "businesses")
- Pricing model and unit economics
- Three customer acquisition channels with 30-day action plans
- Key metrics you'll track
- Biggest risk and how you'll mitigate it
- What success looks like in 6 months

Keep it to one page — the discipline of brevity forces clarity.

My one-page business plan: ___

---

## Creator Level Complete!
You have now completed all 6 Creator starter modules. You can:
- Map and build with the full modern AI stack
- Write production-quality system prompts and few-shot patterns
- Build functional AI agents with tool use and planning loops
- Implement RAG pipelines from scratch
- Ship AI products rapidly using no-code and low-code tools
- Run the unit economics of a sustainable AI business

**What comes next:**
- Keep building — the best way to learn is to ship
- Deepen your technical skills: explore LangGraph, CrewAI, and multi-agent systems
- Study real AI businesses: how do they acquire customers, price, and retain users?
- Contribute to open source AI projects
- Join the community and share what you're building
