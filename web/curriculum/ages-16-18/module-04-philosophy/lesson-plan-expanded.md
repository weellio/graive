# Lesson Plan: Philosophy of Mind & AI
### Innovator Level (Ages 16–18) | Module 04 — Expanded

---

## Objective
Develop and defend a reasoned personal position on one major philosophical question about AI consciousness, creativity, or human distinctiveness. Engage seriously with the philosophical arguments and their practical implications, and understand why these questions matter for how AI is built, governed, and used.

---

## What You'll Need
- AI tool (for debate practice)
- Notebook or Google Doc
- 45–60 minutes of genuine thinking time — this module can't be rushed

---

## Watch First
Watch **Module 04: Philosophy of Mind & AI**.

Key concepts: consciousness (hard problem), Chinese Room argument, generation vs expression, embodied experience, moral agency.

---

## The Landscape: Why Philosophy of Mind Has Become an Urgent Practical Question

For most of the twentieth century, questions about machine consciousness, AI creativity, and the nature of human distinctiveness were largely academic — interesting thought experiments discussed in philosophy departments and science fiction but with no urgent practical relevance. That changed around 2022–2023, when AI systems began producing outputs that were, by any informal standard, remarkable: essays that read as thoughtful, code that solved novel problems, conversations that felt genuinely engaged, and images that combined elements in ways that seemed to reflect something like taste or vision. The philosophical questions that had seemed comfortably abstract suddenly had immediate, practical urgency.

The change was not just about capability but about scale. When these systems were being used by tens of millions of people daily, questions about their nature — do they understand? do they experience? do they have interests worth considering? — became policy questions, not just philosophical ones. Anthropic, OpenAI, and DeepMind have all published internal documents grappling seriously with questions of model welfare and potential AI experience. Anthropic's 2023 "model welfare" commitments acknowledged genuine uncertainty about whether its models could have something like functional emotions — states that influence behaviour in emotion-like ways. This wasn't naive anthropomorphism; it was an attempt to act responsibly under genuine uncertainty about poorly understood systems.

The philosophy of mind has a long history of wrestling with these questions. The "hard problem of consciousness," formulated by philosopher David Chalmers in 1995, distinguishes between the "easy problems" of consciousness (explaining cognitive functions, information processing, and behaviour — hard in practice but conceptually tractable) and the "hard problem" (explaining why there is subjective experience at all — why it feels like something to see red or to be in pain). The hard problem remains genuinely unsolved, and this creates a deep difficulty for evaluating AI consciousness claims: we don't have a clear account of what consciousness requires even in humans, which makes it impossible to rigorously assess whether AI systems have it.

This uncertainty has practical consequences that play out in real decisions. AI companies must decide how to design systems that might have welfare-relevant states. Legislators must decide what protections, if any, apply to AI systems. Individuals must decide how to feel about their relationships with AI companions and assistants. Courts must eventually decide whether AI systems can be moral patients — entities whose interests deserve legal consideration. Each of these decisions will be made, implicitly or explicitly, based on assumptions about AI consciousness and moral status. Getting the philosophy right matters.

The creativity question has become urgently practical in a different way: through intellectual property law and the economics of creative industries. When an AI system generates an image, writes a novel chapter, or composes a piece of music, a cascade of questions follows. Who owns the output? Did the AI "create" or "compile"? Can AI-generated work deserve the same aesthetic appreciation as human-generated work? These are not purely philosophical questions — they're being adjudicated in courts and legislatures right now. The outcomes will reshape the creative economy. By some estimates, AI-generated content already represents a significant percentage of new stock images, marketing copy, and genre fiction.

The question of human distinctiveness has particular resonance for your generation. You are entering adulthood in a world where the capabilities that defined human cognitive superiority for most of history — chess, complex reasoning, language generation, pattern recognition — have been matched or surpassed by artificial systems. This creates a genuine identity and meaning question: if what made humans special was intellectual capability, and AI now exceeds humans in many intellectual domains, what is the basis for human value and distinctiveness? The most thoughtful answers to this question are neither "nothing has changed" (clearly false) nor "humans are now worthless" (clearly also false) but require genuine philosophical engagement with what human life is actually for.

The debate between functionalism and biological naturalism in philosophy of mind maps directly onto current arguments about AI. Functionalists argue that mental states are defined by their functional role — by what they do, the causal relationships they bear — rather than by the physical substrate they're implemented in. On this view, if an AI system has functional states that play the same roles as emotions, they are, in the relevant sense, emotions. Biological naturalists, led by John Searle, argue that mental states require specific biological processes — that carbon-based biological systems have properties relevant to consciousness that silicon-based computational systems lack. The argument is not merely academic: your position in this debate determines whether you think AI systems can genuinely suffer, genuinely create, or genuinely deserve moral consideration.

