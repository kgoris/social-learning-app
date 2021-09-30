import { Component, OnInit } from '@angular/core';
import { Form, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, Observable } from 'rxjs';
import { mergeMap, switchMap } from 'rxjs/operators';
import { Answer } from '../modeles/answer';
import { StudentQuestion } from '../modeles/student-question';
import { StudentQuestionService } from '../service/student-question-service';
import { WelcomeService } from '../welcome/welcome.service';
import * as uuid from 'uuid';
import { WebsocketServiceService } from '../websocket-service.service';
import { Student } from '../modeles/student';
import { ActivityService } from '../service/activity.service';
import { Proposition } from '../modeles/proposition';
import { Activity } from '../modeles/activity';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { StudentService } from '../service/student.service';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
})
export class QuestionnaireComponent implements OnInit {


  trueFalseFormControl: FormControl;
  freeTextFormControl: FormControl;
  multipleChoiceFormControl: FormControl;
  uuidRef: string;
  workingStudent: Student;  
  activitySent: boolean = false;
  observeMode : boolean = false;
  connectedStudentUsername: string;
  currentStudentQuestionId: string;
  questionnaireId: string;
  currentStudentQuestion : StudentQuestion;
  loadingStudentQuestion : Observable<StudentQuestion>;

  constructor(private route: ActivatedRoute, 
              private router: Router,
              private studentQuestionService: StudentQuestionService,
              private welcomeService: WelcomeService,
              private activityService: ActivityService,
              private keycloakService: KeycloakService,
              private websocketService: WebsocketServiceService,
              private studentService: StudentService
              ) { }

  ngOnInit() {
    this.websocketService.subscriberQuestionOberver.subscribe(
      activity => {
        let activityEmit : Activity = activity;
        if(activityEmit.proposition){
          this.currentStudentQuestion.answer.propositionId = activityEmit.proposition.id.toString();
        }else{
          this.currentStudentQuestion.answer.value = activityEmit.value;
        }
      }
    )
    this.initFormGroup();
    this.route.paramMap.pipe(
      mergeMap(params => {
          this.questionnaireId = params.get('qid');
          this.currentStudentQuestionId = params.get('currentSudentQuestionId');
          this.connectedStudentUsername = params.get('studentUsername');
          this.observeMode = params.get('readonly') == "true";
          return this.studentService.findByLogin(params.get('studentUsername'))

      }),mergeMap(student => {
        if(this.currentStudentQuestionId){
          //get the related student question
          return this.studentQuestionService.findById(this.currentStudentQuestionId)
        }else if(this.questionnaireId){
          //create a new student question for the related questionnaireId & current student
          return this.studentQuestionService.createStudentQuestion(this.questionnaireId, student)
        }
      }) 
          
    ).subscribe(async studQuestion => {
      this.currentStudentQuestion = studQuestion;
      let userProfile: KeycloakProfile = await this.keycloakService.loadUserProfile();
      if(this.connectedStudentUsername === userProfile.username){
        this.activityService.notifyDisplayQuestionnaire(this.currentStudentQuestion.student.username, this.currentStudentQuestion.id);
        this.activitySent = true;
      }
      
      if(!this.currentStudentQuestion.answer){
        this.currentStudentQuestion.answer = new Answer();
      }else if(this.currentStudentQuestion.answer.proposition){
        this.currentStudentQuestion.answer.propositionId = String(this.currentStudentQuestion.answer.proposition.id);
      }
      this.cleanFormControls();
    })  
  }

  private initFormGroup() {
    this.trueFalseFormControl = new FormControl("", [
      Validators.required
    ]);
    this.freeTextFormControl = new FormControl("", [
      Validators.required,
      Validators.max(50),
      Validators.min(1)
    ]);

    this.multipleChoiceFormControl = new FormControl("", [
      Validators.required
    ])
    
  }

