import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
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
  
  constructor(
    private welcomeService:WelcomeService,
    private menu : MenuController,
    private userService: UserService,
    private http: HttpClient,
    private authService: AuthService) {
  }

  authenticated(){
    return this.authService.isLoggedIn();
  }

  ngOnInit(): void {

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

  startApp(){
    this.getQuestionnairesWork();
    this.getQuestionnaireObserver();
    this.start = true;
  }

  getQuestionnairesWork(){
    this.welcomeService.getQuestionnairesWork().subscribe(
      questionnaireReceived => this.questionnairesWork = questionnaireReceived
    );
  }

  getQuestionnaireObserver(){
    this.welcomeService.getQuestionnairesObserve().subscribe(
      questionnaireReceived => this.questionnaireObserve = questionnaireReceived
    );
  }
}
