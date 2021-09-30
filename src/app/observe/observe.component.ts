import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { Activity } from '../modeles/activity';
import { Student } from '../modeles/student';
import { ActivityService } from '../service/activity.service';
import { StudentService } from '../service/student.service';
import { UserService } from '../service/user.service';
import { WebsocketServiceService } from '../websocket-service.service';

@Component({
  selector: 'app-observe',
  templateUrl: './observe.component.html',
  styleUrls: ['./observe.component.scss'],
})
export class ObserveComponent implements OnInit {

  activitiesToObserve: Activity[];
  observedStudent: Student;

  constructor(
    private router: Router,
    private activityService: ActivityService,
    private websocketService: WebsocketServiceService,
    private studentService: StudentService,
    private keycloakService: KeycloakService
  ) { }

  ngOnInit() {
    this.activityService.getActivitiesToObserve().subscribe(
      activities => this.activitiesToObserve = activities
    )
  }

  async observe(activity:Activity){
    this.websocketService.onActivityReceived(activity);
    let userProfile = await this.keycloakService.loadUserProfile();
    this.studentService.linkObervedUserOnAUser(userProfile.username, activity.studentUsername).subscribe();
  }

  isActivitiesPresent(){
    return this.activitiesToObserve && this.activitiesToObserve.length > 0;
  }
}
