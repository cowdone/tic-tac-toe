const Gameboard = (function(){
  const rows = 3;
  const columns = 3;
  const board = [];

  for(let i=0;i<rows;i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const checkWin = () => {
    for(let i=0;i<3;i++) {
      if(board[i][0].getValue() !== 0 &&
        board[i][0].getValue() === board[i][1].getValue() &&
        board[i][1].getValue() === board[i][2].getValue()
      ) {
        return true;
      } 
    }
    for(let j=0;j<3;j++) {
      if(board[0][j].getValue() !== 0 &&
        board[0][j].getValue() === board[1][j].getValue() &&
        board[1][j].getValue() === board[2][j].getValue()
      ) {
        return true;
      }
    }
    if(board[0][0].getValue() !== 0 &&
      board[0][0].getValue() === board[1][1].getValue() &&
      board[1][1].getValue() === board[2][2].getValue()
    ) {
      return true;
    } 
    if(board[0][2].getValue() !== 0 &&
      board[0][2].getValue() === board[1][1].getValue() &&
      board[1][1].getValue() === board[2][0].getValue()
    ) {
      return true;
    }
    return false;
  }
  const checkDraw = () => {
    if(board[0][0].getValue() !== 0 && board[0][1].getValue() !== 0 && board[0][2].getValue() !== 0 &&
      board[1][0].getValue() !== 0 && board[1][1].getValue() !== 0 && board[1][2].getValue() !== 0 &&
      board[2][0].getValue() !== 0 && board[2][1].getValue() !== 0 && board[2][2].getValue() !== 0
    ) {
      return true;
    }
    return false;
  }

  const makePlay = (row,column,player) => {
    if(row > 3 || column > 3 || row < 0 || column < 0) {
      console.log("Out of bounds. (the first index is 0 for rows and columns)")
      return "Invalid";
    }
    if(board[row][column].getValue() == "x" || board[row][column].getValue() == "o") {
      console.log("Space already filled.") 
      return "Invalid";
    }
      board[row][column].addToken(player)
    if(checkWin()) {
      return true;
    }
    if(checkDraw() === true && checkWin() !== true) {
      return "Draw";
    }
  }
  return {
    makePlay,
    getBoard
  }
})();

function Cell() {
  let value = 0;

  const addToken = (token) => {
    value = token;
  };

  const getValue = () => value;

  return {
    addToken,
    getValue
  };
}

const gameController = (function(){
  const game = Gameboard;
  const players = [
    {
      name:"Player One",
      token:"X"
    },
    {
      name:"Player Two",
      token:"O"
    }
  ]

  let activePlayer = players[0]
  const switchPlayersTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0]}
  
  const getActivePlayer = () => activePlayer;
  
  const printNewRound = () => {
    console.log(game.getBoard())
    console.log(`${getActivePlayer().name}'s turn.`)
  }
  let gameOver = false;

  const playRound = (row,column) => {
    if(gameOver) {
      console.log("The game is over, reload the page to play again!")
      return;
    }
    const result = game.makePlay(row,column,getActivePlayer().token);
    if(result === "Invalid") {
      return;
    }
    if(result === "Draw") {
      console.log("It's a draw!")
      gameOver = true;
      return;
    }
    if(result) {
      console.log(`${getActivePlayer().name} wins!`)
      gameOver = true;
      return;
    }
    switchPlayersTurn();
    printNewRound();
  }

  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard: game.getBoard
  }
})();
const screenController = function(){
  const game = gameController;
  const playerTurnDiv = document.querySelector(".turn")
  const boardDiv = document.querySelector(".board")
  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`
    
    board.forEach((row, index) => {
      const rowIndex = index;
      row.forEach((cell, index) => {
        const boardButton = document.createElement("button")
        boardButton.dataset.row = rowIndex;
        boardButton.dataset.column = index;
        boardButton.textContent = `${cell.getValue()}`
        boardDiv.appendChild(boardButton);
      })
    })
  }
  function clickHandlerBoard(e) {
      const selectedRow = e.target.dataset.row;
      const selectedColumn = e.target.dataset.column;
      if(!selectedColumn || !selectedRow) return;
      game.playRound(selectedRow, selectedColumn);
      updateScreen();
    }
    boardDiv.addEventListener("click",clickHandlerBoard);
    updateScreen();
  
};
screenController();