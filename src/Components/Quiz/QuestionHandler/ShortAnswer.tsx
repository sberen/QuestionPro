import React from 'react';
import { Button, TextField } from '@material-ui/core';
import { QuestionHandler } from './QuestionHandler';

export class ShortAnswer extends QuestionHandler {

    render() {
        let result = this.renderButtons();
        
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
            {result}
        </div>);
    }
}