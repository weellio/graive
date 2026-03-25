# Lesson Plan: Building a SaaS with AI
### Innovator Level (Ages 16–18) | Module 10 — Expanded

---

## Objective
Apply product thinking to a real AI business idea — produce a clear problem definition, a defined customer, a minimum viable product specification, a basic monetisation model, and a customer discovery plan you could actually execute. Understand how successful AI SaaS companies are built and what distinguishes those that survive from those that don't.

---

## What You'll Need
- A device with internet access
- A free AI tool (ChatGPT free or Claude free)
- A document tool for your work (Google Docs, Notion, etc.)
- Paper and coloured pens OR a digital document
- About 55–60 minutes

---

## Watch First
Watch **Module 10: Building a SaaS with AI** with a parent or on your own.

Remember: Most AI product ideas fail not because the AI part is wrong, but because the builder did not understand the customer well enough.

---

## The Landscape: The AI SaaS Ecosystem and What's Actually Happening

Software as a Service (SaaS) — software delivered over the internet on a subscription basis rather than installed locally — has been the dominant model for business software since the mid-2000s. Salesforce pioneered the model; Slack, Zoom, Notion, Linear, and thousands of others followed it. By 2020, the SaaS market was generating over $150 billion in annual revenue globally. The AI wave is reshaping this market in two distinct ways: AI capabilities are being embedded in existing SaaS products, and a wave of new AI-native SaaS companies is being founded.

The first wave — AI features added to existing products — is already well advanced. Notion AI, Google Workspace AI, Microsoft Copilot for Office 365, Salesforce Einstein, HubSpot's AI features — every major SaaS platform is integrating language model capabilities into its existing product surface area. For users, this makes their existing tools more powerful. For new entrants, it creates competitive pressure: if Notion adds AI writing assistance to its product, companies that built AI writing assistants as standalone products face a significant headwind.

The second wave — AI-native SaaS products built from scratch with AI at the core — is where the interesting new company building is happening. These products couldn't exist without AI, not because they add AI as a feature but because their fundamental value proposition depends on AI capability. Examples include: Perplexity (AI-powered search with citations), Harvey (AI for legal professionals), Cursor (AI-native code editor), Glean (AI-powered enterprise search), and dozens of vertical-specific tools. The defining characteristic is that removing the AI would destroy the product, not just degrade it.

The product lifecycle for AI SaaS has some distinctive properties. Time-to-first-value is typically shorter for AI products than for traditional software, because AI generates output immediately — there's no lengthy setup or data import before the product does something. This is a genuine advantage for early user acquisition but can mask retention problems: users who experience fast early value but low depth of integration churn at higher rates. The "aha moment" for AI products often needs to happen within the first session; the depth of value (why they keep paying) needs to be understood and designed for separately.

Pricing dynamics in AI SaaS are genuinely complex. Most AI products face an underlying cost in API fees (or equivalent costs to run their own models). This creates a cost floor beneath which pricing can't go while maintaining margins. It also creates unit economics challenges: a freemium tier where users can use the product unlimited times is costly in AI SaaS in ways that it isn't for traditional SaaS (where marginal cost of serving an additional user approaches zero). The most successful AI SaaS pricing strategies have been: usage-based pricing tied to the AI operations performed, subscription pricing with limits on usage, or value-based pricing where the price reflects the value delivered rather than the cost of delivery.

The competitive dynamics of AI SaaS are being shaped by a few powerful forces. Foundation model providers — OpenAI, Anthropic, Google — compete with the companies building on their APIs. When ChatGPT added code interpreter, it competed directly with AI coding tools that had been built on the GPT API. This "being on the platform" risk is genuine and affects how investors evaluate AI SaaS companies. The companies most at risk are those whose only differentiation is a user interface over an API that the underlying model provider might replicate. Companies with proprietary data, deep workflow integration, or strong customer relationships are more defensible.

Customer acquisition for AI SaaS has been transformed by the ability to demonstrate value immediately and publicly. Product-led growth (where the product itself is the primary acquisition channel, often through free tiers that users adopt and then recommend or upgrade from) has been particularly effective for AI tools because they produce visible, shareable outputs. Viral loops where users share AI-generated content that carries product attribution are a powerful acquisition mechanism — and a reminder that the outputs your product produces are themselves a marketing channel.

