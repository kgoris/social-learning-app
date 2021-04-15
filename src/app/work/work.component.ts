import { Component, OnInit } from '@angular/core';
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

  constructor(private studentQuestionService: StudentQuestionService,
              private welcomeService: WelcomeService) { }

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
  }

  selectAStudentQuestion(studentQuestion: StudentQuestion){

  }

  
  startNewQuestionnaire(questionnaire: Questionnaire){
    
  }
  
  startReviewModule(){

  }
}
