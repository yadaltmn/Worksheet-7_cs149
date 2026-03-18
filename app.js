const cases = [
  {
    id: "RR-24031",
    customer: "Maria Hernandez",
    vehicle: "2021 Toyota Camry",
    insurer: "State Farm",
    stage: "Customer Approval",
    priority: "High",
    technician: "Henry",
    estimator: "Alex",
    parts: "Mirror cap and bumper bracket on order, ETA March 11",
    eta: "March 14, 2026",
    blocker: "Estimate approved internally, waiting on customer text approval",
    tags: ["approval"],
    nextAction:
      "Send approval text with estimate summary and deductible reminder. If no response in 2 hours, escalate to phone call.",
    customerMessage:
      "Hi Maria, your Repair Relay estimate is ready for approval. Once approved, we can release parts and lock your repair start date for March 12.",
    checklist: [
      "Vehicle checked in and photos attached",
      "Estimate prepared in Repair Relay",
      "Approval still pending",
    ],
  },
  {
    id: "RR-24028",
    customer: "Daniel Cho",
    vehicle: "2023 Honda CR-V",
    insurer: "GEICO",
    stage: "Parts / Supplements",
    priority: "ASAP",
    technician: "Tinh",
    estimator: "Bri",
    parts: "Supplement submitted, clip kit missing, ETA March 10",
    eta: "March 16, 2026",
    blocker: "Vehicle cannot move to reassembly until missing clips arrive",
    tags: ["delay"],
    nextAction:
      "Mark missing clips as critical. Notify customer of one-day delay and keep body work assigned to the same technician.",
    customerMessage:
      "We found a missing clip set needed for reassembly. The order is placed and we now expect pickup on March 16. We will update you if it arrives sooner.",
    checklist: [
      "Supplement photos uploaded",
      "Parts order placed",
      "Customer delay update needed",
    ],
  },
  {
    id: "RR-24035",
    customer: "Latoya Green",
    vehicle: "2020 Ford F-150",
    insurer: "Progressive",
    stage: "Body Repair",
    priority: "Medium",
    technician: "Jesus",
    estimator: "Alex",
    parts: "All parts received and mirrored to parts cart 6",
    eta: "March 18, 2026",
    blocker: "No blocker",
    tags: ["ready"],
    nextAction:
      "Keep in active repair. Confirm frame pull completion before routing to paint queue.",
    customerMessage:
      "Your truck is actively in repair and all current parts are here. We are still on track for March 18.",
    checklist: [
      "Technician assigned",
      "Frame measurement started",
      "Paint handoff pending",
    ],
  },
  {
    id: "RR-24019",
    customer: "Steve Patel",
    vehicle: "2019 Tesla Model 3",
    insurer: "USAA",
    stage: "Paint",
    priority: "High",
    technician: "Paint Team",
    estimator: "Bri",
    parts: "Paint materials staged, original trim bagged",
    eta: "March 12, 2026",
    blocker: "Paint queue needs booth priority review",
    tags: [],
    nextAction:
      "Push to top three in paint list. Notify office and estimator when booth clears so reassembly can start same day.",
    customerMessage:
      "Your vehicle is in paint. Once it clears paint and reassembly, we will text your pickup window.",
    checklist: [
      "Paint priority list created",
      "Estimator notified",
      "Reassembly not started",
    ],
  },
  {
    id: "RR-24017",
    customer: "Evan Torres",
    vehicle: "2022 Chevrolet Silverado",
    insurer: "Farmers",
    stage: "Detail / QC",
    priority: "High",
    technician: "Detail Team",
    estimator: "Alex",
    parts: "All parts installed",
    eta: "March 10, 2026",
    blocker: "Waiting on final safety and quality inspection",
    tags: [],
    nextAction:
      "Estimator should complete final QC, verify payment proof, then text pickup time and rental return instructions.",
    customerMessage:
      "Your Silverado is in final detail and quality check. We expect to send pickup instructions today.",
    checklist: [
      "Detail completed",
      "QC pending",
      "Payment verification pending",
    ],
  },
  {
    id: "RR-24008",
    customer: "Olivia Brooks",
    vehicle: "2018 Nissan Altima",
    insurer: "Allstate",
    stage: "Pickup / Closeout",
    priority: "Low",
    technician: "Office",
    estimator: "Bri",
    parts: "N/A",
    eta: "Ready now",
    blocker: "Insurance check reissue follow-up",
    tags: ["approval"],
    nextAction:
      "Hold closeout until replacement insurance check is confirmed. Keep file in error review queue.",
    customerMessage:
      "Your vehicle is ready, but we still need the corrected insurance payment before final release. We’ll help you close that out as soon as the reissue is confirmed.",
    checklist: [
      "Vehicle complete",
      "Payment exception open",
      "Closeout not exported",
    ],
  },
];

