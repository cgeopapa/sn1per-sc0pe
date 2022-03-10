import sys
import os
import json

PATH = "/usr/share/sniper/loot/workspace"
workspace = sys.argv[1]

loot = os.path.join(PATH, workspace)
dirs = os.listdir(loot)

json_obj = {}
for dir in dirs:
    if dir not in ["output", "screenshots", "scans", "notes", "output.json", "reports", "scan.out", "scan.sh"]:
        json_obj[dir] = {}
        for (dirpath, d, files) in os.walk(os.path.join(loot, dir)):
            for file in files:
                name = os.path.splitext(file)
                if (name[1] not in [".xml", ".html", ".old", ".diff"]) and not name[0].startswith("websource-http") and name[0] not in ["targets", "websource-http"] and not name[0].endswith("-unsorted"):
                    f = open(os.path.join(dirpath, file), "r", encoding="unicode_escape")
                    contents = f.read().strip().split("\n")
                    contents = [c.strip() for c in contents]
                    if len(contents) == 1:
                        json_obj[dir][name[0]] = contents[0]
                    else:
                        json_obj[dir][name[0]] = contents
                    f.close()

f = open(os.path.join(loot, "output.json"), "w")
f.write(json.dumps(json_obj, indent=4))
f.close()
print("Created JSON file at ", os.path.join(loot, "output.json"))
