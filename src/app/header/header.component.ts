import { Component, Input, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { Student } from '../modeles/student';
import { ActivityService } from '../service/activity.service';
import { StudentService } from '../service/student.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input("menuIdCustom") menuIdCustom;

  observedStudent: Student;
  public userProfile: KeycloakProfile | null = null;
  public currentUser: Student;
  
  constructor(
    private menu : MenuController,
    private studentService: StudentService,
    private activityService: ActivityService,
    private keycloakService: KeycloakService) { }

  async ngOnInit() {
    this.userProfile = await this.keycloakService.loadUserProfile(); 
    //this.keycloakService.loadUserProfile().then(userProfile => {
    //  this.userProfile = userProfile
    //  
    //});    
  }

  getUserFirstName(){
    return this.userProfile?.firstName;
  }

  getUserName(){
    return this.userProfile?.lastName;
  }
  getMenuId(){
    return this.menuIdCustom;
  }

  home(){
    return this.activityService.notifyHome(this.userProfile.username);
  }

  openMenu(){
    this.menu.enable(true, this.menuIdCustom);
  }
  closeMenu(){
    this.menu.close(this.menuIdCustom);
  }

  logout() {
    this.activityService.notifiyLogout(this.userProfile.username)
    this.keycloakService.logout();
  }
}
