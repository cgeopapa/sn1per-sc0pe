import { Component, Input, OnInit } from '@angular/core';
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
  ) { }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe(params => {
      this.scan = params['n'];
      this.dao.getScanHistory(params['n']).then((h: any) => {
        this.history = h;
      })
      this.dao.getOutput(this.scan).then((o: any) => {
        this.output = o;
        console.log(this.output);

        this.output.domains.scanned.forEach((i: any) => {
          let ip = {
            domain: i,
            ports: this.output[i].nmap.ports,
            title: this.output[i].web["title-http"],
            server: this.output[i].web["headers-http"].find((l: string) => l.startsWith("Server:")),
            status: this.output[i].web["headers-http"][0],
            fingerprint: this.output[i].nmap.osfingerprint,
            risk: this.output[i].vulnerabilities["vulnerability-risk"],
          }
          this.summary.push(ip)
        });
      })
    })
    this.configDao.getConfigs().then((c: any) => {
      this.configs = c;
    })
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
