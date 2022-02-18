import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {


  constructor() {}
  
  public connect(): void {
    const subject = webSocket({
      url: "ws://10.226.32.205:8080",
      deserializer: msg => msg
    })
    subject.subscribe((msg: any) => {
      console.log(msg.data)
    });
  }
}
