import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";
var _ = require("lodash");

const Stars = props => {
  //const numberOfStars =

  return (
    <div className="col-5">
      {_.range(props.numberOfStars).map(i => (
        <i key={i} className="fa fa-star" />
      ))}
    </div>
  );
};

const Button = props => {
  let button;
  switch (props.answerIsCorrect) {
    case true:
      button = (
        <button className="btn btn-success" onClick={props.acceptAnswer}>
          <i className="fa fa-check" />
        </button>
      );
      break;
    case false:
      button = (
        <button className="btn btn-danger">
          <i className="fa fa-times" />
        </button>
      );
      break;
    default:
      button = (
        <button
          className="btn"
          onClick={props.checkAnswer}
          disabled={props.selectedNumbers.length === 0}
        >
          =
        </button>
      );
      break;
  }

  return (
    <div className="col-2 text-center">
      {button}
      <br />
      <br />
      <button
        className="btn btn-warning btn-sm"
        disabled={props.remainingRefreshes === 0}
      >
        <i className="fas fa-sync" onClick={props.refreshStars} />
        {props.remainingRefreshes}
      </button>
    </div>
  );
};

const Answer = props => {
  return (
    <div className="col-5">
      {props.selectedNumbers.map((number, i) => (
        <span key={i} onClick={() => props.unselectNumber(number)}>
          {number}
        </span>
      ))}
    </div>
  );
};

const Number = props => {
  const numberClassName = number => {
    if (props.usedNumbers.indexOf(number) >= 0) {
      return "used";
    }
    if (props.selectedNumbers.indexOf(number) >= 0) {
      return "selected";
    }
  };
  return (
    <div className="card text-center">
      <div>
        {Number.list.map((number, i) => (
          <span
            key={i}
            className={numberClassName(number)}
            onClick={() => props.selectNumber(number)}
          >
            {number}
          </span>
        ))}
      </div>
    </div>
  );
};
Number.list = _.range(1, 10);

const DoneFrame = props => {
  return (
    <div>
      <h2>{props.doneStatus}</h2>
      <button onClick={props.resetGame}><i class="fas fa-play"> play again</i></button>
    </div>
  );
};

var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) {
    return true;
  }
  if (arr[0] > n) {
    return false;
  }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length,
    combinationsCount = 1 << listSize;
  for (var i = 1; i < combinationsCount; i++) {
    var combinationSum = 0;
    for (var j = 0; j < listSize; j++) {
      if (i & (1 << j)) {
        combinationSum += arr[j];
      }
    }
    if (n === combinationSum) {
      return true;
    }
  }
  return false;
};
class Game extends React.Component {
  static randomNumber = () => {
    return 1 + Math.floor(Math.random() * 9);
  };

  static intialState = () => ({
    selectedNumbers: [],
    usedNumbers: [],
    randomNumberOfStars: Game.randomNumber(),
    answerIsCorrect: null,
    remainingRefreshes: 5,
    doneStatus: null
  });

  state = Game.intialState();

  selectNumber = clickedNumber => {
    if (this.state.selectedNumbers.indexOf(clickedNumber) >= 0) {
      return;
    }
    this.setState(prevState => ({
      answerIsCorrect: null,
      selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
    }));
  };

  unselectNumber = clickedNumber => {
    this.setState(prevState => ({
      answerIsCorrect: null,
      selectedNumbers: prevState.selectedNumbers.filter(
        number => number !== clickedNumber
      )
    }));
  };

  checkAnswer = () => {
    this.setState(prevState => ({
      answerIsCorrect:
        prevState.randomNumberOfStars ===
        prevState.selectedNumbers.reduce((acc, n) => acc + n, 0)
    }));
  };

  acceptAnswer = () => {
    this.setState(
      prevState => ({
        usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
        selectedNumbers: [],
        answerIsCorrect: null,
        randomNumberOfStars: Game.randomNumber()
      }),
      this.updateDoneStatus
    );
  };

  refreshStars = () => {
    if (this.state.remainingRefreshes > 0) {
      this.setState(
        prevState => ({
          randomNumberOfStars: Game.randomNumber(),
          answerIsCorrect: null,
          selectedNumbers: [],
          remainingRefreshes: prevState.remainingRefreshes - 1
        }),
        this.updateDoneStatus
      );
    }
  };

  updateDoneStatus = () => {
    this.setState(prevState => {
      if (prevState.usedNumbers.length === 9) {
        return { doneStatus: "Congrats!" };
      }
      if (
        prevState.remainingRefreshes === 0 &&
        !this.possibleSolutions(prevState)
      ) {
        return { doneStatus: "Game Over!" };
      }
    });
  };

  possibleSolutions = ({ randomNumberOfStars, usedNumbers }) => {
    const possibleNumbers = _.range(1, 10).filter(
      number => usedNumbers.indexOf(number) === -1
    );
    return possibleCombinationSum(possibleNumbers, randomNumberOfStars);
  };

  resetGame = () => {
    this.setState(
        Game.intialState()
    );
  };

  render() {
    const {
      selectedNumbers,
      randomNumberOfStars,
      answerIsCorrect,
      usedNumbers,
      remainingRefreshes,
      doneStatus
    } = this.state;
    return (
      <div className="container">
        <h3>Play Nine</h3>
        <hr />
        <div className="row">
          <Stars numberOfStars={randomNumberOfStars} />

          <Button
            selectedNumbers={selectedNumbers}
            checkAnswer={this.checkAnswer}
            answerIsCorrect={answerIsCorrect}
            acceptAnswer={this.acceptAnswer}
            refreshStars={this.refreshStars}
            remainingRefreshes={remainingRefreshes}
          />

          <Answer
            selectedNumbers={selectedNumbers}
            unselectNumber={this.unselectNumber}
          />
        </div>
        <br />
        {doneStatus ? (
          <DoneFrame doneStatus={doneStatus} resetGame={this.resetGame}/>
        ) : (
          <Number
            selectedNumbers={selectedNumbers}
            selectNumber={this.selectNumber}
            usedNumbers={usedNumbers}
          />
        )}
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        <Game />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
