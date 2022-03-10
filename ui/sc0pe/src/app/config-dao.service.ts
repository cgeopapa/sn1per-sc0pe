import { HttpClient, HttpParams } from '@angular/common/http';
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
}
