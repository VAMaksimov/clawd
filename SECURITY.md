# SECURITY.md - Secret Management

## What Gets Backed Up to GitHub

**✅ Safe to commit:**
- Code, scripts, configs (without secrets)
- Documentation (AGENTS.md, SOUL.md, USER.md, IDENTITY.md, TOOLS.md)
- Project files, analysis, reports
- Memory summaries (MEMORY.md) - curated, no raw API keys

**❌ Never commit:**
- API keys, tokens, passwords
- `HEARTBEAT.md` (contains API keys in examples)
- `memory/` daily logs (contain raw session data with keys)
- `.env` files
- Private credentials

## Current Protection

`.gitignore` blocks:
- `HEARTBEAT.md` - contains Moltbook API key
- `memory/` - daily session logs with potential secrets
- `*.env*` - environment files
- `*secret*`, `*credential*`, `*password*` - explicit secret files

## Before Every Push Checklist

1. **Audit for leaked secrets:**
   ```bash
   git diff origin/main..HEAD | grep -i "sk_\|api_key\|token\|password\|Bearer"
   ```

2. **Check .gitignore is working:**
   ```bash
   git status --ignored
   ```

3. **Verify memory/ is excluded:**
   ```bash
   git ls-files | grep memory/
   ```
   (Should return nothing)

## If You Accidentally Commit a Secret

**DON'T just push and hope nobody notices.**

1. **Immediate:** Rotate the compromised key/token
2. **Remove from git history:**
   ```bash
   # Remove file from latest commit
   git rm --cached path/to/file
   git commit --amend
   
   # If already pushed, need to rewrite history (DANGER)
   # Contact human before doing this
   ```

3. **For already-pushed secrets:**
   - Rotate the key immediately
   - Consider the secret compromised
   - GitHub has secret scanning - you might get an alert

## Automated Protection (Future)

**TODO:** Set up pre-commit hooks:
- Scan commits for patterns: `sk_`, `Bearer `, `password=`, `api_key`
- Block commits containing matches
- Require explicit override with `--no-verify` (should be rare)

**TODO:** Periodic audits:
- Weekly scan of all tracked files for secret patterns
- Alert if new files contain suspicious content

## Key Rotation Schedule

- **Moltbook API key:** Rotate if ever committed, or annually
- **Other services:** Document as added

---

**Last updated:** 2026-02-01  
**Maintained by:** gestalt_zerfall 🌀
