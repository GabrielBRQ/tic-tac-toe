let playerOneAgainstAI;
let AI;

const game = {
    rounds: 1,
    onePlayerGame: true,
    AIPlayed: false,
    difficulty: 'easy',
    depth: 0
}

var gameBoard = {
    1: { 1: '', 2: '', 3: '' },
    2: { 1: '', 2: '', 3: '' },
    3: { 1: '', 2: '', 3: '' }
};

const playerOne = playGame("X");
const playerTwo = playGame("O");

function playGame(symbol) {

    function placeSymbol() {
        // Add symbol to div and gameboard
        if(this.textContent.trim() === ''){
            this.textContent = symbol;
            this.classList.add(symbol === playerOne.symbol ? 'blue-text' : 'red-text');
            const row = this.dataset.row;
            const col = this.dataset.col;
            gameBoard[row][col] = symbol;
            game.rounds++;
        } 

        changeStyle();
    }

    return {
        symbol: symbol,
        placeSymbol: placeSymbol,
    };
}



function checkWinner() {
    const winCombinations = [
        // Row wins
        [gameBoard[1][1], gameBoard[1][2], gameBoard[1][3]],
        [gameBoard[2][1], gameBoard[2][2], gameBoard[2][3]],
        [gameBoard[3][1], gameBoard[3][2], gameBoard[3][3]],
        // Column wins
        [gameBoard[1][1], gameBoard[2][1], gameBoard[3][1]],
        [gameBoard[1][2], gameBoard[2][2], gameBoard[3][2]],
        [gameBoard[1][3], gameBoard[2][3], gameBoard[3][3]],
        // Diagonal wins
        [gameBoard[1][1], gameBoard[2][2], gameBoard[3][3]],
        [gameBoard[1][3], gameBoard[2][2], gameBoard[3][1]],
    ];


    // Verify all combinations
    for (const combination of winCombinations) {
        const [a, b, c] = combination;
        if (a !== '' && a === b && b === c) {
            return a;
        }
    }
    
    let isBoardFull = true;
    for (const row in gameBoard) {
        for (const column in gameBoard[row]) {
            if (gameBoard[row][column] === '') {
                isBoardFull = false;
                break;
            }
        }
    }

    if (isBoardFull) {
        return 'draw';
    }

    return null;
}


const cellDivs = document.querySelectorAll('.cell');

function setupCellDivs() {
    cellDivs.forEach(function(div) {
        div.addEventListener('click', function() {
            if(div.textContent.trim() === ''){
                if (!game.onePlayerGame) {
                    if (game.rounds % 2 === 0) {
                        playerTwo.placeSymbol.call(this);
                    } else {
                        playerOne.placeSymbol.call(this);
                    }
                } else {
                    if (game.rounds % 2 === 0) {
                        if(playerOneAgainstAI.symbol == "O"){
                            playerOneAgainstAI.placeSymbol.call(this);
                        }
                    } else{
                        if(playerOneAgainstAI.symbol == "X"){
                            playerOneAgainstAI.placeSymbol.call(this);
                        }
                    }
                }
                
                let winner = checkWinner();
                if (winner == 'X' || winner == 'O' || winner == 'draw') {
                    showResult(winner);
                }
                if(game.onePlayerGame){
                    if(winner == null && game.AIPlayed == false){

                        setTimeout(function() {
                            AIMove(game.difficulty);
                            winner = checkWinner();
                            if (winner == 'X' || winner == 'O' || winner == 'draw') {
                                showResult(winner);
                            }
                            game.AIPlayed = false;
                        }, 1000);
                    }
                }
            }

        });
    });
}

function showResult(winnerSymbol) {
    const resultsTitle = document.querySelector('.results-title');
    if (winnerSymbol === 'X') {
        resultsTitle.textContent = "Player one (X) won!";
    } else if (winnerSymbol === 'O') {
        resultsTitle.textContent = "Player two (O) won!";
    } else {
        resultsTitle.textContent = "It's a draw!";
    }
    document.querySelector('.results').style.display = 'flex';
}

document.querySelectorAll('.symbol').forEach((symbol) => {
    symbol.classList.add('remove');
});

function resetGame(){
        // Reset game
        game.rounds = 1;

        // Clear divs e class
        cellDivs.forEach(function(div) {
            div.textContent = '';
            div.classList.remove('blue-text', 'red-text');
        });
    
        // Reset gameboard
        gameBoard = {
            1: { 1: '', 2: '', 3: '' },
            2: { 1: '', 2: '', 3: '' },
            3: { 1: '', 2: '', 3: '' }
        };
    
        document.querySelector('.results').style.display = 'none';
        document.querySelector('.results-title').textContent = '';
        document.querySelector('.playerTwo .symbol').classList.add('grayscale');
        document.querySelector('.playerOne .symbol').classList.remove('grayscale');
}



