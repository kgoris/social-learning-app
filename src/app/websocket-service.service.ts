import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {Stomp} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Activity } from './modeles/activity';
import { AuthService } from './service/auth.service';
import { ConfigService } from './service/config.service';


const ACTION_TYPE_DISPLAY: string = "DISPLAY";
const ACTION_TYPE_LOGOUT: string= "LOGOUT";
const ACTION_TYPE_TYPE: string = "TYPE";

const RESSOURCE_TYPE_QUESTIONNAIRE: string = "QUESTIONNAIRE";
const RESSOURCE_TYPE_HEADER: string = "HEADER";
const RESSOURCE_TYPE_RESULTS: string= "RESULTS";
const RESSOURCE_TYPE_WORK: string = "WORK";

@Injectable({
  providedIn: 'root'
})
export class WebsocketServiceService {

  constructor(private configService: ConfigService,
              private authService: AuthService,
              private router: Router) { }
  stompClientComponent = null;
  disabled = true;


  setConnected(connected: boolean) {
    this.disabled = !connected;

    if (connected) {
    }
  }

  connect() {
    const socket = new SockJS('http://localhost:9080/gkz-stomp-endpoint');
    let stompClient = Stomp.over(socket);

    const _this = this;
    stompClient.connect({}, function (frame) {
      _this.setConnected(true);
      console.log('Connected: ' + frame); 
      stompClient.subscribe('/topic/activity', message => {
        _this.onMessageReceived(message);
      });
    });
    
  }

  connectedCallBack(frame){
    
  }
  disconnect() {
    if (this.stompClientComponent != null) {
      this.stompClientComponent.disconnect();
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
      if(activity.ressourceType === RESSOURCE_TYPE_WORK && activity.type === ACTION_TYPE_DISPLAY){
        this.router.navigate(['/work', activity.student.id, 'true']);
      }else if(activity.ressourceType == RESSOURCE_TYPE_QUESTIONNAIRE && activity.type == ACTION_TYPE_DISPLAY){
        this.router.navigate(['questionnaire', activity.ressourceId, activity.student.id, 'true'])
      }else if(activity.ressourceType === RESSOURCE_TYPE_RESULTS && activity.type === ACTION_TYPE_DISPLAY){
        this.router.navigate(['results', activity.ressourceId, activity.student.id, 'true'])

      }
    }
  }

  sendInfo(info:any) {
    this.stompClientComponent.send(
      '/gkz/activity',
      {},
      JSON.stringify(info)
    );
  }
}
