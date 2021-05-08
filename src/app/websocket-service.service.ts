import { Injectable } from '@angular/core';
import {Stomp} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { ConfigService } from './service/config.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketServiceService {

  constructor(private configService: ConfigService) { }
  stompClient = null;
  disabled = true;


  setConnected(connected: boolean) {
    this.disabled = !connected;

    if (connected) {
    }
  }

  connect(functionCallback:any) {
    const socket = new SockJS('http://localhost:9080/gkz-stomp-endpoint');
    this.stompClient = Stomp.over(socket);

    const _this = this;
    this.stompClient.connect({}, function (frame) {
      _this.setConnected(true);
      console.log('Connected: ' + frame);

 
    });
  }

  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }

    this.setConnected(false);
    console.log('Disconnected!');
  }

  sendInfo(info:any) {
    this.stompClient.subscribe('/topic/hi', function (hello) {
      alert(JSON.parse(hello.body).studentDto.firstName);
    });
    this.stompClient.send(
      '/gkz/hello',
      {},
      JSON.stringify(info)
    );
  }
}
