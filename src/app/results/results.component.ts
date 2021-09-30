import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { Results } from '../modeles/results';
import { Student } from '../modeles/student';
import { ActivityService } from '../service/activity.service';
import { StudentQuestionService } from '../service/student-question-service';
import { StudentService } from '../service/student.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {

  results: Results;
  observeMode : boolean = false;
  connectedStudentUsername: string;
  connectedStudent : Student;
  questionnaireId: string;
  public userProfile: KeycloakProfile | null = null;

  constructor( private route: ActivatedRoute, 
              private router: Router,
              private studentQuestionService: StudentQuestionService,
              private studentService: StudentService,
              private activityService: ActivityService,
              private keycloakService: KeycloakService) { 
      
    }

  ngOnInit() {
    this.route.paramMap.pipe(
      mergeMap(params => {
          this.questionnaireId = params.get('id');
          this.connectedStudentUsername = params.get('studentUsername');
          this.observeMode = params.get('readonly') == "true";
          return this.studentService.findByLogin(params.get('studentUsername'))
        }
      ), mergeMap(student => {
        this.connectedStudent = student;
        return this.studentQuestionService.resuls(this.questionnaireId, student);
      })
    ).subscribe(async results => {
        let userProfile: KeycloakProfile = await this.keycloakService.loadUserProfile(); 
        this.results = results;
        if(this.connectedStudentUsername === userProfile.username){
          this.activityService.notifyDisplayResume(this.connectedStudentUsername, +this.questionnaireId);    
        }    
      }
    )  
  }

  reset(){
    //this.studentQuestionService.resetStudentQuestions(this.results.questionnaire.id).subscribe(
    //  studentQuestion => {
    //    this.router.routeReuseStrategy.shouldReuseRoute = function () {
    //      return false;
    //    };
    //    this.router.navigate(['/questionnaire', studentQuestion.id, studentQuestion.student.username, "false"]);
    //  } 
    //)

    this.studentQuestionService.resetStudentQuestions(this.results.questionnaire.id).then(premise => premise.subscribe(
      studentQuestion => {
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
          return false;
        };
        this.router.navigate(['/questionnaire', studentQuestion.id, studentQuestion.student.username, "false"]);
      } 
    ))
  }


}
