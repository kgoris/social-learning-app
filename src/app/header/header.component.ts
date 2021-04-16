import { Component, Input, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Student } from '../modeles/student';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input("menuIdCustom") menuIdCustom;

  constructor(private authService: AuthService,
    private menu : MenuController) { }

  ngOnInit() {}

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
    alert("hello");
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
    this.authService.logout();
  }
}
