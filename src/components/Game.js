import React, { Component } from 'react';
import _ from 'lodash';
import './Game.css';
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';

var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};

const Stars = (props) => {

  return (
    <div className="col-xs-5">
      {_.range(props.numberOfStars).map((i) =>
          <i key={i} className='fa fa-star fa-2x'></i>
      )}
    </div>
  );
}

const Button = (props) => {
  let button;

  switch(props.answerIsCorrect){
    case true:
      button =
        <button className='btn btn-lg btn-success' onClick={props.acceptAnswer}>
          <i className='fa fa-check'></i>
        </button>
      break;
    case false:
      button =
        <button className='btn btn-lg btn-danger' >
          <i className='fa fa-times'></i>
        </button>
      break;
    default:
      button =
        <button className='btn btn-lg btn-info'
                onClick={props.checkAnswer}
                disabled={props.selectedNumbers.length === 0 }>
          =
        </button>
      break;
  }
  return (
    <div className="col-xs-2 text-center">
      {button}
      <br /><br />
      <button className='btn btn-warning' onClick={props.redraw}
              disabled={props.redraws === 0}>
        <i className='fa fa-refresh'> {props.redraws}</i>
      </button>
    </div>
  );
}

const Answer = (props) => {
  return (
    <div className="col-xs-5">
      {props.selectedNumbers.map((number, i)=>
        <span key={i}
              onClick={() => props.unSelectNumber(number)}>{number}</span>
      )}
    </div>
  );
}

const Numbers = (props) => {
  const numberClassname = (number) => {
    if(props.usedNumbers.indexOf(number) >= 0) {
        return 'used';
    }
    if(props.selectedNumbers.indexOf(number) >= 0) {
        return 'selected';
    }
  }


  return (
    <div className="jumbotron text-center">
      <div>
        {Numbers.list.map((number, i) =>
          <span key={i} className={numberClassname(number)}
                  onClick={() => props.selectNumber(number)}>
            {number}
          </span>
        )}
      </div>
    </div>
  );
}

const DoneFrame = (props) => {

  return (
    <div className="jumbotron text-center">
      <h1>{props.doneStatus}</h1>
      <button className='btn btn-lg btn-primary' onClick={props.resetGame}>Play Again</button>
    </div>
  );
}

Numbers.list = _.range(1, 10);

export class Game extends Component {
  static randomNumber = () => Math.floor(Math.random()*9) + 1;

  static initialState = () => ({
    selectedNumbers: [],
    numberOfStars: Game.randomNumber(),
    usedNumbers: [],
    answerIsCorrect: null,
    redraws: 5,
    doneStatus: null,
  })
  state = Game.initialState();
  resetGame = () => this.setState(Game.initialState())
  selectNumber = (clickedNumber) => {
    if(this.state.selectedNumbers.indexOf(clickedNumber) >= 0) { return; }
    if(this.state.usedNumbers.indexOf(clickedNumber) >= 0) { return; }
    this.setState( prevState => ({
      answerIsCorrect: null,
      selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
    }));
  };
  unSelectNumber = (clickedNumber) => {
    this.setState( prevState => ({
      answerIsCorrect: null,
      selectedNumbers: prevState.selectedNumbers
                                .filter(number => number !== clickedNumber)
    }));
  };
  checkAnswer = () => {
    this.setState( prevState => ({
      answerIsCorrect: prevState.numberOfStars ===
                       prevState.selectedNumbers.reduce((acc, n) => acc + n, 0)
    }));
  }
  acceptAnswer = () => {
    this.setState( prevState => ({
      usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
      selectedNumbers: [],
      answerIsCorrect: null,
      numberOfStars: Game.randomNumber(),
    }), this.updateDoneStatus); // it calls promise
  }
  redraw = () => {
    if(this.state.redraws === 0) { return; }
    this.setState( prevState => ({
      numberOfStars: Game.randomNumber(),
      selectedNumbers: [],
      answerIsCorrect: null,
      redraws: prevState.redraws - 1,
    }), this.updateDoneStatus);
  }
  possibleSolutions = ({numberOfStars, usedNumbers}) => {
    const possibleNumbers = _.range(1, 10).filter(number =>
      usedNumbers.indexOf(number) === -1
    );

    return possibleCombinationSum(possibleNumbers, numberOfStars);
  }

  updateDoneStatus = () => {
    this.setState(prevState => {
      if(prevState.usedNumbers.length === 9){
        return { doneStatus: 'Done, Nice!', numberOfStars: 0 }
      }
      if(prevState.redraws === 0 && !this.possibleSolutions(prevState)){
        return { doneStatus: 'Game Over', numberOfStars: 0 }
      }
    });
  }

  render() {
    const { selectedNumbers,
            numberOfStars,
            answerIsCorrect,
            usedNumbers,
            redraws,
            doneStatus
          } = this.state;

    return (
      <div className="container">
        <div className="row">
          <Stars numberOfStars={numberOfStars} />
          <Button selectedNumbers={selectedNumbers}
                  checkAnswer={this.checkAnswer}
                  acceptAnswer={this.acceptAnswer}
                  redraw={this.redraw}
                  redraws={redraws}
                  answerIsCorrect={answerIsCorrect}/>
          <Answer selectedNumbers={selectedNumbers}
                  unSelectNumber={this.unSelectNumber} />
        </div>
        <br />
        {doneStatus ?
          <DoneFrame doneStatus={doneStatus}
                     resetGame={this.resetGame}/> :
          <Numbers selectedNumbers={selectedNumbers}
                   selectNumber={this.selectNumber}
                   usedNumbers={usedNumbers}/>
        }
      </div>
    );
  }
}
