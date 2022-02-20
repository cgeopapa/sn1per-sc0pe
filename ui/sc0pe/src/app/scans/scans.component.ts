import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ScanDaoService } from '../scan-dao.service';

@Component({
  selector: 'app-scans',
  templateUrl: './scans.component.html',
  styleUrls: ['./scans.component.scss']
})
export class ScansComponent implements OnInit {
  scans: any[] = [];

  public selectedScanType: string | null = null;
  public ipDomain: string | null = null;
  public scanName: string | null = null;
  public readonly scanTypes: any[] = environment.scanTypes;

  constructor(
    private dao: ScanDaoService
  ) { }

  ngOnInit(): void {
    this.getScans();
  }

  deleteScan(scan: string) {
    this.dao.deleteScan(scan).finally(() => this.getScans());
  }
  
  getScans() {
    this.dao.getAllScans().then((s: any) => this.scans = s)
  }

  public createScan() {
    this.dao.createScan(this.ipDomain!, this.selectedScanType!, this.scanName!).finally(() => {
      this.getScans();
      this.selectedScanType = this.ipDomain = this.scanName = null;
    });
  }

  public runScan(scan: string) {
    this.dao.runScan(scan);
  }

  public viewScan(scan:string) {
    window.open("/terminal?scan="+scan, "_blank")
  }

}
