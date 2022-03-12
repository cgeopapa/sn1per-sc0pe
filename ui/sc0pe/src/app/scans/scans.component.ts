import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { ScanDaoService } from '../scan-dao.service';

@Component({
  selector: 'app-scans',
  templateUrl: './scans.component.html',
  styleUrls: ['./scans.component.scss']
})
export class ScansComponent implements OnInit {
  @Input() configs: any = {};
  
  scans: any[] = [];
  scanStatus: any = {};

  public selectedConfig: string | null = null;
  public selectedScanType: string | null = null;
  public ipDomain: string | null = null;
  public port: number | null = null;
  public selectedScheduleType: string | null = null;
  public scanName: string | null = null;
  public fp = false;
  public b = false;
  public o = false;
  public r = false;

  public invalidScanType = true;
  public invalidIpDomain = true;
  public invalidPort = true;
  public invalidScanName = true;
  public submitted = false;

  public readonly scanTypes: any[] = environment.scanTypes;
  public readonly scheduleTypes: any[] = environment.schedule;

  constructor(
    private dao: ScanDaoService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.getScans();
    console.table(this.configs);

    this.dao.getScanStatus().subscribe((msg: any) => {
      this.scanStatus = JSON.parse(msg);
    })
  }

  deleteScan(scan: string) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete <b>${scan}</b>? You will lose all results this scan has ever yeilded and this can not be undone.`,
      accept: () => {
        this.dao.deleteScan(scan).finally(() => this.getScans());
      }
    })
  }
  
  getScans() {
    this.dao.getAllScans().then((s: any) => this.scans = s)
  }

  public createScan(shouldRun = false) {
    this.submitted = true;
    
    this.invalidScanType = !this.selectedScanType;
    this.invalidIpDomain = !this.ipDomain;
    this.invalidPort = !this.port && this.selectedScanType === "port";
    this.invalidScanName = !this.scanName || this.scans.includes(this.scanName);
    
    if(!this.invalidIpDomain && !this.invalidPort && !this.invalidScanName && !this.invalidScanType){
      this.dao.createScan(
        this.ipDomain!, 
        this.selectedScanType!, 
        this.scanName!,
        this.port,
        this.selectedScheduleType,
        this.selectedConfig,
        this.fp,
        this.b,
        this.o,
        this.r
      ).finally(() => {
        this.getScans();

        if(shouldRun){
          this.runScan(this.scanName!);
        }
        
        this.submitted = false;
        this.selectedScanType = this.selectedScheduleType = this.port = this.ipDomain = this.scanName = null;
        this.fp = this.b = this.o = this.r = false;
      });

    }
  }

  public runScan(scan: string) {
    this.dao.runScan(scan);
  }

  public viewScan(scan:string) {
    window.open("/terminal?scan="+scan, "_blank")
  }

}
