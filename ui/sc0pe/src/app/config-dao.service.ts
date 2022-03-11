import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigDaoService {

  constructor(
    private http: HttpClient
  ) { }

  public getConfigs() {
    const configs = this.http.get(environment.url+"configs", {
      observe: "body",
    })
    return lastValueFrom(configs)
  }

  public getConfig(config: string) {
    const configs = this.http.get(environment.url+"config", {
      params: new HttpParams().set("config", config),
      observe: "body",
    })
    return lastValueFrom(configs)
  }

  public createConfig(config: string) {
    const configs = this.http.post(environment.url+"config", null, {
      params: new HttpParams().set("config", config),
      observe: "body",
      responseType: "text"
    })
    return lastValueFrom(configs)
  }

  public deleteConfig(config: string) {
    const configs = this.http.delete(environment.url+"config", {
      params: new HttpParams().set("config", config),
      observe: "body",
      responseType: "text"
    })
    return lastValueFrom(configs)
  }

  public updateConfig(configName: string, config: any) {
    const configs = this.http.put(environment.url+"config", config, {
      params: new HttpParams().set("config", configName),
      observe: "body",
      responseType: "text",
      headers: new HttpHeaders().set("Content-Type", "application/json"),
    })
    return lastValueFrom(configs)
  }
}
