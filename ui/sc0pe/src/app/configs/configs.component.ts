import { Component, OnInit } from '@angular/core';
import { ConfigDaoService } from '../config-dao.service';

@Component({
  selector: 'app-configs',
  templateUrl: './configs.component.html',
  styleUrls: ['./configs.component.scss']
})
export class ConfigsComponent implements OnInit {
  configs: any[] = [];

  transformedConfig: any = {};
  initialConfig: any = {};
  selectedConfig: any = {};
  configKeys: string[] = [];

  changes: boolean = false;
  visible = false;
  newConfigName: string | null = null;
  newConfigNameValid = true;

  constructor(
    private dao: ConfigDaoService
  ) { }

  ngOnInit(): void {
    this.getConfigs();
  }

  public change() {
    this.changes = true;
  }

  getConfigs() {
    this.dao.getConfigs().then((s: any) => {
      this.configs = s;
    })
  }

  getConfig(config: string) {
    this.dao.getConfig(config).then((s: any) => {
      this.selectedConfig = config;
      this.transformedConfig = this.transformConfig(s);
      this.initialConfig = {...this.transformedConfig}
      this.configKeys = Object.keys(this.transformedConfig);
    })
  }

  createNewConfig() {
    if(this.newConfigName && !(this.configs.includes(this.newConfigName))){
      this.newConfigNameValid = true;
      this.dao.createConfig(this.newConfigName).then(() => {
        this.getConfigs();
        this.visible = false;
      })
    }
    else {
      this.newConfigNameValid = false;
    }
  }

  newConfigNameRemoveSpaces() {
    this.newConfigName = this.newConfigName!.replace(" ", "_");
  }

  private transformConfig(c: any) {
    let ret: any = {};
    for(let key in c) {
      if(c[key] === "0" || c[key] === "1") {
        ret[key] = c[key] === "1";
      }
      else {
        ret[key] = c[key];
      }
    }
    console.log(ret);
    return ret;
  }
}
