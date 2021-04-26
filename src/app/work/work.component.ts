import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Questionnaire } from '../modeles/questionnaire';
import { StudentQuestion } from '../modeles/student-question';
import { StudentQuestionService } from '../service/student-question-service';
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
              private welcomeService: WelcomeService) {
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
  }

  selectAStudentQuestion(studentQuestion: StudentQuestion){

  }

  
  startNewQuestionnaire(questionnaire: Questionnaire){
    
  }
  
  startReviewModule(){

  }

  visitQuestionnaire(questionnaireToVisit: Questionnaire){
    this.studentQuestionService.visit(questionnaireToVisit.id).subscribe(
      sq => {
        this.router.navigate(['/questionnaire', sq.id])
      }
    )
    
  }
}
