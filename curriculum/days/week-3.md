# Week 3: Agent Architecture (Days 15-21)

**Theme:** Building intelligent routing and agents

**Assignment:** Agent Selector (Due Day 27)

---

## Day 15: Understanding Agent Systems

**Time:** 60 min | **Type:** Read

### Learning Objectives
- Understand what makes something an "agent"
- Know the selector/router pattern
- Recognize when to use agents vs simple prompts

### Content
1. [Understanding Agents](../7-agent-architecture/1-understanding-agents.md)
2. [Agent Routing](../7-agent-architecture/2-agent-routing.md)

### Key Takeaways
- Agent = LLM + tools + decision-making loop
- Selector = router that picks the right agent for a query
- Start simple; add agents as needed

---

## Day 16: Prompting for Agents

**Time:** 45 min | **Type:** Read

### Learning Objectives
- Know how to write effective agent prompts
- Understand temperature and model selection
- Recognize prompt patterns that work

### Content
1. [Prompting Strategies](../7-agent-architecture/3-prompting-strategies.md)

### Key Takeaways
- Clear instructions > clever tricks
- Temperature 0 for routing decisions
- Include examples in prompts when behavior is ambiguous

---

## Day 17: Text-Based Selector (Exercise)

**Time:** 90 min | **Type:** Hands-on

### Learning Objectives
- Implement a basic text-based agent selector
- Parse LLM output to route queries
- Handle edge cases in routing

### Content
1. [Text-Based Selector](../7-agent-architecture/4-text-based-selector.md)

### Exercise
Complete the TODOs in `app/api/select-agent/route.ts`:

1. Create the selector prompt
2. Call the LLM
3. Parse the response
4. Route to the correct agent

### Run Tests
```bash
yarn test:selector
```

### Key Takeaways
- Text parsing works but is fragile
- LLMs don't always follow format instructions
- Need graceful handling of malformed responses

---

## Day 18: Structured Outputs + Graceful Degradation

**Time:** 60 min | **Type:** Read + Hands-on

### Learning Objectives
- Use Zod schemas for structured outputs
- Implement fallback strategies
- Handle routing failures gracefully

### Content
1. [Structured Outputs](../7-agent-architecture/5-structured-outputs.md)
2. [Graceful Degradation](../7-agent-architecture/6-graceful-degradation.md)

### Exercise
Upgrade your selector to use structured outputs:

1. Define Zod schema for routing decision
2. Use `zodResponseFormat` with OpenAI
3. Add fallback when parsing fails

### Key Takeaways
- Structured outputs = guaranteed JSON format
- Zod validates response matches expected shape
- Always have a default agent for unroutable queries

---

## Day 19: LinkedIn Agent (Exercise)

**Time:** 60 min | **Type:** Hands-on

### Learning Objectives
- Implement a specialized agent
- Use fine-tuned model for specific tasks
- Test agent behavior

### Content
1. [LinkedIn Agent](../8-linkedin-agent/1-linkedin-agent.md)

### Exercise
Complete the TODOs in `app/agents/linkedin.ts`:

1. Create the LinkedIn writing prompt
2. Configure model (fine-tuned if available)
3. Return properly formatted response

### Assignment Assigned
**Agent Selector** is now assigned. See [ASSIGNMENTS.md](../ASSIGNMENTS.md) for details.

### Key Takeaways
- Specialized agents = focused prompts + appropriate models
- Fine-tuned models excel at specific formats
- Test with diverse inputs to verify behavior

---

## Day 20: Assignment 2 Work

**Time:** 90 min | **Type:** Assignment

### Focus
Work on Assignment 2: Agent Selector with Structured Outputs

**Code:** Implement structured output routing with proper fallbacks.

### Files
- `app/api/select-agent/route.ts`

### Tips
- Use Zod schemas for type safety
- Test edge cases: ambiguous queries, unknown topics
- Make sure fallback behavior is sensible

---

## Day 21: REST

Take a break. Week 4 focuses on RAG implementation.

---

## Week 3 Checklist

- [ ] Understand agent architecture concepts
- [ ] Implemented text-based selector
- [ ] Upgraded to structured outputs
- [ ] Implemented LinkedIn agent
- [ ] Assignment 2 in progress (Due Day 27)
