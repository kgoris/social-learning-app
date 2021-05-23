import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Student } from "../modeles/student";
import { ConfigService } from "./config.service";

@Injectable()
export class StudentService {
    constructor(private configService: ConfigService, private httpClient: HttpClient){}
    header = new HttpHeaders({
        'Accept': 'application/json',
      });

    public getAllStudents():Observable<Student[]>{
        return this.httpClient.get<Student[]>(this.configService.student_url,  {headers: this.header});
    }

    public findById(id:string):Observable<Student>{
        return this.httpClient.get<Student>(this.configService.student_url + "/" + id,  {headers: this.header});
    }
}