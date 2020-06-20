import React from 'react';
import { QuizInfoMini } from '../Quiz/QuizInfoMini';
import { QUIZ_TYPES, QUIZ_INDICES, QUIZ_DESC } from '../Quiz/QuizTypes';
import { Button, Grid, CardActions, Card, CardContent, Typography, TextField } from '@material-ui/core';
import {FormProps} from './Form';
import "./UploadQuiz.css";
import { MCForm } from './MCForm';
import { SAForm } from './SAForm';
import {MSAForm} from './MSAForm';
import { firestore, auth } from '../../firebase';

interface UploadProps {
  submit: (qz: QuizInfoMini) => void;
  afterSubmit: () => void;
}


interface UploadState {
  quizType: string | undefined;
  quizID: string;
}

export default class UploadQuiz extends React.Component<UploadProps, UploadState> {
  constructor(props: any) {
    super(props);
    this.state = {
      quizType: undefined,
      quizID: ""
    }
  }

  render() {
    const buttons: any[] = QUIZ_TYPES.map((val) => <Grid item component={Card} style={{margin: "5px"}} id="button" spacing={3} xs={12} md ={5}>
                                                      <CardContent>
                                                        <Typography variant="h6">
                                                          {val.longName}
                                                        </Typography>
                                                        <Typography variant='body2'>
                                                          {QUIZ_DESC.get(val.shortName)}
                                                        </Typography>
                                                      </CardContent>
                                                      <CardActions>
                                                        <Button onClick={() => this.setState({quizType: val.shortName})} color='primary' variant='text'>Make This Quiz</Button>
                                                      </CardActions>
                                                    </Grid>);

    const props: FormProps = {
      quizType: this.state.quizType, 
      afterSubmit: this.props.afterSubmit,
      addQuiz: this.props.submit,
      onBack: () => this.setState({quizType: undefined})
    }

    const forms: any[] = [
      <SAForm {...props}/>,
      <MCForm {...props}/>,
      <MSAForm {...props}/>,
      <SAForm {...props}/>
    ];
    
    return ( !this.state.quizType
                    ?  <div style={{margin: "10px"}}>
                        <Typography style={{margin: "5px"}} variant='h5' color='primary'>New Quiz Type:</Typography>
                        <br/>
                        <Grid container spacing={3} >
                          {buttons}
                        </Grid>
                        <br/>
                        <TextField  id='fields' key={"second"} 
                          rows={1} 
                          label="QuizID" 
                          onChange={(evt: any) => this.setState({quizID: evt.target.value})} 
                          value={this.state.quizID} 
                          color='primary'
                          variant={"outlined"}
                          size='medium'
                       />
                       <br/>
                       <Button onClick={() => this.validateQuiz()} variant="outlined" color="primary">Add Quiz via QuizID</Button>
                      </div>
                    : forms[QUIZ_INDICES.get(this.state.quizType) as number] ) ;
  }

  async validateQuiz(){
    let quizID = this.state.quizID;
    var quizDocRef: firebase.firestore.DocumentReference = firestore.collection("quizzes").doc(quizID);
    let quiz = await quizDocRef.get()
                            .then(doc => {
                              if (!doc.exists) {
                                window.alert('Please enter valid quizID.');
                                return undefined;
                              } else {
                                console.log('Document data:', doc.data());
                                return doc.data();
                              }
                            })
                            .catch(err => {
                              console.log('Error getting document', err);
                            });
    console.log(quiz);
    if (quiz){
      var userDocRef : firebase.firestore.DocumentReference = firestore.collection("users").doc(auth.currentUser!.uid);
      let userQuizzes = await userDocRef.get()
                                .then((snap: firebase.firestore.DocumentData) => {
                                  return snap.get("quizzes");
                                })
                                .catch(err => {
                                  console.log('Error getting document', err);
                                });
      if(quizID in Object.keys(userQuizzes)){
        window.alert('You already have access to quiz');
      } else {
        var key = `quizzes.${quizID}`;
        window.alert('You successfully added quiz to your collection!');
        firestore.collection("users").doc(auth.currentUser!.uid).update({
          [key] : [quiz.title, quiz.type]
        });
      }

    }
    

  }

}