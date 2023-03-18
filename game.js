import { Gameboard, Player } from './factories.js';

const player = Player(true);
const playerGameboard = Gameboard();
playerGameboard.fillBoard();
const computer = Player(false);
const computerGameboard = Gameboard();
computerGameboard.fillBoard();

let currentPlayer = player;
let currentGameboard = playerGameboard;


(function GameLoop() {
    do {

    } while (!currentGameboard.allShipsSunk());
});
