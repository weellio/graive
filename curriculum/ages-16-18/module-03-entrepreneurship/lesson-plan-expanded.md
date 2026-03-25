# Lesson Plan: Entrepreneurship in the AI Age
### Innovator Level (Ages 16–18) | Module 03 — Expanded

---

## Objective
Develop, pressure-test, and validate one genuine product or service idea at the intersection of AI leverage and real human problems. Understand how the economics of AI-powered businesses differ from traditional startups, and what that means for where genuine opportunity lies.

---

## What You'll Need
- AI tool
- Notebook or Google Doc
- Optional: 1-2 people you can interview
- 45–60 minutes

---

## Watch First
Watch **Module 03: Entrepreneurship in the AI Age**.

Key formula: Unique insight + AI leverage = unfair advantage. Start with the problem, not the tool.

---

## The Landscape: How AI Is Reshaping Who Can Build a Business

The classic narrative of startup success required significant capital, a technical co-founder, and months of development before anything was in the hands of users. The minimum viable product that Paul Graham described in his famous essays still required a developer to build. That reality has changed more dramatically in the last three years than in the previous twenty, and the change is not subtle.

The most visible shift is in the cost and time required to produce software. AI-assisted development tools — GitHub Copilot, Cursor, Replit AI — have compressed the development cycle for experienced developers. But more consequentially for aspiring entrepreneurs, no-code AI tools (covered in Module 02) and AI-powered app builders (Bubble, Bolt.new, v0.dev) have made it possible to produce functional software products without deep engineering expertise. What this means in practice: the primary barrier to testing a software business idea has shifted from "can I build it?" to "is there a market for it?" — which is actually the more important question.

The economic structure of AI-enabled businesses has distinctive features that entrepreneurs need to understand. On the cost side, AI capabilities that would have required a team of specialists are now accessible via API at commodity prices. A content analysis task that once required hiring an analyst can now be done for fractions of a cent per operation. This makes certain business models viable at scale that would never have been profitable before. But it also means that the "AI capability" part of most AI products is not a sustainable competitive advantage — any competitor can access the same foundation models via the same APIs.

This is the central strategic challenge of the AI era: if the intelligence itself is a commodity, where does defensible value come from? Practitioners and investors have converged on several answers. The first is distribution — having an audience, customer relationships, or a channel that competitors can't replicate quickly. The second is data — proprietary data about a specific domain or customer base that can be used to make AI outputs more accurate and relevant. The third is trust — being the known, trusted entity in a field where AI outputs need to be validated by a credible source. The fourth is integration depth — building so deeply into a customer's workflow that switching away is genuinely costly.

The profile of who is building AI businesses is also changing. The classic startup archetype — mid-twenties ex-big-tech engineer in San Francisco — is still well-represented. But the AI tools wave has enabled a much broader cohort of builders: industry specialists building tools for their own profession, individual creators building niche products for their existing audience, and non-technical operators building automations for small businesses. The common thread is domain knowledge combined with AI fluency — not engineering credentials. This is precisely the combination that the Innovator curriculum is developing.

The pace of change in AI business models also creates unusual opportunities for young builders. Established companies are slow to adapt to new tool landscapes — the compliance processes, risk management requirements, and organisational inertia of a large company make it genuinely difficult to move as fast as a motivated individual. In windows of rapid technology change, individual builders with deep knowledge of a specific domain or community can build and ship faster than any organisation. The window doesn't stay open forever, but for the next several years, it's wider than it has been in decades.

The risks deserve honest acknowledgement. "AI wrapper" businesses — products that simply add a user interface on top of an existing AI API with minimal additional value — have proven difficult to sustain. When OpenAI or Anthropic releases a new model that does something an AI wrapper product was charging for, the product can become obsolete overnight. The entrepreneurs who have built more durable businesses are those who combined AI capability with genuine customer relationships, proprietary data, or deep workflow integration. These take more time to build but create more defensible positions.

---

## Technical Deep Dive: The Economics of AI Products

Understanding the cost structure of an AI product is essential for building a viable business.

**API costs and unit economics.** Most AI products are built on foundation models accessed via API, where you pay per token (roughly per word processed). At current pricing (early 2025), GPT-4o charges approximately $0.005 per 1,000 input tokens and $0.015 per 1,000 output tokens. A typical analysis of a 500-word document costs approximately $0.01–0.03. This is cheap in absolute terms, but the cost structure matters enormously for business model design. If your product processes thousands of documents per user per month, and you charge a monthly subscription of $20, you need your per-operation cost to be fractions of a cent to maintain a healthy margin.

