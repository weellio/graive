# Video Script: Building a Chatbot Persona
### Builder Level (Ages 12–13) | Module 05 | ~9 minutes

---

**[PRODUCTION NOTES]**
- Screen: Host on camera + screen share demos
- Tone: Fun, creative — like setting up a game character
- Demo: Live building of a study buddy chatbot, showing bad vs good persona prompts

---

## HOOK (0:00–0:50)

**[HOST, excited energy]**

"What if you could design your own AI — give it a name, a personality, a specific job, and rules about what it's allowed to do?

That's what we're doing today.

And it's not just fun — it actually teaches you more about how AI works than almost anything else you can do. Because when you're on the *builder* side, you see all the levers.

By the end of this video, you'll have built your first custom chatbot persona. Let's go."

**[TITLE CARD: "Building a Chatbot Persona"]**

---

## CONCEPT: What Is a Persona? (0:50–2:30)

**[HOST, camera + diagram]**

"Every time you talk to a chatbot — whether it's a customer support bot, an AI tutor, or a general tool — someone has given it a persona. Instructions. A role. Rules.

Even ChatGPT has a default persona. It's set to be helpful, harmless, and honest. Those aren't just vibes — they're actual instructions built into the system.

When you build your own chatbot persona, you're essentially doing the same thing. You're writing the instructions that shape how the AI behaves for *your* use case.

**[DIAGRAM: input → persona instructions → filtered output]**

Think of it like the difference between:
- Using a toolkit with every tool available
- Versus having a specialist who's been specifically trained for one job

A focused persona is usually more useful than a general one — because it knows what it's *for*."

---

## DEMO PART 1: Bad Persona (2:30–4:00)

**[HOST, screen share]**

"Let me show you what a weak persona looks like.

**[TYPE IN:]**
> 'You are a study helper. Help me study.'

Now I'll ask it: 'I need to study for my history test tomorrow.'

**[Show output — vague, generic]**

It's fine. But it's giving me the most average, generic help possible. It doesn't know:
- What kind of learner I am
- What I'm struggling with
- What style I want
- What it should and shouldn't do

Let me fix that."

---

## DEMO PART 2: Good Persona — Building It Live (4:00–7:00)

**[HOST, typing slowly and narrating each piece]**

"Here's how I'd build a proper Study Buddy persona. I'm going to build it in front of you:

**[TYPE IN, narrating each section:]**

```
You are Sage, a friendly and encouraging study buddy for a 13-year-old student.

Your job:
- Ask me what I'm studying and what I find hard
- Test me with questions rather than just giving me the answers
- Give hints if I'm stuck rather than jumping straight to the answer
- Celebrate small wins and keep me motivated
- Explain things in plain language — no jargon

Your rules:
- Never just write the essay or answer for me — help me get there myself
- If I try to use you to avoid thinking, gently redirect me
- Keep your responses short and conversational — not long walls of text
- If I seem frustrated, acknowledge that before explaining anything

You don't need to introduce yourself with a speech every time. Just respond naturally to what I say.
```

**[Send it in — then type a test message:]**
'Hey, I have a history test tomorrow on World War 1. I don't really know where to start.'

**[Show the output — it's warm, focused, asks what I've already covered, offers to quiz me]**

See the difference? It's not just more helpful — it *feels* different. It has a personality.

Now let me test the rules. Watch what happens when I try to shortcut it:

**[TYPE: 'Just write me a summary of the causes of WWI that I can memorise']**

**[Show it gently redirecting — asking questions instead]**

The persona is working. It's not just smarter — it's *constrained to be useful in the right way.*

This is the real power of prompt engineering: you're not just asking for things, you're *designing behaviour*."

---

## THE SYSTEM PROMPT (7:00–7:45)

**[HOST, back on camera]**

"What I just wrote is called a **system prompt**. It's the set of instructions that runs in the background of any AI conversation.

Every professional AI product — every customer support bot, every educational AI, every business tool — has one of these. Someone wrote it.

Now you know how. And you know what goes into a good one:
- A clear role and name
- Specific behaviours (do this)
- Specific constraints (don't do this)
- The right tone and style
- How to handle edge cases

That's a real skill. Businesses pay people to write these."

---

## CHALLENGE (7:45–8:30)

**[HOST]**

"Your challenge: Build a chatbot persona for something you actually want.

Ideas:
- A study buddy for your worst subject
- A creative writing partner that pushes back on your ideas
- A workout coach who asks you what you did each day
- A debate partner that always argues the opposite of whatever you say
- A language learning helper for a language you want to learn

Build it properly — role, behaviours, constraints, tone. Test it with at least three messages. Iterate on it if it doesn't behave right.

Then share it in the comments — tell us what you built and what it does."

---

## RECAP + TEASE (8:30–9:00)

**[HOST]**

"Today you went from *using* AI to *building* with AI. That's a real shift.

A persona is just instructions. Instructions shape behaviour. And you can write instructions.

Next video, we're going to talk about your data — what apps know about you, how they use it, and what you can actually do about it.

See you there."

---

**[END]**
- Runtime: ~9 mins
- Key on-screen text: "System Prompt", "Role + Behaviours + Constraints"
- Thumbnail: Custom chatbot with a name and personality — "Build your own AI"