const columns = [
  "Customer Approval",
  "Parts / Supplements",
  "Body Repair",
  "Paint",
  "Detail / QC",
  "Pickup / Closeout",
];

let selectedCaseId = cases[0].id;

const heroStats = document.getElementById("hero-stats");
const workflowColumns = document.getElementById("workflow-columns");
const caseTitle = document.getElementById("case-title");
const caseDetail = document.getElementById("case-detail");
const copilotCard = document.getElementById("copilot-card");
const messageList = document.getElementById("message-list");

function renderStats() {
  const approvals = cases.filter((item) => item.tags.includes("approval")).length;
  const delays = cases.filter((item) => item.tags.includes("delay")).length;
  const ready = cases.filter((item) => item.tags.includes("ready")).length;

  heroStats.innerHTML = [
    ["Active ROs", cases.length],
    ["Approvals Needed", approvals],
    ["Delay Risks", delays],
    ["Ready For Repair", ready],
  ]
    .map(
      ([label, value]) => `
        <div class="stat-card">
          <span>${label}</span>
          <strong>${value}</strong>
        </div>
      `,
    )
    .join("");
}

function renderColumns() {
  workflowColumns.innerHTML = columns
    .map((column) => {
      const items = cases.filter((item) => item.stage === column);
      return `
        <section class="workflow-column">
          <div class="workflow-column-header">
            <div>
              <h3>${column}</h3>
              <p class="section-note">${columnSummary(column)}</p>
            </div>
            <span class="pill">${items.length}</span>
          </div>
          <div>
            ${items.map(renderCaseCard).join("") || "<p class='section-note'>No vehicles in this stage.</p>"}
          </div>
        </section>
      `;
    })
    .join("");

  document.querySelectorAll(".case-card").forEach((button) => {
    button.addEventListener("click", () => {
      selectedCaseId = button.dataset.caseId;
      renderColumns();
      renderSelectedCase();
    });
  });
}

function renderCaseCard(item) {
  const activeClass = item.id === selectedCaseId ? "active" : "";
  return `
    <button class="case-card ${activeClass}" data-case-id="${item.id}">
      <strong>${item.customer}</strong>
      <p>${item.vehicle}</p>
      <div class="meta-row">
        <span>${item.id}</span>
        <span>${item.technician}</span>
      </div>
      <div>
        <span class="status-chip">${item.priority}</span>
        ${item.tags.map(renderTag).join("")}
      </div>
    </button>
  `;
}

function renderSelectedCase() {
  const item = cases.find((entry) => entry.id === selectedCaseId);

  caseTitle.textContent = `${item.customer} • ${item.vehicle}`;
  caseDetail.innerHTML = `
    <p>${item.blocker}</p>
    <dl>
      <dt>Repair file</dt><dd>${item.id}</dd>
      <dt>Stage</dt><dd>${item.stage}</dd>
      <dt>Estimator</dt><dd>${item.estimator}</dd>
      <dt>Technician</dt><dd>${item.technician}</dd>
      <dt>Insurer</dt><dd>${item.insurer}</dd>
      <dt>ETA</dt><dd>${item.eta}</dd>
      <dt>Parts</dt><dd>${item.parts}</dd>
    </dl>
    <div class="checklist">
      ${item.checklist
        .map((line) => `<div class="checklist-item">${line}</div>`)
        .join("")}
    </div>
  `;

  copilotCard.innerHTML = `
    <h3>${copilotHeading(item)}</h3>
    <p>${item.nextAction}</p>
  `;

  messageList.innerHTML = `
    <article class="message-card">
      <h3>Customer text draft</h3>
      <p>${item.customerMessage}</p>
    </article>
    <article class="message-card">
      <h3>Staff note summary</h3>
      <p>LLM summary: ${item.customer}'s ${item.vehicle} is in <span class="mono">${item.stage}</span>. Primary blocker: ${item.blocker.toLowerCase()}.</p>
    </article>
  `;
}

function renderTag(tag) {
  const labels = {
    approval: "Needs Approval",
    delay: "Delay Risk",
    ready: "Ready",
  };

  return `<span class="tag ${tag}">${labels[tag] || tag}</span>`;
}

function columnSummary(column) {
  const summaries = {
    "Customer Approval": "Texts, approvals, deductible reminders",
    "Parts / Supplements": "Orders, ETA tracking, added damage",
    "Body Repair": "Technician assignment and active repair work",
    Paint: "Paint queue and reassembly handoff",
    "Detail / QC": "Detail, payment proof, final inspection",
    "Pickup / Closeout": "Rental return, payment, export, file review",
  };

  return summaries[column];
}

function copilotHeading(item) {
  if (item.tags.includes("delay")) {
    return "Delay intervention";
  }

  if (item.tags.includes("approval")) {
    return "Approval workflow";
  }

  if (item.stage === "Pickup / Closeout") {
    return "Financial closeout";
  }

  return "Next best action";
}

renderStats();
renderColumns();
renderSelectedCase();
