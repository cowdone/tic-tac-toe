const Gameboard = (function(){
  const rows = 3;
  const columns = 3;
  let board = [];

  for(let i=0;i<rows;i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;
  const restartGame = () => {
    const newBoard = [];

    for(let i=0;i<rows;i++) {
    newBoard[i] = [];
    for (let j = 0; j < columns; j++) {
      newBoard[i].push(Cell());
    }
  }
  board = newBoard;
  }

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
      return "Invalid";
    }
    if(board[row][column].getValue() == "X" || board[row][column].getValue() == "O") {
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
    getBoard,
    restartGame
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

  const playerOneInput = document.querySelector("#player-one-input")
  const playerTwoInput = document.querySelector("#player-two-input")
  const submitNamesBtn = document.querySelector(".submit-names-btn")
  const playerTurnDiv = document.querySelector(".turn")
  submitNamesBtn.addEventListener("click", () => {
    players[0].name = playerOneInput.value;
    players[1].name = playerTwoInput.value;
    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`
  })

  let activePlayer = players[0]

  const switchPlayersTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0]}
  
  const getActivePlayer = () => activePlayer;

  let gameOver = false;
  let message;
  let domMessage;
  const messageContainer = document.querySelector(".result-msg-container")
  const playRound = (row,column) => { 
    if (domMessage) {
      if(domMessage.textContent === "It's a draw!" || domMessage.textContent === `${getActivePlayer().name} wins!`) {
        return;
      }
      domMessage.remove();
    }
    if(gameOver) {
      return;
    }
    const result = game.makePlay(row,column,getActivePlayer().token);
    if(result === "Invalid") {
      message = "Space already filled."
      domMessage = document.createElement("h1")
      domMessage.textContent = message
      messageContainer.appendChild(domMessage)
      return;
    }
    if(result === "Draw") {
      message = "It's a draw!";
      domMessage = document.createElement("h1")
      domMessage.textContent = message;
      messageContainer.appendChild(domMessage)
      gameOver = true;
      return;
    }
    if(result) {
      message = `${getActivePlayer().name} wins!`;
      domMessage = document.createElement("h1")
      domMessage.textContent = message;
      messageContainer.appendChild(domMessage)
      gameOver = true;
      return;
    }
    switchPlayersTurn();
  }
  const container = document.querySelector(".restart-btn-container")
      const newGame = document.createElement("button")
      newGame.classList.add("restart-btn")
      newGame.textContent = "Restart Game"
      container.appendChild(newGame)
      newGame.addEventListener("click", () => {
        game.restartGame();
        activePlayer = players[0];
        gameOver = false;
        domMessage.textContent = "";
        domMessage.remove();
      })

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
        boardButton.classList.add("board-btn")
        boardDiv.appendChild(boardButton);
      })
    })
  }
  const restartBtn = document.querySelector(".restart-btn")
  restartBtn.addEventListener("click", () => updateScreen())

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