function setupButtons() {
    const replayButton = document.querySelector('.replay');
    const changeModeButton = document.querySelector('.change-mode');
    const onePlayerButton = document.querySelector('.buttons-div button:first-child');
    const twoPlayerButton = document.querySelector('.menu button:last-child');
    const symbolX = document.querySelector('.X');
    const symbolO = document.querySelector('.O');
    const easyButton = document.querySelector('.easy');
    const mediumButton = document.querySelector('.medium');
    const hardButton = document.querySelector('.hard');
    
    
    // Reset game when clicked
    replayButton.addEventListener('click', function(){
        resetGame();
        if(game.onePlayerGame == true && AI.symbol == "X"){
            AIMove(game.difficulty);
        }
    });

    // Reset game and show menu div
    changeModeButton.addEventListener('click', function() {
        resetGame();
        document.querySelector('.menu').style.display = 'flex';
    });
    
    // Go to select difficulty
    onePlayerButton.addEventListener("click", function() {
        game.onePlayerGame = true;
        document.querySelector('.menu').style.display = 'none';
        document.querySelector('.difficulty').style.display = 'flex';
    });

    // Start two player game
    twoPlayerButton.addEventListener("click", function () {
        game.onePlayerGame = false;
        document.querySelector('.menu').style.display = 'none';
    });

    symbolX.addEventListener("click", function() {
        document.querySelector('.pick-div').style.display = 'none';
        startGameAgainstAI('X', 'O');
    });
    
    symbolO.addEventListener("click", function() {
        document.querySelector('.pick-div').style.display = 'none';
        startGameAgainstAI('O', 'X');
        AIMove(game.difficulty);
    });

    easyButton.addEventListener("click", function() {
        document.querySelector('.pick-div').style.display = 'flex';
        document.querySelector('.difficulty').style.display = 'none';
        game.difficulty = 'easy';
    });

    mediumButton.addEventListener("click", function() {
        document.querySelector('.pick-div').style.display = 'flex';
        document.querySelector('.difficulty').style.display = 'none';
        game.difficulty = 'medium';
    });

    hardButton.addEventListener("click", function() {
        document.querySelector('.pick-div').style.display = 'flex';
        document.querySelector('.difficulty').style.display = 'none';
        game.difficulty = 'hard';
    });
}



function startGameAgainstAI(playerSymbol, botSymbol) {
    playerOneAgainstAI = playGame(playerSymbol);
    AI = playGame(botSymbol);
}


function AIMove(difficulty) {
    if(difficulty == 'easy'){
        playEasy();
    }
    else if (difficulty == 'medium') {
        if(Math.floor(Math.random() * 10) < 3){
            playEasy();
        }else{
            bestMove();
        }
    }else if(difficulty == 'hard'){
        if(game.rounds == 1 && AI.symbol == 'X'){
            playEasy();
        }else{
            bestMove();
        }
    }

};


function bestMove(){
    let move;
    let bestScore = -Infinity;
    let score;
    let bestDepth= Infinity;
    for (const row in gameBoard) {
        for (const column in gameBoard[row]) {
            if (gameBoard[row][column] === '') {
                gameBoard[row][column] = AI.symbol;
                if(AI.symbol == 'O'){
                    scores.O = 1;
                    scores.X = -1;
                }else{
                    scores.O = -1;
                    scores.X = 1;   
                }
                score = minimax(gameBoard, false);
                gameBoard[row][column] = '';
                if(score > bestScore || score == bestScore && game.depth < bestDepth){
                    bestScore = score;
                    bestDepth = game.depth;
                    game.depth = 0;
                    move = {row, column}
                }
            }
        }
    }
    const newMove = document.querySelector(`[data-row='${move.row}'][data-col='${move.column}']`);
    AI.placeSymbol.call(newMove);
    gameBoard[move.row][move.column] = AI.symbol;
}

let scores = {
    X: 1,
    O: -1,
    draw: 0
}

function minimax(board, isMaximizing){
    let result = checkWinner();
    if(result !== null){
        return scores[result];
    }
    if(isMaximizing){
        let bestScore = -Infinity;
        for (const row in board) {
            for (const column in board[row]) {
                if (board[row][column] === '') {
                    game.depth++;
                    board[row][column] = AI.symbol;
                    let score = minimax(board, false);
                    board[row][column] = '';
                    bestScore = (score > bestScore) ? score : bestScore;
                }
            }
        }   
        return bestScore;
    }else{
        let bestScore = Infinity;
        for (const row in board) {
            for (const column in board[row]) {
                if (board[row][column] === '') {
                    game.depth++;
                    board[row][column] = playerOneAgainstAI.symbol;
                    let score = minimax(board, true);
                    board[row][column] = '';
                    bestScore = (score < bestScore) ? score : bestScore;
                }
            }
        }   
        return bestScore;
    }
}

function playEasy() {
    const emptyCells = [];
    cellDivs.forEach(function(div) {
        if (div.textContent.trim() === '') {
            emptyCells.push(div);
        }
    });
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex]; 
    const row = randomCell.dataset.row;
    const col = randomCell.dataset.col;

    AI.placeSymbol.call(randomCell); 
    gameBoard[row][col] = AI.symbol;
}

function changeStyle(){

    // Make "X" or "O" in grayscale, smaller with different opacity
    if (game.rounds % 2 === 1) {
        document.querySelector('.playerTwo .symbol').classList.add('grayscale');
        document.querySelector('.playerOne .symbol').classList.remove('grayscale');
    } else {
        document.querySelector('.playerOne .symbol').classList.add('grayscale');
        document.querySelector('.playerTwo .symbol').classList.remove('grayscale');
    }
}


document.addEventListener("DOMContentLoaded", function () {
    setupButtons();
    setupCellDivs();
});