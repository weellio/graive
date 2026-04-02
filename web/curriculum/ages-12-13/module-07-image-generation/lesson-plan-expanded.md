# Lesson Plan: AI Image Generation
### Builder Level (Ages 12–13) | Module 07 — Expanded

---

## About This Lesson

Not very long ago, creating a photorealistic digital image required either a professional camera and hours of editing, or years of training in digital art and illustration. Today, anyone with a free account and a reasonably descriptive sentence can generate a highly detailed, stylistically sophisticated image in under ten seconds. This is one of the most dramatic capability shifts in creative technology in decades, and it is still accelerating.

AI image generation works differently from text generation, but the underlying principle is similar: pattern learning from enormous datasets. The models that power tools like Adobe Firefly, Midjourney, and DALL-E were trained on billions of image-text pairs — an image alongside a caption or alt text describing it. Over time, the model learned statistical relationships between words and visual patterns: what "golden hour light" looks like, what "watercolour style" looks like, what "angry expression" looks like. When you write a prompt, the model uses those learned associations to generate new pixel arrangements that match the description.

This technology is changing creative industries in real time. Stock photo agencies have seen dramatic drops in sales. Graphic designers are being asked to use AI for first drafts. Advertising agencies are using AI to generate dozens of campaign variations overnight. On the other side, artists, illustrators, and photographers are fighting back through lawsuits, advocacy, and experiments with watermarking and opt-out registries. These are live, unresolved debates happening right now in courts, in company boardrooms, and in the creative community.

For your generation, understanding this technology is important on two levels. Practically: you are growing up in a world where knowing how to write effective image prompts — like knowing how to write effective text prompts — is a genuine skill that has professional and creative value. Critically: you are also growing up in a world where the provenance of any image you encounter is uncertain. Developing the habit of questioning whether an image is real, generated, or manipulated is now as important a media literacy skill as reading carefully.

This lesson gives you both. You will learn the anatomy of an effective image prompt, experiment with one of the most powerful creative levers available (artistic style), and engage seriously with the ethical questions that do not have easy answers.

---

## Key Concepts

- **Diffusion model:** The type of AI model most commonly used for image generation — it works by starting from random noise and gradually refining it into an image that matches the text description.
- **Prompt anatomy:** The structured layers of an image prompt — subject, action, setting, mood, lighting, style, composition, and colour palette — each of which controls a different aspect of the output.
- **Style transfer:** The technique of applying the visual characteristics of one artistic style to a different subject or scene.
- **Training data consent:** The ethical question of whether AI image generators can ethically use human artists' work as training data without permission or compensation.
- **Deepfake image:** An AI-generated image that realistically depicts a real person in a situation that never happened, often indistinguishable from a real photograph.
- **Watermarking (C2PA):** An emerging technical standard for embedding invisible metadata in AI-generated images so that their origin can be verified — part of an effort to restore provenance to digital imagery.

---

## How It Works

The dominant technology behind AI image generation today is called a **diffusion model**. Here is a simplified version of how it works:

During training, the model is shown millions of real images and learns what those images look like at different levels of "noisiness" — from the original clear image all the way to pure random noise, with many steps in between. It learns to reverse this process: given a noisy image, what does the slightly less noisy version look like?

At generation time, the model starts with pure random noise — essentially static. The text prompt you wrote is encoded into a mathematical representation and used to guide the denoising process at every step. Each step asks: given this noisy image and this text description, what should the slightly clearer version look like? After dozens or hundreds of steps, a coherent image emerges that matches the statistical patterns the model associates with your prompt.

This is why image generation can sometimes produce strange errors — extra fingers, impossible reflections, weirdly merged objects — in areas where the model's training data was inconsistent or sparse. The model is making statistically likely predictions about pixel arrangements, not reasoning about what fingers actually look like.

---

## What You'll Need
- A device with internet access
- Access to a free AI image tool — Adobe Firefly (free), Canva AI (free tier), or Microsoft Designer (free with a Microsoft account)
- A free text AI tool (ChatGPT free or Claude free)
- Paper and coloured pens OR a digital document
- About 50 minutes

---

## Watch First
Watch **Module 07: AI Image Generation** with a parent or on your own.

Remember: AI image generators do not search for existing images — they generate new ones from scratch by learning what millions of images look like and reconstructing them based on your text description. Every image is unique.

---

## Real World Examples

