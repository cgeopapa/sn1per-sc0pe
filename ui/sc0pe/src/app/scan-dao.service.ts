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

  public createScan(ip: string, type: string, scan: string) {
    const create = this.http.get(environment.url+"scan", {
      params: new HttpParams().appendAll({
        "ip": ip,
        "type": type,
        "scan": scan,
      })
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
}
