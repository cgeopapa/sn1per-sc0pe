import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { ConfigDaoService } from '../config-dao.service';
import { ScanDaoService } from '../scan-dao.service';

@Component({
  selector: 'app-scan-details',
  templateUrl: './scan-details.component.html',
  styleUrls: ['./scan-details.component.scss']
})
export class ScanDetailsComponent implements OnInit {
  scan = "";

  history: any = {};
  output: any = {};
  outputDomain: string[] = [];
  outputGeneral: string[] = [];

  summary: any[] = [];

  visible = false;
  scanObj: any = {};
  public readonly scanTypes: any[] = environment.scanTypes;
  public readonly scheduleTypes: any[] = environment.schedule;
  public invalidScanType = true;
  public invalidIpDomain = true;
  public invalidPort = true;
  public invalidScanName = true;
  public submitted = false;
  public configs: any = {};

  constructor(
    private dao: ScanDaoService,
    private configDao: ConfigDaoService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private titleService: Title,
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle(`Sc0pe - Results of ${this.scan}`)
    this.activeRoute.queryParams.subscribe(params => {
      this.scan = params['n'];
      this.dao.getScanHistory(params['n']).then((h: any) => {
        this.history = h;
      })
      this.dao.getOutput(this.scan).then((o: any) => {
        this.output = o;
        this.outputGeneral = Object.keys(this.output);
        console.log(this.output);
        
        this.output.domains.scanned.forEach((i: any) => {
          const webKeys = Object.keys(this.output[i].web);
          const headerKey = webKeys.find((l: string) => l.startsWith("headers-http"));
          const titleKey = webKeys.find((l: string) => l.startsWith("title-http"));

          let ip: any = {
            domain: i,
            ports: this.output[i].nmap.ports,
            fingerprint: this.output[i].nmap.osfingerprint,
            risk: this.output[i].vulnerabilities["vulnerability-risk"],
          }

          if(titleKey){
            ip["title"] = this.output[i].web[titleKey]
          }
          if(headerKey) {
            ip.server = this.output[i].web[headerKey].find((l: string) => l.startsWith("Server:"));
            ip.status = this.output[i].web[headerKey][0]
          }
          this.summary.push(ip);
          this.outputDomain.push(i);
          this.outputGeneral = this.outputGeneral.filter((k: string) => k !== i)
        });
      })
    })
    this.configDao.getConfigs().then((c: any) => {
      this.configs = c;
    })
  }

  public isList(obj: any) {
    return Array.isArray(obj);
  }

  public objectToDisplay(obj: any, subItem: string) {
    if(subItem === "pwned_emails") {
      const ret = [];
      for(let pwned of obj) {
        const breaches = pwned.Breaches? pwned.Breaches.length : 0;
        const pastes = pwned.Pastes? pwned.Pastes.length : 0;
        let lastBreach = new Date(0);
        let lastPaste = new Date(0);
        if (breaches !== 0) {
          lastBreach = new Date(Math.max.apply(Math, pwned.Breaches.map((b: any) => new Date(b.BreachDate))));
        }
        if(pastes !== 0) {
          lastPaste = new Date(Math.max.apply(Math, pwned.Pastes.map((b: any) => new Date(b.Date))));
        }
        const last = lastBreach > lastPaste ? lastBreach : lastPaste;
        ret.push(`${pwned.email} found in ${breaches} breaches and in ${pastes} pastes. Latest breach at ${last.toLocaleDateString('en-US')}`)
      }
      return ret.join("\n");
    }
    try {
      return obj.join("\n");
    }
    catch (e) {
      return obj;
    }
  }

  public getObjectKeys(obj: any) {
    return Object.keys(obj);
  }

  public isEmptyObject(obj: any) {
    return Object.keys(obj).length === 0;
  }

  public home() {
    this.router.navigateByUrl("/");
  }

  public config() {
    sessionStorage.setItem("config", "c");
    this.home();
  }

  public terminal() {
    window.open("/terminal?scan="+this.scan, "_blank")
  }

  public execute() {
    this.dao.runScan(this.scan);
  }

  public editScan() {
    this.visible = true;
    this.dao.getScan(this.scan).then((s: any) => {
      this.scanObj = s;
    })
  }

  public updateScan() {
    this.dao.updateScan(this.scan, this.scanObj).then(() => {
      this.visible = false;
      console.log(this.visible);
    })
  }

  public deleteScan() {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete <b>${this.scan}</b>? You will lose all results this scan has ever yeilded and this can not be undone.`,
      accept: () => {
        this.dao.deleteScan(this.scan).finally(() => this.home());
      }
    })
  }
}
