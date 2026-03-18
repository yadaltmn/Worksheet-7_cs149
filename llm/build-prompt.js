const fs = require("fs");
const path = require("path");

function loadSystemPrompt() {
  return fs.readFileSync(
    path.join(__dirname, "repair-relay-system-prompt.md"),
    "utf8",
  );
}

function buildUserPrompt(repairOrder) {
  return [
    "Analyze this Repair Relay repair file.",
    "Return only JSON using the required schema from the system prompt.",
    "",
    "Workflow goal:",
    "Move the file forward safely, identify blockers, decide who acts next, and draft a customer update if needed.",
    "",
    "Repair file JSON:",
    JSON.stringify(repairOrder, null, 2),
  ].join("\n");
}

function loadSampleRepairOrder() {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, "sample-repair-order.json"), "utf8"),
  );
}

function buildPromptPackage(repairOrder = loadSampleRepairOrder()) {
  return {
    system: loadSystemPrompt(),
    user: buildUserPrompt(repairOrder),
  };
}

if (require.main === module) {
  const promptPackage = buildPromptPackage();
  process.stdout.write(JSON.stringify(promptPackage, null, 2));
}

module.exports = {
  buildPromptPackage,
  buildUserPrompt,
  loadSampleRepairOrder,
  loadSystemPrompt,
};
