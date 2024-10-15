const boardSize = 5;  // Size of the grid
const mineCount = 5;  // Number of mines
let gameBoard = [];
let gameOver = false;

// Initialize the game
function initGame() {
    gameOver = false;
    gameBoard = [];
    const gameBoardDiv = document.getElementById("gameBoard");
    gameBoardDiv.innerHTML = '';
    document.getElementById("status").innerText = 'Click on a cell to reveal it.';

    // Create game board
    for (let i = 0; i < boardSize; i++) {
        gameBoard[i] = [];
        for (let j = 0; j < boardSize; j++) {
            gameBoard[i][j] = {
                revealed: false,
                mine: false,
                adjacentMines: 0
            };
            const cellDiv = document.createElement("div");
            cellDiv.classList.add("cell");
            cellDiv.dataset.row = i;
            cellDiv.dataset.col = j;
            cellDiv.addEventListener("click", revealCell);
            gameBoardDiv.appendChild(cellDiv);
        }
    }

    // Place mines
    for (let i = 0; i < mineCount; i++) {
        let x, y;
        do {
            x = Math.floor(Math.random() * boardSize);
            y = Math.floor(Math.random() * boardSize);
        } while (gameBoard[x][y].mine);
        gameBoard[x][y].mine = true;
        updateAdjacentMines(x, y);
    }
}

// Update adjacent mines count
function updateAdjacentMines(x, y) {
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (i >= 0 && i < boardSize && j >= 0 && j < boardSize && !(i === x && j === y)) {
                gameBoard[i][j].adjacentMines++;
            }
        }
    }
}

// Reveal cell function
function revealCell(event) {
    if (gameOver) return;

    const cellDiv = event.target;
    const row = cellDiv.dataset.row;
    const col = cellDiv.dataset.col;

    if (gameBoard[row][col].revealed) return;

    gameBoard[row][col].revealed = true;
    cellDiv.classList.add("revealed");

    if (gameBoard[row][col].mine) {
        cellDiv.classList.add("mine");
        document.getElementById("status").innerText = 'Game Over! You hit a mine.';
        gameOver = true;
        revealAllMines();
    } else {
        cellDiv.innerText = gameBoard[row][col].adjacentMines || '';
        if (gameBoard[row][col].adjacentMines === 0) {
            revealAdjacentCells(row, col);
        }
    }
}

// Reveal adjacent cells recursively
function revealAdjacentCells(x, y) {
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (i >= 0 && i < boardSize && j >= 0 && j < boardSize && !(i === x && j === y)) {
                const cellDiv = document.querySelector(`.cell[data-row='${i}'][data-col='${j}']`);
                if (cellDiv && !gameBoard[i][j].revealed) {
                    revealCell({ target: cellDiv });
                }
            }
        }
    }
}

// Reveal all mines
function revealAllMines() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (gameBoard[i][j].mine) {
                const cellDiv = document.querySelector(`.cell[data-row='${i}'][data-col='${j}']`);
                if (cellDiv) {
                    cellDiv.classList.add("mine");
                }
            }
        }
    }
}

// Reset game button event
document.getElementById("resetButton").addEventListener("click", initGame);

// Start the game
initGame();
