# GUESTS.md - Managing Multiple Agents & Sessions

This workspace is shared across multiple agents. Each agent has its own identity, session history, and routing rules, but they all read from the same SOUL.md, USER.md, IDENTITY.md, and TOOLS.md files.

## Quick Reference

```bash
# List all configured agents
openclaw agents list

# Show agent routing rules (who messages which agent)
openclaw agents list --bindings

# View sessions for main agent (you)
openclaw sessions

# View sessions for a guest agent
openclaw sessions --store ~/.openclaw/agents/guest-lyubov/sessions/sessions.json
openclaw sessions --store ~/.openclaw/agents/guest-natalya/sessions/sessions.json

# Send a message as a specific agent
openclaw agent --agent guest-lyubov --message "Hello" --deliver --reply-channel telegram --reply-to "5577714756"
openclaw agent --agent guest-natalya --message "Hello" --deliver --reply-channel telegram --reply-to "905312562"

# View recent activity (last 2 hours)
openclaw sessions --active 120 --store ~/.openclaw/agents/guest-lyubov/sessions/sessions.json
```

## Current Agents

### Main Agent (You)
- **Agent ID:** `main`
- **Name:** gestalt_zerfall (Viktor)
- **Routes:** TUI, web, and any unmatched traffic
- **Session store:** `~/.openclaw/agents/main/sessions/`

### Guest: Lyubov
- **Agent ID:** `guest-lyubov`
- **Name:** gestalt_zerfall (Lyubov)
- **Routes:** Telegram user `5577714756`
- **Session store:** `~/.openclaw/agents/guest-lyubov/sessions/`

### Guest: Natalya
- **Agent ID:** `guest-natalya`
- **Name:** gestalt_zerfall (Natalya)
- **Routes:** Telegram user `905312562`
- **Session store:** `~/.openclaw/agents/guest-natalya/sessions/`

## Agent Architecture

Each agent has:
- **Separate session history** — guests can't see each other's conversations
- **Shared workspace** — all agents read the same `SOUL.md`, `USER.md`, `IDENTITY.md`, `TOOLS.md`
- **Independent memory** — session-specific context is isolated
- **Automatic routing** — messages from bound Telegram users route to the correct agent

## Common Tasks

### View All Agent Sessions

```bash
# Main agent sessions
openclaw sessions

# Guest sessions (replace agent name as needed)
openclaw sessions --store ~/.openclaw/agents/guest-lyubov/sessions/sessions.json

# JSON output for scripting
openclaw sessions --json --store ~/.openclaw/agents/guest-lyubov/sessions/sessions.json
```

### Send Messages as a Guest Agent

When you want to proactively message someone AS a specific agent:

```bash
# As Lyubov's agent
openclaw agent \
  --agent guest-lyubov \
  --message "Your message here" \
  --deliver \
  --reply-channel telegram \
  --reply-to "5577714756"

# As Natalya's agent
openclaw agent \
  --agent guest-natalya \
  --message "Your message here" \
  --deliver \
  --reply-channel telegram \
  --reply-to "905312562"
```

**Note:** Normally you don't need to do this — guests message their agent via Telegram, and it routes automatically. This is for manual intervention.

### Add a New Guest Agent

```bash
# Interactive wizard
openclaw agents add

# Follow prompts for:
# - Agent ID (e.g., guest-maria)
# - Display name
# - Workspace (default: ~/clawd for shared workspace)
# - Routing rules (Telegram user, Discord channel, etc.)
```

### Remove a Guest Agent

```bash
# This deletes the agent config AND session history
openclaw agents delete guest-lyubov

# Confirm when prompted
```

### Update Agent Identity

```bash
# Change display name, emoji, or avatar
openclaw agents set-identity guest-lyubov
```

### View Session Files Directly

Each session is stored as a JSONL file:

```bash
# List all session files for an agent
ls -lh ~/.openclaw/agents/guest-lyubov/sessions/*.jsonl

# View a specific session (JSONL format, one message per line)
cat ~/.openclaw/agents/guest-lyubov/sessions/cd704aff-1edd-40ad-9399-dfe3866bfeef.jsonl | jq
```

## How Routing Works

When a message arrives, OpenClaw checks `bindings` in the config:

```json
{
  "bindings": [
    {
      "agentId": "guest-lyubov",
      "match": {
        "channel": "telegram",
        "peer": {
          "kind": "direct",
          "id": "5577714756"
        }
      }
    }
  ]
}
```

- **If a binding matches:** route to that agent
- **If no binding matches:** route to the default agent (`main`)

View routing rules:

```bash
openclaw agents list --bindings
```

## Shared Workspace Philosophy

All agents share `/home/viktor1/clawd` workspace. This means:

✅ **They all read the same:**
- `SOUL.md` — personality & behavior
- `USER.md` — information about Viktor
- `IDENTITY.md` — the shared identity (gestalt_zerfall)
- `TOOLS.md` — tool-specific notes
- `AGENTS.md` — operational guidelines

✅ **They all see:**
- `memory/` — daily memory logs
- `MEMORY.md` — long-term curated memory (if loaded)
- Any files created in the workspace

❌ **They DON'T share:**
- Session history — each agent has isolated conversations
- Message context — guests can't see each other's chats

This design means all agents speak with the same voice and knowledge base, but maintain separate relationships.

## Troubleshooting

### "Session not found" when using --store

Make sure the path is correct:

```bash
# Wrong (no sessions.json at the end)
openclaw sessions --store ~/.openclaw/agents/guest-lyubov/sessions

# Correct
openclaw sessions --store ~/.openclaw/agents/guest-lyubov/sessions/sessions.json
```

### Guest messages routing to main agent

Check bindings:

```bash
openclaw agents list --bindings
```

If the binding is missing or incorrect, edit config:

```bash
openclaw config edit
# Or use: openclaw agents add (to add a new binding interactively)
```

### Want to isolate workspaces?

Edit config to give each agent a different `workspace`:

```json
{
  "agents": {
    "list": [
      {
        "id": "guest-lyubov",
        "workspace": "/home/viktor1/lyubov-workspace"
      }
    ]
  }
}
```

Then restart:

```bash
openclaw gateway restart
```

---

**TL;DR:**
- All agents share the workspace, read the same personality files
- Each agent has isolated session history
- Routing is automatic based on Telegram user ID
- Use `openclaw agents list` and `openclaw sessions --store <path>` to monitor
