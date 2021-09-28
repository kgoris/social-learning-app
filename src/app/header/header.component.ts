import { Component, Input, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
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
  public userProfile: KeycloakProfile | null = null;
  
  constructor(private authService: AuthService,
    private menu : MenuController,
    private userService: UserService,
    private activityService: ActivityService,
    private keycloakService: KeycloakService) { }

  async ngOnInit() {
    this.userService.currentObservedStudent.subscribe(student => this.observedStudent = student); 
    this.userProfile = await this.keycloakService.loadUserProfile(); 
    
  }

  getUserFirstName(){
    return this.userProfile.firstName;
  }

  getUserName(){
    return this.userProfile.lastName;
  }
  getMenuId(){
    return this.menuIdCustom;
  }

  home(){
    return this.activityService.notifyHome(this.authService.getStudentInfo());
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
    this.keycloakService.logout();
  }
}