**1. The viral AI Pope Francis image**
In March 2023, an AI-generated image of Pope Francis wearing a designer white puffer jacket spread widely on social media. Many people initially believed it was a real photograph. It was generated with Midjourney. This image became a landmark moment in AI image history — the first widely viral AI image to be broadly mistaken for a real photo. It demonstrated that AI image quality had reached a threshold where casual viewers could no longer reliably distinguish AI from photography.

**2. Getty Images vs. Stability AI**
Getty Images filed a lawsuit against Stability AI (the company behind Stable Diffusion) in 2023, alleging that the company scraped millions of Getty's watermarked photos to train their model without permission or payment. This lawsuit is one of the most significant ongoing legal battles in AI, and its outcome will likely determine how future AI image generators can legally acquire training data. It is a direct example of the training data consent issue in court.

**3. The Hollywood writers' strike and AI imagery**
During the 2023 Hollywood strikes, writers and actors (SAG-AFTRA and WGA) included protections against AI in their demands — including restrictions on using AI to generate images of actors' likenesses. This led to new contract language about AI in entertainment, setting precedents for how the industry deals with AI-generated visual media. It shows that these ethical questions have moved from theoretical debates to real negotiating tables.

---

## Try It — Prompt the Picture

### Activity 1: Understand the Anatomy of an Image Prompt (15 mins)

A great image prompt is made up of several layers. Understanding each layer means you can control what you get.

Here is the anatomy of a strong image prompt:

| Layer | What it controls | Example |
|-------|-----------------|---------|
| **Subject** | What is in the image | a young astronaut |
| **Action/Pose** | What they are doing | sitting on a moon rock |
| **Setting** | Where it is happening | on the surface of Mars |
| **Mood/Atmosphere** | The feeling of the image | lonely but peaceful |
| **Lighting** | How it is lit | golden hour sunlight, long shadows |
| **Style** | The artistic style | digital painting, watercolour, photorealistic |
| **Composition** | Where things are placed | wide-angle shot, low perspective |
| **Colour palette** | The dominant colours | muted blues and oranges |

**Practice run:**

Start with a basic prompt and build it up layer by layer.

**Prompt 1 (subject only):** "a dog"
Generate this image (or imagine what you would get) — it will be very generic.

**Prompt 2 (add action and setting):** "a golden retriever sitting in an autumn forest"

**Prompt 3 (add mood and lighting):** "a golden retriever sitting in an autumn forest, late afternoon light filtering through the trees, warm and peaceful mood"

**Prompt 4 (add style and composition):** "a golden retriever sitting in an autumn forest, late afternoon light filtering through the trees, warm and peaceful mood, painted in the style of a children's book illustration, close-up shot with the dog looking directly at the viewer"

Generate all four (if you have access to an image tool) or compare the descriptions side by side and predict what each would look like.

Write down: Which layer made the biggest difference to the image? Which layer is hardest to describe in words?

---

### Activity 2: Style Exploration — Same Subject, Five Styles (15 mins)

One of the most powerful things you can do with AI image prompts is change the style while keeping everything else the same. This lets you explore how artistic style completely transforms the feel of an image.

Choose a simple subject. Here are some options:
- A cat sitting on a windowsill
- A child reading a book under a tree
- A lighthouse in a storm
- A bowl of fruit on a kitchen table

Now generate (or write) the same subject in five different styles:

1. **Photorealistic:** "...shot on a DSLR camera, sharp focus, natural lighting"
2. **Watercolour painting:** "...soft watercolour illustration, loose brushstrokes, pastel tones"
3. **Anime / manga:** "...anime style, vibrant colours, expressive eyes, Japanese animation"
4. **Oil painting, Renaissance style:** "...oil on canvas, Renaissance style, dramatic chiaroscuro lighting"
5. **Pixel art:** "...16-bit pixel art, retro video game style"

For each style, note:
- What emotions does it evoke?
- What kind of audience might this style appeal to?
- Where would you expect to see this style used (book cover, game, poster, news article)?

Write a short paragraph comparing your favourite and least favourite result. Explain your aesthetic choices.

---

### Activity 3: The Ethics Round Table (15 mins)

AI image generation raises some real and unresolved questions. Let us think through them carefully.

Read each scenario below and write your honest response to the question that follows. There is no single right answer — the goal is to think clearly.

