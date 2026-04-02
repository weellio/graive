# Lesson Plan: Teaching the Machine
### Explorer Level (Ages 10–11) | Module 08

---

## About This Lesson

Imagine you want to teach a very young child what a cat looks like, without using any words. You just show them cats. You show them fluffy cats and tiny cats and old cats and kittens and black cats and orange cats — until eventually, the child sees any cat and says "cat!" without being told. They have learned from examples. They have built an internal model of what "cat" means from all the different versions they have seen. This is essentially how AI learns, and it is called machine learning.

The key difference between AI learning and human learning is scale. You might show a child a hundred cats before they reliably know what a cat is. An AI image recognition system might be shown ten million labelled photos before it can confidently identify a cat in a photograph it has never seen before. This is both AI's greatest strength — it can process examples at a scale no human could match — and one of its biggest weaknesses — it depends entirely on the quality of those examples.

The people who label training data — the human workers who go through millions of images, sentences, and sounds and tag them with the correct information — have one of the most important and least-talked-about jobs in the technology industry. If those labels are accurate and diverse, the AI learns well. If the labels contain mistakes, if they reflect the biases of the people who made them, or if they leave out large groups of people or types of experience, the AI inherits those flaws. And those flaws then affect every person who uses the AI, often without anyone realising.

This is one of the most important ideas in all of AI literacy: AI does not think independently — it is shaped by the humans who built it and the data they chose. When an AI makes a biased or unfair decision, it is almost always because biased or incomplete training data was baked in at the beginning. Understanding this does not mean AI is bad — it means the people who build and use AI have a responsibility to think carefully about what they feed it.

---

## Key Concepts

- **Machine learning:** A method of training AI by showing it many labelled examples until it can identify patterns and make predictions on new data.
- **Training data:** The collection of examples — images, text, sounds, or other information — that an AI system learns from.
- **Data labelling:** The human process of tagging training examples with correct information (e.g. marking a photo as "cat" or a sentence as "kind").
- **Bias in AI:** When an AI system produces unfair or skewed results because its training data over-represented some groups or viewpoints and under-represented others.
- **Ambiguous label:** A training example that could reasonably fit more than one category — a real challenge for data labellers.

---

## Fun Facts

- The ImageNet database, which helped train many of today's image-recognition AIs, contains over 14 million labelled images that were sorted by human volunteers — that is more images than most professional photographers take in a lifetime.
- In 2015, a major technology company's AI photo app labelled photos of Black people with deeply offensive tags — a consequence of training data that was not diverse enough. The company had to apologise and fix the system urgently.
- Data labelling is a massive global industry — millions of workers around the world are paid to label AI training data, often doing very repetitive tasks like marking which part of an image shows a road or confirming whether a short piece of text expresses a positive or negative emotion.

---

## What You'll Need
- A device with internet access
- A free AI tool (ChatGPT free or Claude free)
- Paper and coloured pens OR a digital document
- A friend, sibling, or parent to play one of the activities with (optional but fun)
- About 45–50 minutes

---

## Watch First
Watch **Module 08: Teaching the Machine** with a parent or on your own.

Remember: AI does not come pre-loaded with knowledge — it learns by looking at millions of examples. You, right now, are smarter than any AI when it comes to things it has never been taught.

---

## Try It — You Are the Teacher

### Activity 1: Teach a Human to Think Like a Machine (10 mins)

Before we teach a machine, let us understand what teaching from examples actually feels like.

This works best with a partner (a friend, sibling, or parent), but you can do it solo with your imagination too.

**The game:** You are going to teach your partner to sort things into two groups — but you cannot use words to explain the rule. You can only show them examples.

1. Pick a secret rule from this list (or make up your own):
   - Things that are alive vs. things that are not alive
   - Things that can get wet vs. things that should not get wet
   - Things you find inside vs. things you find outside
   - Things that make sound vs. things that are silent

2. Write down 10 examples, split into Group A and Group B based on your secret rule. For example, if your rule is "alive vs. not alive":
   - Group A: dog, tree, mushroom, fish, yourself
   - Group B: rock, spoon, cloud, car, pencil

3. Show your partner only the two lists. No explanation. Ask them: "What is the rule?"

4. Reveal the answer. Did they get it?

**Now think:** This is almost exactly how AI learns. It sees thousands of examples split into groups (called labels) and figures out the pattern. But what if some of your examples were wrong? What if you put "mushroom" in the wrong group by accident? That is called **bad training data** — and it causes real problems.

Write down: What would happen to an AI that learned from a list where three things were in the wrong group?

---

### Activity 2: Feed the Machine Good Examples and Bad Examples (10 mins)

Now let us see training data in action using a real AI tool.

Open ChatGPT or Claude and try this experiment:

**Round 1 — Good training examples:**

Type this prompt:
> "I am going to give you some examples of sentences and whether they are 'kind' or 'unkind'. Learn from my examples, then tell me which category a new sentence belongs to.
>
> Kind: 'You did a great job on that drawing.'
> Kind: 'I saved you a seat at lunch.'
> Unkind: 'Your idea is stupid.'
> Unkind: 'Nobody wants to sit next to you.'
>
> Now, is this sentence kind or unkind: 'I noticed you seemed sad — are you okay?'"

