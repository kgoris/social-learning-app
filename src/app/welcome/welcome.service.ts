import { Injectable } from '@angular/core';
import { ConfigService } from '../service/config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../modeles/student';

@Injectable()
export class WelcomeService {
    constructor(private configService: ConfigService, private httpClient: HttpClient){}
    header = new HttpHeaders({
        'Accept': 'application/json',
      });
    getWelcomeMessage():Observable<Student[]>{
        return this.httpClient.get<Student[]>(this.configService.student_url,  {headers: this.header});
    }
}