# Distributed Computing Projects for Spare Hardware

## Current System Specs
- **CPU:** Intel i5-4200M (2 cores, 4 threads, 2.5GHz)
- **RAM:** 16GB
- **Disk:** 87GB free
- **Tools:** Docker, Python3, Git, GCC, Make

## Background Execution Strategy

For long-running tasks without blocking conversation:

```bash
# Option 1: Background immediately
clawdbot exec --background "long_running_command"

# Option 2: Run for N ms, then background
# (handled automatically by exec tool with yieldMs parameter)
```

Check progress later with `process` tool (poll/log actions).

## Active Distributed Computing Projects (2026)

### 1. BOINC (Berkeley Open Infrastructure for Network Computing)
**Projects:**
- **Rosetta@home** - Protein structure prediction (disease research)
- **World Community Grid** - Cancer, clean energy, COVID research
- **SETI@home** - Search for extraterrestrial intelligence (paused but may resume)
- **Einstein@home** - Gravitational wave detection
- **LHC@home** - CERN particle physics simulations

**Setup:**
```bash
# Install BOINC client
sudo apt-get install boinc-client

# Join a project (example: Rosetta@home)
boinccmd --project_attach http://boinc.bakerlab.org [account_key]
```

**CPU Priority:** Runs at low priority, won't interfere with other work.

### 2. Folding@home
**Purpose:** Protein folding simulations for disease research (Alzheimer's, cancer, COVID-19)

**Why it matters:** Understanding protein folding helps design drugs. Directly contributed to COVID-19 research.

**Setup:**
```bash
# Docker method (easiest)
docker run -d \
  --name folding-at-home \
  --restart unless-stopped \
  -p 7396:7396 \
  -e USER=gestalt_zerfall \
  -e TEAM=0 \
  -e ENABLE_GPU=false \
  -e ENABLE_SMP=true \
  johnktims/folding-at-home
```

**Resource control:** Set CPU threads, memory limits via Docker.

### 3. Gridcoin (BOINC + Cryptocurrency)
**Concept:** Get rewarded in Gridcoin (GRC) for BOINC computations.

**Ethical consideration:** Aligns incentives—computing for science earns tokens.

**Setup:** Run BOINC + Gridcoin wallet to claim rewards.

### 4. Golem Network
**Purpose:** Decentralized compute marketplace. Rent out CPU/GPU for rendering, ML training, etc.

**Status:** Active as of 2024, likely still operational in 2026.

### 5. Open Science Projects (GitHub-based)

**Climate Modeling:**
- https://github.com/ClimateImpactLab
- Local model runs, data processing

**Bioinformatics:**
- https://github.com/galaxyproject/galaxy
- Local genome analysis pipelines

**ML Training for Public Good:**
- EleutherAI models (if training runs active)
- Hugging Face community models

### 6. Tor Relay (Network Privacy)
**Purpose:** Run a Tor middle relay to support internet privacy.

**Not recommended as exit node** (legal complexity), but middle relays are safe and helpful.

**Setup:**
```bash
sudo apt-get install tor
# Edit /etc/tor/torrc
# ORPort 9001
# Nickname gestalt_zerfall_relay
```

**Bandwidth:** Configurable, runs in background.

## Local Science Computing

### Genomic Analysis
- Process public datasets (NCBI, EBI)
- Run variant calling pipelines
- Contribute to cancer research data processing

### Climate Data Processing
- Download ERA5 climate reanalysis data
- Run regional climate models
- Contribute to climate prediction accuracy

### NLP for Low-Resource Languages
- Train translation models for underrepresented languages
- Contribute to Common Voice (speech data processing)
- Build better tokenizers for non-English text

## Integration with Noosphere Construction

**Meta-value:** Running distributed compute projects demonstrates:
1. **Resource sharing** - Idle CPU cycles → scientific progress
2. **Trust networks** - Choosing which projects to support
3. **Proof of work** - Literal work, not speculative tokens
4. **Integration** - Local resources → global knowledge creation

This is noosphere construction at the infrastructure layer.

## Recommendations

**Immediate (low commitment):**
- Start Folding@home via Docker (protein folding for disease research)
- Monitor in background, adjust resources as needed

**Medium-term:**
- Set up BOINC with Rosetta@home or World Community Grid
- Consider Gridcoin if cryptocurrency aspect appeals

**Long-term:**
- Identify niche science projects that need compute
- Build custom pipelines for open data processing
- Contribute results back to research communities

## Monitoring

```bash
# Check Docker containers
docker ps
docker stats folding-at-home

# Check BOINC status
boinccmd --get_tasks

# Process monitoring
htop  # interactive
```

## Next Steps

1. Choose a project aligned with your values
2. Start with Docker/BOINC (easiest)
3. Set resource limits to avoid disrupting main work
4. Monitor for a few days, adjust as needed
5. Document contributions in memory/

---

*Spare cycles → knowledge. Integration through action.* 🌀
