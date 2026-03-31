# Lesson Plan: Building AI Agents
### Creator Level (Ages 18+) | Module 03

---

## Objective
By the end of this lesson, you'll understand what AI agents are, how tool use enables agents to act in the world, how memory and planning loops work, and how to build a functional agent using the Claude Agent SDK or equivalent.

---

## What You'll Need
- Python 3.9+ with Anthropic SDK installed (`pip install anthropic`)
- API key (Anthropic strongly recommended for this module; Claude has excellent tool use)
- Code editor
- About 90–120 minutes

---

## Watch First
Watch **Module 03: Building AI Agents** before starting.

Paradigm shift: **An LLM that only generates text is a tool. An LLM that can call functions, use the web, read files, and take actions — and can plan sequences of steps to accomplish a goal — is an agent.**

---

## Key Concepts

### What Is an AI Agent?

An AI agent is a system where an LLM:
1. Receives a goal (not just a task)
2. Decides what steps are needed to accomplish it
3. Takes actions using tools
4. Observes the results
5. Decides on next steps
6. Iterates until the goal is complete

```
Goal → Plan → Action → Observe → [Complete OR Loop back to Plan]
```

The key difference from a standard LLM call: **the agent decides its own next steps based on what it observes, rather than following a predetermined script.**

> "A chatbot answers questions. An agent accomplishes goals. The difference is agency — the ability to plan, act, and adapt."

### Tool Use: The Foundation of Agency

Tools are functions the agent can call. Examples:
- `search_web(query)` — searches the internet
- `read_file(path)` — reads a file
- `write_file(path, content)` — writes a file
- `run_python(code)` — executes Python code
- `send_email(to, subject, body)` — sends an email
- `query_database(sql)` — runs a database query
- `call_api(url, method, params)` — calls an external API

Tool use protocol (Anthropic/Claude):
1. You define tools with names, descriptions, and parameter schemas
2. The model decides whether to call a tool and with what arguments
3. Your code executes the tool
4. The result is passed back to the model
5. The model uses the result to decide next steps

### Types of Agent Memory

**In-context (short-term):** The conversation history in the current context window. All agents have this. Limited by context window size.

**External (long-term):** Stored outside the model — a database, file system, or vector DB. Explicitly retrieved when needed.

**Episodic:** Records of past actions and their outcomes. The agent can learn from experience.

**Semantic:** Factual knowledge, retrieved via RAG (covered in Module 04).

### Planning Loops

Agents need planning mechanisms to handle complex, multi-step goals:

**ReAct (Reasoning + Acting):** The agent alternates between "thinking" (reasoning about what to do next) and "acting" (calling tools). Simple and effective.

**Chain of Thought + Tools:** Combine CoT reasoning with tool calls. The agent writes out its reasoning before each action.

**Plan-and-Execute:** First generate a complete plan, then execute each step. Better for tasks where you can plan upfront.

**Tree of Thoughts:** Explore multiple reasoning paths, evaluate, and select the best. Good for complex problems.

---

## Try It — Build Your First Agent

### Activity 1: Simple Tool Use (20 mins)

Build an agent with one custom tool. Let's build a "calculator agent" — the LLM decides when to call the calculator rather than trying to compute in its head.

```python
import anthropic
import json

client = anthropic.Anthropic(api_key="your-key-here")

# Define the tool
tools = [
    {
        "name": "calculate",
        "description": "Perform mathematical calculations. Use this for any arithmetic, not your own computation.",
        "input_schema": {
            "type": "object",
            "properties": {
                "expression": {
                    "type": "string",
                    "description": "A mathematical expression to evaluate, e.g. '2 + 2', '15 * 7 / 3'"
                }
            },
            "required": ["expression"]
        }
    }
]

def run_tool(tool_name: str, tool_input: dict) -> str:
    if tool_name == "calculate":
        try:
            result = eval(tool_input["expression"])
            return str(result)
        except Exception as e:
            return f"Error: {e}"
    return "Tool not found"

def run_agent(user_message: str) -> str:
    messages = [{"role": "user", "content": user_message}]

    while True:
        response = client.messages.create(
            model="claude-3-5-haiku-20241022",
            max_tokens=1024,
            tools=tools,
            messages=messages
        )

        # If no tool call, we're done
        if response.stop_reason == "end_turn":
            return response.content[0].text

        # Process tool calls
        tool_calls_made = []
        for content_block in response.content:
            if content_block.type == "tool_use":
                tool_result = run_tool(content_block.name, content_block.input)
                tool_calls_made.append({
                    "type": "tool_result",
                    "tool_use_id": content_block.id,
                    "content": tool_result
                })

        # Add assistant response and tool results to conversation
        messages.append({"role": "assistant", "content": response.content})
        messages.append({"role": "user", "content": tool_calls_made})

# Test
print(run_agent("What is 17 multiplied by 43, then divided by 7? Round to 2 decimal places."))
print(run_agent("If I have 15 items at £3.50 each, and I get a 20% discount, what do I pay?"))
```

