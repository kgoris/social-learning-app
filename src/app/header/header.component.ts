import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Student } from '../modeles/student';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

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
    this.menu.enable(true, "first");
  }
  closeMenu(){
    this.menu.close('first');
  }

  logout() {
    this.authService.logout();
  }
}
