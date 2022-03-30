[![Sn1perSecurity](https://sn1persecurity.com/images/Sn1perSecurity-Attack-Surface-Management-header2.png)](https://sn1persecurity.com)

## ABOUT:
Discover the attack surface and prioritize risks with our continuous Attack Surface Management (ASM) platform - Sn1per Professional. For more information, go to https://sn1persecurity.com.

## FEATURES:
### Attack Surface Discovery
Easily discover the attack surface (IPs, domain names, open ports, HTTP headers, etc.).
### Penetration Testing
Automate the discovery of vulnerabilities and ethical exploitation using the latest hacking and open source security tools.
### Visual Recon
Perform visual recon against all hosts in your workspace using the Slideshow widget and thumbnails.
### IT Asset Inventory
Search, sort and filter for DNS, IP, title, status, server headers, WAF and open TCP/UDP ports of the entire attack surface inventory.
### Red Team
Strengthen "blue team" response and detection capabilities against automated penetration testing techniques.
### Notepad
Store and access multiple notes in a single location to help manage your data and keep things organized.
### Vulnerability Management
Quickly scan for the latest vulnerabilities and CVEs using the latest commercial and open source vulnerability scanners.
### Web Application Scans
Launch web application scans via Burpsuite Professional 2.x, Arachni and Nikto.
### Reporting
Export the entire attack surface host list and vulnerability reports to CSV, XLS or PDF format to filter, sort and view all attack surface data.
### OSINT Collection
Collect online documents, meta data, email addresses and contact information automatically.
### Continuous Scan Coverage
Schedule scans on a daily, weekly or monthly basis for continuous coverage for changes.
### Bug Bounty
Automate the discovery of the attack surface and scan for the latest vulnerabilities and CVEs easily.
### Notifications & Changes
Receive notifications for scan and host status changes, URL and domain changes and new vulnerabilities discovered.
### Domain Takeovers
List all DNS records vulnerable to domain hijacking and takeover.

## KALI/UBUNTU/DEBIAN/PARROT LINUX INSTALL:
```
cd Sn1per
bash install.sh
```

## INTERFACE USAGE:
```
sudo sniperSc0pe
```

## CLI USAGE:
```
[*] NORMAL MODE
sniper -t <TARGET>

[*] NORMAL MODE + OSINT + RECON
sniper -t <TARGET> -o -re

[*] STEALTH MODE + OSINT + RECON
sniper -t <TARGET> -m stealth -o -re

[*] DISCOVER MODE
sniper -t <CIDR> -m discover -w <WORSPACE_ALIAS>

[*] SCAN ONLY SPECIFIC PORT
sniper -t <TARGET> -m port -p <portnum>

[*] FULLPORTONLY SCAN MODE
sniper -t <TARGET> -fp

[*] WEB MODE - PORT 80 + 443 ONLY!
sniper -t <TARGET> -m web

[*] HTTP WEB PORT MODE
sniper -t <TARGET> -m webporthttp -p <port>

[*] HTTPS WEB PORT MODE
sniper -t <TARGET> -m webporthttps -p <port>

[*] HTTP WEBSCAN MODE
sniper -t <TARGET> -m webscan 

[*] ENABLE BRUTEFORCE
sniper -t <TARGET> -b

[*] AIRSTRIKE MODE
sniper -f targets.txt -m airstrike

[*] NUKE MODE WITH TARGET LIST, BRUTEFORCE ENABLED, FULLPORTSCAN ENABLED, OSINT ENABLED, RECON ENABLED, WORKSPACE & LOOT ENABLED
sniper -f targets.txt -m nuke -w <WORKSPACE_ALIAS>

[*] MASS PORT SCAN MODE
sniper -f targets.txt -m massportscan

[*] MASS WEB SCAN MODE
sniper -f targets.txt -m massweb

[*] MASS WEBSCAN SCAN MODE
sniper -f targets.txt -m masswebscan

[*] MASS VULN SCAN MODE
sniper -f targets.txt -m massvulnscan

[*] PORT SCAN MODE
sniper -t <TARGET> -m port -p <PORT_NUM>

[*] LIST WORKSPACES
sniper --list

[*] DELETE WORKSPACE
sniper -w <WORKSPACE_ALIAS> -d

[*] DELETE HOST FROM WORKSPACE
sniper -w <WORKSPACE_ALIAS> -t <TARGET> -dh

[*] GET SNIPER SCAN STATUS
sniper --status

[*] LOOT REIMPORT FUNCTION
sniper -w <WORKSPACE_ALIAS> --reimport

[*] LOOT REIMPORTALL FUNCTION
sniper -w <WORKSPACE_ALIAS> --reimportall

[*] LOOT REIMPORT FUNCTION
sniper -w <WORKSPACE_ALIAS> --reload

[*] LOOT EXPORT FUNCTION
sniper -w <WORKSPACE_ALIAS> --export

[*] SCHEDULED SCANS
sniper -w <WORKSPACE_ALIAS> -s daily|weekly|monthly

[*] USE A CUSTOM CONFIG
sniper -c /path/to/sniper.conf -t <TARGET> -w <WORKSPACE_ALIAS>

[*] UPDATE SNIPER
sniper -u|--update
```

## MODES:
* **NORMAL:** Performs basic scan of targets and open ports using both active and passive checks for optimal performance.
* **STEALTH:** Quickly enumerate single targets using mostly non-intrusive scans to avoid WAF/IPS blocking.
* **FLYOVER:** Fast multi-threaded high level scans of multiple targets (useful for collecting high level data on many hosts quickly).
* **AIRSTRIKE:** Quickly enumerates open ports/services on multiple hosts and performs basic fingerprinting. To use, specify the full location of the file which contains all hosts, IPs that need to be scanned and run ./sn1per /full/path/to/targets.txt airstrike to begin scanning.
* **NUKE:** Launch full audit of multiple hosts specified in text file of choice. Usage example: ./sniper /pentest/loot/targets.txt nuke.
* **DISCOVER:** Parses all hosts on a subnet/CIDR (ie. 192.168.0.0/16) and initiates a sniper scan against each host. Useful for internal network scans.
* **PORT:** Scans a specific port for vulnerabilities. Reporting is not currently available in this mode.
* **FULLPORTONLY:** Performs a full detailed port scan and saves results to XML.
* **MASSPORTSCAN:** Runs a "fullportonly" scan on mutiple targets specified via the "-f" switch.
* **WEB:** Adds full automatic web application scans to the results (port 80/tcp & 443/tcp only). Ideal for web applications but may increase scan time significantly.
* **MASSWEB:** Runs "web" mode scans on multiple targets specified via the "-f" switch.
* **WEBPORTHTTP:** Launches a full HTTP web application scan against a specific host and port.
* **WEBPORTHTTPS:** Launches a full HTTPS web application scan against a specific host and port.
* **WEBSCAN:** Launches a full HTTP & HTTPS web application scan against via Burpsuite and Arachni.
* **MASSWEBSCAN:** Runs "webscan" mode scans of multiple targets specified via the "-f" switch.
* **VULNSCAN:** Launches a OpenVAS vulnerability scan.
* **MASSVULNSCAN:** Launches a "vulnscan" mode scans on multiple targets specified via the "-f" switch.
