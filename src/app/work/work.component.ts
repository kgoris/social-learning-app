import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { mergeMap } from 'rxjs/operators';
import { Questionnaire } from '../modeles/questionnaire';
import { Student } from '../modeles/student';
import { StudentQuestion } from '../modeles/student-question';
import { ActivityService } from '../service/activity.service';
import { StudentQuestionService } from '../service/student-question-service';
import { StudentService } from '../service/student.service';
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
  workingStudent: Student;  
  connectedUser: KeycloakProfile;
  activitySent: boolean = false;
  observeMode : boolean = false;

  constructor(private studentQuestionService: StudentQuestionService,
              private router: Router,
              private route: ActivatedRoute,
              private welcomeService: WelcomeService,
              private keycloakService: KeycloakService,
              private websocketService : WebsocketServiceService,
              private studentService: StudentService,
              private activityService: ActivityService) {
                router.events.subscribe(event => {
                  if (event instanceof NavigationEnd) {
                    this.ngOnInit();
                  }
                });
               }

  ngOnInit() {
    this.route.paramMap.pipe(
      mergeMap(params => {
        let studentUsername = params.get('studentUsername');
        this.observeMode = params.get('readonly') == "true";
        return this.studentService.findByLogin(studentUsername);
      }), mergeMap(student => {
        this.workingStudent = student;
        this.welcomeService.getQuestionnairesWork(this.workingStudent).subscribe(
          questionnaireReceived => this.questionnaires = questionnaireReceived
        );
        this.welcomeService.getQuestionnaireLocked(this.workingStudent).subscribe(
          lq => this.lockedQuestionnaires = lq
        );
        return this.keycloakService.loadUserProfile(); 
      }),mergeMap(connectedUser => {
        this.connectedUser = connectedUser;
        if(!this.activitySent && this.workingStudent.username === this.connectedUser.username){
          this.activityService.notifyDisplayWorkActivity(this.workingStudent.username);
          this.activitySent = true;
        }

        return this.studentQuestionService.findStudentQuestionsByStudent(this.workingStudent.username);
      })
    ).subscribe(async studentQuestions => {
      this.studentQuestions = studentQuestions;
    })
  }

  navigateToWork(){
    this.router.navigate(['/work', this.connectedUser.username , 'false']);

  }
  
  selectAStudentQuestion(studentQuestion: StudentQuestion){

  }
  
  startNewQuestionnaire(questionnaire: Questionnaire){}
  
  startReviewModule(){}

  visitQuestionnaire(questionnaireToVisit: Questionnaire){
    
    //this.studentQuestionService.visit(questionnaireToVisit.id).subscribe(
    //  sq => {
    //    this.router.navigate(['/questionnaire', sq.id, this.workingStudent.username, 'false'])
    //  }
    //)

    this.studentQuestionService.visit(questionnaireToVisit.id).then(
      premise => premise.subscribe(
      sq => {
        this.router.navigate(['/questionnaire', sq.id, this.workingStudent.username, 'false'])
      }
    ))
    
  }
}
