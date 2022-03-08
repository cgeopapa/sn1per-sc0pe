import sys
import os
import json

PATH = "/usr/share/sniper/loot/workspace"
workspace = sys.argv[1]

loot = os.path.join(PATH, workspace)
dirs = os.listdir(loot)

json_obj = {}
for dir in dirs:
    if dir not in ["output", "screenshots", "scans", "notes", "output.json", "reports"]:
        json_obj[dir] = {}
        for (dirpath, d, files) in os.walk(os.path.join(loot, dir)):
            for file in files:
                name = os.path.splitext(file)
                if name[1] != ".xml" or ("websource-http" in name[0]):
                    f = open(os.path.join(dirpath, file), "r")
                    contents = f.read().split("\n")
                    json_obj[dir][name[0]] = contents
                f.close()

f = open(os.path.join(loot, "output.json"), "w")
f.write(json.dumps(json_obj, indent=4))
