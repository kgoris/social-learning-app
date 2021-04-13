import { Student } from "./student";

export class QuestionnaireQuery{
    public static readonly WORK_ACCESS_TYPE = "WORK";
    public static readonly OBSERVE_ACCESS_TYPE = "OBSERVE";

    studentDto:Student;
    accessType: string;

    constructor(student:Student, accessType:string){
        this.studentDto = student;
        this.accessType = accessType;
    }
}