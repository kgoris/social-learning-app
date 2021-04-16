import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { mergeMap, switchMap } from 'rxjs/operators';
import { Answer } from '../modeles/answer';
import { StudentQuestion } from '../modeles/student-question';
import { StudentQuestionService } from '../service/student-question-service';
import { WelcomeService } from '../welcome/welcome.service';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
})
export class QuestionnaireComponent implements OnInit {

  currentStudentQuestion : StudentQuestion;
  loadingStudentQuestion : Observable<StudentQuestion>;

  constructor(private route: ActivatedRoute, 
              private studentQuestionService: StudentQuestionService,
              private welcomeService: WelcomeService) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      mergeMap(params => {
          let questionnaireId = params.get('qid');
          let currentStudentQuestionId = params.get('currentSudentQuestionId');
          if(currentStudentQuestionId){
            //get the related student question
          }else if(questionnaireId){
            //create a new student question for the related questionnaireId & current student
          }
          return this.studentQuestionService.createStudentQuestion(questionnaireId);
        }
      )
    ).subscribe(value => {
      this.currentStudentQuestion = value;
      this.currentStudentQuestion.answer = new Answer();
      
    })  
  }

  trueFalseQuestion(): boolean{
    return this.currentStudentQuestion.question.type === 'TRUE_FALSE'; 
  }
  
  multipleChoiceQuestion(): boolean {
    return this.currentStudentQuestion.question.type === 'MULTIPLE_CHOICE';
  }

  freeTextQuestion(): boolean {
    return this.currentStudentQuestion.question.type === 'FREE_TEXT';
  }

  singleChoiceQuestion(): boolean {
    return this.currentStudentQuestion.question.type === 'SINGLE_CHOICE';
  }

  submit(){

  }

  next(){
    this.studentQuestionService.nextStudentQuestion(this.currentStudentQuestion).subscribe(
      studentQuestion => this.currentStudentQuestion = studentQuestion
    )
  }

  previous(){
    this.studentQuestionService.previousStudentQuestion(this.currentStudentQuestion).subscribe(
      studentQuestion => this.currentStudentQuestion = studentQuestion
    )
  }


}
