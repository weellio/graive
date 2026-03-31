# Lesson Plan: Multimodal AI — Beyond Text
### Innovator Level (Ages 16–18) | Module 10

---

## Objective
By the end of this lesson, you'll understand the major modalities of AI (vision, audio, video), know the leading tools and their capabilities in each category, and be able to design multi-modal workflows for real-world use cases.

---

## What You'll Need
- AI tool (Claude with vision, or GPT-4o)
- Optional: access to Whisper (OpenAI speech), DALL-E, Suno, or Runway for experiments
- Notebook or Google Doc
- About 60–75 minutes

---

## Watch First
Watch **Module 10: Multimodal AI — Beyond Text** before starting.

Key insight: **The most powerful AI applications will combine modalities — text, image, audio, video — in workflows that mirror how humans actually perceive and communicate.**

---

## Key Concepts

### What Is Multimodal AI?

Early AI worked in a single modality — either text, or images, or audio. Modern AI models can work across modalities simultaneously:

- **Reading text and understanding images at the same time** (GPT-4o, Claude 3.5 Sonnet)
- **Generating images from text** (DALL-E, Midjourney, Stable Diffusion)
- **Converting speech to text** (Whisper)
- **Converting text to speech** (ElevenLabs, OpenAI TTS)
- **Generating video from text** (Sora, Runway, Pika)
- **Generating music from text** (Suno, Udio)
- **Analysing video content** (Gemini, emerging models)

> "A truly multimodal AI can see what you see, hear what you say, and respond in whatever medium is most useful — text, image, audio, or all three."

### Vision AI

**What it can do:**
- Describe images in natural language
- Answer questions about image content
- Read text in images (OCR)
- Identify objects, people, scenes, and activities
- Analyse charts, diagrams, and data visualisations
- Compare images and identify differences

**Practical applications:**
- Accessibility (describing images for visually impaired users)
- Document processing (reading handwritten forms, receipts, invoices)
- Quality control in manufacturing (detecting defects from photos)
- Medical imaging (detecting tumours, analysing scans — with human oversight)
- Security (surveillance, anomaly detection)

**Limitations:**
- Accuracy varies with image quality
- Can hallucinate details that aren't there
- Struggles with very complex or ambiguous scenes
- Privacy implications when used on photos of people

### Audio AI

**Speech to text (ASR — Automatic Speech Recognition):**
- Whisper (OpenAI) — highly accurate transcription in 90+ languages
- Real-time meeting transcription (Otter.ai, Teams, Zoom)

**Text to speech (TTS):**
- ElevenLabs — ultra-realistic voice cloning and synthesis
- OpenAI TTS — fast, good quality, multiple voices
- Google and Amazon TTS — widely used in products

**Voice understanding:**
- Beyond transcription — understanding tone, emotion, intent
- Emerging capability: identifying who is speaking and their emotional state

**Music generation:**
- Suno, Udio — generate full songs (vocals, instruments) from text descriptions
- Legal grey area: trained on copyrighted music

### Video AI

**Video generation:**
- Sora (OpenAI) — text to video, high quality but compute-intensive
- Runway Gen-2, Pika — accessible text-to-video tools
- Heygen, Synthesia — AI avatars that present your script

**Video analysis:**
- Extracting key frames and describing content
- Summarising long videos
- Transcribing and timestamping audio

---

## Try It — Multimodal Experiments

### Activity 1: Vision AI Test (15 mins)

If you have access to a vision-capable AI (Claude or GPT-4o):

**Experiment 1 — Image description:**
Upload or link to a complex image (a busy street scene, a chart, a handwritten note) and ask:
1. "Describe everything you see in this image in detail."
2. "What is the mood or atmosphere of this image?"
3. Ask a specific factual question about the image content

Rate the accuracy: ___/10
Most impressive thing it caught: ___
One error or hallucination: ___

**Experiment 2 — Document reading:**
Take a photo of a printed document, receipt, or handwritten note. Ask the AI to:
1. Transcribe the text exactly
2. Summarise the key information

Accuracy: ___/10
Use case this would be most valuable for: ___

---

### Activity 2: Audio AI Workflow Design (15 mins)

Design a complete workflow for one of these audio AI use cases:

**Option A:** An AI system that transcribes interview recordings and generates a structured summary

**Option B:** A podcast production assistant that generates show notes, chapter markers, and a social media clip from a full episode recording

**Option C:** A language learning tool that uses speech recognition to give pronunciation feedback

Chosen option: ___

**Workflow design:**

| Step | Input | AI Tool/Model | Output |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |

What's the key technical challenge in this workflow? ___
What human oversight is needed? ___
Estimated time saving vs manual process: ___

---

### Activity 3: Combining Modalities (20 mins)

The most powerful applications combine multiple modalities. Design a workflow that uses at least THREE modalities (text + one other minimum).

**Real-world use case to solve:**
Pick something genuinely useful — a problem in education, content creation, accessibility, business, science, or personal productivity.

My use case: ___

**Workflow design:**

Step 1 — Input modality: ___
What the AI does: ___
Output: ___

Step 2 — Modality: ___
What the AI does: ___
Output: ___

Step 3 — Modality: ___
What the AI does: ___
Output: ___

Step 4 (optional additional step): ___

**What makes combining modalities better than a text-only approach for this use case:** ___

**The key technical or ethical challenge:** ___

---

## The Deepfake Intersection

Multimodal AI — specifically voice cloning and video generation — is directly enabling deepfake technology. Every technology in this module can be misused:

- Voice cloning → fake audio of real people
- Video generation → fake video of real people
- Image generation → fake photos of events that never happened

As builders using these technologies, you have a responsibility to:
- Not build tools intended for deception or harassment
- Consider how your product could be misused before launching
- Understand the legal implications of voice/image cloning (many jurisdictions are passing specific laws)
- Add appropriate safeguards (e.g., watermarking AI-generated content)

Rate: How much do you think about the misuse potential of AI tools you build? ___/10

What one safeguard should every multimodal AI product include? ___

---

## Emerging Modalities

The frontier of multimodal AI is expanding rapidly:
- **3D generation** — AI generating 3D models from text or images
- **Code + UI generation** — AI generating functional interfaces from screenshots or descriptions
- **Scientific data** — AI analysing protein structures, molecular interactions, satellite imagery
- **Haptic/sensory** — early research into AI-mediated touch and smell

Which emerging modality excites you most for future applications?

My answer: ___
Why: ___
One realistic application in 5 years: ___

---

## Reflect

1. Which modality do you think is currently most underused by AI product builders? Where are the biggest unexplored opportunities?

2. Multimodal AI is moving toward AI that can perceive the world almost as humans do — seeing, hearing, reading simultaneously. What changes when AI can engage with the full richness of human communication?

3. What's the most important safeguard that should be standard in any product using voice cloning or realistic video generation?

---

## Challenge
**The Multimodal MVP:**

Design — and if possible, build a prototype of — an AI product that uses at least two modalities. Use no-code tools where possible.

Requirements:
- Clear, specific use case
- At least 2 modalities combined
- Tested with at least 1 real user
- A written reflection on what works, what doesn't, and what you'd add in v2

My product: ___
Modalities used: ___
User feedback: ___
What I'd change: ___

---

## Coming Up Next
Module 11: Leading in the Age of AI — from building to communicating, deciding, and deploying responsibly. What it means to lead with AI rather than just use it.
