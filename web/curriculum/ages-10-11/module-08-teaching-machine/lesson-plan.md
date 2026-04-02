# Lesson Plan: Teaching the Machine
### Explorer Level (Ages 10–11) | Module 08

---

## Objective
By the end of this lesson, you can explain how AI learns from examples (training data), why the quality of those examples matters, and what happens when an AI is taught using bad or unfair data.

---

## What You'll Need
- A device with internet access
- A free AI tool (ChatGPT free or Claude free)
- Paper and coloured pens OR a digital document
- A friend, sibling, or parent to play one of the activities with (optional but fun)
- About 30 minutes

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

---

## Share (Optional)
Play the "teach a human" game from Activity 1 with someone at home. See if they can figure out your secret rule from your examples alone. Afterwards, explain: "This is how AI actually learns. It gets shown examples until it figures out the pattern."

---

## Coming Up Next
Module 09: Remix and Improve — You have given AI instructions. Now you will learn how to take a bad answer and make it better, step by step, using the power of iteration.