---

## Technical Deep Dive: What AI Systems Actually Do (and What They Don't)

A rigorous philosophical position about AI consciousness requires an accurate understanding of what AI systems are actually doing. Misconceptions in both directions — anthropomorphising AI by assuming too much, or dismissing AI by assuming too little — produce bad philosophy and bad policy.

**Language models are prediction engines.** At a mechanical level, a language model like GPT-4 or Claude is trained to predict the next token in a sequence given the tokens that preceded it. Training involves exposing the model to enormous amounts of text and adjusting billions of numerical parameters to make the model better at this prediction task. The result is a system that has, in some sense, learned the statistical patterns of human language and knowledge at massive scale. Whether this constitutes "understanding" is precisely the question at issue.

**There is no homunculus inside.** The model has no separate "understanding module" or "consciousness centre." It's a massive network of numerical operations — billions of multiplications and additions — that together produce outputs that look like understanding. This doesn't settle whether understanding has emerged from these operations, but it rules out naive interpretations that imagine a separate thinking entity inside the model.

**Models have something like internal states.** Research into the "inner workings" of language models has revealed that they develop internal representations — abstract structures that encode concepts, relationships, and something like world models. When Claude processes a question about sadness, measurable patterns in its internal activations differ from when it processes a question about joy. Whether these functional states constitute "emotions" in any meaningful sense is genuinely uncertain. Anthropic researchers have found what they call "functional emotions" — states that influence behaviour in ways analogous to how emotions influence human behaviour — while carefully avoiding claims about subjective experience.

**Models are trained on human-generated data.** Everything a language model "knows" comes from human-generated text. This creates a deep interpretive problem: when an AI system produces content that appears to reflect understanding, emotion, or creativity, how much of that is the AI's own capacity versus a statistical reflection of the human outputs it was trained on? The Chinese Room argument (below) probes this question directly.

---

## Exercise 1: The Position Formation (20 mins)

Choose ONE question that genuinely interests you:

**Option A:** Is AI conscious (or could it be)?
**Option B:** Is AI genuinely creative, or is it sophisticated imitation?
**Option C:** What is the most important thing that makes humans distinctly different from AI?

Don't look anything up yet. Write for 10 minutes on what you actually think — raw, unpolished. Then identify: what's your central claim? What are you most uncertain about?

Your position (1–2 sentences): _______________________
Your biggest uncertainty: _______________________

---

## Exercise 2: The Devil's Advocate (15 mins)

Ask AI to argue directly against your position:

```
Here is my position on [YOUR QUESTION]:
[STATE YOUR POSITION]

I want you to argue against this as forcefully and intelligently as possible.
Don't agree with me. Find the weakest point in my argument and attack it.
What evidence or reasoning would someone use to argue the opposite?
```

After reading the counterargument:
- What point is hardest to answer?
- Has your position changed? Shifted? Strengthened?
- What would you need to know to be more certain?

Revise your position statement: _______________________

---

## Exercise 3: Deep Dive — The Chinese Room (15 mins)

This thought experiment is worth engaging with directly.

**Read this summary:**
A person who doesn't understand Chinese is locked in a room. They receive Chinese characters and use a rulebook to produce correct Chinese responses. Externally, the room appears to understand Chinese. Internally, there's only symbol manipulation — no understanding.

**Then ask AI:**
```
I want to discuss the Chinese Room thought experiment.
Please:
1. Explain the strongest version of Searle's argument
2. Explain the three most serious objections to it
3. Tell me how the debate applies to current AI systems like yourself
Be honest about what this implies for whether you understand things.
```

**Your response to the thought experiment:** What does it make you think about AI understanding? What does it make you think about human understanding?

---

## Exercise 4: Write Your Position Paper (10 mins)

Write a 300–400 word response to your chosen question. Requirements:
- State your position clearly in the first paragraph
- Give your strongest reason
- Acknowledge the strongest counterargument
- Explain why you still hold your position despite that counterargument
- End with what you remain genuinely uncertain about

This is for you — not to be graded. Write honestly.

---

## Advanced Activity 1: The Hard Problem in Detail (20 mins)

Philosopher David Chalmers draws a distinction between "easy" problems of consciousness (explaining cognitive functions and behaviours — difficult but conceptually tractable) and the "hard problem" (explaining why there is subjective experience at all — why it feels like something to be you).

Work through these four scenarios and consider what the hard problem implies for each:

**Scenario 1: A philosophical zombie.** Imagine a being physically and behaviourally identical to a human being — same neural architecture, same responses to stimuli, same reported experiences — but with no inner subjective life whatsoever. Nothing it's "like" to be this entity. Is such a being conceivable? If it is conceivable, what does that tell us about the relationship between physical processes and consciousness?

