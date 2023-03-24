import domController from './domController.js';
import { Gameboard, Player } from './factories.js';

let player;
let playerGameboard;
let computer;
let computerGameboard;
let currentPlayer;
let currentGameboard;
let gameIsOver;

function startGame() {
    gameIsOver = false;
    player = Player(true);
    playerGameboard = Gameboard();
    playerGameboard.fillBoard();
    playerGameboard.setUpGameboard();
    computer = Player(false);
    computerGameboard = Gameboard();
    computerGameboard.fillBoard();
    currentPlayer = player;
    currentGameboard = playerGameboard;
    GameLoop();
}

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

const restartButton = document.querySelector('button.restart');
restartButton.addEventListener('click', () => {
    domController.resetDisplay();
    startGame();
});

startGame();

export default startGame;