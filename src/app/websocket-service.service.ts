import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {Stomp} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Activity } from './modeles/activity';
import { AuthService } from './service/auth.service';
import { ConfigService } from './service/config.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketServiceService {

  constructor(private configService: ConfigService,
              private authService: AuthService,
              private router: Router) { }
  stompClient = null;
  disabled = true;


  setConnected(connected: boolean) {
    this.disabled = !connected;

    if (connected) {
    }
  }

  connect() {
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

  onMessageReceived(message){
    let activity: Activity = JSON.parse(message.body);
    this.onActivityReceived(activity);
  }

  onActivityReceived(activity: Activity){
    if(activity.student.id !== this.authService.getStudentInfo().id){
      if(activity.ressourceType === "WORK" && activity.type === "DISPLAY"){
        this.router.navigate(['/work', activity.student.id]);
      }
    }
  }

  sendInfo(info:any) {
    this.stompClient.subscribe('/topic/activity', this.onMessageReceived);
    this.stompClient.send(
      '/gkz/activity',
      {},
      JSON.stringify(info)
    );
  }
}