**Scenario 1 — The Training Data Question:**
AI image generators were trained on billions of images collected from the internet — many of which were created by human artists who did not consent to their work being used to train an AI. Now the AI can generate images "in the style of" those artists without paying them or crediting them.

Question: Is this fair to the original artists? What would a fair system look like?

**Scenario 2 — The Fake Photo:**
Someone uses an AI image generator to create a realistic-looking photo of a famous person doing something embarrassing. They post it online without labelling it as AI-generated. Thousands of people see it and believe it is real.

Question: Is generating the image wrong, or only posting it without a label? What rules should exist?

**Scenario 3 — The School Art Project:**
A student uses AI to generate an image for their school art project without telling their teacher. The teacher praises the "creative work."

Question: Is this cheating? Does the answer change depending on what the assignment was — "make something beautiful" vs "demonstrate your drawing skills"?

**Scenario 4 — The Professional Artist:**
A graphic designer who has spent 10 years learning their craft finds that clients now ask for AI-generated images instead of hiring them, because AI is faster and cheaper.

Question: Is this a problem? Who (if anyone) is responsible — the clients, the AI companies, the technology, society?

After writing your responses, pick the scenario you feel most strongly about and summarise your position in 2–3 sentences.

---

### Activity 4: Negative Prompting — Control Through Exclusion (10 mins) — NEW

Many AI image tools support "negative prompts" — instructions about what you do NOT want to appear in the image. This is a powerful but often overlooked technique.

Choose one of the images you generated earlier (or pick a new subject). Generate it twice:
- **Version A:** Your standard prompt, no negative prompt.
- **Version B:** The same prompt, plus a negative prompt section where you exclude 3–5 things you do not want (e.g., "no text, no watermarks, no cartoon style, no dark lighting, no blurry backgrounds").

Compare the two results. Write down:
1. What changed between Version A and Version B?
2. Were there unwanted elements in Version A that the negative prompt successfully removed?
3. Did the negative prompt accidentally change anything you wanted to keep?

This exercise teaches you that in prompt engineering — for both text and images — what you tell the AI NOT to do is just as important as what you tell it to do.

---

### Activity 5: Reverse-Engineer a Real Image (10 mins) — NEW

Find a visually interesting image online — an advertisement, a film still, a book cover, or a piece of art. Study it carefully.

Now try to write the AI image prompt that could have produced it. Use the anatomy layers from Activity 1 as your guide:
- What is the subject and action?
- What is the setting and lighting?
- What mood does it have?
- What style does it appear to be?
- What is the composition and colour palette?

Write out the full prompt. Then, if you have access to an image tool, generate it and compare the result to the original.

Reflection:
- How close did your generated version get?
- What was hardest to capture in words?
- What does this tell you about the gap between visual language and text language?

---

## Design It!

Design a **movie poster** using an AI image prompt — but you are going to plan the whole thing before generating a single image.

On paper or digitally, sketch a rough layout of your poster. Decide:
- What is the film about? (Genre, title, main character)
- What should the image show?
- What style, mood, and lighting?
- Where should the title text appear?
- What colour palette fits the story?

Write the full image prompt you would use to generate the main poster image. Aim for at least 5 of the 8 anatomy layers from Activity 1.

If you have access to an image tool, generate it. If not, describe what you expect it to look like.

Label your design: **"My AI Movie Poster Plan"**

---

## Reflect
Answer these questions out loud or write them down:

1. How is prompting for images different from prompting for text? What skills transfer across, and what is unique to image prompting?
2. After the ethics discussion in Activity 3, has your view on AI-generated art changed at all? Do you think AI images are "real" art?
3. If you were advising a company building an AI image generator, what one rule would you make them follow to make the technology fairer?
4. If you cannot reliably tell whether an image is AI-generated or real, does that change how you will respond to images in news stories, social media, or advertising?
5. Is there a kind of image that AI should never be allowed to generate, regardless of the prompt? Where would you draw the line and why?

---

## Share (Optional)
Show someone your five-style comparison from Activity 2. Ask them to pick their favourite style without knowing the prompt. Then reveal that they were all generated from the same description — just with different style tags added. Discuss: Why does style matter so much to how we feel about an image?

---

## Coming Up Next
Module 08: The Prompt Library — You have been writing prompts for weeks. It is time to get organised. You are going to build your own personal reusable prompt collection — a library you can actually use for school, hobbies, and creative projects.
