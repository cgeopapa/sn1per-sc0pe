import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  configs: any[] = [];
  index = 0;

  constructor() { }

  ngOnInit(): void {
    if (sessionStorage.getItem("config")) {
      this.index = 1;
      sessionStorage.removeItem("config");
    }
  }

  getConfigs(configs: any) {
    this.configs = configs;
  }
}
