# Lesson Plan: AI Law — What You Need to Know
### Innovator Level (Ages 16–18) | Module 09

---

## Objective
By the end of this lesson, you'll understand the key legal frameworks affecting AI development and deployment — copyright, liability, data protection (GDPR), the EU AI Act, and platform terms of service — and be able to identify legal risks in hypothetical AI products.

---

## What You'll Need
- AI tool (Claude or ChatGPT)
- Notebook or Google Doc
- About 60–75 minutes

---

## Watch First
Watch **Module 09: AI Law — What You Need to Know** before starting.

Important framing: **Legal compliance isn't just about avoiding trouble. Understanding the law helps you build responsibly, understand your users' rights, and compete credibly in a regulated space.**

---

## Key Concepts

### Copyright and AI

**The training data problem:**
AI models are trained on vast amounts of copyrighted material. In most countries, copyright law wasn't written with this in mind. Courts are now deciding whether training AI on copyrighted data constitutes infringement.

Key cases to know:
- *The New York Times vs OpenAI* — major ongoing lawsuit arguing GPT was trained on NYT articles without permission
- *Getty Images vs Stability AI* — claims AI was trained on Getty's images
- *Authors Guild actions* — multiple authors suing AI companies

**AI-generated output and copyright:**
In most jurisdictions, AI alone cannot hold copyright — copyright requires a human author. This means:
- You may own copyright in AI-assisted work if you made meaningful creative decisions
- Purely AI-generated content may have no copyright protection
- This creates uncertainty — always check the latest guidance in your country

> "The legal framework for AI copyright is being built in real-time, through court cases and legislation. What's true today may not be true in 18 months."

### Liability: Who Is Responsible When AI Gets It Wrong?

If an AI system harms someone — gives dangerous medical advice, makes a biased hiring decision, causes a car accident — who is legally liable?

Current framework (unclear and evolving):
- The **AI developer** (built the model): May bear some responsibility
- The **deployer** (built the product using the model): Often carries primary liability
- The **user** (if they provided bad inputs or ignored warnings): May share responsibility

As a product builder using an AI API, you are typically the **deployer** — and you bear responsibility for how the AI is used in your product, even if you didn't build the underlying model.

This is why terms of service from AI providers often require you to:
- Not deploy AI in high-risk domains (medical diagnosis, legal advice, financial decisions) without appropriate safeguards
- Maintain human oversight in critical applications
- Maintain your own usage policies

### GDPR and Data Protection

If you're collecting or processing data about users in the EU (or from EU citizens, even if you're elsewhere), GDPR applies to you.

Key GDPR obligations:
- **Lawful basis** — you must have a legal reason to process personal data (consent, contract, legitimate interest)
- **Privacy notice** — tell users what data you collect, why, and how long you keep it
- **Data minimisation** — only collect what you actually need
- **Right to erasure** — users can ask you to delete their data
- **Data breach notification** — you must notify authorities within 72 hours of a breach
- **Privacy by design** — build data protection in from the start, not as an afterthought

**Specific AI risks under GDPR:**
- Sending user data to third-party AI APIs may require user consent
- Automated decision-making with significant effects on individuals requires special safeguards
- Training models on personal data requires careful legal justification

### The EU AI Act

The EU AI Act (entered into force 2024) is the world's first comprehensive AI regulation. It classifies AI systems by risk:

| Risk Level | Examples | Requirements |
|---|---|---|
| Unacceptable (banned) | Social scoring, real-time biometric surveillance | Prohibited |
| High risk | CV screening, credit scoring, medical devices | Strict requirements: transparency, human oversight, accuracy standards |
| Limited risk | Chatbots, deepfake generators | Transparency obligations (must disclose AI involvement) |
| Minimal risk | Spam filters, AI in games | No specific requirements |

If you build AI products for EU users, you need to understand where your product sits in this framework.

