import { Proposition } from "./proposition";
import { Student } from "./student";

export class Activity{
    id: number;
    ressourceType: string;
    type: string;
    ressourceId: number;
    student: Student;
    proposition: Proposition;
    value: string;
}