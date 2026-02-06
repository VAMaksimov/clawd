# Folding@home Control Commands

## Status Check
```bash
docker ps -f name=folding-at-home
docker stats folding-at-home --no-stream
```

## Pause (Stop Computing)
```bash
docker pause folding-at-home
```

## Resume (Continue Computing)
```bash
docker unpause folding-at-home
```

## Stop Completely
```bash
docker stop folding-at-home
```

## Start Again
```bash
docker start folding-at-home
```

## Remove Completely
```bash
docker stop folding-at-home
docker rm folding-at-home
```

## View Logs (See What It's Doing)
```bash
docker logs folding-at-home -f
```

## Check Resource Usage
```bash
docker stats folding-at-home
```

## Verify Network Connections
```bash
docker logs folding-at-home | grep Connecting
```

---

## Current Status

**Container ID:** 49473099bd49  
**Status:** Running  
**Uptime:** Since 2026-02-01 11:49 MSK  
**Connections:** foldingathome.org servers only (Stanford University)  
**Project:** 16959 (protein folding research)

---

**Important:** If you want maximum trust, stop this container and install official Folding@home client from https://foldingathome.org/ instead of using a community Docker image.
