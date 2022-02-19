import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScanDaoService {

  constructor(
    private http: HttpClient
  ) { }

  public getAllScans() {
    return this.http.get(environment.url+"scans", {
      observe: "body",
    })
  }
}
