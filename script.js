let playerOneAgainstAI;
let AI;

const game = {
    rounds: 1,
    onePlayerGame: true,
    AIPlayed: false,
    difficulty: 'easy',
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
    
    if (game.rounds == 10){
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
                        game.AIPlayed = true;
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


// Function to start when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
    var twoPlayerButton = document.querySelector('.menu button:last-child');
  
    // Start two player mode
    twoPlayerButton.addEventListener("click", function () {
        game.onePlayerGame = false;
        document.querySelector('.menu').style.display = 'none';
    });
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
    
    // Reset game when clicked
    replayButton.addEventListener('click', resetGame);

    // Reset game and menu div is shown
    changeModeButton.addEventListener('click', function() {
        resetGame();
        document.querySelector('.menu').style.display = 'flex';
    });
    
    // Go to Pick div
    onePlayerButton.addEventListener("click", function() {
        game.onePlayerGame = true;
        document.querySelector('.menu').style.display = 'none';
        document.querySelector('.pick-div').style.display = 'flex';
    });
}


const symbolX = document.querySelector('.X');
const symbolO = document.querySelector('.O');

symbolX.addEventListener("click", function() {
    document.querySelector('.pick-div').style.display = 'none';
    startGameAgainstAI('X', 'O');
});

symbolO.addEventListener("click", function() {
    document.querySelector('.pick-div').style.display = 'none';
    startGameAgainstAI('O', 'X');
    AIMove(game.difficulty);
});

function startGameAgainstAI(playerSymbol, botSymbol) {
    playerOneAgainstAI = playGame(playerSymbol);
    AI = playGame(botSymbol);
}


function AIMove(difficulty) {
    const emptyCells = getEmptyCells();
    if(difficulty == 'easy'){
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const randomCell = emptyCells[randomIndex]; 
        const row = randomCell.dataset.row;
        const col = randomCell.dataset.col;
    
        AI.placeSymbol.call(randomCell); 
        gameBoard[row][col] = AI.symbol;
    }else if(difficulty == 'medium'){

    }else {
        
    }

};

function getEmptyCells() {
    const emptyCells = [];
    cellDivs.forEach(function(div) {
        if (div.textContent.trim() === '') {
            emptyCells.push(div);
        }
    });
    return emptyCells;
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