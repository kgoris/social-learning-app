import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Questionnaire } from '../modeles/questionnaire';
import { StudentQuestion } from '../modeles/student-question';
import { AuthService } from '../service/auth.service';
import { StudentQuestionService } from '../service/student-question-service';
import { WebsocketServiceService } from '../websocket-service.service';
import { WelcomeService } from '../welcome/welcome.service';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss'],
})
export class WorkComponent implements OnInit {
  
  studentQuestions : StudentQuestion[];
  questionnaires: Questionnaire[];
  lockedQuestionnaires: Questionnaire[];

  constructor(private studentQuestionService: StudentQuestionService,
              private router: Router,
              private welcomeService: WelcomeService,
              private authService: AuthService,
              private websocketService : WebsocketServiceService) {
                router.events.subscribe(event => {
                  if (event instanceof NavigationEnd) {
                    this.ngOnInit();
                  }
                });
               }

  ngOnInit() {
    this.studentQuestionService.findStudentQuestionsByStudent()
    .subscribe(
      value => {
        this.studentQuestions = value;        
      } 
    );
    this.welcomeService.getQuestionnairesWork().subscribe(
      questionnaireReceived => this.questionnaires = questionnaireReceived
    );
    this.welcomeService.getQuestionnaireLocked().subscribe(
      lq => this.lockedQuestionnaires = lq
    );
    this.websocketService.connect(this.listenToWebsocket);
  }

  selectAStudentQuestion(studentQuestion: StudentQuestion){

  }
  
  startNewQuestionnaire(questionnaire: Questionnaire){
    
  }
  
  startReviewModule(){

  }

  listenToWebsocket(hello){
    alert(hello);
  }

  testWS(){
    this.websocketService.sendInfo(this.authService.getStudentInfo());
  }
  visitQuestionnaire(questionnaireToVisit: Questionnaire){
    
    
    this.studentQuestionService.visit(questionnaireToVisit.id).subscribe(
      sq => {
        this.router.navigate(['/questionnaire', sq.id])
      }
    )
    
  }
}
