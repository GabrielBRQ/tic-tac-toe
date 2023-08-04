function createPlayer(symbol){
    return {
        symbol: symbol
    };
}

const playerOne = createPlayer("X");
const playerTwo = createPlayer("O");

var gameBoard = {
    1: { 1: '', 2: '', 3: '' },
    2: { 1: '', 2: '', 3: '' }, 
    3: { 1: '', 2: '', 3: '' } 
};