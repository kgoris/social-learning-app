import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Questionnaire } from '../modeles/questionnaire';
import { Student } from '../modeles/student';
import { StudentService } from '../service/student.service';
import { UserService } from '../service/user.service';
import { WelcomeService } from './welcome.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['welcome.component.css'],
  //providers : [WelcomeService]
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
    private studentService: StudentService,
    private router: Router,
    private keycloakService: KeycloakService) {
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
    this.studentService.findByLogin(this.userProfile.username).subscribe(
      student => {
        this.welcomeService.getQuestionnairesWork(student).subscribe(
          questionnaireReceived => this.questionnairesWork = questionnaireReceived
        );
      }
    )
    
  }

  getQuestionnaireObserver(){
    this.welcomeService.getQuestionnairesObserve().then(promise => promise.subscribe(
      questionnaireReceived => this.questionnaireObserve = questionnaireReceived
    ));
  }

  goToWork(){
    this.router.navigate(['/work/' + this.userProfile.username + '/' + 'false']);
  }
}
