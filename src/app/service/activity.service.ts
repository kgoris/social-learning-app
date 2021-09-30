import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { KeycloakService } from "keycloak-angular";
import { KeycloakProfile } from "keycloak-js";
import { Observable } from "rxjs";
import { Activity } from "../modeles/activity";
import { Proposition } from "../modeles/proposition";
import { Student } from "../modeles/student";
import { StudentQuestion } from "../modeles/student-question";
import { ConfigService } from "./config.service";

const ACTION_TYPE_DISPLAY: string = "DISPLAY";
const ACTION_TYPE_LOGOUT: string= "LOGOUT";
const ACTION_TYPE_HOME: string= "HOME";
const ACTION_TYPE_TYPE: string = "TYPE";

const RESSOURCE_TYPE_QUESTIONNAIRE: string = "QUESTIONNAIRE";
const RESSOURCE_TYPE_HEADER: string = "HEADER";
const RESSOURCE_TYPE_RESULTS: string= "RESULTS";
const RESSOURCE_TYPE_WORK: string = "WORK";

@Injectable()
export class ActivityService {
    constructor(private configService: ConfigService, 
                private httpClient: HttpClient,
                private keycloakService: KeycloakService){}

   
    
    header = new HttpHeaders({
        'Accept': 'application/json',
      });

    
    public postActivity(activity: Activity): Observable<any>{
        return this.httpClient.post<any>(this.configService.activity_url, activity, {headers: this.header});
    }
    
    public async notifyDisplayWorkActivity(workingStudentUsername: string){
        let userProfile: KeycloakProfile = await this.keycloakService.loadUserProfile(); 
        if(userProfile.username === workingStudentUsername){
            let activity = new Activity();
            activity.studentUsername = workingStudentUsername;
            activity.type = ACTION_TYPE_DISPLAY;
            activity.ressourceType = RESSOURCE_TYPE_WORK;
            this.postActivity(activity).subscribe();
        }
    }

    public async notifyDisplayQuestionnaire(workingStudentUsername: string, questionnaireId: number){
        let userProfile: KeycloakProfile = await this.keycloakService.loadUserProfile(); 
        if(userProfile.username === workingStudentUsername){
            let activity = new Activity();
            activity.studentUsername = workingStudentUsername;
            activity.type = ACTION_TYPE_DISPLAY;
            activity.ressourceType = RESSOURCE_TYPE_QUESTIONNAIRE;
            activity.ressourceId = questionnaireId;
            this.postActivity(activity).subscribe();
        }
    }

    public async notifyDisplayResume(workingStudentUsername: string, questionnaireId: number){
        let userProfile: KeycloakProfile = await this.keycloakService.loadUserProfile(); 
        if(userProfile.username === workingStudentUsername){
            let activity = new Activity();
            activity.studentUsername = workingStudentUsername;
            activity.type = ACTION_TYPE_DISPLAY;
            activity.ressourceType = RESSOURCE_TYPE_RESULTS;
            activity.ressourceId = questionnaireId;
            this.postActivity(activity).subscribe();
        }
    }

    public notifiyTypeAnswer(studentQuestion: StudentQuestion, proposition:Proposition, text: string){
        let activity = new Activity();
        activity.studentUsername = studentQuestion.student.username;
        activity.type = ACTION_TYPE_TYPE;
        activity.ressourceType = RESSOURCE_TYPE_QUESTIONNAIRE;
        activity.ressourceId = studentQuestion.id;
        activity.proposition = proposition;
        activity.value = text;
        this.postActivity(activity).subscribe();
    }

    public notifiyLogout(workingStudentUsername:string){
        let activity = new Activity();
        activity.studentUsername = workingStudentUsername;
        activity.ressourceType = RESSOURCE_TYPE_HEADER;
        activity.type = ACTION_TYPE_LOGOUT
        this.postActivity(activity).subscribe();

    }

    public notifyHome(workingStudentUsername:string){
        let activity = new Activity();
        activity.studentUsername = workingStudentUsername;
        activity.ressourceType = RESSOURCE_TYPE_HEADER;
        activity.type = ACTION_TYPE_HOME;
        this.postActivity(activity).subscribe();
    }

    public getActivitiesToObserve(): Observable<Activity[]>{
        return this.httpClient.get<Activity[]>(this.configService.activity_student_to_observe, {headers: this.header});
    }
}