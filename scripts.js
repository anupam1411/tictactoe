document.getElementById("start-game").addEventListener("click", initializeGame);
document
  .getElementById("restart-game")
  .addEventListener("click", initializeGame);

let gridSize;
let winStreak;
let currentPlayer;
let gameGrid;

function initializeGame() {
  gridSize = parseInt(document.getElementById("grid-size").value);
  winStreak = parseInt(document.getElementById("win-streak").value);

  if (winStreak > gridSize) {
    alert("Win streak cannot be greater than grid size");
    return;
  }

  currentPlayer = "X";
  gameGrid = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));

  const gameGridElement = document.getElementById("game-grid");
  gameGridElement.innerHTML = "";
  gameGridElement.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  gameGridElement.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const cell = document.createElement("div");
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener("click", handleCellClick);
      gameGridElement.appendChild(cell);
    }
  }

  document.getElementById("restart-game").classList.remove("hidden");
  document.getElementById("result").classList.add("hidden");
  document.getElementById("result").textContent = "";
}

function handleCellClick(event) {
  const row = event.target.dataset.row;
  const col = event.target.dataset.col;

  if (gameGrid[row][col] !== null) return;

  gameGrid[row][col] = currentPlayer;
  event.target.textContent = currentPlayer;
  event.target.classList.add(currentPlayer.toLowerCase());

  if (checkWin(parseInt(row), parseInt(col))) {
    document.getElementById("result").textContent = `${currentPlayer} wins!`;
    document.getElementById("result").classList.remove("hidden");
    document.getElementById("restart-game").classList.remove("hidden");
    disableGrid();
  } else if (gameGrid.flat().every((cell) => cell !== null)) {
    document.getElementById("result").textContent = "It's a draw!";
    document.getElementById("result").classList.remove("hidden");
    document.getElementById("restart-game").classList.remove("hidden");
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  }
}

function checkWin(row, col) {
  const directions = [
    { dr: 0, dc: 1 }, // horizontal
    { dr: 1, dc: 0 }, // vertical
    { dr: 1, dc: 1 }, // diagonal /
    { dr: 1, dc: -1 }, // diagonal \
  ];

  return directions.some((direction) => {
    let count = 1;
    for (let step = 1; step < winStreak; step++) {
      const r = row + direction.dr * step;
      const c = col + direction.dc * step;
      if (
        r >= 0 &&
        r < gridSize &&
        c >= 0 &&
        c < gridSize &&
        gameGrid[r][c] === currentPlayer
      ) {
        count++;
      } else {
        break;
      }
    }
    for (let step = 1; step < winStreak; step++) {
      const r = row - direction.dr * step;
      const c = col - direction.dc * step;
      if (
        r >= 0 &&
        r < gridSize &&
        c >= 0 &&
        c < gridSize &&
        gameGrid[r][c] === currentPlayer
      ) {
        count++;
      } else {
        break;
      }
    }
    return count >= winStreak;
  });
}

function disableGrid() {
  const cells = document.querySelectorAll("#game-grid div");
  cells.forEach((cell) => cell.removeEventListener("click", handleCellClick));
}

initializeGame();
