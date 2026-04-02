# Lesson Plan: AI and Music
### Builder Level (Ages 12–13) | Module 09 — Expanded

---

## About This Lesson

Music is one of the most deeply human things there is. It encodes emotion, cultural identity, memory, and creativity in a way that is unique to our species — or at least, that has been unique to our species until very recently. AI music generation tools like Suno and Udio can now produce complete songs — with instruments, vocals, lyrics, and production — in under thirty seconds from a text description. The songs are often surprisingly compelling. And that fact raises questions that cut right to the heart of what creativity means and why it matters.

How does AI generate music? Not by "hearing" in any way you would recognise. AI music models are trained on enormous datasets of audio recordings and their associated metadata. The model learns statistical patterns: which frequencies tend to appear together, which rhythmic patterns characterise different genres, which chord progressions create certain emotional effects, which vocal styles correlate with which lyrical themes. When you write a prompt, the model generates audio that statistically fits the description — not because it has any feeling about music, but because it has seen enough examples to predict what fits.

The music industry is already experiencing the impact of this technology. Multiple major artists — including Drake (via an AI-generated impersonation), The Beatles (via AI audio restoration tools), and scores of lesser-known musicians — have found AI at the centre of controversies about copyright, consent, and creativity. Record labels are writing new contracts with AI clauses. Streaming platforms are developing policies for AI-generated music. Musicians are debating among themselves whether AI is a useful tool or an existential threat. These debates are happening right now, and they are not settled.

For you, this lesson is an opportunity to use AI as an actual creative tool — to experiment, to produce something, and to think carefully about what that experience means. The most interesting question is not "can AI make music?" (clearly it can, to some degree) but "what does it mean for music to be made this way?" Does it matter if a song that moves you was created by a pattern-predicting machine rather than a human being feeling something? Is that question even meaningful? You should form your own view.

The ownership question in this lesson is genuinely unresolved in law and ethics. There is no clear right answer. The goal is not to reach a verdict but to understand the competing interests clearly enough to reason about them — a skill that matters across many domains beyond music.

---

## Key Concepts

- **Audio diffusion model:** A type of AI model trained on audio data, learning the statistical patterns of sound, rhythm, and melody to generate new audio from text descriptions.
- **Genre:** A category of music defined by shared stylistic conventions — AI music generators work best with genres that have clear, learnable patterns (pop, lo-fi, EDM) and less well with genres requiring improvisation or expressiveness (jazz, blues).
- **Copyright:** The legal right of a creator to control use of their creative work — currently contested for AI-generated music because machines cannot hold copyright and the training data involved human artists who did not consent.
- **Training data consent:** The ethical question of whether AI music generators should be required to have permission from artists whose recordings were used as training data.
- **AI-assisted vs. AI-generated:** An important distinction — AI-assisted means a human used AI as one tool among many in a creative process; AI-generated means the AI produced the output with minimal human creative input beyond a prompt.
- **Streaming economics:** The financial model of music distribution, where rights owners (artists, labels) earn royalties when songs are played — currently being disrupted by the possibility of AI-generated music flooding platforms.

---

## How It Works

AI music generation works differently from AI text or image generation, but follows the same fundamental logic: learn patterns from training data, then generate new content that fits a given description.

Music models are trained on recordings encoded as spectrograms — visual representations of sound frequencies over time that allow the model to treat audio like image data. The model learns what different instruments look like as spectrograms, what different tempos look like, what different emotional qualities look like in frequency patterns.

When you write a prompt like "upbeat lo-fi hip-hop with piano and light rain sounds," the model encodes your text into a mathematical representation, then uses that to guide generation of a spectrogram that statistically fits the description. That spectrogram is then converted back into audio.

Modern tools also incorporate language model technology to generate coherent lyrics that match the mood and topic of the prompt, and separate components that handle vocal style and production quality. The result is a surprisingly coherent song — but one that was built bottom-up from learned patterns, with no emotional intent behind it.

This is why AI music sometimes has an uncanny quality: technically competent but somehow missing the sense of a person behind it. The patterns are there; the intention is not.

---

## What You'll Need
- A device with internet access
- A free AI tool (ChatGPT free or Claude free)
- Access to a free AI music tool — **Suno** (suno.com, free tier) or **Udio** (udio.com, free tier) — ask a parent to help create an account
- Headphones or speakers
- Paper and coloured pens OR a digital document
- About 50 minutes

---

## Watch First
Watch **Module 09: AI and Music** with a parent or on your own.

