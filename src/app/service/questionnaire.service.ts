import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Questionnaire } from "../modeles/questionnaire";
import { ConfigService } from "./config.service";

@Injectable()
export class QuestionnaireService {
    constructor(private configService: ConfigService, 
        private httpClient: HttpClient){}

    findQuestionnaireById(id:string): Observable<Questionnaire>{
        return this.httpClient.get<Questionnaire>(
                                    this.configService.questionnaires_url + '/' + id);
    }
}