---

## Technical Deep Dive: SaaS Architecture with AI

Understanding how an AI SaaS product is actually built at a technical level helps you design better products and have more substantive conversations with builders and engineers.

**The standard AI SaaS stack.** A typical AI SaaS product involves: a frontend (the user interface — often a web app built with React or a no-code tool like Bubble), a backend (the application logic — often Node.js, Python, or serverless functions), an AI API (OpenAI, Anthropic, or an open-source model), a database (user data, product data — often PostgreSQL or a NoSQL database), and authentication (managing user identity and access — Auth0, Supabase, or similar). For no-code implementations, tools like Bubble or Glide replace the frontend and backend, while Airtable or Notion replace the database.

**The AI call in context.** In a typical AI SaaS product, a user action triggers a backend process that: (1) retrieves any relevant context from the database (user preferences, previous interactions, relevant documents), (2) constructs a prompt that combines the system instructions, the retrieved context, and the user's current request, (3) calls the AI API, (4) processes the AI response (potentially reformatting, filtering, or augmenting it), and (5) stores the result and returns it to the frontend. This flow is more complex than a direct chat interface, but it's what allows AI SaaS products to be personalised, contextual, and stateful.

**Streaming responses.** Many AI products stream the AI response to the user as it's generated rather than waiting for the complete response. This significantly improves perceived responsiveness — users see text appearing rather than waiting for a complete response. Implementing streaming requires specific handling in both the backend (using streaming API calls) and the frontend (handling chunks of text as they arrive).

**Caching and cost management.** AI API calls are the primary variable cost in AI SaaS. Caching — storing AI responses and reusing them when the same input is encountered — can significantly reduce API costs for products where many users ask similar questions. Other cost management strategies include: choosing models appropriate to the task (using smaller, cheaper models for simple tasks and larger models only for complex ones), batching API calls where timing allows, and setting token limits on inputs and outputs.

---

## Activity 1: The Problem Before the Product (15 mins)

The biggest mistake new product builders make is falling in love with their solution before they truly understand the problem.

**The "Pain Spectrum" Exercise:**

Think about different groups of people you know, interact with, or have access to:
- Small business owners
- Students preparing for exams or applications
- Professionals in a specific industry
- Creators (YouTubers, writers, photographers, podcasters)
- Community organisations or non-profits

For each group you consider, ask: "What is one thing they do repeatedly that is slow, tedious, error-prone, or expensive — and that might be automatable with AI?"

**Your task:** Generate 10 candidate problems as "Problem Statements":
> "[Specific person] spends too much time/money/effort on [specific task] because [root cause], which costs them [consequence]."

Once you have 10, score each on:
- **Frequency:** How often does the person face this? (1–5)
- **Pain:** How much does it bother them? (1–5)
- **AI fit:** How well could AI solve this? (1–5)

Multiply the three scores. Your highest-scoring problem is your best starting point.

---

## Activity 2: Design the MVP (25 mins)

MVP stands for Minimum Viable Product — the simplest version that a real customer could use and that you could learn from.

**Step 1 — The Core Value Proposition:**
"My product helps [specific customer] to [accomplish goal] by [how it works], so they [outcome]."

**Step 2 — The Minimum Feature Set:**
What are the absolute minimum features that deliver the core value? Aim for 1–3 features maximum.

For each feature:
- Name and description
- Why this feature must be in the MVP
- How AI specifically enables it

**Step 3 — The Tech Stack:**
Map out a minimal tech stack for your MVP:
- AI models: OpenAI API, Claude API, or open-source model
- No-code builders: Bubble, Glide, Softr
- Automation: n8n, Make
- Forms and databases: Airtable, Notion, Google Sheets
- Payments: Stripe
- Frontend: A simple webpage, a Notion site, a Typeform

**Step 4 — The Pricing Question:**
What would you charge? Research what similar products charge. Write your proposed pricing model and price point with justification.

