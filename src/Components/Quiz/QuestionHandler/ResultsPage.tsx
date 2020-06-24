import React from 'react';
import { Button, Card, Grid, Typography, Box, CardContent, CardActions } from '@material-ui/core';
import CountUp from 'react-countup';
import {QuizInfo} from '../QuizInfo';
import './ResultsPage.css'
import { QuizResult } from '../QuizResult';


export function Results(quiz: QuizInfo, responses: any[] ,result: QuizResult | undefined,
  shrinkQs: (Qs: any[]) => void, onBack: () => any) {
  let display: any = (result) ? result.display : undefined;
  let incorrectQuestions: any = (result) ? result.incorrectQuestions : undefined;

  let grade : number = (result) ? Math.round(100 * ((responses.length - incorrectQuestions.length) / responses.length)) : 0;
  return (
    (!result) ? (<div> loading</div>) : (
      <Grid container spacing={3}>
        <Grid item component={Card} xs={12} md={12} sm={12} className={grade >= 80 ? "goodTitle" : "badTitle"}>
          <CardContent>
            <Typography variant='h5' className={grade >= 80 ? "correctText" : "incorrectText"}>
            <Box fontWeight={"fontWeightBold"}>Grade: <CountUp start={0} end={grade} duration={2.5}/>%</Box>
            </Typography>
          </CardContent>
          <CardActions>
          {getButtons(incorrectQuestions, shrinkQs, onBack, quiz)}
          </CardActions>
        </Grid>
        {display}
      </Grid>)
  )
}


function getButtons(incorrect: any[], shrinkQs: (Qs: any[]) => void, onBack: () => void, quiz: QuizInfo) {
  const buttons: any[] = [];
  if (quiz.uid !== ""){
    buttons.push(
      <Button onClick={() => {shrinkQs(quiz.questions);}}
        variant="outlined" color="primary">Retake the Test</Button>
    );
  }

  if (incorrect.length !== 0) buttons.push(
    <Button onClick={() => {shrinkQs(incorrect);}}
      variant="outlined" color="primary">Test Incorrect Answers</Button>
  );

  buttons.push(<Button onClick={() => {onBack();}}
    variant="outlined" color="primary">Home</Button>);

  return buttons;
}