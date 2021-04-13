import { Component } from '@angular/core';

import { MenuController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './service/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { take, finalize } from 'rxjs/operators';
import { UserService } from './service/user.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent{
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menu : MenuController,
    private authService: AuthService,
    private http: HttpClient, 
    private router: Router,
    private userService: UserService
  ) {
    this.initializeApp();
  }




  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
