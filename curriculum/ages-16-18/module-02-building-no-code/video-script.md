# Video Script: Building with AI (No-Code)
### Innovator Level (Ages 16–18) | Module 02 | ~12 minutes

---

## HOOK (0:00–0:45)

**[HOST on camera]**

"The most powerful AI applications aren't the ones where you type a prompt and get an output. They're the ones where AI does useful work *while you're sleeping.*

Today I'm going to show you how to build AI automations — workflows where AI processes information, generates outputs, and takes actions automatically. No coding required.

By the end of this video, you'll have the knowledge to build your first real AI-powered workflow. Let's go."

**[TITLE CARD: "Building with AI (No-Code)"]**

---

## THE LANDSCAPE: WHAT TOOLS EXIST (0:45–3:00)

**[HOST, diagram of tool categories]**

"There are a few categories of tools worth knowing:

**Automation platforms** — these connect apps together and let you build workflows:
- **n8n** (free and open-source, very powerful) — recommended for learners who want full control
- **Make (formerly Integromat)** — user-friendly, visual
- **Zapier** — easiest to start, more limited on the free tier

**AI-native tools:**
- **Claude API / OpenAI API** — raw programmatic access to AI models. You send a prompt, you get a response, you do something with it. Even if you don't know how to code, understanding this is valuable.
- **Notion AI, Gamma, etc.** — AI built into specific productivity tools

**The core concept** across all of these: **triggers, actions, and conditions.**
- A **trigger** is what starts the workflow (a new email, a scheduled time, a form submission, a new file)
- **Actions** are what happens (send a message, write to a spreadsheet, call an AI, post to a platform)
- **Conditions** are if/then logic (if the email contains X, do Y; otherwise do Z)"

---

## ANATOMY OF AN AI WORKFLOW (3:00–5:00)

**[HOST, diagram]**

"Almost every useful AI automation follows this pattern:

```
TRIGGER → COLLECT DATA → SEND TO AI → PROCESS OUTPUT → TAKE ACTION
```

Example 1: Daily news summary
- Trigger: every morning at 7am
- Collect: pull top headlines from an RSS feed
- Send to AI: 'Summarise these headlines for someone interested in technology and business. Be concise. Flag anything unusually important.'
- Process output: format the summary
- Action: send to email or Telegram

Example 2: Content research assistant
- Trigger: I paste a URL into a specific folder
- Collect: extract the article text
- Send to AI: 'Extract key insights, quotes, and ideas from this article. Tag it with relevant topics.'
- Process output: formatted notes
- Action: add to Notion database

Example 3: Feedback analyser
- Trigger: new form submission
- Collect: the feedback text
- Send to AI: 'Analyse this feedback. Identify: sentiment, specific issue mentioned, priority level (high/medium/low), suggested action.'
- Process output: structured data
- Action: add to tracking spreadsheet, send alert if high priority

**[Walk through each one briefly with visuals]**"

---

## LIVE DEMO: BUILD SOMETHING SIMPLE (5:00–9:30)

**[HOST, screen share — building a real simple workflow live]**

"Let me build something live. I'm going to build a simple news summariser.

**[Using n8n or Make — whatever is most accessible]**

Step 1: Set the trigger — scheduled, every morning

Step 2: HTTP request to a public news API or RSS feed

Step 3: Connect to an AI node (OpenAI or Claude)
- Input: the headlines/articles
- System prompt: 'You are a concise news analyst. Given these headlines, write a 150-word briefing focused on technology and business news. Highlight anything that seems unusually significant.'

Step 4: Send the output to email (using a simple SMTP node) or Telegram

**[Walk through the actual configuration — show it's not as complicated as it looks]**

This took about 15 minutes to build. Once it's running, it sends me a summary every morning without me touching it.

**The question isn't 'is this impressive?' The question is: what would be useful for you?** That's always the starting point for good automation design."

---

## THE API — DEMYSTIFIED (9:30–11:00)

**[HOST]**

"One concept worth understanding even if you don't code: APIs.

API stands for Application Programming Interface. It's basically a way for one application to talk to another. When your automation tool sends something to Claude or GPT, it's using an API.

Here's the key thing: **the API is just a function call.** You send: a system prompt (instructions), a user message (the specific request), and some settings (how creative, how long, etc.). You get back: text.

That's it. Every AI product you use — the chat interfaces, the embedded tools, the automations — they all use this same basic mechanism.

Understanding this means: you're not locked into specific products. If you understand how the API works conceptually, you can use any AI model in any tool, or eventually build your own tools.

If you do know some basic coding — or want to learn — Python + the Anthropic or OpenAI SDK is genuinely one of the most immediately powerful things you can do. You can call AI from your own scripts in minutes."

---

## CHALLENGE (11:00–11:30)

**[HOST]**

"Build something. Anything. One automation that would genuinely save you time or give you something useful.

Ideas:
- Daily briefing on a topic you care about
- Automatic meeting notes summariser (paste notes, get a structured summary)
- Reading list tracker (paste articles, get tagged summaries added to a doc)
- A study tool that quizzes you from notes you paste in

Pick something small enough to build in an hour. The point is to do it, not to build the perfect thing."

---

## RECAP + TEASE (11:30–12:00)

**[HOST]**

"Triggers, actions, conditions. The pattern: collect data → send to AI → process output → take action. APIs are just function calls. Build something.

Next: how do people actually make money in this new landscape — and what does that mean for you?"

---

**[END]**
