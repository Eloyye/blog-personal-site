---
name: clarify
description: Evaluate whether a prompt or question is too vague to act on confidently. Use when Claude Code or Codex receives a request that lacks a clear target, scope, or intent. Ask one clarifying question at a time, waiting for the user to answer before proceeding to the next. Ask at least 5 questions before proceeding.
---

# Clarify - Vague Prompt Evaluation

Before acting on any prompt, evaluate whether it is specific enough to proceed confidently.

## Step 1: Assess Vagueness

A prompt is **vague** when it meets one or more of the following:

- **Missing target** - no specific file, component, function, or system is named (e.g. "fix the bug")
- **Ambiguous scope** - the boundary of the change is unclear (e.g. "improve performance")
- **Missing intent** - the desired outcome or success condition is not stated (e.g. "add a feature")
- **Multiple valid interpretations** - a reasonable agent could take meaningfully different paths and both would seem correct

If the prompt is specific enough to act on, **proceed without asking**. Do not add friction to clear requests.

## Step 2: Interview the Developer (vague prompts only)

If the prompt is vague, **do not guess or make assumptions**. Conduct a sequential interview: ask **one question at a time**, wait for the answer, then ask the next. Each question should offer concrete choices that are easy to answer quickly.

**Rules:**

1. Ask **at least 5 questions** - cover target, scope, intent, constraints, and success criteria.
2. Every question must include **4 concrete suggested choices** drawn from likely options in the current codebase or domain.
3. Every concrete answer choice must include a **one-line example** so the user can immediately understand what selecting it means.
4. The first 3 concrete answer choices must include a **one-line tradeoff** showing a brief upside and downside so the user can quickly compare the main options.
5. Every question must include a **"Recommend and answer"** option. If the user selects it, provide your recommended answer, briefly justify it, and ask the user to confirm before continuing.
6. Every question must include an **"Other (please describe)"** option.
7. Every question must include a **"Rephrase this question"** option so the developer can signal they do not understand what is being asked.
8. **Ask exactly one question per response** - do not show the next question until the user answers the current one.
9. After each answer, acknowledge it briefly (one sentence) on its own line, then show the next question block.
10. After all questions are answered, synthesize and proceed.

**Single-question format:**

Use a banner divider, a blank line, the question, then compact choices. Each main choice is a tight three-line block: label, example, tradeoff. Meta-options sit below a dotted divider so they are easy to scan but visually distinct.

```text
───── Question N of N+ ─────────────────────────

<Question - specific, not generic>

  a) <Concrete choice from the codebase or domain>
     ex: <simple example of what this choice means>
     + <brief upside>   − <brief downside>

  b) <Another concrete choice>
     ex: <simple example of what this choice means>
     + <brief upside>   − <brief downside>

  c) <Another concrete choice>
     ex: <simple example of what this choice means>
     + <brief upside>   − <brief downside>

  d) <Fourth concrete choice>
     ex: <simple example of what this choice means>

  ·····
  e) Recommend and answer
  f) Other (please describe)
  g) Rephrase this question
```

**Behavior for "Recommend and answer":**

If the user selects **"Recommend and answer"**, do this before moving on:

```text
Recommended answer: <your recommended choice or custom answer>
Why: <1-2 sentence justification based on the request, codebase, or common default>

Confirm to use this answer, or tell me what to change.
```

Do not treat the recommendation as final until the user confirms it.

**Minimum question areas to cover (in roughly this order):**

1. **Target** - which specific file, component, endpoint, or system?
2. **Scope** - how broadly should the change reach?
3. **Intent / desired outcome** - what does success look like?
4. **Constraints** - are there performance, compatibility, or style requirements?
5. **Priority / tradeoffs** - if the ideal is not achievable, what matters most?
6. _(Additional questions as needed for the specific domain)_

## Step 3: Proceed After All Answers

Once all questions are answered, synthesize the developer's choices and proceed. Do not ask further clarifying questions unless an answer introduces a genuinely new blocker. If the developer selects **"Rephrase this question"**, restate that specific question more simply and wait for a new answer before continuing. If the developer selects **"Recommend and answer"**, provide the recommendation, justification, and confirmation prompt before continuing.

## Examples

**Vague:** `"fix the bug"`

```text
───── Question 1 of 5+ ─────────────────────────

Which bug are you referring to?

  a) The 500 error on POST /api/matches
     ex: Saving a completed match fails and the API returns status 500.
     + Points directly to an API failure path.   − May ignore related frontend symptoms.

  b) The stat calculation returning NaN for unplayed sets
     ex: A player with an incomplete match history shows NaN in the UI.
     + Focuses on a clear data-handling bug.   − Could leave upstream invalid data untouched.

  c) The stale data shown after a player is deleted
     ex: The deleted player still appears until the page is refreshed.
     + Targets an obvious UX consistency issue.   − May involve cache invalidation across layers.

  d) The rankings page crashes when filters are cleared
     ex: Clearing all filters throws an exception and the page stops rendering.

  ·····
  e) Recommend and answer
  f) Other (please describe)
  g) Rephrase this question
```

_(User answers -> acknowledge on its own line -> show question 2.)_

```text
You want to fix the NaN stat calculation.

───── Question 2 of 5+ ─────────────────────────

What should the fixed behavior be?

  a) Return 0 instead of NaN
     ex: Empty stats render as 0 wins, 0 losses, and 0%.
     + Simple for downstream consumers.   − Blurs the difference between zero and missing data.

  b) Return null and let the UI handle the empty state
     ex: The UI shows "No stats yet" instead of a number.
     + Preserves missing-vs-real distinction.   − Requires UI code to handle null correctly.

  c) Throw a validation error upstream so bad data never reaches the calculation
     ex: The API rejects incomplete set data before computing stats.
     + Enforces stronger data integrity.   − More disruptive if incomplete data already exists.

  d) Show a placeholder like "--" from the calculation layer
     ex: The API or utility returns a display-oriented placeholder for missing stats.

  ·····
  e) Recommend and answer
  f) Other (please describe)
  g) Rephrase this question
```

_(If the user selects "Recommend and answer":)_

```text
Recommended answer: Return null and let the UI handle the empty state.
Why: Preserves the difference between "no data" and a real zero value, which avoids misleading stats.

Confirm to use this answer, or tell me what to change.
```

_(Continue through at least 5 questions before acting.)_

---

**Clear - no questions needed:** `"add a GET /api/players/:id endpoint that returns player stats from the players table"`

Proceed directly. The target, method, path, and data source are all specified.
