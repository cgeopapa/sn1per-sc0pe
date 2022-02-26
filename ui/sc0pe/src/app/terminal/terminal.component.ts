import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ScanDaoService } from '../scan-dao.service';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements OnInit {
  private scan = "";
  private pre: any;

  stdout: string[] = [];

  constructor(
    private dao: ScanDaoService,
    private router: ActivatedRoute,
    private title: Title
  ) {}

  ngOnInit(): void {
    this.router.queryParams.subscribe(q => {
      this.scan = q["scan"];
      this.title.setTitle(`Sc0pe - Stdout of ${this.scan}`)
    });
    this.pre = document.getElementById("pre");
    this.dao.getScanStdout(this.scan).subscribe((d: any) => {
      this.pre!.innerHTML += d;
      this.scrollToBottom();
    })
  }
  
  public scrollToBottom() {
    window.scrollTo(0,document.body.scrollHeight);
  }
}