### Platform Terms of Service
When you use AI APIs, you're agreeing to terms of service. Key things to check:
- **Prohibited use cases** — what are you not allowed to build?
- **Data usage rights** — does the API provider use your users' data to train its models?
- **Content policy** — what content must your product prevent?
- **Age restrictions** — can you serve minors?
- **Attribution requirements** — do you need to disclose you're using AI?

---

## Try It — Legal Analysis Activities

### Activity 1: Legal Risk Assessment (20 mins)

For each of these AI product concepts, identify the main legal risks and what you'd do to manage them:

**Product A: An AI that reads your medical symptoms and suggests diagnoses**

Legal risks:
- Copyright: ___
- Liability: ___
- GDPR: ___
- EU AI Act risk category: ___
- My mitigation approach: ___

**Product B: A tool that scans job applications and ranks candidates using AI**

Legal risks:
- Copyright: ___
- Liability: ___
- GDPR: ___
- EU AI Act risk category: ___
- My mitigation approach: ___

**Product C: A chatbot for teenagers that helps with homework**

Legal risks:
- Copyright: ___
- Liability: ___
- GDPR: ___
- EU AI Act risk category: ___
- My mitigation approach: ___

---

### Activity 2: Terms of Service Audit (15 mins)

Choose one major AI API provider (OpenAI, Anthropic, Google) and read their usage policies and terms of service.

Key things to find:
1. What use cases are explicitly prohibited? (List 5)
   1. ___
   2. ___
   3. ___
   4. ___
   5. ___

2. Does the API provider use your API input/output data to train their models? What does the policy say?
   ___

3. What are the requirements around deploying to minors?
   ___

4. What must you do if you're building in a "high risk" domain?
   ___

5. The most surprising restriction I found:
   ___

---

### Activity 3: The Legal Memo (20 mins)

You're building an AI-powered product that:
- Uses ChatGPT API to answer users' questions about their legal rights
- Collects users' names and email addresses
- Is accessible to anyone in the EU
- Is completely free to use

Write a brief legal risk memo covering:
- Your three biggest legal risks
- What you would do to mitigate each
- One thing you would NOT do with this product because of legal risk

My three risks:
1. ___
2. ___
3. ___

My mitigations:
1. ___
2. ___
3. ___

What I would refuse to do: ___

---

## The Compliance-by-Design Principle

Treating legal compliance as an afterthought is expensive. Getting sued, receiving regulatory fines, or being shut down costs far more than building responsibly from the start.

Good practices for responsible AI builders:
- Read the API terms of service before building anything
- Add appropriate disclaimers when providing information that could affect health, finances, or legal situations
- Minimise personal data collection — only collect what you need
- Be transparent with users about AI involvement
- Build in human oversight for consequential decisions
- Check if your jurisdiction requires specific AI disclosures

Rate your current understanding of AI legal requirements: ___/10

What's the one area you most need to learn more about: ___

---

## Reflect

1. Before this lesson, how much did you know about AI law? What was the most surprising thing you learned?

2. As an AI builder, you often use other companies' models via API. If your AI product harms a user — and the harm traces back to the base model's failure — how should responsibility be divided? Is that the current legal position?

3. The EU AI Act categorises AI by risk level. Do you think the risk categories are drawn in the right places? Is anything missing or misclassified?

---

## Challenge
**The Legal Audit:**

Take your AI product concept from Module 08 (or a hypothetical one). Write a full legal audit covering:

1. Copyright implications (training data, your outputs)
2. Liability exposure and how you'd manage it
3. GDPR obligations if you have EU users
4. EU AI Act risk category
5. API terms of service implications
6. Three legal safeguards you'd build in from day one

This is the kind of analysis a real startup should do before launching. Make it specific to your product, not generic.

Product I'm auditing: ___
My biggest legal risk: ___
My most important safeguard: ___

---

## Coming Up Next
Module 10: Multimodal AI — Beyond Text — vision, audio, video: what AI can do when it processes more than just words, and how to combine modalities in real workflows.
