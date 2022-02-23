import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScanDaoService } from '../scan-dao.service';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements OnInit {
  private scan = "";

  stdout: string[] = [];

  constructor(
    private dao: ScanDaoService,
    private router: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.router.queryParams.subscribe(q => {
      this.scan = q["scan"];
    });
    this.dao.getScanStdout(this.scan).subscribe((d: any) => {
      console.log(d);
      this.stdout.push(d);
    })
  }

}
