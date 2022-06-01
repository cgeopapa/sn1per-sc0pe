from random import random
from time import sleep
from urllib.parse import quote
import cloudscraper
import sys
import json
from os import path

def checkMails():
    scraper = cloudscraper.create_scraper(interpreter='nodejs')
    scraper.get("https://haveibeenpwned.com/unifiedsearch/aaa")
    sleep(random()*3)
    if len(sys.argv) == 3:
        dir = path.dirname(sys.argv[1])
        with open(sys.argv[1], "r") as emails:
            result = []
            for email in emails:
                urlencoded = quote(email.strip())
                req = scraper.get(f"https://haveibeenpwned.com/unifiedsearch/{urlencoded}")
                if req.status_code == 403 or req.status_code == 429:
                    print(f"Got resonse code {req.status_code}")
                    del scraper
                    return False
                resp = str(req.text).strip()
                if req.status_code == 200:
                    print(f"{email.strip()} is PWNED")
                    result.append(json.loads(resp))
        domain = sys.argv[2]
        with open(path.join(dir, f"pwned_emails-{domain}.json"), "w") as pwned:
            pwned.write(json.dumps(result, indent=1))


if __name__ == "__main__":
    res = checkMails()
    while res == False:
        w = round(random()*30 + 60, 1)
        print(f"Retrying after {w} secconds")
        sleep(w)
        res = checkMails()
