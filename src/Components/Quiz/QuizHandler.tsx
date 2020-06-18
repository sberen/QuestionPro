import React from 'react';
import {QuizInfo} from './QuizInfo';
import {QUIZ_INDICES, SINGLE} from './QuizTypes';
import {ShortAnswer} from './QuestionHandler/ShortAnswer';
import {Results} from './QuestionHandler/ResultsPage';
import { MultipleChoice } from './QuestionHandler/MultipleChoice';
import { MultiShortAnswers } from './QuestionHandler/MultiShortAnswer';
import { LongAnswer } from './QuestionHandler/LongAnswer';
import { Button } from '@material-ui/core';
// import * as quizes from '../../resources/Questions.json';


interface HandlerProps {
  info : QuizInfo; // Identification information of the quiz
  onBack: () => void; // Go back to Quiz selection
}

interface HandlerState {
  currentQuestion : number; // Current questions number
  quiz: QuizInfo; // Identification information of the quiz
  incorrectAnswers: Map<string, [string, string]>;
  answers: any[]; // Current answer responses
  resultsPage: boolean; // True if showing results page
  problemsPerPage: number;
}

export class QuizHandler extends React.Component<HandlerProps, HandlerState> {

  constructor(props : any){
    super(props);
    console.log(this.props.info);
    let Qs: any[] = this.props.info.questions;
  

    var ans = this.populateAnswers(Qs);
  

    this.state = {
      currentQuestion: 1,
      incorrectAnswers: new Map(),
      quiz: this.props.info,
      answers: ans,
      resultsPage: false,
      problemsPerPage: 2
    }
  }

  render() {
    let cur = this.state.currentQuestion;
    let perPage = this.state.problemsPerPage;
    if (perPage === -1){
      perPage= this.state.quiz.questions.length;
    }
    
    return (
      !this.state.resultsPage ? <div>
        <div><h5>{this.props.info.name}<br/>
        Page: {Math.ceil(cur/perPage)} / {Math.ceil(this.state.quiz.questions.length/perPage)}
        </h5></div>
        {this.renderQuestions()}
        {this.renderButtons()}
        
      </div> : Results(this.state.quiz, this.state.answers, (Qs: any[]) => this.shrinkQs(Qs), () => this.props.onBack())
    );
  }

  // generates props for question at index
  quizProps = (index: number) =>{
    return {
      question: this.state.quiz.questions[index],
      changeAnswer: (ans: string| string[]) => this.updateAnswer(index, ans),
      answer: this.state.answers[index]
    }
  }

  quizTypes = (props: any) =>{
    return [
      <ShortAnswer {...props}/>,
      <MultipleChoice {...props}/>,
      <MultiShortAnswers {...props}/>,
      <LongAnswer {...props}/>
    ]
  }


  renderQuestions = () =>{
    var startIndex = this.state.currentQuestion -1;
    var endIndex = Math.min(startIndex + this.state.problemsPerPage, this.state.answers.length);
    if (this.state.problemsPerPage === -1){
      endIndex = this.state.answers.length;
    }

    var indices = []
    for (var i = startIndex; i< endIndex; i++){
      indices.push(i);
    }

    let questions = indices.map((index: number) =>
      <div>
        {this.quizTypes(this.quizProps(index))[QUIZ_INDICES.get(this.props.info.type) as number]} 
        <br/>
      </div>
      
    )

    return (
      <div>
        {questions}
      </div>
    )
  }

  // change answer to ans for current question
  updateAnswer = (index:number, ans: string | string[]) => {
    const newAnswers = this.state.answers.slice();
    newAnswers[index] = ans;
    this.setState({
      answers: newAnswers,
    });
  }

  // Processing request to change question. 
  // Positive num indicates move forward by given value and negative values for going back
  changeQuestion(num: number) {
    let stillGoing: boolean = (this.state.currentQuestion + num) <= this.state.quiz.questions.length;
    if (this.state.problemsPerPage === -1){
      stillGoing = false;
    }
    this.setState({currentQuestion : this.state.currentQuestion + num, resultsPage: !stillGoing});
  }

  // Create new quiz with newQs (intended include subset of questions from current Qs)
  shrinkQs(newQs: any[]) {
    const newAns: any[] = this.populateAnswers(newQs);
    this.setState({
      currentQuestion: 1, 
      quiz: new QuizInfo(this.state.quiz.name, this.state.quiz.type, this.state.quiz.uid, newQs),
      answers: newAns,
      resultsPage: false
    });
  }

  // returns "Zeroed Out" answers field based on given Qs
  populateAnswers(Qs: any[]){
    let count = Qs.length;

    // Case that the answer can be captured with one string
    if (SINGLE.includes(this.props.info.type)){
      var singleString = new Array<string>(count);
      for (var i = 0; i< singleString.length; i++){
        singleString[i] = "";
      }
      return singleString;
    } 
    // Case that the answer has multiple components and need to be represented as an array
    else {
      var multiString = new Array<string[]>(count);
      for (i = 0; i< multiString.length; i++ ) {
        multiString[i] = new Array<string>(Qs[i].prompts.length);
        for(let j = 0; j< Qs[i].prompts.length; j ++){
          multiString[i][j] = "";
        }
      }
      return multiString;
    }
  }

  renderButtons = () =>{
    const result : any[] = [];
    var qPerPage = this.state.problemsPerPage;
    var isFirst: boolean = this.state.currentQuestion === 1;
    var isLast: boolean = (qPerPage === -1 || 
      (this.state.currentQuestion + qPerPage) > this.state.quiz.questions.length);
    var secondButton:String;
    if(isLast){
        secondButton = "Finish"
    } else{
        secondButton = "Next"
    }
    if (!isFirst){
        result.push(
            <Button key='back' onClick={() => this.changeQuestion(-1 * qPerPage)} variant='outlined' color='primary'>Back</Button>
        )
    }
    result.push(
        <Button key="next" onClick={() => {this.changeQuestion(1 * qPerPage)}} variant='outlined' color='primary'>
        {secondButton}</Button>
    )
    return result;
  }
}