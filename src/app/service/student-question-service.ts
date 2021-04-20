import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { StudentQuestion } from "../modeles/student-question";
import { AuthService } from "./auth.service";
import { ConfigService } from "./config.service";

@Injectable()
export class StudentQuestionService {
    
    constructor(private configService: ConfigService, 
        private httpClient: HttpClient,
        private authService: AuthService){}

    findStudentQuestionsByStudent(): Observable<StudentQuestion[]>{
        return this.httpClient.post<StudentQuestion[]>(
                                    this.configService.student_questions_by_student_url, 
                                    this.authService.getStudentInfo());
    }

    createStudentQuestion(questionnaireId:string): Observable<StudentQuestion>{
        return this.httpClient.post<StudentQuestion>(
            this.configService.student_questions_create + '?questionnaireId=' + questionnaireId,
            this.authService.getStudentInfo()
        )
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

    findById(id:string): Observable<StudentQuestion>{
        return this.httpClient.get<StudentQuestion>(this.configService.student_question_url + '/' + id);
    }
}