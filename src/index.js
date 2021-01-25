import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
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
            />
        );
    }

    render() {
        return (
            <div>
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
    };
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            xTurn: true,
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];

        // Create copy of state array
        const tempSquares = current.squares.slice();

        // Check whether a move needs to be made
        if(this.calculateWinner(tempSquares) || tempSquares[i])
            return;

        // Determine which move it is and set state
        tempSquares[i] = this.state.xTurn ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: tempSquares
            }]),
            stepNumber: history.length,
            xTurn: !this.state.xTurn
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xTurn: (step % 2) === 0,
        });
    }

    calculateWinner(squares) {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    }

  render() {
      // create array for history and the most recent state of the game
      const history = this.state.history;
      const current = history[this.state.stepNumber];

      // determine if the move made was a game winning move or not
      const winner = this.calculateWinner(current.squares);

      // add the ability to jump back in history 
      const moves = history.map((i, move) => {
          const desc = move ? 'Go to move #' + move : 'Go to game start';
          return (
              <li key={move} >
                  <button onClick={() => this.jumpTo(move)}>{desc}</button>
              </li>
          );
      });

      let gameStatus;
      if(winner)
        gameStatus = 'Winner: ' + winner;
      else
        gameStatus = 'Next player: ' + (this.state.xTurn ? 'X' : 'O');

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    onClick={this.handleClick} 
                    squares={current.squares}
                />
            </div>
            <div className="game-info">
                <div>{gameStatus}</div>
                <ol>{moves}</ol>
            </div>
        </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
 
