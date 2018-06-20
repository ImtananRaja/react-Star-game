import React from "react";
import ReactDOM from "react-dom";
var _ = require("lodash");
import "./styles.css";

const Stars = props => {
  const numberOfStars = 1 + Math.floor(Math.random() * 9);

  return (
    <div className="col-5">
      {_.range(numberOfStars).map(i => <i key={i} className="fa fa-star" />)}
    </div>
  );
};

const Button = props => {
  return (
    <div className="col-2">
      <button>=</button>
    </div>
  );
};

const Answer = props => {
  return <div className="col-5">...</div>;
};

const Number = props => {
  return (
    <div className="card text-center">
      <div>
        {Number.list.map((number, i) => <span key={i}>{number}</span>)}
      </div>
    </div>
  );
};

Number.list = _.range(1, 10);

class Game extends React.Component {
  render() {
    return (
      <div className="container">
        <h3>Play Nine</h3>
        <hr />
        <div className="row">
          <Stars />
          <Button />
          <Answer />
        </div>
        <br />
        <Number />
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
