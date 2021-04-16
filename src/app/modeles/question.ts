import { OfficialAnswer } from "./official-answer";
import { Proposition } from "./proposition";
import { Questionnaire } from "./questionnaire";


export class Question{
    id: number;
    title: string;
    type: string;
    sequenceNumber: number;
    questionnaire: Questionnaire;
    officialAnswer: OfficialAnswer;
    propositions: Proposition[];
    questionnaireId: number;
}