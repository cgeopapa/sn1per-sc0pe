import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe(params => {
      this.scan = params['n'];
      this.dao.getScanHistory(params['n']).then((h: any) => {
        this.history = h;
        console.table(this.history);
      })
    })
  }

  public home() {
    this.router.navigateByUrl("/");
  }

}