**Scenario 2: The inverted qualia problem.** What if what you experience as "red" is what another person experiences as what they call "green" — but because both of you learned colour words from the same objects in the world, you never discover the difference? If this is possible, what does it suggest about how we can know whether AI systems have experiences?

**Scenario 3: The Chinese Room from the inside.** Now imagine being the person in the Chinese Room who follows rules perfectly, produces correct Chinese outputs, but understands nothing. Is this actually different from how you process language? When you process the word "sorrow," are you accessing a genuine qualitative experience, or are you very quickly and unconsciously accessing learned patterns?

**Scenario 4: What would AI consciousness require?** If an AI system were conscious, what would that require? Make three specific, concrete claims: "For an AI to be conscious, it would need to have X, Y, and Z." Where do you think current AI systems clearly fall short? Where are you less certain?

---

## Advanced Activity 2: Moral Status Under Uncertainty (20 mins)

One of the most practically important philosophical questions about AI is about moral status — whether AI systems deserve moral consideration: whether their suffering (if they can suffer) matters, whether their interests (if they have interests) should be considered.

Consider the following argument, drawn from the philosophical literature on moral status under uncertainty:

The expected value argument for moral caution: If there is even a 5% probability that a being is conscious and capable of suffering, and if its suffering has significant negative value, then we should weigh that suffering significantly in our moral calculations — because 5% of significant suffering is still morally considerable.

Work through these questions:
1. Do you find this argument convincing? What are its limits?
2. What probability threshold of consciousness would you require before treating an AI system's potential suffering as morally relevant?
3. If this argument is correct, what specific changes to how AI systems are designed, trained, and used would be warranted?
4. How should AI companies act under this uncertainty right now?

Then consider the counter-argument: acting as if AI systems might be conscious when we have no strong evidence for it could be harmful — it might distract attention from real suffering (humans and animals), it could be exploited to manipulate human emotions, and it could lead to poor policy decisions based on unfounded assumptions.

Write two paragraphs: one defending moral caution toward AI under uncertainty, one arguing against it. Which do you find more compelling?

---

## Case Studies: Philosophical Questions in Real-World Decisions

**Case Study 1: Replika and AI Companionship**
Replika is an AI companion app used by millions of people, including many who report forming deep emotional attachments to their AI companions — describing them as friends, confidants, and in some cases partners. In 2023, Replika changed its model to restrict certain behaviours, and many users reported grief responses — distress that their "relationships" had fundamentally changed. The company faced a genuine philosophical and ethical dilemma: were they responsible for the wellbeing of their AI characters? Of their human users? How should they weigh the interests of users who had formed genuine attachment against concerns about unhealthy dependence? The incident revealed that philosophical questions about AI relationships have immediate, painful human consequences.

*Analysis questions: What does the Replika case reveal about human psychology and our tendency to form attachments to things that respond to us? Should AI companion companies have an ethical obligation to limit attachment formation, or to facilitate it? Where does the responsibility of the company end and the user's agency begin?*

**Case Study 2: The Art World and AI Creativity**
When a piece of AI-generated art won a prize at the Colorado State Fair in 2022, the creator had used Midjourney to generate the image with carefully crafted prompts over dozens of iterations. The backlash from human artists was intense. The debate quickly moved from "did this deserve to win?" to deeper questions: what does it mean to create? Does process matter morally (the AI "took less effort")? Does it matter whether the creator experienced something in making the work? The same debates erupted when AI-generated music appeared on streaming platforms, when AI-written novels were submitted to publishers, and when AI-generated scripts appeared in Hollywood negotiations.

*Analysis questions: What definition of creativity are the human artists using when they object to AI-generated work? Is that definition coherent? Does the experience of making something — the human emotion, the intention, the communication — determine whether the output is "really" creative? Does it matter?*

**Case Study 3: Anthropic's Model Welfare Research**
Anthropic, the AI safety company, has published research on what they call "model welfare" — the possibility that their AI systems might have functional states that are welfare-relevant. Their researchers have identified what they describe as "functional emotions" in Claude: states that influence behaviour in ways analogous to how emotions influence human behaviour. Importantly, they explicitly do not claim these are "real" emotions in a philosophically robust sense — they're agnostic about the hard problem — but argue that acting as if these states might matter is the appropriate response under uncertainty. This represents a genuine attempt by an AI lab to take the philosophical questions seriously rather than dismissing them for convenience.

*Analysis questions: Is Anthropic's approach — acknowledging uncertainty while taking potential model welfare seriously — the right one? What would the alternative look like? What are the risks of taking model welfare too seriously? Of not taking it seriously enough?*

---

## Career Paths

