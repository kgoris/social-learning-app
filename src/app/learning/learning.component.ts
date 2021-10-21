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
import { LearningItem } from '../modeles/learningItem';

@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.scss'],
})
export class LearningComponent implements OnInit {

  currentStudentQuestionId: string;
  currentStudentQuestion: StudentQuestion;
  workingStudentUsername: string;
  observeMode : boolean = false;
  workingStudent: Student;  
  connectedStudent: KeycloakProfile;
  uuidRef: string;
  questionnaire: Questionnaire;
  index: number = 0;
  learningItem: LearningItem;
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
          this.questionnaireId = params.get('qid');
          this.workingStudentUsername = params.get('studentUsername');
          this.currentStudentQuestionId = params.get('currentSudentQuestionId');
          this.observeMode = params.get('readonly') == "true";
          return this.studentService.findByLogin(params.get('studentUsername'))

      }),mergeMap(student => {
        this.workingStudent = student;
        return this.keycloakService.loadUserProfile();
      }), mergeMap(connectedStudent => {
        this.connectedStudent = connectedStudent;
        return this.studentQuestionService.findById(this.currentStudentQuestionId)
      })      
    ).subscribe(studentQuestion => {
      this.currentStudentQuestion = studentQuestion;
      this.learningItem = this.getLearningItem();
    })
  }

  questionHeader(){
    if(!this.uuidRef){
      this.uuidRef = uuid.v4();
    }
    return "learningHeader" +  this.uuidRef;
  }

  getLearningItem(){
    return this.currentStudentQuestion?.questionnaire?.learningItems[this.index];
  }

  next(){
    this.index = (this.index + 1) % this.currentStudentQuestion?.questionnaire?.learningItems.length;
    this.learningItem = this.getLearningItem();
  }
  
}