**Gross margin considerations.** SaaS businesses (non-AI) typically run gross margins of 70–85% — meaning for every £100 of revenue, £70–85 is left after direct costs (hosting, etc.). AI-heavy products often run lower gross margins because of API costs: 50–65% is more typical for AI-native products. This has significant implications for pricing and business model design — it means you need higher revenue per customer, or much higher volume, to reach the same profitability as a traditional software business.

**Make-vs-buy decisions.** As you build an AI product, you'll continuously face make-vs-buy decisions: use an existing AI API (buy) or train/fine-tune your own model (make). For almost all early-stage products, the answer is buy — using an existing API is faster, cheaper, and produces better results than trying to train your own model with limited data and compute. Fine-tuning (covered in Module 11) is a sensible investment only when you have a large amount of domain-specific data and a clear performance gap between the fine-tuned model and a general-purpose one.

**Moat vs. feature.** A "moat" in startup terminology is a competitive advantage that's difficult for competitors to replicate. In AI products, you should ask of every feature: is this a moat or just a feature? A feature can be copied; a moat cannot be easily replicated. Data, customer relationships, and brand trust are moats. Being the first to add a specific AI feature is typically not a moat — competitors will add it within months.

---

## Exercise 1: Problem Mining (15 mins)

List 10 problems you or people around you have. These can be:
- Things that take too long
- Tasks that are frustratingly repetitive
- Things that require expertise people don't have
- Information that's hard to find or process
- Things that currently require expensive professionals

Don't filter for 'AI-solvable' yet. Just list real problems.

| # | Problem | Who has it | How often | How annoying (1-10) |
|---|---------|-----------|----------|-------------------|
| 1 | | | | |
| 2 | | | | |
| ... | | | | |

**Circle your top 3 — the most specific, most frequent, most annoying.**

---

## Exercise 2: The Idea Generator (20 mins)

For your top 3 problems, run this prompt:

```
I have identified this problem: [DESCRIBE THE PROBLEM SPECIFICALLY, INCLUDING WHO HAS IT]

Help me think through:
1. How could AI be used to solve part or all of this problem?
2. What would a productised version look like (something someone pays for regularly)?
3. Who is the most specific possible target customer?
4. What would make this better than existing solutions?
5. What's the simplest possible version I could test with real people this week?
```

Run this for each of your top 3 problems.

**After running all three, choose ONE idea to develop further.**

Your idea in one sentence: "I help [WHO] do [WHAT] using [HOW]."

---

## Exercise 3: The Investor Stress Test (15 mins)

Now pressure-test your idea:

**Prompt 1 — The Sceptic:**
```
Here is my business idea: [YOUR IDEA IN FULL DETAIL]

Act as a rigorous, sceptical but fair investor.
What are the 5 biggest risks?
What assumptions am I making that could be wrong?
What would need to be true for this to succeed?
What would cause this to fail?
```

**Prompt 2 — The Competitor:**
```
Someone is building [YOUR IDEA]. I am a well-funded competitor.
What would be my strategy to make their product irrelevant?
What would they need to do to defend against me?
```

After both: what's the most important risk to address first?

---

## Exercise 4: Validation Design (10 mins)

Design a 1-week validation plan — without building anything:

