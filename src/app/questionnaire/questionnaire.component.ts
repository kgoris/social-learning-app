import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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


  trueFalseFormControl: FormControl;
  currentStudentQuestion : StudentQuestion;
  loadingStudentQuestion : Observable<StudentQuestion>;

  constructor(private route: ActivatedRoute, 
              private router: Router,
              private studentQuestionService: StudentQuestionService,
              private welcomeService: WelcomeService) { }

  ngOnInit() {
    this.initFormGroup();
    this.route.paramMap.pipe(
      mergeMap(params => {
          let questionnaireId = params.get('qid');
          let currentStudentQuestionId = params.get('currentSudentQuestionId');
          if(currentStudentQuestionId){
            //get the related student question
            return this.studentQuestionService.findById(currentStudentQuestionId)
          }else if(questionnaireId){
            //create a new student question for the related questionnaireId & current student
            return this.studentQuestionService.createStudentQuestion(questionnaireId)
          }
          ;
        }
      )
    ).subscribe(value => {
      this.currentStudentQuestion = value;
      if(!this.currentStudentQuestion.answer){
        this.currentStudentQuestion.answer = new Answer();
      }      
    })  
  }

  private initFormGroup() {
    this.trueFalseFormControl = new FormControl("", [
      Validators.required
    ])
  }

  private triggerFormValidation() {
    if(this.trueFalseQuestion()){
      this.trueFalseFormControl.updateValueAndValidity();
      this.trueFalseFormControl.markAllAsTouched();
    }
  }

  public checkIfFormValid(): boolean{
    if(this.trueFalseQuestion()){
      return !this.trueFalseFormControl.hasError('required');
    }
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
    this.triggerFormValidation();
  }

  next(){
    this.studentQuestionService.nextStudentQuestion(this.currentStudentQuestion).subscribe(
      studentQuestion => {
        this.currentStudentQuestion = studentQuestion
        this.router.navigate(['/questionnaire/' + this.currentStudentQuestion.id]);
      } 
    )
    this.submit();
  }

  previous(){
    this.studentQuestionService.previousStudentQuestion(this.currentStudentQuestion).subscribe(
      studentQuestion => {
        this.currentStudentQuestion = studentQuestion
        this.router.navigate(['/questionnaire/' + this.currentStudentQuestion.id]);
      } 
    )
    
  }

  lock(){
    this.triggerFormValidation();
    if(this.checkIfFormValid())
    this.studentQuestionService.lockStudentQuestions(this.currentStudentQuestion.questionnaire.id).subscribe(
      value => {
        this.router.navigate(['/results/' + this.currentStudentQuestion.questionnaire.id]);
      }
    )
  }


}
