import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Questionnaire } from '../modeles/questionnaire';
import { Student } from '../modeles/student';
import { AuthService } from '../service/auth.service';
import { UserService } from '../service/user.service';
import { WelcomeService } from './welcome.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['welcome.component.css'],
  providers : [WelcomeService]
})
export class WelcomeComponent  implements OnInit{

  public students: Student[];
  questionnairesWork : Questionnaire[];
  questionnaireObserve : Questionnaire[];
  backHome: boolean = true;
  start: boolean = false;
  observeSelected : boolean = false;
  workSelected: boolean =false ; 
  public userProfile: KeycloakProfile | null = null;
  
  constructor(
    private welcomeService:WelcomeService,
    private userService: UserService,
    private http: HttpClient,
    private router: Router,
    private keycloakService: KeycloakService) {
  }

  //TODO refactor
  authenticated(){
    //return this.authService.isLoggedIn();
    return true;
  }

  async ngOnInit(): Promise<void> {
    this.userProfile = await this.keycloakService.loadUserProfile();
  }

  getUserFirstName(){
    return this.userProfile.firstName;
  }

  getUserName(){
    return this.userProfile.lastName;
  }

  startApp(){
    this.getQuestionnairesWork();
    this.getQuestionnaireObserver();
    this.start = true;
  }

  getQuestionnairesWork(){
    this.welcomeService.getQuestionnairesWork(null).subscribe(
      questionnaireReceived => this.questionnairesWork = questionnaireReceived
    );
  }

  getQuestionnaireObserver(){
    this.welcomeService.getQuestionnairesObserve().subscribe(
      questionnaireReceived => this.questionnaireObserve = questionnaireReceived
    );
  }

  goToWork(){
    this.router.navigate(['/work/' + this.userProfile.username + '/' + 'false']);
  }
}