1. Who are 3–5 specific people I could talk to who have this problem?
2. What 3 questions would I ask them? (Avoid: "would you use this?" — ask about their current experience instead)
3. What would "validated" look like? (e.g., 2 people say they'd pay for it)
4. What's the simplest manual version I could run to test it? (The "fake it before you make it" approach)

---

## Advanced Activity 1: Competitive Landscape Analysis (20 mins)

Before building, you need a clear picture of who else is in your space. Naive founders often discover well-funded competitors after spending months building. Sophisticated founders use competitor analysis to identify gaps, sharpen their positioning, and find the specific niche where they have an advantage.

Search for existing solutions to the problem you've identified. You want to find:
- Direct competitors (solving the same problem for the same customer)
- Indirect competitors (different approach to the same problem, or same approach to a different but related problem)
- Adjacent players (companies the customer currently uses for related workflows)

For each competitor you find, note:
- What they charge (pricing model and price point)
- What they do well (based on reviews, public user feedback)
- What complaints or limitations are visible in reviews or forums
- Who their target customer appears to be

Use this prompt to help synthesise:
```
Here are the existing solutions to [YOUR PROBLEM]: [LIST COMPETITORS AND THEIR KEY FEATURES]

Based on this competitive landscape:
1. What gaps are not being served well?
2. Where are the most common customer complaints?
3. What pricing tier appears underserved?
4. Who would be the most defensible niche to target first?
```

The output of this analysis should be a one-paragraph "competitive positioning statement" that explains exactly how your idea is different and for whom.

---

## Advanced Activity 2: The Business Model Canvas (25 mins)

A business model is more than a product idea — it's a coherent account of how value is created, delivered, and captured. The Business Model Canvas, developed by Alexander Osterwalder, is a one-page framework used by startups and established companies alike to map out the key components of a business.

For your chosen idea, complete a simplified canvas with these nine components:

| Component | Your Answer |
|-----------|-------------|
| **Customer Segments** | Who specifically are you serving? Be as specific as possible. |
| **Value Proposition** | What specific problem do you solve, and why is your solution better than alternatives? |
| **Channels** | How do you reach your customers? (Where do they hang out, what do they read, who do they trust?) |
| **Customer Relationships** | How do you acquire customers, keep them, and grow revenue from them? |
| **Revenue Streams** | How do you charge? Subscription, per-use, one-time payment, freemium? |
| **Key Resources** | What do you need to deliver your product? (AI API, data, your own expertise) |
| **Key Activities** | What are the most important things you must do to make this work? |
| **Key Partnerships** | Who do you depend on? (AI providers, distribution partners, data sources) |
| **Cost Structure** | What are your biggest costs? (AI API fees, hosting, customer acquisition) |

After completing the canvas, identify your riskiest assumption — the one thing that, if wrong, would mean the whole business doesn't work. This is what you need to validate first.

---

## Case Studies

**Case Study 1: Jasper AI — Riding the AI Content Wave**
Jasper launched in 2021 as an AI writing assistant for marketing teams and quickly grew to $75 million in ARR (annual recurring revenue), becoming one of the fastest-growing SaaS companies in history. The core insight was simple: marketing teams produce enormous amounts of content (blog posts, social media, email campaigns, ad copy) and the repetitive nature of this work was well-suited to AI assistance. Jasper's initial moat was first-mover advantage in a rapidly growing category — they built a large customer base and brand before competition intensified. However, as ChatGPT became widely available and dozens of competitors entered the space, Jasper's growth slowed significantly. By 2023, the company had cut significant staff. The lesson: first-mover advantage in AI features is temporary. The durable businesses are those that built deep workflow integration and customer relationships alongside the AI capabilities.

*Analysis questions: What could Jasper have done differently to build a more defensible business? What would you look at to assess whether an "AI wrapper" business has a genuine competitive moat?*

**Case Study 2: Harvey AI — Deep Domain Expertise as a Moat**
Harvey AI, founded by two lawyers-turned-entrepreneurs, built AI tools specifically for the legal profession. Rather than building a general-purpose AI assistant, they focused deeply on legal workflows: contract review, due diligence, legal research, brief drafting. By developing genuine expertise in how law firms work, building integrations with legal research databases, and pursuing rigorous validation of their outputs with legal professionals, Harvey created a product that general-purpose AI tools couldn't easily replicate. By 2024, Harvey was serving major law firms globally and had raised significant funding. The moat is their deep understanding of legal workflows combined with legal-specific training data and customer relationships with firms for whom switching costs are high.

*Analysis questions: What made Harvey's domain specialisation more defensible than a general AI assistant? How would you apply the same "domain depth" strategy to an industry you know well? What does this suggest about where the best AI opportunities lie for people with non-technical expertise?*

**Case Study 3: Teenage Builders — The New Cohort**
Since 2022, a notable number of teenage and early-twenties builders have shipped AI products with genuine user bases. Examples from the public record include students who built tools for their school communities (AI study assistants, homework organiser tools), creators who built tools for their existing audience (newsletter tools, content repurposing tools), and developers who built tools for specific professional niches they had access to through family or part-time work. What the successful cases share: deep knowledge of a specific problem and customer, the ability to get genuine feedback quickly (because they're embedded in the community they're serving), and a willingness to iterate rapidly. Speed and closeness to the customer — not funding or team size — were the decisive advantages.

*Analysis questions: What advantages do you have as a young builder that an experienced professional might not have? What communities, problems, or domains do you understand better than most adults? How could you turn that proximity into an unfair advantage?*

---

## Career Paths

**Founder / Entrepreneur**
Building your own company is the most direct application of entrepreneurship skills, but it's not the only one. The skills developed in this module — identifying problems worth solving, validating ideas before building, understanding competitive dynamics, thinking about business models — are valuable whether you're starting something yourself or working at a startup. Many successful founders spent years at other companies first, building specific domain expertise, customer relationships, or technical skills before starting their own venture.

**Venture Capital Analyst / Associate**
Venture capital firms invest in early-stage companies. Analysts and associates evaluate deals by assessing founder quality, market size, competitive dynamics, and business model viability — exactly the frameworks developed in this module. Entry-level VC roles are highly competitive and typically require prior startup experience or exceptional analytical skills, but they're accessible to motivated people in their early twenties who can demonstrate genuine insight about markets and companies.

**Product Strategy / Chief of Staff at Startups**
Fast-growing startups need people who think in terms of problems and solutions, understand competitive dynamics, and can move quickly between strategic thinking and execution. The Chief of Staff role at a startup often resembles "junior co-founder" — working across every function with the CEO. Strong candidates combine business model thinking with the ability to build or commission operational tools rapidly.

**AI Business Development**
Large companies are actively seeking people who can identify where AI can create value in their businesses, partner with AI providers, and translate between technical AI capabilities and business applications. This emerging role sits between strategy, partnerships, and product management — and rewards people who understand both the business problem and the AI solution space.

---

## Level Up — The Landing Page Test

Build a one-page pitch for your idea without building the product. Use AI to help write:
- A headline that communicates the value
- 3 bullet points of what it does
- A simple "sign up to be notified" or "get early access" ask

This is a real technique: put up a landing page, drive some traffic to it, see if anyone signs up. If no one does, the idea needs work before you build.

**Use AI to write the copy. Your job: make sure it sounds like something a real person would want.**

**Specific deliverable:** A complete one-page landing page document (doesn't need to be live online — a well-formatted Google Doc is fine) that includes: headline, subheadline, problem statement, three key features/benefits, a clear call-to-action, and a brief "who this is for" section. Share it with at least two people outside your immediate circle and ask for their honest reaction. Document their feedback. Would they sign up? Why or why not? What confused them?

---

## Further Reading

- **"The Lean Startup" by Eric Ries** — the foundational text on validated learning, minimum viable products, and the build-measure-learn cycle. The core insight — that building before validating is the most common and expensive mistake in entrepreneurship — remains as relevant as ever in the AI era.
- **"Zero to One" by Peter Thiel** — a contrarian view of what makes a great startup, with a strong argument for building something genuinely new (secrets, in Thiel's framework) rather than incrementally improving existing approaches. Particularly relevant for thinking about what makes an AI business defensible.
- **"The Mom Test" by Rob Fitzpatrick** — a slim, practical book specifically about customer interviews and validation. The central insight is that asking people "would you use this?" is almost useless; learning how to ask questions that reveal genuine behaviour is the skill. Essential reading before the validation exercise.
- **Stratechery by Ben Thompson** — a subscription newsletter by an independent analyst who writes with exceptional clarity about technology strategy, competitive dynamics, and business models. His analysis of how AI is reshaping specific industries is the best publicly available writing on AI business strategy.

---

## Deep Reflection Questions

1. The module says "AI commoditises production — trust and audience are the scarce resource." What does that mean practically for what you should be building now, even before you have a product idea? What are the non-technical assets worth accumulating today?

2. What's the difference between a problem you find interesting and a problem customers would pay to solve? Can you think of an example of each from the ideas you generated? Why does that distinction matter so much for deciding what to build?

3. If you did pursue the idea you developed in this module, what would you be betting on about yourself — your skills, insights, or access? What specific knowledge or position do you have that a well-funded team in San Francisco doesn't?

4. The fastest-growing AI companies have often been first movers in a category — but many first movers have also been overtaken by well-resourced competitors once the market was established. What should a founder do in the first 18 months of a business to create advantages that are hard to copy?

5. "Fake it before you make it" — building a landing page or running a manual process before automating it — is a widely recommended validation approach. But there's an ethical question: is it honest to present something as a product when it doesn't exist yet? Where is the line between a pre-launch marketing page and misleading potential customers?

6. Many of the most impactful AI applications are in domains like healthcare, legal, financial, and education — areas with significant regulatory requirements, professional licensing, and high stakes for errors. How should a young entrepreneur think about building in these spaces? Is the regulatory complexity a barrier or an opportunity?

---

## Share (Optional)

Share your one-sentence idea: "I help [WHO] do [WHAT] using [HOW]." Others might give useful feedback or say "I'd use that!"

---

## Coming Up Next
Module 04: Philosophy of Mind & AI — what does all of this mean for what it means to be human?
