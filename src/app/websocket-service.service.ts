import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {Stomp} from '@stomp/stompjs';
import { Subject } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { Activity } from './modeles/activity';
import { Student } from './modeles/student';
import { AuthService } from './service/auth.service';
import { ConfigService } from './service/config.service';
import { UserService } from './service/user.service';


const ACTION_TYPE_DISPLAY: string = "DISPLAY";
const ACTION_TYPE_LOGOUT: string= "LOGOUT";
const ACTION_TYPE_TYPE: string = "TYPE";
const ACTION_TYPE_HOME: string = "HOME";

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
              private router: Router,
              private userService: UserService) { }
  stompClientComponent = null;
  disabled = true;
  activityQuestionObserver = new Subject<Activity>();
  public subscriberQuestionOberver = this.activityQuestionObserver.asObservable();

  emitDataQuestionObserver(data){
    this.activityQuestionObserver.next(data);
  }


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
    let currentStudent: Student = this.authService.getStudentInfo();
    
    if(currentStudent && activity.student && currentStudent.studentObserved && currentStudent.studentObserved.id === activity.student.id){
      this.onActivityReceived(activity);
    }
    
  }

  onActivityReceived(activity: Activity){
    if(activity.student.id !== this.authService.getStudentInfo().id){
      if(activity.ressourceType === RESSOURCE_TYPE_WORK && activity.type === ACTION_TYPE_DISPLAY){
        this.router.navigate(['/work', activity.student.id, 'true']);
      }else if(activity.ressourceType == RESSOURCE_TYPE_QUESTIONNAIRE && activity.type == ACTION_TYPE_DISPLAY){
        this.router.navigate(['questionnaire', activity.ressourceId, activity.student.id, 'true'])
      }else if(activity.ressourceType === RESSOURCE_TYPE_RESULTS && activity.type === ACTION_TYPE_DISPLAY){
        this.router.navigate(['results', activity.ressourceId, activity.student.id, 'true'])
      }else if(activity.ressourceType == RESSOURCE_TYPE_QUESTIONNAIRE && activity.type === ACTION_TYPE_TYPE){
        this.emitDataQuestionObserver(activity);
      }else if(activity.ressourceType === RESSOURCE_TYPE_HEADER &&  (activity.type === ACTION_TYPE_LOGOUT || activity.type === ACTION_TYPE_HOME)){
        this.router.navigate(['home']);
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
