import sys
import os
from os import path
import json
import re

PATH = "/usr/share/sniper/loot/workspace"
workspace = sys.argv[1]

loot = os.path.join(PATH, workspace)
directories = os.listdir(loot)
dirs = list(filter(lambda d: d not in ["output", "screenshots", "scans", "notes", "output.json", "reports", "scan.out", "scan.sh", "domains"], directories))
json_obj = {
    "domains": {}
}

f = open(path.join(loot, "domains", "targets-all-sorted.txt"))
r = f.read().strip().split("\n")
json_obj["domains"]["scanned"] = r
f.close()

domains = r
for d in domains:
    json_obj[d] = {}

f = open(path.join(loot, "domains", "targets-all-unscanned.txt"))
r = f.read().strip().split("\n")
json_obj["domains"]["unscanned"] = r
f.close()

for ip in domains:
    json_obj[ip] = {}
    for dir in dirs:
        json_obj[ip][dir] = {}

for dir in dirs:
    # if dir not in ["output", "screenshots", "scans", "notes", "output.json", "reports", "scan.out", "scan.sh", "domains"]:
    json_obj[dir] = {}
    for (dirpath, d, files) in os.walk(os.path.join(loot, dir)):
        for file in files:
            name = os.path.splitext(file)
            if not any(word in name[0] for word in ["unsorted", "port"]) and (name[1] not in [".xml", ".html", ".old", ".diff", ""]):
                f = open(os.path.join(dirpath, file), "r", encoding="unicode_escape")
                found = False
                contents = f.read().strip().split("\n")
                contents = [c.strip() for c in contents]
                for ip in domains:
                    if ip in [s.strip() for s in re.split("-|_", name[0])]:
                        n = name[0].replace("-"+ip, "")
                        if len(contents) == 1:
                            json_obj[ip][dir][n] = contents[0]
                        else:
                            json_obj[ip][dir][n] = contents
                        f.close()
                        found = True
                        break
                if not found:
                    if ip in contents:
                        json_obj[ip][dir][name[0]] = True
                    else:
                        if len(contents) == 1:
                            json_obj[dir][name[0]] = contents[0]
                        else:
                            json_obj[dir][name[0]] = contents
                    f.close()
        break

# ─── DOMAINS ────────────────────────────────────────────────────────────────────

# json_obj["domains"] = {}

# f = open(path.join(loot, "domains", "targets-all-sorted.txt"))
# r = f.read().strip().split("\n")
# json_obj["domains"]["targets-scanned"] = r
# f.close()

# f = open(path.join(loot, "domains", "targets-all-unscanned.txt"))
# r = f.read().strip().split("\n")
# json_obj["domains"]["targets-unscanned"] = r
# f.close()

# f = open(path.join(loot, "domains", "domains-all-sorted.txt"))
# r = f.read().strip().split("\n")
# json_obj["domains"]["domains"] = r
# domains = r
# f.close()

# ─── NMAP ───────────────────────────────────────────────────────────────────────

# json_obj["nmap"] = {}

# f = open(path.join(loot, "nmap", "livehosts-sorted.txt"))
# domains = f.read().strip().split("\n")
# json_obj["domains"]["domains"] = domains
# f.close()

# ─── OUTPUT ─────────────────────────────────────────────────────────────────────

f = open(os.path.join(loot, "output.json"), "w")
f.write(json.dumps(json_obj, indent=4))
f.close()
print("Created JSON file at ", os.path.join(loot, "output.json"))
