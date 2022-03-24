import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  configs: any[] = [];
  index = 0;

  constructor(
    private title: Title
  ) { }

  ngOnInit(): void {
    if (sessionStorage.getItem("config")) {
      this.index = 1;
      sessionStorage.removeItem("config");
    }
    this.title.setTitle("Sc0pe")
  }

  getConfigs(configs: any) {
    this.configs = configs;
  }
}