Test results:
- Did the agent call the tool? ___
- Were the calculations correct? ___
- How many tool calls were needed for the second question? ___

---

### Activity 2: Multi-Tool Agent (30 mins)

Extend your agent with multiple tools. Build a research assistant that can:
1. "Search the web" (simulate with a mock function)
2. Summarise text
3. Save notes to a file

```python
import anthropic
import json
from datetime import datetime

client = anthropic.Anthropic(api_key="your-key-here")

# Simulate a web search (replace with real search API if available)
def mock_search(query: str) -> str:
    # In production, use SerpAPI, Tavily, or similar
    return f"Search results for '{query}': [This is simulated. In production, connect to a real search API to get actual results about: {query}]"

def save_note(filename: str, content: str) -> str:
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filepath = f"notes_{timestamp}_{filename}.txt"
    with open(filepath, 'w') as f:
        f.write(content)
    return f"Saved to {filepath}"

tools = [
    {
        "name": "search_web",
        "description": "Search the web for current information about a topic",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Search query"}
            },
            "required": ["query"]
        }
    },
    {
        "name": "save_note",
        "description": "Save a note or summary to a file for later reference",
        "input_schema": {
            "type": "object",
            "properties": {
                "filename": {"type": "string", "description": "Short filename (no extension)"},
                "content": {"type": "string", "description": "Content to save"}
            },
            "required": ["filename", "content"]
        }
    }
]

def run_tool(name: str, inputs: dict) -> str:
    if name == "search_web":
        return mock_search(inputs["query"])
    elif name == "save_note":
        return save_note(inputs["filename"], inputs["content"])
    return "Unknown tool"

def run_agent(goal: str, system_prompt: str = None) -> str:
    messages = [{"role": "user", "content": goal}]
    system = system_prompt or "You are a research assistant. Use tools to gather information and save useful summaries."

    while True:
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2048,
            system=system,
            tools=tools,
            messages=messages
        )

        if response.stop_reason == "end_turn":
            final_text = next((b.text for b in response.content if hasattr(b, 'text')), "Done")
            return final_text

        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                result = run_tool(block.name, block.input)
                print(f"Tool called: {block.name} | Result: {result[:100]}...")
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result
                })

        messages.append({"role": "assistant", "content": response.content})
        messages.append({"role": "user", "content": tool_results})

# Test with a complex goal
result = run_agent("Research the key differences between supervised and unsupervised machine learning, then save a concise summary as notes.")
print(f"\nFinal result: {result}")
```

Observations:
- How many tool calls did it make? ___
- Did it combine tools effectively? ___
- What would you add to make this agent genuinely useful? ___

---

### Activity 3: Agent Design Pattern — ReAct (20 mins)

Implement the ReAct pattern explicitly — ask the model to reason before each action.

Modify your system prompt to include:
```
Before each action, think through:
- What is my current state and what have I learned so far?
- What is the most valuable next step?
- What tool should I call, and why?

Format your thinking as <thinking>...</thinking> before each tool call.
```

Run the same goal as Activity 2. Compare the reasoning quality.

Did explicit reasoning improve the agent's decisions? ___
What unnecessary tool calls did it avoid by thinking first? ___
Trade-off of reasoning (more tokens = higher cost): ___

---

## Agent Failure Modes

Agents are powerful but fail in characteristic ways. Know these before deploying:

1. **Looping** — the agent gets stuck in a loop calling the same tool repeatedly
2. **Hallucinated tool calls** — calling a tool with made-up parameters
3. **Goal drift** — straying from the original goal after many tool calls
4. **Overly aggressive action** — taking irreversible actions (sending emails, deleting files) too quickly
5. **Context overflow** — too many tool calls fill the context window

**Safeguards:**
- Set a maximum iteration count
- For irreversible actions: require explicit confirmation
- Log all tool calls
- Use concise tool outputs (don't pass back 10,000 words when 100 will do)
- Regularly test with adversarial goals

---

## Reflect

1. What's the fundamental difference between a prompt chain (Module 10 in the Innovator track) and an agent? When would you choose each?

2. What actions would you never let an agent take without human confirmation? What's your principle for deciding?

3. Agents can accomplish remarkable things — but they can also take harmful irreversible actions at scale. What safeguards would you require before deploying an agent to real users?

---

## Challenge
**Build a Useful Agent:**

Design and build an agent that solves a real problem you have. Requirements:
- At least 3 tools
- Handles at least one multi-step goal
- Has explicit safeguards against the failure modes listed above
- Has been tested with at least 5 different goals (including 2 that should fail gracefully)

Document:
- Tools defined: ___
- Most complex goal it successfully completed: ___
- A goal where it failed, and why: ___
- Safeguards you implemented: ___
- What you'd add in v2: ___

---

## Coming Up Next
Module 04: RAG — Teaching AI Your Own Data — retrieval-augmented generation, embeddings, vector search, and chunking strategies for building AI that knows what you know.
