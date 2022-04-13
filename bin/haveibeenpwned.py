from random import random
from time import sleep
from urllib.parse import urlencode
import cloudscraper
import sys
import json
import urllib.parse
from os import path

def checkMails():
    scraper = cloudscraper.create_scraper(delay=9)
    scraper.get("https://haveibeenpwned.com/unifiedsearch/aaa")
    if len(sys.argv) == 2:
        dir = path.dirname(sys.argv[1])
        with open(sys.argv[1], "r") as emails:
            result = ""
            for email in emails:
                urlencoded = urllib.parse.quote(email.strip())
                req = scraper.get(f"https://haveibeenpwned.com/unifiedsearch/{urlencoded}")
                if req.status_code == 403 or req.status_code == 429:
                    print(f"Got resonse code {req.status_code}")
                    return False
                resp = str(req.text).strip()
                print(req.status_code)
                if req.status_code == 200:
                    j = json.loads(resp)
                    result += json.dumps(j, indent=1)
        print(result)


if __name__ == "__main__":
    res = checkMails()
    while res == False:
        w = round(random()*20 + 10, 1)
        print(f"Retrying after {w} secconds")
        sleep(w)
        res = checkMails()
