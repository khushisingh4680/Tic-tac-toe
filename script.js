const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart');

let board = ["", "", "", "", "", "", "", "", ""];
let isGameActive = true;
const human = "X";
const ai = "O";

const winConditions = [
  [0,1,2], [3,4,5], [6,7,8], 
  [0,3,6], [1,4,7], [2,5,8], 
  [0,4,8], [2,4,6]
];

function handleCellClick(e) {
  const index = e.target.getAttribute('data-index');
  if (board[index] !== "" || !isGameActive) return;

  makeMove(index, human);
  if (isGameActive) {
    setTimeout(aiMove, 500);
  }
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  checkResult(player);
}

function aiMove() {
  if (!isGameActive) return;

  // Step 1: Try to win
  for (let condition of winConditions) {
    const [a, b, c] = condition;
    const values = [board[a], board[b], board[c]];
    if (values.filter(v => v === ai).length === 2 && values.includes("")) {
      const index = condition[values.indexOf("")];
      makeMove(index, ai);
      return;
    }
  }

  // Step 2: Block human win
  for (let condition of winConditions) {
    const [a, b, c] = condition;
    const values = [board[a], board[b], board[c]];
    if (values.filter(v => v === human).length === 2 && values.includes("")) {
      const index = condition[values.indexOf("")];
      makeMove(index, ai);
      return;
    }
  }

  // Step 3: Random move
  const available = board
    .map((val, i) => (val === "" ? i : null))
    .filter(i => i !== null);

  if (available.length === 0) return;

  const randomIndex = available[Math.floor(Math.random() * available.length)];
  makeMove(randomIndex, ai);
}

function checkResult(currentPlayer) {
  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      isGameActive = false;
      statusText.textContent = currentPlayer === human ? "You are the winner!" : "AI wins!";
      return;
    }
  }

  if (!board.includes("")) {
    isGameActive = false;
    statusText.textContent = "It's a draw!";
    return;
  }

  statusText.textContent = currentPlayer === human ? "AI's Turn (O)" : "Your Turn (X)";
}

function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  isGameActive = true;
  cells.forEach(cell => cell.textContent = "");
  statusText.textContent = "Your Turn (X)";
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);

// Initial setup
statusText.textContent = "Your Turn (X)";