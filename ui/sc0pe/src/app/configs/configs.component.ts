import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ConfigDaoService } from '../config-dao.service';

@Component({
  selector: 'app-configs',
  templateUrl: './configs.component.html',
  styleUrls: ['./configs.component.scss']
})
export class ConfigsComponent implements OnInit {
  configs: any[] = [];
  @Output() configsEvent = new EventEmitter<any[]>();

  transformedConfig: any = {};
  initialConfig: any = {};
  selectedConfig = "None";
  configKeys: string[] = [];

  changes: boolean = false;
  visible = false;
  newConfigName: string | null = null;
  newConfigNameValid = true;

  constructor(
    private dao: ConfigDaoService,
    private confirmationService: ConfirmationService,
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
      this.configsEvent.emit(this.configs);
    })
  }

  getConfig(config: string) {
    if(this.changes) {
      this.confirmationService.confirm({
        message: "You have unsaved changes in this configuration file. Are you sure you want to switch to an other one? You will lose all unsaved changes.",
        accept: () => {
          this.changeConfig(config);
        }
      })
    }
    else {
      this.changeConfig(config);
    }
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

  deleteConfirm(config: string) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the configuration file <b>${config}</b>? You can not undo this action.`,
      accept: () => {
        this.dao.deleteConfig(config).then(() => {
          this.getConfigs();
        })
      }
    })
  }

  updateConfig() {
    this.dao.updateConfig(this.selectedConfig, this.transformedConfig).then(() => {
      this.getConfig(this.selectedConfig);
      this.changes = false;
    })
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

  private changeConfig(config: string){
    this.dao.getConfig(config).then((s: any) => {
      this.selectedConfig = config;
      this.transformedConfig = this.transformConfig(s);
      this.initialConfig = {...this.transformedConfig}
      this.configKeys = Object.keys(this.transformedConfig);
      this.changes = false;
    })
  }
}
