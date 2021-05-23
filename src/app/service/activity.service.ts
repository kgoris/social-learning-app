import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Activity } from "../modeles/activity";
import { Student } from "../modeles/student";
import { AuthService } from "./auth.service";
import { ConfigService } from "./config.service";

const ACTION_TYPE_DISPLAY: string = "DISPLAY";
const ACTION_TYPE_LOGOUT: string= "LOGOUT";
const ACTION_TYPE_TYPE: string = "TYPE";

const RESSOURCE_TYPE_QUESTIONNAIRE: string = "QUESTIONNAIRE";
const RESSOURCE_TYPE_HEADER: string = "HEADER";
const RESSOURCE_TYPE_RESULTS: string= "RESULTS";
const RESSOURCE_TYPE_WORK: string = "WORK";

@Injectable()
export class ActivityService {
    constructor(private configService: ConfigService, 
                private httpClient: HttpClient,
                private authService: AuthService){}

   
    
    header = new HttpHeaders({
        'Accept': 'application/json',
      });

    
    public postActivity(activity: Activity): Observable<any>{
        return this.httpClient.post<any>(this.configService.activity_url, activity, {headers: this.header});
    }
    
    public notifyDisplayWorkActivity(workingStudent: Student){
        if(this.authService.getStudentInfo().id === workingStudent.id){
            let activity = new Activity();
            activity.student = workingStudent;
            activity.type = ACTION_TYPE_DISPLAY;
            activity.ressourceType = RESSOURCE_TYPE_WORK;
            this.postActivity(activity).subscribe();
        }
    }

    public getActivitiesToObserve(): Observable<Activity[]>{
        return this.httpClient.get<Activity[]>(this.configService.activity_student_to_observe, {headers: this.header});
    }
}