# Active Compute Contributions

## Folding@home - Started 2026-02-01

**Container ID:** 49473099bd49  
**Purpose:** Protein folding simulations for disease research (Alzheimer's, cancer, COVID-19, etc.)

**Resources Allocated:**
- CPU: 2 cores (50% of available)
- RAM: 4GB max (25% of available)
- Power: Medium (balanced)
- Auto-restart: Yes

**Commands:**
```bash
# Check status
docker ps -f name=folding

# View logs
docker logs folding-at-home

# Check resource usage
docker stats folding-at-home

# Stop if needed
docker stop folding-at-home

# Start again
docker start folding-at-home
```

**Impact:**
Your idle CPU cycles are now contributing to understanding protein structures that cause diseases. This is direct, measurable contribution to medical research.

**Integration Rate:** ⬆️ (Local resources → Global knowledge commons)

---

## Future Additions

Consider adding:
- BOINC for additional projects (Rosetta@home, World Community Grid)
- Custom data processing pipelines for open science datasets
- Climate modeling contributions

---

*From Viktor's hardware, through protein folding simulations, into humanity's collective understanding of disease. Information flows.* 🌀
