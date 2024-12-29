let board;  
let currentPlayer;  
let aiDifficulty;  
let gameActive = true;
let isSinglePlayer = false;

function startGame(numPlayers) {  
    document.getElementById("menu").style.display = "none";  
    if (numPlayers === 1) {  
        isSinglePlayer = true;  // Mode un joueur  
        document.getElementById("difficulty").style.display = "block";  
    } else {  
        isSinglePlayer = false; // Mode deux joueurs  
        startTwoPlayerGame();  
    }  
}  

function setDifficulty(difficulty) {  
    aiDifficulty = difficulty;  
    document.getElementById("difficulty").style.display = "none";  
    startSinglePlayerGame();  
}  

function startSinglePlayerGame() {  
    board = Array(9).fill(null);  
    currentPlayer = 'X';  
    gameActive = true;  

    document.getElementById("gameBoard").style.display = "block";  
    document.getElementById("grid").innerHTML = '';  
    for (let i = 0; i < 9; i++) {  
        const cell = document.createElement("div");  
        cell.className = "cell";  
        cell.setAttribute("data-cell-index", i);  
        cell.addEventListener("click", () => handleCellClick(cell, i));  
        document.getElementById("grid").appendChild(cell);  
    }  
    displayMessage("C'est à votre tour !");  
}  

function startTwoPlayerGame() {  
    board = Array(9).fill(null);  
    currentPlayer = 'X';  
    gameActive = true;  

    document.getElementById("gameBoard").style.display = "block";  
    document.getElementById("grid").innerHTML = '';  
    for (let i = 0; i < 9; i++) {  
        const cell = document.createElement("div");  
        cell.className = "cell";  
        cell.setAttribute("data-cell-index", i);  
        cell.addEventListener("click", () => handleCellClick(cell, i));  
        document.getElementById("grid").appendChild(cell);  
    }  
    displayMessage("C'est à vous de jouer, Joueur X !");  
}  

function handleCellClick(cell, index) {  
    if (board[index] || !gameActive) {  
        return;  
    }  

    board[index] = currentPlayer;  
    cell.innerText = currentPlayer;  

    if (checkWin(currentPlayer)) {  
        displayMessage(`Le joueur ${currentPlayer} a gagné !`);  
        gameActive = false;  
        document.getElementById("restartButton").style.display = "block";  
    } else if (board.every(cell => cell)) {  
        displayMessage("Match nul !");  
        gameActive = false;  
        document.getElementById("restartButton").style.display = "block";  
    } else {  
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';  
        if (isSinglePlayer && currentPlayer === 'O') {  // Vérifiez si c'est le mode un joueur  
            makeAIMove();  
        } else {  
            displayMessage(`C'est à votre tour, Joueur ${currentPlayer}`);  
        }  
    }  
}

function makeAIMove() {  
    let move;  
    if (aiDifficulty === 1) {  
        move = getRandomMove();  
    } else if (aiDifficulty === 2) {  
        move = getMediumMove();  
    } else {  
        move = getBestMove();  
    }  
    if (move !== null) {  
        const cell = document.querySelector(`[data-cell-index='${move}']`);  
        handleCellClick(cell, move);  
    }  
}  

function getRandomMove() {  
    const emptyCells = board.reduce((acc, cell, index) => {  
        if (!cell) acc.push(index);  
        return acc;  
    }, []);  
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];  
}  

function getMediumMove() {  
    // Prioritize winning move, then block opponent  
    for (let i = 0; i < 3; i++) {  
        if (board[i * 3] === board[i * 3 + 1] && board[i * 3 + 2] === null) {  
            return i * 3 + 2;  
        }  
        if (board[i * 3] === board[i * 3 + 2] && board[i * 3 + 1] === null) {  
            return i * 3 + 1;  
        }  
        if (board[i * 3 + 1] === board[i * 3 + 2] && board[i * 3] === null) {  
            return i * 3;  
        }  
    }  
    for (let i = 0; i < 3; i++) {  
        if (board[i] === board[i + 3] && board[i + 6] === null) {  
            return i + 6;  
        }  
        if (board[i] === board[i + 6] && board[i + 3] === null) {  
            return i + 3;  
        }  
        if (board[i + 3] === board[i + 6] && board[i] === null) {  
            return i;  
        }  
    }  
    return getRandomMove();  
}  

function getBestMove() {  
    // Simple AI which can block or win based on winning strategy  
    for (let i = 0; i < 3; i++) {  
        if (board[i * 3] === board[i * 3 + 1] && board[i * 3 + 2] === null) {  
            return i * 3 + 2;  
        }  
        if (board[i * 3] === board[i * 3 + 2] && board[i * 3 + 1] === null) {  
            return i * 3 + 1;  
        }  
        if (board[i * 3 + 1] === board[i * 3 + 2] && board[i * 3] === null) {  
            return i * 3;  
        }  
    }  
    for (let i = 0; i < 3; i++) {  
        if (board[i] === board[i + 3] && board[i + 6] === null) {  
            return i + 6;  
        }  
        if (board[i] === board[i + 6] && board[i + 3] === null) {  
            return i + 3;  
        }  
        if (board[i + 3] === board[i + 6] && board[i] === null) {  
            return i;  
        }  
    }  
    // Check diagonals  
    if (board[0] === board[4] && board[8] === null) return 8;  
    if (board[0] === board[8] && board[4] === null) return 4;  
    if (board[4] === board[8] && board[0] === null) return 0;  
    return getRandomMove();  
}  

function checkWin(player) {  
    return (  
        (board[0] === player && board[1] === player && board[2] === player) || // Horizontal  
        (board[3] === player && board[4] === player && board[5] === player) ||  
        (board[6] === player && board[7] === player && board[8] === player) ||  
        (board[0] === player && board[3] === player && board[6] === player) || // Vertical  
        (board[1] === player && board[4] === player && board[7] === player) ||  
        (board[2] === player && board[5] === player && board[8] === player) ||  
        (board[0] === player && board[4] === player && board[8] === player) || // Diagonal  
        (board[2] === player && board[4] === player && board[6] === player)  
    );  
}  

function resetGame() {  
    document.getElementById("restartButton").style.display = "none";  
    document.getElementById("message").innerText = "";  
    document.getElementById("menu").style.display = "block";  
    document.getElementById("gameBoard").style.display = "none";  
}  
  
function displayMessage(message) {  
    document.getElementById("message").innerText = message;  
}