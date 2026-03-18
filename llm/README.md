# Repair Relay LLM

This folder contains a domain-specific LLM starter for `Repair Relay`.

It is not a newly trained model. It is the part you actually need first:

- a strong system prompt
- a workflow schema
- a structured repair file shape
- a prompt builder for app integration

## Files

- `repair-relay-system-prompt.md`: system instructions for the assistant
- `workflow-schema.json`: allowed workflow states and decision rules
- `sample-repair-order.json`: example case payload
- `build-prompt.js`: turns a repair order into a grounded LLM prompt

## What the LLM should do

- summarize the current repair file
- identify blockers
- recommend the next action
- identify who should act next
- draft a customer update
- warn when workflow rules are violated

## What the LLM should not do

- invent parts ETAs
- invent approvals
- mark repairs complete without QC pass
- mark files closed without closeout review

## Integration pattern

Use the system prompt from `repair-relay-system-prompt.md` and pass the generated user prompt from `build-prompt.js` plus the repair file JSON.
