import { Answer } from "./answer";
import { Question } from "./question";
import { Questionnaire } from "./questionnaire";
import { Student } from "./student";

export class StudentQuestion{
    id: number;
    answer: Answer;
    student: Student;
    question: Question;
    questionnaire: Questionnaire;
    locked: boolean;
}