  private triggerFormValidation() {
    if(this.trueFalseQuestion()){
      this.trueFalseFormControl.updateValueAndValidity();
      this.trueFalseFormControl.markAllAsTouched();
    }else if(this.freeTextQuestion()){
      
      this.freeTextFormControl.markAllAsTouched();
      this.freeTextFormControl.updateValueAndValidity();
    }else if(this.multipleChoiceQuestion()){
      this.multipleChoiceFormControl.updateValueAndValidity();
      this.multipleChoiceFormControl.markAllAsTouched();
      if(this.currentStudentQuestion.answer.propositionId){
        this.currentStudentQuestion.answer.proposition = this.currentStudentQuestion.question.propositions
            .filter(p => p.id === Number(this.currentStudentQuestion.answer.propositionId))[0]
      }
    }
  }

  public checkIfFormValid(): boolean{
    if(this.trueFalseQuestion()){
      
      return !this.trueFalseFormControl.hasError('required') || ! this.trueFalseFormControl.touched;
    }else if(this.freeTextQuestion()){
      if(!this.freeTextFormControl.touched){
        return true;
      }else{
        return !this.freeTextFormControl.hasError('required') && !this.freeTextFormControl.hasError('min') && !this.freeTextFormControl.hasError('max');
      }
    }else if (this.multipleChoiceQuestion()){
      return !this.multipleChoiceFormControl.hasError('required') || ! this.multipleChoiceFormControl.touched ;
    }
  }

  questionHeader(){
    if(!this.uuidRef){
      this.uuidRef = uuid.v4();
    }
    return "quetionHeader" +  this.uuidRef;
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

  multiChanged(propositionId){
    if(propositionId){
      let proposition: Proposition = this.currentStudentQuestion.question.propositions
      .filter(p => p.id === Number(propositionId))[0];
      this.activityService.notifiyTypeAnswer(this.currentStudentQuestion, proposition, null);
    }
    
  }

  textChanged(value){
    if(value && !this.observeMode){
      this.activityService.notifiyTypeAnswer(this.currentStudentQuestion, null, value);
    }
  }

  cleanFormControls(){

    this.multipleChoiceFormControl.setErrors({required: false});
    this.freeTextFormControl.setErrors({required: false, min:false, max:false});
    this.trueFalseFormControl.setErrors({required: false});
  }

  next(){
    this.triggerFormValidation();
    if(this.checkIfFormValid()){
    
      this.studentQuestionService.nextStudentQuestion(this.currentStudentQuestion).subscribe(
        studentQuestion => {
          this.currentStudentQuestion = studentQuestion
          this.router.navigate(['/questionnaire', this.currentStudentQuestion.id, this.currentStudentQuestion.student.username, 'false']);
        } 
      )
    }
  }

  previous(){
    this.triggerFormValidation();
    if(this.checkIfFormValid()){
      this.studentQuestionService.previousStudentQuestion(this.currentStudentQuestion).subscribe(
        studentQuestion => {
          this.currentStudentQuestion = studentQuestion
          this.router.navigate(['/questionnaire', this.currentStudentQuestion.id, this.currentStudentQuestion.student.username, 'false']);
        } 
      )
    }    
  }

  lock(){
    this.triggerFormValidation();
    if(this.checkIfFormValid()){
      this.studentQuestionService.save(this.currentStudentQuestion).subscribe(value =>{
            //this.studentQuestionService.lockStudentQuestions(this.currentStudentQuestion.questionnaire.id).subscribe(
            //  value => {
            //    this.router.navigate(['/results', this.currentStudentQuestion.questionnaire.id, this.currentStudentQuestion.student.username, 'false']);
            //  }
            //)

            this.studentQuestionService.lockStudentQuestions(this.currentStudentQuestion.questionnaire.id).then(premise => premise.subscribe(
              value => {
                this.router.navigate(['/results', this.currentStudentQuestion.questionnaire.id, this.currentStudentQuestion.student.username, 'false']);
              }
            ))
          }
            
      )
      
    }

    

  }


}