**Step 5 — The Unfair Advantage:**
Why would someone use your product instead of an existing one? Write your honest answer. If you cannot identify an unfair advantage, that is important information.

---

## Activity 3: Customer Discovery — The Five Conversations (15 mins)

Design a customer discovery script for a 15-minute conversation:

1. An opening that explains you're exploring, not pitching
2. Questions about their current experience with the problem
3. Questions about what they've tried before and why it didn't work
4. Questions about what a perfect solution would look like
5. A closing asking if they'd like to stay in touch

**Your task:**
1. Write your full customer discovery script
2. Identify five real people you could approach
3. Write down what you need to learn to know whether your idea is worth pursuing

---

## Advanced Activity 1: Business Model Deep Dive (25 mins)

Beyond the basic pricing question, your business model defines how value flows through your product — how you create it, deliver it, and capture it. Different business model choices have dramatic effects on growth dynamics, unit economics, and defensibility.

Analyse your chosen idea through three different business model lenses:

**Option A: Freemium with Paid Upgrade**
- How many free users would convert to paid? (Industry benchmarks: 2–5% for B2C, higher for B2B)
- What features go on the free tier vs. paid tier?
- How do you manage API costs on the free tier?
- What's the path from free user to paying customer?

**Option B: Usage-Based Pricing**
- What's the unit of value your product delivers? (documents processed, queries answered, images generated)
- What should you charge per unit?
- How do you communicate value to users who are unfamiliar with per-usage pricing?
- What prevents a high-volume user from costing you more in API fees than they pay?

**Option C: B2B Subscription with Annual Contract**
- Which businesses have this problem at scale?
- What's the typical annual contract value (ACV) for business software in this category?
- How would you sell to businesses — direct sales, inbound marketing, channel partners?
- What do enterprise buyers need from a vendor that SMB buyers don't? (SOC2 compliance, SLAs, dedicated support, procurement processes)

After analysing all three options, choose the one that best fits your specific product and customer, and explain why the other two don't fit as well.

---

## Advanced Activity 2: Go-to-Market Strategy (25 mins)

Building a product is only half the challenge. Getting it into the hands of paying customers — your go-to-market (GTM) strategy — is the other half, and it's where most first-time builders struggle.

Map out a 90-day go-to-market plan for your product. The goal is not to acquire thousands of customers — it's to find your first 10 genuinely happy paying customers.

**Pre-launch (Days 1–30):**
- Who are the 50 specific people or organisations you'll reach out to first? (Be specific — not "people who work in X industry" but actual named individuals or companies you have some access to)
- What is your outreach message? (Write the first 3 sentences of an outreach email — it should communicate the problem and a proposed solution in one breath, and ask for a 15-minute conversation)
- What do you want to learn from the first 5 conversations?

**Soft launch (Days 31–60):**
- Who gets access first? (A small group that you can support intensively)
- What does "success" look like at 60 days? (Be specific: "2 paying customers" or "5 active free users providing weekly feedback")
- What's your single primary acquisition channel? (Direct outreach, content, community, referral — pick one to focus on completely)

**First revenue (Days 61–90):**
- What does your first invoice look like? (Who paid, what amount, for what)
- What did you learn from your first paying customers that changed your product?
- What would make a customer upgrade from free to paid, or renew for a second month?

The 90-day plan is a hypothesis, not a guarantee. The value of writing it is that it forces specific thinking about real actions rather than general strategy.

---

## Design It!

Create a **"Product One-Pager"** — a single-page document that explains your product idea clearly enough for a potential investor, co-founder, or early customer to understand it immediately.

Include:
- **Product name** (even if provisional)
- **The problem** (one sentence, specific and vivid)
- **The customer** (who exactly)
- **The solution** (one paragraph, plain language)
- **Why AI?** (one sentence)
- **The MVP features** (bulleted list — maximum 5 items)
- **Pricing** (your proposed model and price)
- **The ask** (what are you asking the reader to do?)
- **Your name and contact**

---

## Case Studies

