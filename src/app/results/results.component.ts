import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { Results } from '../modeles/results';
import { Student } from '../modeles/student';
import { ActivityService } from '../service/activity.service';
import { AuthService } from '../service/auth.service';
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
  connectedStudentId: number;
  connectedStudent : Student;
  questionnaireId: string;

  constructor( private route: ActivatedRoute, 
              private router: Router,
              private studentQuestionService: StudentQuestionService,
              private studentService: StudentService,
              private activityService: ActivityService,
              private authService: AuthService) { 
      
    }

  ngOnInit() {
    this.route.paramMap.pipe(
      mergeMap(params => {
          this.questionnaireId = params.get('id');
          this.connectedStudentId = +params.get('studentId');
          this.observeMode = params.get('readonly') == "true";
          return this.studentService.findById(params.get('studentId'))
        }
      ), mergeMap(student => {
        this.connectedStudent = student;
        return this.studentQuestionService.resuls(this.questionnaireId, student);
      })
    ).subscribe(results => {
        this.results = results;
        if(this.connectedStudentId === this.authService.getStudentInfo().id){
          this.activityService.notifyDisplayResume(this.connectedStudent, +this.questionnaireId);    
        }    
      }
    )  
  }

  reset(){
    this.studentQuestionService.resetStudentQuestions(this.results.questionnaire.id).subscribe(
      studentQuestion => {
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
          return false;
        };
        this.router.navigate(['/questionnaire', studentQuestion.id, studentQuestion.student.id, "false"]);
      } 
    )
  }


}
