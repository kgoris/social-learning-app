import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { mergeMap } from 'rxjs/operators';
import { Student } from '../modeles/student';
import { StudentService } from '../service/student.service';
import * as uuid from 'uuid';
import { StudentQuestionService } from '../service/student-question-service';
import { QuestionnaireService } from '../service/questionnaire.service';
import { Questionnaire } from '../modeles/questionnaire';
import { StudentQuestion } from '../modeles/student-question';


@Component({
  selector: 'app-choosing',
  templateUrl: './choosing.component.html',
  styleUrls: ['./choosing.component.scss'],
})
export class ChoosingComponent implements OnInit {

  currentStudentQuestionId: string;
  currentStudentQuestion: StudentQuestion;
  workingStudentUsername: string;
  observeMode : boolean = false;
  workingStudent: Student;  
  connectedStudent: KeycloakProfile;
  uuidRef: string;
  questionnaire: Questionnaire;
  questionnaireId: string;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private keycloakService: KeycloakService,
              private studentService: StudentService,
              private studentQuestionService: StudentQuestionService,
              private questionnaireService: QuestionnaireService) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      mergeMap(params => {
          this.workingStudentUsername = params.get('studentUsername');
          this.questionnaireId = params.get('qid');
          this.currentStudentQuestionId = params.get('currentSudentQuestionId');
          this.observeMode = params.get('readonly') == "true";
          return this.studentService.findByLogin(params.get('studentUsername'))

      }),mergeMap(student => {
        this.workingStudent = student;
        return this.keycloakService.loadUserProfile();
      }), mergeMap(connectedStudent => {
        this.connectedStudent = connectedStudent;
        return this.questionnaireService.findQuestionnaireById(this.questionnaireId)
      })      
    ).subscribe(questionnaire => {
      this.questionnaire = questionnaire;
    })
  }

  questionHeader(){
    if(!this.uuidRef){
      this.uuidRef = uuid.v4();
    }
    return "choosingHeader" +  this.uuidRef;
  }

  launchQuestionnaire(){
    if(this.currentStudentQuestionId){
      this.router.navigate(['/questionnaire', this.currentStudentQuestionId, this.workingStudentUsername, 'false']);
    }else {
      this.router.navigate(['/questionnaire/new', this.questionnaire.id, this.workingStudentUsername, 'false']);
    }
  }

  launchLearning(){
    if(this.currentStudentQuestionId){
      this.router.navigate(['/learning', this.workingStudentUsername, 'false', this.questionnaire.id, this.currentStudentQuestionId]);
    }else {
      this.router.navigate(['/learning/new', this.workingStudentUsername, 'false', this.questionnaire.id]);
    }
  }

}