**Case Study 1: Cursor — AI-Native Product Done Right**
Cursor began as an AI-powered code editor — a fork of VS Code with AI capabilities deeply integrated throughout the editing experience, not bolted on. Unlike GitHub Copilot (which added AI suggestions to an existing editor), Cursor was designed from scratch around the assumption that AI would be involved in writing, reviewing, and modifying code. The result was a product that felt qualitatively different: faster, more contextual, better at understanding large codebases. Cursor achieved $100M ARR in 2024 and became one of the fastest-growing developer tools ever. Key lessons: the "AI-native" advantage (designing around AI from the start) was real and measurable; their target customer (professional developers) had strong preferences and were willing to pay; and the product's quality was high enough that word-of-mouth drove significant acquisition.

*Analysis questions: What specifically made Cursor "AI-native" rather than "AI-added"? Could a well-funded incumbent (JetBrains, Microsoft) replicate Cursor's product approach? What would they need to do? What would make it hard?*

**Case Study 2: Copy.ai — Navigating the AI Content Tool Race**
Copy.ai was one of the early AI writing assistants, launched in 2021 and growing rapidly to $10M ARR before competition intensified dramatically in 2022–2023. As ChatGPT, Jasper, Writesonic, and dozens of other tools competed in the same space, Copy.ai faced a classic "commoditisation of the core" problem: the AI capability that differentiated it was no longer differentiated because everyone had access to the same foundation models. Copy.ai's response was to shift focus toward specific B2B workflows — sales content, GTM (go-to-market) automation, enterprise use cases — rather than competing on general writing quality. This pivot toward verticalization (going deeper into specific business workflows rather than competing broadly) is a common and often successful response to commoditisation pressure.

*Analysis questions: What did Copy.ai's commoditisation problem reveal about the risks of building on top of foundation model APIs? What would the ideal business model look like for a product that knows its core AI capability might be commoditised in 12 months?*

**Case Study 3: Replit's Product-Led Growth in AI Tools**
Replit is a browser-based coding environment that has embedded AI deeply into its product — AI code completion, AI debugging, AI explanation, and (via Replit Agent) AI-generated applications. Replit has used a product-led growth model: a free tier with strong AI capabilities has driven millions of user sign-ups, and conversion to paid tiers is driven by users hitting usage limits or needing more compute. A notable aspect of Replit's approach is targeting non-traditional developers — people who want to build software applications but don't have traditional computer science backgrounds — using AI to lower the skill barrier for building functional applications. This is a genuine market expansion play: not just competing for existing developers but expanding the population of people who can build.

*Analysis questions: What assumptions about AI capability and accessibility does Replit's strategy rest on? If those assumptions are right, what are the long-term implications for the software development industry? What happens to traditional programming education if AI makes it possible to build functional software without learning to code well?*

---

## Career Paths

**Product Manager (AI Products)**
Product managers at AI-native companies define what gets built, who it's for, and what success looks like. In AI products, this role requires: deep understanding of AI capabilities and limitations, ability to translate customer problems into product specifications, and the judgment to prioritise ruthlessly in a rapidly moving landscape. The best AI PMs have built things — they understand what's technically possible and what prompting and AI architecture choices look like from the inside.

**Growth Lead / Head of Growth**
AI SaaS products that depend on rapid user acquisition need people who can design and execute growth experiments — A/B tests, acquisition channel experiments, activation improvements, retention initiatives. This role combines data analysis, product intuition, and marketing creativity. The "product-led growth" paradigm (where the product itself drives acquisition) has created a specific growth methodology that is now widely taught and practiced.

**AI-Focused Founder**
The barriers to starting an AI SaaS company are lower than they've ever been — and the opportunity surface is larger. The combination of skills developed across the Innovator curriculum — problem identification, customer discovery, product specification, no-code building, AI prompting, security thinking — is the foundation for founding an AI product company. Many of the most successful AI products of the next five years will be founded by people who are currently in school.

**Technical Sales / Solutions Engineer**
Selling AI SaaS products to business customers requires being able to demonstrate technical depth, understand customer workflows, and connect product capabilities to specific business problems. Solutions engineers sit between sales and product — they're technical enough to build demos and answer hard questions, and customer-facing enough to communicate value clearly. This is a high-compensation role with a clear entry path from AI fluency combined with communication skills.

