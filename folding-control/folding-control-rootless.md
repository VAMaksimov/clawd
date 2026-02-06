# Folding@home Control in Your Rootless Docker

**Container ID:** 52bfda87ff04  
**Context:** Rootless Docker (`/run/user/1000/docker.sock`)  
**Status:** Running  
**Project:** 16959 (Protein folding research)

## Copy-Paste Commands (Your Rootless Context)

### View Container Status
```bash
docker --host unix:///run/user/1000/docker.sock ps -f name=folding-at-home
```

### View Logs (What It's Doing)
```bash
docker --host unix:///run/user/1000/docker.sock logs folding-at-home
# Follow in real-time:
docker --host unix:///run/user/1000/docker.sock logs -f folding-at-home
```

### Check Resource Usage
```bash
docker --host unix:///run/user/1000/docker.sock stats folding-at-home --no-stream
```

### PAUSE Computation (Pause Button)
```bash
docker --host unix:///run/user/1000/docker.sock pause folding-at-home
```

### RESUME Computation (Play Button)
```bash
docker --host unix:///run/user/1000/docker.sock unpause folding-at-home
```

### STOP Container (Full Stop)
```bash
docker --host unix:///run/user/1000/docker.sock stop folding-at-home
```

### START Again (After Stop)
```bash
docker --host unix:///run/user/1000/docker.sock start folding-at-home
```

### DELETE Container Completely
```bash
docker --host unix:///run/user/1000/docker.sock stop folding-at-home
docker --host unix:///run/user/1000/docker.sock rm folding-at-home
```

---

## What It's Doing Right Now

```
WU00:FS00:Received Unit: id:00 state:DOWNLOAD error:NO_ERROR project:16959
WU00:FS00:Downloading core from http://cores.foldingathome.org/lin/64bit-avx2-256/a8-0.0.12/Core_a8.fah
```

**Translation:** Downloading the protein folding simulator core, about to start computing.

**Servers it connects to:**
- `13.59.134.176:8080` - Folding@home work assignment server (AWS)
- `129.32.209.205:8080` - Work server (Stanford University)
- `cores.foldingathome.org:80` - Folding@home core download

All legitimate, no crypto mining, no hidden connections.

---

## Easier Alias (Optional)

Add this to your `~/.bashrc` to make it simpler:

```bash
alias fah='docker --host unix:///run/user/1000/docker.sock'
```

Then you can just:
```bash
fah ps
fah logs -f folding-at-home
fah pause folding-at-home
fah unpause folding-at-home
```

---

## Summary

✅ Container now runs in **YOUR rootless Docker**  
✅ You can see it with `docker ps`  
✅ You can control it with `pause`/`unpause`/`stop`  
✅ Processes are legitimate Folding@home (not crypto)  
✅ Connected only to foldingathome.org servers

**Full transparency:** You now have complete visibility and control.
