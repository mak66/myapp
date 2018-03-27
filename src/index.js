import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button
        className={"square-"+props.size}
        onClick={props.onClick}
        style={{backgroundColor: (props.onWinLine ? 'red' : 'white')}}>
        {props.value}
      </button>
    );
}

class Board extends React.Component {
  renderSquare(i,winLine) {
    return <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      onWinLine={winLine.includes(i)}
      size={this.props.size}
           />;
  }

  renderRow(r,winLine){
    return (
      <div className="board-row">
        {this.renderSquare(r*3,winLine)}
        {this.renderSquare(r*3+1,winLine)}
        {this.renderSquare(r*3+2,winLine)}
      </div>

    )
  }


  render() {
    const winLine = winningLine(this.props.squares);
    return (
      <div>
        {this.renderRow(0,winLine)}
        {this.renderRow(1,winLine)}
        {this.renderRow(2,winLine)}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history:[{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
      size: "big"
    }
  }
  /**
 * Calculate & Update state of new dimensions
 */
updateDimensions() {
  if ( window.innerWidth > 960 && window.innerHeight > 750) {
    this.setState({ size: "big" });
  } else if ( window.innerWidth > 800 && window.innerHeight > 500) {
    this.setState({ size: "medium" });
  } else if ( window.innerWidth > 460 && window.innerHeight > 270) {
    this.setState({ size: "small" });
  } else if ( window.innerWidth > 150 && window.innerHeight > 130) {
    this.setState({ size: "tiny" });
  } else {
    this.setState({ size: "too small" });
  }
}

/**
 * Add event listener
 */
componentDidMount() {
  this.updateDimensions();
  window.addEventListener("resize", this.updateDimensions.bind(this));
}

/**
 * Remove event listener
 */
componentWillUnmount() {
  window.removeEventListener("resize", this.updateDimensions.bind(this));
}

  handleClick(i){
    const history = this.state.history.slice(0,this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
    const desc = move ?
      'Go to move #' + move :
      'Game Start';
      return (
        <li  className={"list-item-"+this.state.size}key={move}>
          <button className={"listButton-"+this.state.size} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' +winner;
    } else if (this.state.stepNumber === 9) {
      status = 'Draw';
    } else {
      status = 'Next player: '+ (this.state.xIsNext ? 'X' : 'O');
    }
    if (this.state.size === "too small" ) return (<div>Window too small</div>);

    return (
      <div className={"body-"+this.state.size}>
        <div className="game">
          <div>
            <Board
              squares={current.squares}
              size={this.state.size}
              onClick={(i) => this.handleClick(i)}/>
          </div>
          <div className={"game-info-"+this.state.size}>
            <div className={"status-"+this.state.size}>History</div>
            <ol className={"ol-"+this.state.size+",status-"+this.state.size}>{moves}</ol>
          </div>
        </div>
        <div className={"status-"+this.state.size}>
          <div>{status}</div>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
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
function winningLine(squares) {
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
      return lines[i];
    }
  }
  return [];
}
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
