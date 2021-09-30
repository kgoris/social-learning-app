import { Student } from "./student";

export class QuestionnaireQuery{
    public static readonly WORK_ACCESS_TYPE = "WORK";
    public static readonly OBSERVE_ACCESS_TYPE = "OBSERVE";

    accessType: string;
    studentUsername: string;

    constructor(studentUsername: string, accessType:string){
        this.studentUsername = studentUsername;
        this.accessType = accessType;
    }
}