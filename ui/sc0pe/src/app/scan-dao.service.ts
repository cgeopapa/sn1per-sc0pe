import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScanDaoService {

  constructor(
    private http: HttpClient
  ) { }

  public getAllScans() {
    const scans = this.http.get(environment.url+"scans", {
      observe: "body",
    })
    return firstValueFrom(scans)
  }

  public deleteScan(scan: string) {
    const del = this.http.delete(environment.url+"scan", {
      params: new HttpParams().append("scan", scan)
    })
    return firstValueFrom(del);
  }

  public killScan(scan: string) {
    const del = this.http.get(environment.url+"killscan", {
      params: new HttpParams().append("scan", scan)
    })
    return firstValueFrom(del);
  }

  public createScan(ip: string, type: string, scan: string, port: number | null, sch: string | null, config: string | null, fp: boolean, b: boolean, o: boolean, r: boolean) {
    let params = new HttpParams().appendAll({
      "ip": ip,
      "type": type,
      "scan": scan,
    })
    if(port) params = params.append("port", port)
    if(sch) params = params.append("sch", sch)
    if(config) params = params.append("config", config)
    if(fp) params = params.append("fp", fp)
    if(b) params = params.append("b", b)
    if(o) params = params.append("o", o)
    if(r) params = params.append("r", r)
    const create = this.http.post(environment.url+"scan", null, {
      params: params
    })
    return firstValueFrom(create);
  }

  public runScan(scan: string) {
    const run = this.http.get(environment.url+"exec", {
      params: new HttpParams().set("scan", scan)
    })
    return firstValueFrom(run);
  }

  public getScanStatus() {
    const ws = webSocket({
      url: environment.ws,
      deserializer: (e: any) => e.data.toString(),
      serializer: (e: any) => e.toString()
    });
    ws.next("scans");
    return ws;
  }

  public getScanStdout(scan: string) {
    const stdout = webSocket({
      url: environment.ws,
      deserializer: (e: any) => e.data.toString(),
      serializer: (e: any) => e.toString()
    });
    stdout.next('pls '+scan);
    return stdout;
  }

  public getScanHistory(scan: string) {
    const run = this.http.get(environment.url+"history", {
      params: new HttpParams().set("scan", scan)
    })
    return firstValueFrom(run);
  }

  public getScan(scan: string) {
    const run = this.http.get(environment.url+"scan", {
      responseType: "json",
      params: new HttpParams().set("scan", scan),
    })
    return firstValueFrom(run);
  }

  public updateScan(scan: string, scanObj: any) {
    const run = this.http.put(environment.url+"scan", scanObj, {
      responseType: 'text',
      params: new HttpParams().set("scan", scan),
    })
    return firstValueFrom(run);
  }

  public getOutput(scan: string) {
    const run = this.http.get(environment.url+"output", {
      responseType: "json",
      params: new HttpParams().set("scan", scan)
    })
    return firstValueFrom(run);
  }

}
