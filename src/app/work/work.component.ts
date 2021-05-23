import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { Questionnaire } from '../modeles/questionnaire';
import { Student } from '../modeles/student';
import { StudentQuestion } from '../modeles/student-question';
import { ActivityService } from '../service/activity.service';
import { AuthService } from '../service/auth.service';
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
  activitySent: boolean = false;

  constructor(private studentQuestionService: StudentQuestionService,
              private router: Router,
              private route: ActivatedRoute,
              private welcomeService: WelcomeService,
              private authService: AuthService,
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
        let studentId = params.get('studentId');
        return this.studentService.findById(studentId);
      })
    ).subscribe(student => {
      this.workingStudent = student;
      if(!this.activitySent && this.workingStudent.id === this.authService.getStudentInfo().id){
        this.activityService.notifyDisplayWorkActivity(this.workingStudent);
        this.activitySent = true;
      }
      
      this.studentQuestionService.findStudentQuestionsByStudent(student)
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
    })
    this.websocketService.connect();
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
