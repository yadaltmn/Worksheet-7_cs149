# Repair Relay LLM and Product Spec

## Goal

Build `Repair Relay` as the main operating system for a collision repair shop. The platform should manage vehicle intake, approvals, parts, repair, paint, detail, pickup, and closeout without requiring CCC One to be the workflow owner.

CCC One or Mitchell can still exist as optional estimate sources, but Repair Relay should store and drive the operational state.

## Problem being solved

Your Google Sheet export shows the same pattern common in body shops:

- multiple boards for bays, paint, parts, and missing items
- manual coordination between office staff, estimators, technicians, and detail
- customer updates handled ad hoc
- payment and closeout issues discovered late
- workflow logic living in people’s heads instead of a system

## Product position

Repair Relay should replace spreadsheet-based coordination with one repair file that powers every queue.

## Main product modules

### 1. Repair file

Each vehicle should have one canonical record with:

- repair order number
- customer and insurance info
- vehicle details
- assigned estimator
- assigned technician or bay
- approval state
- parts state and ETA
- repair stage
- supplement history
- customer communication log
- payment status
- QC status
- pickup status
- closeout status

### 2. Department boards

Derived views should come from the repair file:

- intake board
- approval board
- parts board
- body repair board
- paint priority board
- detail priority board
- payment hold board
- closeout error board

### 3. Customer messaging

The app should support:

- estimate approval by text
- delay notifications
- pickup ready texts
- deductible reminders
- rental return reminders

### 4. Exception handling

The system must explicitly track:

- further damage
- supplement needed
- missing parts or clips
- insurance payment issues
- failed QC inspection
- file closeout errors

## Workflow model from your flowchart

Recommended top-level statuses:

1. `intake`
2. `estimating`
3. `awaiting_customer_approval`
4. `parts_pending`
5. `ready_for_repair`
6. `in_body_repair`
7. `supplement_review`
8. `in_paint_queue`
9. `in_paint`
10. `reassembly`
11. `awaiting_missing_parts`
12. `in_detail`
13. `quality_inspection`
14. `awaiting_payment`
15. `ready_for_pickup`
16. `post_pickup_hold`
17. `closeout_review`
18. `closed`

These should replace spreadsheet-only categories such as "high", "low", and manually typed notes as the main process logic. Priority can remain a separate field.

## LLM role

The LLM should not decide the truth of the repair file on its own. It should assist staff based on structured data and notes.

### Good LLM jobs

- summarize repair notes into plain English
- propose the next operational step
- draft customer messages
- detect missing data before handoff
- explain why a file is blocked
- produce estimator or office follow-up checklists
- classify free-text updates into structured fields

### Bad LLM jobs

- changing payment status without user confirmation
- moving a vehicle to complete with no QC pass recorded
- inventing part arrival dates
- guessing insurance approvals that are not documented

## Recommended LLM features

### 1. Next-step copilot

Input:

- current status
- assigned roles
- notes
- approvals
- parts ETA
- QC state
- payments

Output:

- next best action
- blocker summary
- who should act next
- customer update recommendation

### 2. Message drafting

Input:

- customer name
- vehicle
- issue
- promised ETA
- tone setting

Output:

- short SMS draft
- longer email draft if needed

### 3. Missing-data detection

Example checks:

- repair in progress but no technician assigned
- paint complete but reassembly not assigned
- pickup ready but payment proof missing
- closeout attempted with unresolved file error

### 4. Supplement assistant

When more damage is found, the LLM can:

- summarize findings
- draft insurer-facing supplement notes
- list required photos or proof items
- suggest the right customer update

## Suggested system architecture

### Frontend

- web dashboard for office, estimators, techs, paint, and detail
- mobile-friendly repair file view
- board view for each department

### Backend

- API for repair files, statuses, assignments, notes, parts, messages, and payments
- relational database such as PostgreSQL
- event log for status changes and audit history

### AI layer

- prompt templates grounded in structured repair data
- retrieval limited to the current repair file and relevant shop rules
- hard validation before any automated action is committed

## Minimal data model

### `repair_orders`

- `id`
- `ro_number`
- `customer_name`
- `customer_phone`
- `vehicle_year`
- `vehicle_make`
- `vehicle_model`
- `insurance_company`
- `deductible_due`
- `status`
- `priority`
- `eta`
- `estimator_id`
- `technician_id`
- `paint_priority`
- `detail_priority`

### `parts_orders`

- `id`
- `repair_order_id`
- `vendor`
- `description`
- `status`
- `eta`
- `is_critical`

### `supplements`

- `id`
- `repair_order_id`
- `reason`
- `photos_complete`
- `approved_at`

### `messages`

- `id`
- `repair_order_id`
- `channel`
- `direction`
- `content`
- `sent_at`

### `closeout_reviews`

- `id`
- `repair_order_id`
- `has_errors`
- `error_notes`
- `reviewed_by`
- `reviewed_at`

## Business rules to encode

- A repair cannot move to `ready_for_pickup` unless QC passed.
- A file cannot move to `closed` if closeout review has unresolved errors.
- Missing critical parts should automatically set a blocked state.
- A customer payment issue should route to office follow-up, not technician workflow.
- If further damage is found, the file should branch to supplement review and customer communication.

## Recommended MVP

### Phase 1

- repair file CRUD
- department boards
- status movement with audit log
- customer text templates
- basic LLM next-step assistant

### Phase 2

- parts ETA and missing parts tracking
- supplement workflow
- QC checklist
- pickup and payment workflow

### Phase 3

- accounting export
- external estimate import/export
- predictive delay scoring
- role-based dashboards

## Immediate development direction

Start with Repair Relay owning these five actions:

1. create and update the repair file
2. move jobs through workflow stages
3. send customer updates
4. track blockers and exceptions
5. provide AI guidance for the next action

That gives you a usable product before building deeper integrations.
