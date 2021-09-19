import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Activity } from '../modeles/activity';
import { Student } from '../modeles/student';
import { ActivityService } from '../service/activity.service';
import { AuthService } from '../service/auth.service';
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
    private authservice: AuthService
  ) { }

  ngOnInit() {
    this.activityService.getActivitiesToObserve().subscribe(
      activities => this.activitiesToObserve = activities
    )
  }

  observe(activity:Activity){
    this.websocketService.onActivityReceived(activity);
    let student: Student = this.authservice.getStudentInfo();
    student.studentObserved = activity.student;
    this.authservice.storeStudentInfo(student);
    this.studentService.updateStudent(activity.student).subscribe();
  }

  isActivitiesPresent(){
    return this.activitiesToObserve && this.activitiesToObserve.length > 0;
  }
}
