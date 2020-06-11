import React from 'react';
import { TextField } from '@material-ui/core';
import { QuestionHandler } from './QuestionHandler';

export class ShortAnswer extends QuestionHandler {

    /*
    Format:
    
    Title
    Answer Box
    */
    render() {
        
        return (
        <div>
            {this.props.question.prompts} <br/> 
            <TextField
                rows={1}
                onChange={this.onInputChange}
                value={this.props.answer}
                variant='outlined'
                color='primary'
                size='small'
            /> <br/>
        </div>);
    }
}