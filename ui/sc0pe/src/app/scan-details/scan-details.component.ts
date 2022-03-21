import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ScanDaoService } from '../scan-dao.service';

@Component({
  selector: 'app-scan-details',
  templateUrl: './scan-details.component.html',
  styleUrls: ['./scan-details.component.scss']
})
export class ScanDetailsComponent implements OnInit {
  scan = "";
  history: any = {};

  constructor(
    private dao: ScanDaoService,
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
    })
  }

  public home() {
    this.router.navigateByUrl("/");
  }

  public execute() {
    this.dao.runScan(this.scan);
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
