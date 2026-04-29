# Clock-o-matic Dev Team

Five specialized Claude Code agents that simulate a full development team. Each agent is defined in `.claude/agents/` and can be invoked by typing `/[agent-name]` in Claude Code, or spawned programmatically via the Agent tool.

## The Team

| Agent | File | Responsibility |
|---|---|---|
| **pm** | `.claude/agents/pm.md` | Backlog, sprint planning, acceptance criteria |
| **senior-dev** | `.claude/agents/senior-dev.md` | Feature implementation, bug fixes |
| **qa-engineer** | `.claude/agents/qa-engineer.md` | Test plans, Playwright tests, regression checks |
| **release-manager** | `.claude/agents/release-manager.md` | Chrome Web Store prep, versioning, CHANGELOG |
| **ux-reviewer** | `.claude/agents/ux-reviewer.md` | Accessibility, visual polish, contrast |

## Workflow

```
PM → sprint plan (team/sprint.md)
        ↓
   ┌────┴────┐
  Dev      QA        ← run in parallel
   └────┬────┘
        ↓
  Release Manager   ← after dev + QA sign off
        ↓
  UX Reviewer       ← final pass before submission
```

## Running the team

**Start a sprint** — ask the PM to plan:
> "Run the pm agent to plan the next sprint"

**Ship a feature** — ask the dev:
> "Run the senior-dev agent to implement [item] from the sprint plan"

**Check quality** — ask QA:
> "Run the qa-engineer agent to write tests for the schedule feature"

**Prep the release** — ask the release manager:
> "Run the release-manager agent to work through the pre-publishing checklist"

**Polish the UI** — ask the UX reviewer:
> "Run the ux-reviewer agent to audit accessibility"

## Team output files

| File | Owner | Purpose |
|---|---|---|
| `team/sprint.md` | PM | Current sprint plan |
| `team/dev-log.md` | Senior Dev | What was built and why |
| `team/qa-report.md` | QA | Test coverage and findings |
| `team/release-status.md` | Release Manager | Checklist and store copy |
| `team/ux-report.md` | UX Reviewer | Accessibility and polish findings |
