import { Component, OnInit } from '@angular/core';
import { ScanDaoService } from '../scan-dao.service';

@Component({
  selector: 'app-scans',
  templateUrl: './scans.component.html',
  styleUrls: ['./scans.component.scss']
})
export class ScansComponent implements OnInit {
  scans: any[] = [];

  constructor(
    private dao: ScanDaoService
  ) { }

  ngOnInit(): void {
    this.dao.getAllScans().subscribe((s: any) => {
      this.scans = s
    })
  }

}
