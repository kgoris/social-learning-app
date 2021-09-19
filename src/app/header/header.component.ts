import { Component, Input, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Student } from '../modeles/student';
import { ActivityService } from '../service/activity.service';
import { AuthService } from '../service/auth.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input("menuIdCustom") menuIdCustom;

  observedStudent: Student;

  constructor(private authService: AuthService,
    private menu : MenuController,
    private userService: UserService,
    private activityService: ActivityService) { }

  ngOnInit() {
    this.userService.currentObservedStudent.subscribe(student => this.observedStudent = student);    
  }

  getUserFirstName(){
    let student: Student = this.authService.getStudentInfo();
    if(!!student){
      return student.firstName
    }
    return null;
  }
  getMenuId(){
    return this.menuIdCustom;
  }

  home(){
    return this.activityService.notifyHome(this.authService.getStudentInfo());
  }

  getUserName(){
    let student: Student = this.authService.getStudentInfo();
    if(!!student){
      return student.name
    }
    return null;
  }
  authenticated(){
    return this.authService.isLoggedIn();
  }

  openMenu(){
    this.menu.enable(true, this.menuIdCustom);
  }
  closeMenu(){
    this.menu.close(this.menuIdCustom);
  }

  logout() {
    this.activityService.notifiyLogout(this.authService.getStudentInfo())
    this.authService.logout();
  }
}
