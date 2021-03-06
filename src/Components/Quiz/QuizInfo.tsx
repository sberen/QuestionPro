// this class represents all the information
// necessary to take a single quiz.
export class QuizInfo {
    name : string;
    type : string;
    uid : string;
    questions: any[]
    
    constructor(name?: string, type? : string, uid? : string, questions?: any[]){
        this.name = name ||"";
        this.type = type ||"";
        this.uid = uid || "";
        this.questions = questions || [];
    }
}