import { Component, OnInit } from '@angular/core';
import { ConfigDaoService } from '../config-dao.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  configs: any[] = [];

  constructor(
    private configDao: ConfigDaoService
  ) { }

  ngOnInit(): void {
    this.getConfigs();
  }

  getConfigs() {
    this.configDao.getConfigs().then((s: any) => {
      this.configs = s;
    })
  }
}
