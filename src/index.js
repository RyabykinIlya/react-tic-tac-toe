import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className={props.class + " square"} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        class={this.props.winner.indexOf(i) >= 0 ? "btn-won" : null}
      />
    );
  }

  render() {
    return (
      <div>
        {/*<div className="status">{status}</div>*/}
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      xIsNext: true,
      winner: []
    };
  }

  handleClick(i) {
    if (this.state.winner.length > 0) return;
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (squares[i]) return;
    squares[i] = this.state.xIsNext ? "X" : "O";

    this.setState({
      history: history.concat([{ squares: squares }]),
      xIsNext: !this.state.xIsNext,
      winner: calculateWinner(squares)
    });
  }

  jumpTo(idx) {
    let xIsNext = false;
    if (idx === 0 || idx % 2 === 0) {
      xIsNext = true;
    }
    this.setState({
      history: this.state.history.slice(0, idx + 1),
      xIsNext: xIsNext,
      winner: idx === 0 ? [] : this.state.winner
    });
  }

  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = this.state.winner;

    let moves = [];
    let desc = "";
    history.forEach((item, idx) => {
      if (idx === 0) {
        desc = "go to start";
      } else {
        desc = "go to #" + idx;
      }
      moves.push(
        <li key={idx}>
          <button className="goto-move" onClick={() => this.jumpTo(idx)}>
            {desc}
          </button>
        </li>
      );
    });

    let status;
    console.log(history.length);
    if (winner.length > 0) {
      status = "The winner is: " + current.squares[winner[0]];
    } else if (history.length === 10) {
      status = "Is a Draw";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-info">
          <ul>{moves}</ul>
        </div>
        <div className="game-board">
          <div className="game-status">{status}</div>
          <div>
            <Board
              squares={current.squares}
              winner={winner}
              onClick={i => this.handleClick(i)}
            />
          </div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return [];
}