Write down what the AI says.

**Round 2 — Confusing training examples:**

Now try this prompt:
> "I am going to give you some examples of sentences and whether they are 'kind' or 'unkind'. Learn from my examples, then tell me which category a new sentence belongs to.
>
> Kind: 'Your idea is stupid.'
> Kind: 'Nobody wants to sit next to you.'
> Unkind: 'You did a great job on that drawing.'
> Unkind: 'I saved you a seat at lunch.'
>
> Now, is this sentence kind or unkind: 'I noticed you seemed sad — are you okay?'"

Write down what the AI says. Was it different?

**Discuss:** You just gave the AI deliberately wrong labels — the opposite of the truth. This shows why the people who label training data have an enormous responsibility. If they make mistakes (or if they have biases), those mistakes get baked into the AI forever.

---

### Activity 3: Design Your Own Training Dataset (10 mins)

You are now a data labeller at an AI company. Your job is to create training data for an AI that will help a school library recommend books.

Your task: Create a list of 10 book descriptions, each labelled with one of these categories:
- **Adventure**
- **Mystery**
- **Funny**
- **Scary**

Rules:
- Each description should be 1–2 sentences
- You must include at least 2 books in each category
- The descriptions cannot use the category name (so a "Funny" book description cannot say "hilarious" or "comedy")

Example:
> "A girl discovers a secret door in her grandmother's attic that leads to a land where it is always raining upwards." — **Adventure**

Once you have your 10 examples, look at them and ask: Could any of these fit in more than one category? For instance, could a book be both Scary and Mystery?

This is called an **ambiguous label** — and it is a real challenge for the people who build training datasets. Real life does not always fit neatly into boxes, and neither do books, images, or sentences.

---

### Activity 4: Spot the Missing Data (10 mins)

This activity helps you understand why the diversity of training data matters.

Imagine you are building an AI that can recognise human emotions from facial expressions. You collect 1,000 photographs of people looking happy, sad, angry, or surprised.

But then you realise: all 1,000 photographs are of people from the same country, all roughly the same age, and all photographed in good lighting.

Answer these questions:
1. What types of people are completely missing from this training data?
2. How might the AI perform when it encounters a face that looks very different from what it was trained on?
3. Can you think of a real-world situation where an AI with this kind of gap in its training data might cause real harm?

Then ask an AI tool: "Can you give me one real example where AI got something wrong because of biased or incomplete training data? Keep it simple for an 11-year-old."

Write a short summary of what you find. Does the example help you understand why training data diversity matters?

---

## Draw It!

Draw a simple diagram showing the journey of training data. Include these steps:

1. Someone collects examples (show this as a big pile of things — photos, sentences, recordings)
2. A human labels each example (show a person with a stamp or sticker)
3. The labelled examples are fed to the AI (show the AI "eating" the examples)
4. The AI learns a pattern (show the pattern as a lightbulb or a brain)
5. The AI uses the pattern to answer new questions (show someone asking a question and getting an answer)

Label each step. Add a second version of the diagram where something goes wrong at step 2 (bad labels). Show how the mistake travels all the way to step 5.

---

## Reflect
Answer these questions out loud or write them down:

1. If AI learns from human-made examples, does that mean AI can inherit human mistakes and human biases? Give an example of how that might happen.
2. You created a training dataset in Activity 3. Was it hard to label everything clearly? What made it tricky?
3. Imagine an AI that was only trained on books written in English by British authors. What kinds of stories might it know nothing about?
4. After the Missing Data activity, do you think the people who design training datasets have a responsibility to make sure they include everyone? What would make that hard to do in practice?
5. If you were going to build an AI that recommends music to young people, what types of music and what types of people would you make sure to include in your training data?

---

## Level Up Challenge

Design a "bias audit" for a fictional AI system.

Imagine an AI has been built to help teachers decide which students should be recommended for advanced maths classes. The AI was trained on historical school records from the last 20 years.

Your task: Write a list of at least five questions a responsible person should ask before trusting this AI's recommendations. Think about:
- Who might be unfairly affected if the historical data reflects old biases
- What important information the AI might be missing about a student
- Whether the patterns of the past are the right patterns to use for decisions about the future
- Who should have the final say — the AI, or a human teacher?

Present your audit questions as a numbered list, with one sentence of explanation for each question.

This is a real type of work that AI ethics researchers and policy makers do. You have just designed an AI ethics framework.

---

## Share (Optional)
Play the "teach a human" game from Activity 1 with someone at home. See if they can figure out your secret rule from your examples alone. Afterwards, explain: "This is how AI actually learns. It gets shown examples until it figures out the pattern."

---

## Coming Up Next
Module 09: Remix and Improve — You have given AI instructions. Now you will learn how to take a bad answer and make it better, step by step, using the power of iteration.
