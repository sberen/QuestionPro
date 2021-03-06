import React from 'react';
import './MainPage.css';
import { TopBar } from '../TopBar/TopBar';
import { QuizSelector } from './QuizSelector';
import { QuizInfo } from '../Quiz/QuizInfo';
import { QuizStats, QuizSummary } from '../StatsPage/QuizStats';
import { Stats } from '../StatsPage/Stats';
import {QuizHandler} from '../Quiz/QuizHandler'
import UploadQuiz from '../UploadQuiz/UploadQuiz';
import { auth, firestore } from '../../firebase';
import { FrontPage } from './FrontPage';
import { QuizInfoMini } from '../Quiz/QuizInfoMini';


interface MainPageState {
  pageNum: number;  // the page to be displayed
  quiz : QuizInfo | null; // Information regarding chosen quiz, undefined if nothing has been chosen
  quizzes: QuizInfoMini[];
  groupQuizzes : QuizInfo[] | null;
  statsQuiz: QuizStats | null
}

// this is the main top level component for the application,
// displaying each of the desired pages and the toolbar
export class MainPage extends React.Component<{}, MainPageState> {
  constructor(props: any) {
    super(props);

    this.state = {
      quiz: null,
      pageNum: 0,
      quizzes: [],
      groupQuizzes: null,
      statsQuiz: null
    }
  }

  componentWillUnmount() {
    auth.signOut();
  }

  componentDidMount()  {
    auth.onAuthStateChanged((newUser) => this.registerAuthListener(newUser));
  }

  render() {

    const pages = [
        <QuizSelector removeQuiz={(id:string)=> this.removeQuiz(id)} quizzes={this.state.quizzes}
            makeQuiz={() => this.setPage(2)} changeQuiz={(qz:QuizInfo) => {this.setState({quiz: qz, pageNum: 1, groupQuizzes: null})}}
            setMega={(qz: QuizInfo, grouped: QuizInfo[]) => this.setState({quiz: qz, groupQuizzes: grouped, pageNum: 1})}
            getData={(qz: QuizInfoMini) => this.getData(qz)}/>,
        <QuizHandler info={this.state.quiz!} megaQs={this.state.groupQuizzes} onBack={() => this.setPage(0)}/>,
        <UploadQuiz submit={(qz: QuizInfoMini) => this.addQuiz(qz)} afterSubmit={() => this.setPage(0)}/>,
        <Stats quiz={this.state.statsQuiz!}/>
    ];

    return (
      <div>
        <div style={{marginBottom: "2%"}}>
          <TopBar user={auth.currentUser} onQuizClick={() => this.setPage(0)} makeQuiz={() => this.setPage(2)} onSignOut={() => auth.signOut()}/>
        </div>
        <div className={"centered"}>
          {auth.currentUser ? pages[this.state.pageNum] : <FrontPage />}
        </div>
      </div>
    )
  }


  // sets the current page index
  setPage(page: number) {
    if (auth.currentUser) {
      this.setState({pageNum: page});
    }
  }

  // adds a quiz to the current set of 
  // user's quizzes upon creation
  addQuiz(qz: QuizInfoMini) {
    this.setState((prev: MainPageState) => ({
      quizzes: [...prev.quizzes, qz]
    }));
  }

  // removes a quiz from the current set of
  // user's quizzes locally upon deletion
  removeQuiz(id: string){
    this.setState((prev: MainPageState)=>({
      quizzes: prev.quizzes.filter(function(value, index, arr){ return value.uid !== id;})
    }));
  }

  // retrieves the necessary statistics for the
  // chosen quiz
  async getData(qz: QuizInfoMini) {
    let object = await firestore.collection("users").doc(auth.currentUser!.uid).get();
    let quests = await firestore.collection("quizzes").doc(qz.uid).get();
    let quizInfo = object.get(`quizzes.${qz.uid}`);
    let pathParams : [string, any, number, QuizSummary, number[], any[], string]= [
      quizInfo[0],
      object.get(`quizResults.${qz.uid}.attempts`),
      object.get(`quizResults.${qz.uid}.lastAttempt`),
      object.get(`quizResults.${qz.uid}.overall`) as QuizSummary,
      object.get(`quizResults.${qz.uid}.wrongQCnt`),
      quests.get("questions"),
      quizInfo[1]
    ]
    let stats : QuizStats = new QuizStats(...pathParams);

  

    this.setState({statsQuiz: stats, groupQuizzes: null, pageNum: 3});
  }

  // registers an auth listener to the firebase auth ref,
  // waiting for a user sign in or sign out. Upon signing in
  // we retrieve their quizzes to be displayed.
  async registerAuthListener(newUser: firebase.User | null) {
    var stateQuizzes: QuizInfoMini[] = [];
    if (newUser) {
      var user: firebase.firestore.DocumentReference = firestore.collection("users").doc(newUser.uid);

      let returned = await user.get()
                              .then((snap: firebase.firestore.DocumentData) => {
                                return snap.get("quizzes");
                              });

      if (returned) {
        for (let quiz of Object.keys(returned)) {
          let object: string[] = returned[quiz];
          stateQuizzes.push(new QuizInfoMini(object[0], object[1], quiz));
        }
      } else {
        let name : string[] = newUser.displayName!.split(' ');

        user.set({
          first: name[0],
          last: name.length !== 0 ? name[name.length - 1]: null,
          quizzes: {},
          quizResults: {}
        }).then(() => {
          console.log("Document set properly");
        }).catch((error) => {
          console.error("Document Not Set");
        })
      }
    }

    this.setState({quizzes: stateQuizzes, quiz: null, pageNum: 0});
  }
}