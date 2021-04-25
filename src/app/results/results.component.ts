import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { Results } from '../modeles/results';
import { StudentQuestionService } from '../service/student-question-service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {

  results: Results;

  constructor( private route: ActivatedRoute, 
              private router: Router,
    private studentQuestionService: StudentQuestionService) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      mergeMap(params => {
          let questionnaireId = params.get('id');
            return this.studentQuestionService.resuls(questionnaireId)
        }
      )
    ).subscribe(value => {
        this.results = value;
      }
    )  
  }

  reset(){
    this.studentQuestionService.resetStudentQuestions(this.results.questionnaire.id).subscribe(
      studentQuestion => this.router.navigate(['/questionnaire', studentQuestion.id])
    )
  }


}