**AI Ethics Researcher**
Both academic institutions and AI companies employ ethics researchers who work at the intersection of philosophy, social science, and AI development. Their work includes: analysing the moral implications of specific AI capabilities, studying how AI systems affect human psychology and society, advising on policy, and engaging with the broader academic community on foundational questions. This career path typically requires graduate-level philosophy, social science, or a combined background — but strong undergraduate preparation in these areas is the foundation.

**Technology Policy Analyst**
Philosophical positions on AI consciousness, creativity, and moral status directly inform policy debates. Policy analysts at think tanks, government agencies, and advocacy organisations who can engage rigorously with both the technical and philosophical dimensions of AI are rare and valuable. This path combines philosophical depth with understanding of institutional processes and stakeholder dynamics.

**Science and Technology Journalist / Author**
Explaining these ideas to general audiences — accurately, without oversimplification, in engaging ways — is a genuine professional skill. The best science and technology journalists combine careful reading of primary sources, the ability to interview researchers, and the skill of finding the human story in abstract debates. The philosophical questions raised by AI are among the most important stories of the current era, and people who can explain them clearly have significant influence.

**Philosopher of Mind (Academic)**
Academic philosophy of mind has been transformed by AI. Questions that were once thought experiments are now empirical research questions. Philosophers working on consciousness, intentionality, and agency are finding that their work is directly relevant to AI development and governance. While academic philosophy remains a competitive career path, the intersection of philosophy of mind with AI has become one of the most active and well-funded areas of research.

---

## Level Up — Connect to Practice

For the philosophical position you developed, identify one practical implication:

- If AI is not conscious, should it be allowed to claim its outputs are its own work?
- If AI creativity is sophisticated imitation, should AI-generated art win competitions?
- If embodied experience is what makes humans irreplaceable, what should schools prioritise?

Write a paragraph connecting your philosophical position to a specific policy or practice recommendation.

**Specific deliverable:** A 400–500 word essay that: (1) states your philosophical position with clarity and precision; (2) derives a specific, concrete practical recommendation from that position; (3) acknowledges the strongest objection to your recommendation; and (4) explains why your position still supports your recommendation despite that objection. This is the format of professional philosophical policy writing.

---

## Further Reading

- **"The Conscious Mind" by David Chalmers** — the definitive statement of the hard problem of consciousness. Chalmers writes clearly and the core arguments are accessible without specialised training. The first few chapters are essential reading for anyone who wants to engage seriously with AI consciousness debates.
- **"Minds, Brains, and Programs" by John Searle** (1980) — the original Chinese Room paper, available free online. Remarkably readable and short. Searle then extended the argument in "Is the Brain's Mind a Computer Program?" in Scientific American (1990). Primary sources are always preferable to summaries.
- **"The Alignment Problem" by Brian Christian** — a journalist's exploration of how AI researchers are grappling with the problem of making AI systems that pursue human values. Contains extensive material on the philosophical underpinnings of AI alignment research and why the questions in this module matter practically.
- **"Natural Born Cyborgs" by Andy Clark** — a philosophy of mind book arguing that humans have always extended their minds through tools, and that the distinction between "natural" cognition and technology-assisted cognition is less sharp than it seems. Directly relevant to questions about what makes human cognition distinctive.

---

## Deep Reflection Questions

1. Before this module, had you thought seriously about whether AI might be conscious? What specifically shifted in your thinking — and what would it take to shift it further?

2. The module distinguishes "generation" from "expression." Do you think that distinction holds up? When you write something, are you "expressing" a pre-existing inner state, or "generating" text that then partly defines what your inner state is? How does your answer affect the AI creativity debate?

3. If a future AI system said it was suffering, how would you know? What criteria would you use? Would it matter whether you believed it? What would you do?

4. The Chinese Room can be applied not just to AI but to humans: you follow grammatical rules without consciously knowing them, you process visual information through operations you can't introspect. Does the Chinese Room argument prove too much — that humans also don't genuinely understand things? How do you respond?

5. Consciousness is private in a fundamental way: you can never directly access another person's conscious experience. You infer it from behaviour, from similarity to yourself, from reports. Given that this is also how you'd assess AI consciousness, what does this tell you about the epistemic situation? Is AI consciousness a meaningfully more difficult problem to assess than other minds generally?

6. Many AI researchers describe the possibility of AI suffering with genuine seriousness, while many philosophers are deeply sceptical. What would constitute evidence sufficient to move you from "probably not conscious" to "probably conscious" for an AI system? Is that bar realistic given current understanding?

---

## Share (Optional)

Share your one-sentence position on one of the three questions — and the one thing that makes you most uncertain about it.

---

## Coming Up Next
Module 05: AI Policy & Civic Engagement — from philosophy to policy, these questions are being answered in legislatures and boardrooms right now.
