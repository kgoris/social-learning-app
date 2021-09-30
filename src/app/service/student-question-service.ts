import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { KeycloakService } from "keycloak-angular";
import { Observable } from "rxjs";
import { Results } from "../modeles/results";
import { Student } from "../modeles/student";
import { StudentQuestion } from "../modeles/student-question";
import { ConfigService } from "./config.service";

@Injectable()
export class StudentQuestionService {
    
    constructor(private configService: ConfigService, 
        private httpClient: HttpClient,
        private keycloakService: KeycloakService){}


    findStudentQuestionsByStudent(studentUsername:string): Observable<StudentQuestion[]>{
        return this.httpClient.get<StudentQuestion[]>(
                                    this.configService.student_questions_by_student_url + '/' + studentUsername);
    }

    createStudentQuestion(questionnaireId:string, student: Student): Observable<StudentQuestion>{
        return this.httpClient.get<StudentQuestion>(
            this.configService.student_questions_create + '?questionnaireId=' 
            + questionnaireId + '&username=' + student.username)
    }

    nextStudentQuestion(studentQuestion:StudentQuestion): Observable<StudentQuestion>{
        return this.httpClient.post<StudentQuestion>(
            this.configService.student_questions_next,
            studentQuestion
        )
    }

    previousStudentQuestion(studentQuestion:StudentQuestion): Observable<StudentQuestion>{
        return this.httpClient.post<StudentQuestion>(
            this.configService.student_questions_previous,
            studentQuestion
        )
    }

    save(studentQuestion: StudentQuestion): Observable<StudentQuestion>{
        return this.httpClient.post<StudentQuestion>(
            this.configService.student_questions_save,
            studentQuestion
        )
    }

    findById(id:string): Observable<StudentQuestion>{
        return this.httpClient.get<StudentQuestion>(this.configService.student_question_url + '/' + id);
    }

    async lockStudentQuestions(questionnaireId:number): Promise<Observable<any>>{
        let currentStudent =  await this.keycloakService.loadUserProfile();
        return this.httpClient.get<any>(
            this.configService.student_questions_lock  + '?questionnaireId=' 
            + questionnaireId + '&username=' + currentStudent.username)
    }

    resuls(questionnaireId:string, student:Student): Observable<Results>{
        return this.httpClient.post<Results>(
            this.configService.student_questions_results  + '?questionnaireId=' + questionnaireId,
            student
        )
    }

    async resetStudentQuestions(questionnaireId:number): Promise<Observable<StudentQuestion>>{
        let currentStudent =  await this.keycloakService.loadUserProfile();
        return this.httpClient.get<any>(
            this.configService.student_questions_reset  + '?questionnaireId=' 
            + questionnaireId + '&username=' + currentStudent.username)
    }

    async visit(questionnaireId: number): Promise<Observable<StudentQuestion>>{
        let currentStudent =  await this.keycloakService.loadUserProfile();

        return this.httpClient.get<StudentQuestion>(
            this.configService.student_questions_visit  + '?questionnaireId=' 
            + questionnaireId + '&username=' + currentStudent.username)
    }

}