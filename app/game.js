import { Gameboard, Player } from './factories.js';
import domController from './domController.js';

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

function switchPlayers() {
    currentPlayer = currentPlayer == player ? computer : player;
    currentGameboard = currentGameboard == playerGameboard ? computerGameboard : playerGameboard;
}