Remember: AI does not "hear" music the way you do. It processes music as patterns — rhythms, frequencies, chord progressions — and learns to predict what sounds "go together" based on enormous amounts of training data. It does not feel the emotion. You do.

---

## Real World Examples

**1. The AI-generated "Drake" song**
In April 2023, a song called "Heart on My Sleeve" was released by an anonymous creator using AI-generated voices imitating Drake and The Weeknd. It racked up millions of streams before being removed from platforms. Universal Music Group requested the takedown. This triggered an immediate industry-wide debate about AI voice cloning and copyright — and led directly to platforms updating their AI content policies. It was one of the first major viral moments demonstrating AI music's real-world impact.

**2. The Beatles' last song using AI**
In late 2023, The Beatles released "Now And Then" — framed as the last-ever Beatles song. It was completed using AI audio restoration technology (developed by Peter Jackson's team) to isolate John Lennon's voice from a lo-fi demo recording and make it usable in a finished production. This is an example of AI being used as a tool to serve human creative intent — an entirely different use case from fully AI-generated music, and one that most people found emotionally legitimate.

**3. Suno and the music industry lawsuit**
In 2024, major record labels including Sony, Universal, and Warner filed lawsuits against Suno and Udio, alleging that the companies trained their models on copyrighted recordings without permission. This is the music industry's version of the Getty Images vs. Stability AI lawsuit for images — and its outcome will likely shape the legal framework for AI music generation for years to come.

---

## Try It — From Pattern to Song

### Activity 1: How AI Hears Music (15 mins)

Before you make music with AI, let us understand what it is actually doing.

**Part A — The Pattern Game:**

Music is made of patterns. Here is a simple example:

A major chord contains three notes: the root, the third, and the fifth. Play (or imagine) these patterns:
- C major = C, E, G
- G major = G, B, D
- A minor = A, C, E

Many of the most famous pop songs use just four chords cycling around in different orders. AI music generators have learned that certain chord progressions feel "happy", "sad", "tense", or "resolved" by analysing millions of songs.

Open ChatGPT or Claude and ask:
> "I am 12 years old learning about music and AI. Can you explain in simple terms what a chord progression is and why the sequence I-IV-V-I (do-fa-sol-do) sounds so satisfying to human ears? Keep it under 150 words."

Read the response. Then ask:
> "Why does AI music generation work better for some genres (like pop, lo-fi, electronic) than others (like jazz improvisation or classical composition)? Explain simply."

Write down the key idea from each answer in your own words. The goal is to understand: AI is very good at patterns, but music that surprises you or breaks rules in unexpected ways is much harder for it.

**Part B — Genre Mapping:**

Make a quick list of 6 music genres you know (e.g. pop, hip-hop, rock, classical, country, jazz, EDM, lo-fi). For each one, predict:
- Would AI be good or bad at generating this genre? (Good / OK / Bad)
- Reason: (Pattern-heavy? Requires improvisation? Emotion-driven?)

---

### Activity 2: Make Something (20 mins)

Time to actually generate music. Open your AI music tool (Suno or Udio) and work through these three rounds.

**Round 1 — The Vague Prompt:**
Type a simple, vague prompt: "happy song"
Listen to what is generated. Describe it in 3 words.

**Round 2 — The Detailed Prompt:**
Now write a much more specific prompt. Include:
- Genre/style (e.g. "lo-fi hip-hop beat", "upbeat acoustic pop", "cinematic orchestral")
- Mood (e.g. "nostalgic and warm", "tense and urgent")
- Tempo or energy (e.g. "slow and dreamy", "fast and energetic")
- Any instruments (e.g. "piano and strings", "drum machine and synth bass")
- Optional: a theme or story (e.g. "sounds like arriving home after a long journey")

Example of a strong prompt:
> "Upbeat acoustic pop song with finger-picked guitar and light percussion. Warm and optimistic mood, like a sunny Saturday morning. Medium tempo. No lyrics."

Generate at least 2 variations with your detailed prompt.

**Round 3 — Your Own Creation:**
Design a prompt for a song that would be the perfect soundtrack to something in your life — your morning routine, a sports highlight reel, a study session, a moment with friends. Write the prompt, generate it, and listen.

For each round, write:
- The prompt you used
- Three words describing what you got
- Did it match what you imagined? What surprised you?

---

### Activity 3: The Ownership Question (10 mins)

This is one of the most genuinely unsettled questions in all of law and art right now. Read carefully and form your own opinion.

**The situation:** When an AI tool generates a song, multiple parties were involved:
1. The AI company — they built the tool
2. The musicians whose recordings were used as training data — without their permission in most cases
3. You — you wrote the prompt that guided the output

**Three different perspectives:**

**Perspective A — "It's mine!"**
"I spent time crafting the perfect prompt. I made creative decisions. The output would not exist without my input. I should own the copyright."

**Perspective B — "It belongs to no one."**
"A machine made it. Machines cannot hold copyright. Prompts are not creative acts in the traditional sense. AI music should be public domain — free for everyone."

**Perspective C — "The original artists deserve credit."**
"AI learned to make music by studying millions of human-made recordings. Those artists should be compensated or at least credited every time AI generates something in their style."

**Your task:** Write one paragraph (5–8 sentences) explaining which perspective you find most convincing — and why. You may combine elements of different perspectives if you think none of them are fully right on their own.

Then answer this additional question: If you posted your AI-generated song from Activity 2 on a music sharing platform and it became popular, should you be able to earn money from it? Who else (if anyone) should earn from it?

---

### Activity 4: The Turing Test for Music (10 mins) — NEW

This activity tests whether people can tell the difference between AI-generated and human-made music — and what that difference means.

Generate one song using the AI music tool (Round 3 from Activity 2 works well). Then find one piece of human-made music in the same genre (from Spotify, YouTube, or a music library).

Without labelling which is which, play a short clip of each to a family member, friend, or parent. Ask them:
- Which one do you prefer?
- Which one do you think was made by a human?
- Which one would you be more likely to listen to again?

Reveal which was AI-generated. Then ask: Does knowing which was AI-generated change their preference? Do they feel differently about the AI song now that they know?

Write down what they said and what you found interesting about their reaction. Does the origin of a piece of music change how you feel about it?

---

### Activity 5: Compose a "Brief" for Your Dream Song (10 mins) — NEW

Professional music producers work from "briefs" — detailed descriptions of what a client needs from a piece of music. A brief might specify the mood, instrumentation, tempo, target audience, where it will be used, and what feeling it should create.

Write a complete brief for a song you genuinely wish existed — something you would actually want to listen to. Your brief should include:

- **Genre and sub-genre:** (be specific — not just "rock" but "indie folk with a slightly psychedelic feel")
- **Tempo and energy:** (bpm range if you know it, or descriptive words)
- **Instrumentation:** (what instruments, played in what way)
- **Mood and emotional arc:** (what should it feel like at the start? the middle? the end?)
- **Lyrical theme:** (if it has vocals, what should the lyrics be about?)
- **Reference tracks:** (name 1–2 existing songs it should feel like, even if the style is different)
- **Where it will be used:** (background music? a running playlist? a film scene? a game?)

Now turn your brief into a prompt for the AI music tool and generate it. How well did the AI execute on your brief? What was missing? What surprised you?

---

## Design It!

Design a **band poster** for a fictional AI-assisted music project.

The rules:
- The "band" is you plus an AI music tool (you are the human creative director, the AI is your instrument)
- Give the project a name
- Choose a genre
- Design a simple poster with the project name, a fake "tour date" for a show in your city, and an image (drawn by hand or described if you are designing digitally)
- Write a 2-sentence "about" blurb for the project — as if it were appearing on a streaming profile

Think about: How would you describe to listeners that AI was involved? Would you tell them at all?

---

## Reflect
Answer these questions out loud or write them down:

1. After listening to your AI-generated music, did it feel like "real" music to you? What is the difference between AI-generated music and AI-assisted music (where a human uses AI as one tool among many)?
2. Many famous musicians are worried that AI will replace live musicians and session players who earn a living making music. Is this concern valid? What could be done about it?
3. You have now used AI for text, images, and music. Which felt most creative to you? Which felt most like the AI was doing the work rather than you?
4. If AI can generate music in the exact style of any living artist, is that different from a human musician being influenced by that artist? Where is the line between influence and imitation?
5. If a streaming platform paid out royalties for every song played, and AI-generated songs flooded the platform with thousands of new tracks per day, what would happen to the income of human musicians? Is that a problem that technology should solve, or a market problem?

---

## Share (Optional)
Play your best AI-generated song (from Round 3 of Activity 2) to someone without telling them it was AI-generated. Ask for their honest reaction. Then reveal how it was made. Did their reaction change? What does that tell you about music and the way we listen?

---

## Coming Up Next
Module 10: Debug Your Prompt — Even with a great library and strong skills, AI sometimes gives you confusing, wrong, or frustrating responses. Next lesson, you will learn a systematic debugging process to fix it every time.
