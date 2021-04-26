import { Injectable } from '@angular/core';
import { ConfigService } from '../service/config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../modeles/student';
import { AuthService } from '../service/auth.service';
import { QuestionnaireQuery } from '../modeles/questionnaire-query';
import { ApiService } from '../service/api.service';
import { Questionnaire } from '../modeles/questionnaire';

@Injectable()
export class WelcomeService {

 
    
    constructor(
            private httpClient: HttpClient,
            private authService: AuthService,
            private config: ConfigService){}

    getQuestionnairesWork(){
        let questionnaireQuery : QuestionnaireQuery = new QuestionnaireQuery(this.authService.getStudentInfo(), QuestionnaireQuery.WORK_ACCESS_TYPE);
        return this.getQuestionnaires(questionnaireQuery);
    }

    getQuestionnairesObserve(){
        let questionnaireQuery : QuestionnaireQuery = new QuestionnaireQuery(this.authService.getStudentInfo(), QuestionnaireQuery.OBSERVE_ACCESS_TYPE);
        return this.getQuestionnaires(questionnaireQuery);
    }

    private getQuestionnaires(questionnaireQuery : QuestionnaireQuery):Observable<Questionnaire[]>{
        return this.httpClient.post<Questionnaire[]>(this.config.questionnaires_find_by_questionnaire_query, questionnaireQuery);
    }

    getQuestionnaireLocked(){
        let questionnaireQuery : QuestionnaireQuery = new QuestionnaireQuery(this.authService.getStudentInfo(), QuestionnaireQuery.WORK_ACCESS_TYPE);
        return this.httpClient.post<Questionnaire[]>(this.config.questionnaires_locked, questionnaireQuery);
    }

    getQuestionnaireById(questionnaireId:number){
        return this.httpClient.get<Questionnaire>(this.config.questionnaires_url + '/' + questionnaireId);
    }
}