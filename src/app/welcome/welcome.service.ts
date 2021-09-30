import { Injectable } from '@angular/core';
import { ConfigService } from '../service/config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../modeles/student';
import { QuestionnaireQuery } from '../modeles/questionnaire-query';
import { ApiService } from '../service/api.service';
import { Questionnaire } from '../modeles/questionnaire';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

@Injectable()
export class WelcomeService {

 
    
    constructor(
            private httpClient: HttpClient,
            private config: ConfigService,
            private keycloakService: KeycloakService){}

    getQuestionnairesWork(student: Student){
        let questionnaireQuery : QuestionnaireQuery = new QuestionnaireQuery(student.username, QuestionnaireQuery.WORK_ACCESS_TYPE);
        return this.getQuestionnaires(questionnaireQuery);
    }

    async getQuestionnairesObserve(){
        let userProfile: KeycloakProfile = await this.keycloakService.loadUserProfile(); 
        let questionnaireQuery : QuestionnaireQuery = new QuestionnaireQuery(userProfile.username, QuestionnaireQuery.OBSERVE_ACCESS_TYPE);
        return this.getQuestionnaires(questionnaireQuery);
    }

    private getQuestionnaires(questionnaireQuery : QuestionnaireQuery):Observable<Questionnaire[]>{
        return this.httpClient.post<Questionnaire[]>(this.config.questionnaires_find_by_questionnaire_query, questionnaireQuery);
    }

    getQuestionnaireLocked(student:Student){
        let questionnaireQuery : QuestionnaireQuery = new QuestionnaireQuery(student.username, QuestionnaireQuery.WORK_ACCESS_TYPE);
        return this.httpClient.post<Questionnaire[]>(this.config.questionnaires_locked, questionnaireQuery);
    }

    getQuestionnaireById(questionnaireId:number){
        return this.httpClient.get<Questionnaire>(this.config.questionnaires_url + '/' + questionnaireId);
    }
}