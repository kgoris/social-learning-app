import { LearningItem } from "./learningItem";

export class Questionnaire{
    id: number;
    levelSequence: number;
    title: string;
    code: string;
    questionCount: number;
    learningItems: LearningItem[]; 
}