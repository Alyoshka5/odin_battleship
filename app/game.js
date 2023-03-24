import domController from './domController.js';
import { Gameboard, Player } from './factories.js';

const player = Player(true);
const playerGameboard = Gameboard();
playerGameboard.fillBoard();
playerGameboard.setUpGameboard();
const computer = Player(false);
const computerGameboard = Gameboard();
computerGameboard.fillBoard();

let currentPlayer = player;
let currentGameboard = playerGameboard;
let gameIsOver = false;

async function GameLoop() {
    do {
        const enemyGameboard = currentPlayer == player ? computerGameboard : playerGameboard;
        gameIsOver = await currentPlayer.makeMove(enemyGameboard);
        switchPlayers();
    } while (!gameIsOver);
    domController.announceWinner(currentPlayer == player ? 'Computer' : 'User');
};

function switchPlayers() {
    currentPlayer = currentPlayer == player ? computer : player;
    currentGameboard = currentGameboard == playerGameboard ? computerGameboard : playerGameboard;
}

GameLoop();