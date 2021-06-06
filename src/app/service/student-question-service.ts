import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Results } from "../modeles/results";
import { Student } from "../modeles/student";
import { StudentQuestion } from "../modeles/student-question";
import { AuthService } from "./auth.service";
import { ConfigService } from "./config.service";

@Injectable()
export class StudentQuestionService {
    
    constructor(private configService: ConfigService, 
        private httpClient: HttpClient,
        private authService: AuthService){}

    getStudent(student:Student){
        if(student){
            return student;
        }else{
            return this.authService.getStudentInfo();
        }
        
    }

    findStudentQuestionsByStudent(student:Student): Observable<StudentQuestion[]>{
        return this.httpClient.post<StudentQuestion[]>(
                                    this.configService.student_questions_by_student_url, 
                                    this.getStudent(student));
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

    save(studentQuestion: StudentQuestion): Observable<StudentQuestion>{
        return this.httpClient.post<StudentQuestion>(
            this.configService.student_questions_save,
            studentQuestion
        )
    }

    findById(id:string): Observable<StudentQuestion>{
        return this.httpClient.get<StudentQuestion>(this.configService.student_question_url + '/' + id);
    }

    lockStudentQuestions(questionnaireId:number): Observable<any>{
        return this.httpClient.post<any>(
            this.configService.student_questions_lock  + '?questionnaireId=' + questionnaireId,
            this.authService.getStudentInfo()
        )
    }

    resuls(questionnaireId:string, student:Student): Observable<Results>{
        return this.httpClient.post<Results>(
            this.configService.student_questions_results  + '?questionnaireId=' + questionnaireId,
            student
        )
    }

    resetStudentQuestions(questionnaireId:number): Observable<StudentQuestion>{
        return this.httpClient.post<any>(
            this.configService.student_questions_reset  + '?questionnaireId=' + questionnaireId,
            this.authService.getStudentInfo()
        )
    }

    visit(questionnaireId: number): Observable<StudentQuestion>{
        return this.httpClient.post<StudentQuestion>(
            this.configService.student_questions_visit  + '?questionnaireId=' + questionnaireId,
            this.authService.getStudentInfo()
        )
    }

}