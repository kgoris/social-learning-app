import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Activity } from '../modeles/activity';
import { Student } from '../modeles/student';
import { ActivityService } from '../service/activity.service';
import { WebsocketServiceService } from '../websocket-service.service';

@Component({
  selector: 'app-observe',
  templateUrl: './observe.component.html',
  styleUrls: ['./observe.component.scss'],
})
export class ObserveComponent implements OnInit {

  activitiesToObserve: Activity[];

  constructor(
    private router: Router,
    private activityService: ActivityService,
    private websocketService: WebsocketServiceService
  ) { }

  ngOnInit() {
    this.activityService.getActivitiesToObserve().subscribe(
      activities => this.activitiesToObserve = activities
    )
  }

  observe(activity:Activity){
    this.websocketService.onActivityReceived(activity);
  }

  isActivitiesPresent(){
    return this.activitiesToObserve && this.activitiesToObserve.length > 0;
  }
}