---

## Reflect
Answer these questions out loud or write them down:

1. The "Jobs to Be Done" framework says customers do not buy products — they "hire" them to do a job. What "job" does your product get hired to do, and what are customers currently "hiring" to do that job instead?
2. Many AI SaaS products are essentially a thin wrapper around an OpenAI or Anthropic API. Is that a valid business? What are the risks of building a business entirely dependent on another company's AI model?
3. If your product succeeded beyond your expectations — 10,000 paying customers — what would be the biggest operational, ethical, or technical challenges you would face that you have not thought about yet?

---

## Level Up — Build a Prototype

Build the simplest possible working version of your product idea. Don't aim for completeness — aim for demonstrating the core value proposition.

**Specific deliverable:** A working prototype that you can share with at least one real potential customer. The prototype should: (1) be accessible via a link or shareable file; (2) demonstrate the core AI capability of your product (even if other features are missing or simulated); (3) have been used by at least one real person who is not you; (4) be accompanied by a 300-word write-up covering: what you built, how you built it (tools used), what you learned from showing it to someone else, and what you would change in Version 2.

If you cannot build a working prototype, build the highest-fidelity mockup you can — a Figma design, a clickable prototype in Canva, or a detailed storyboard — and get feedback on that instead. The feedback you receive before building saves time compared to the feedback you receive after building.

---

## Further Reading

- **"The Lean Startup" by Eric Ries** — specifically the chapters on minimum viable products, validated learning, and the build-measure-learn loop. The core discipline of testing assumptions before committing resources is as relevant for AI SaaS as for any other startup context.
- **Lenny's Newsletter (lennyrachitsky.com)** — the most consistently practical newsletter on product management, growth, and building SaaS products. Includes AI-specific coverage with case studies from practitioners. Particularly valuable for the "how do successful SaaS products actually acquire customers?" question.
- **"Zero to One" by Peter Thiel** — on building products that are genuinely novel rather than incrementally better. The question "will this still be the best solution in 10 years?" is unusually relevant for AI products, which are being built in a rapidly changing competitive environment.
- **Stratechery (stratechery.com) by Ben Thompson** — the most rigorous publicly available analysis of technology strategy and competitive dynamics in AI SaaS. Thompson's framework of "aggregation theory" and his specific analyses of how AI is disrupting different market structures provide essential context for thinking about where durable AI SaaS businesses can be built.

---

## Deep Reflection Questions

1. The "Jobs to Be Done" framework says customers hire products to do a job. What job does your product get hired for? Who or what do customers currently hire instead? What does the quality of those current solutions tell you about how good your product needs to be?

2. Many AI SaaS companies are "wrappers" — user interfaces over foundation model APIs with limited proprietary logic. Is that a valid business in the long run? What are the risks, and how would you know if your product was too much of a wrapper?

3. If your product succeeded beyond expectations and reached 10,000 paying customers, what operational, ethical, or technical challenges would you face that you haven't thought about yet? Data privacy? Support volume? Quality consistency? Content moderation?

4. The customer discovery process requires talking to people who might not give you the feedback you want to hear. What psychological barriers make it hard to hear negative feedback about an idea you care about? How do you design a customer discovery process that generates honest information rather than validation?

5. Several AI SaaS categories have become highly competitive within 12 months of the underlying AI capability becoming available — AI writing assistants, AI image generation tools, AI coding assistants. How would you identify an AI SaaS category that is less likely to become commoditised quickly? What properties would that category have?

6. Software products can scale to millions of users relatively easily — marginal cost is near zero. An AI SaaS product that becomes very successful faces genuine ethical questions about scale: if your product processes millions of documents, has millions of conversations, or influences millions of decisions, what responsibilities do you have? At what scale do you become an institution rather than just a product?

---

## Share (Optional)
Send your product one-pager to at least one person outside your immediate circle. Ask them: "Does this problem resonate with you or anyone you know? Would you try this product?"

---

## Coming Up Next
Module 11: Fine-Tuning and RAG — customising AI with your own data to build products that couldn't exist with off-the-shelf models.
