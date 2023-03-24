
const domController = (function() {
    let playerLastAttackedTile;
    let computerLastAttackedTile;

    function displayGameboard(isPlayerGameboard, shipsCoords) {
        const boardContainer = document.querySelector('.board-container');
        const boardDiv = document.createElement('div');
        boardDiv.classList.add(isPlayerGameboard ? 'board' : 'enemy-board');

        for (let r = 0; r < 10; r++) {
            const row = document.createElement('div');
            row.classList.add('board-row');
            for (let c = 0; c < 10; c++) {
                const tile = document.createElement('div');
                tile.classList.add('board-tile');
                tile.setAttribute('coordinate', `${r} ${c}`);
                if (isPlayerGameboard) stylizeTile(shipsCoords, tile, r, c, true);
                row.appendChild(tile);
            }
            boardDiv.appendChild(row);
        }
        boardContainer.appendChild(boardDiv);
    }

    function stylizeTile(shipsCoords, tile, row, col, isPlayerTile) {
        shipsCoords.forEach(shipCoords => {
            let rotation;
            if (shipCoords.length != 1) rotation = shipCoords[0][0] == shipCoords[1][0] ? 'horizontal' : 'vertical';
            
            for (let i = 0; i < shipCoords.length; i++) {
                if (shipCoords[i][0] == row && shipCoords[i][1] == col) {
                    tile.classList.add(isPlayerTile ? 'ship-tile' : 'hit-ship-tile');
                    if (shipCoords[i+1] != undefined) {
                        if (rotation == 'horizontal') tile.style.borderRight = 'var(--ship-division-border)';
                        else tile.style.borderBottom = 'var(--ship-division-border)';
                    }
                    if (shipCoords[i-1] != undefined) {
                        if (rotation == 'horizontal') tile.style.borderLeft = 'var(--ship-division-border)';
                        else tile.style.borderTop = 'var(--ship-division-border)';
                    }
                    return;
                }
            }
        });
    }

    function registerMove() {
        return new Promise((resolve, reject) => {
            const tiles = document.querySelectorAll('.enemy-board .board-tile');
            
            tiles.forEach(tile => tile.addEventListener('click', () => {
                resolve(tile.getAttribute('coordinate'));
            }));
        });
    }

    function displayAttack(coord, shipIsHit, isRealPlayer) {
        const attackedTile = document.querySelector(`.${isRealPlayer ? 'enemy-board' : 'board'} .board-tile[coordinate="${coord[0]} ${coord[1]}"]`);
        if (shipIsHit) {
            attackedTile.innerHTML = '<div class="hit-symbol"></div>';
        } else {
            attackedTile.innerHTML = '<div class="miss-symbol"></div>';
            attackedTile.classList.add('miss-ship-tile');
        }
        attackedTile.classList.add('last-attacked-tile');
        if (isRealPlayer) {
            if (this.playerLastAttackedTile) this.playerLastAttackedTile.classList.remove('last-attacked-tile');
            this.playerLastAttackedTile = attackedTile;
        } else {
            if (this.computerLastAttackedTile) this.computerLastAttackedTile.classList.remove('last-attacked-tile');
            this.computerLastAttackedTile = attackedTile;
        }
    }

    function stylizeSunkShip(ship, isRealPlayer) {
        for (let coord of ship.coords) {
            if (isRealPlayer) {
                const shipTile = document.querySelector(`.enemy-board .board-tile[coordinate="${coord[0]} ${coord[1]}"]`);
                stylizeTile([ship.coords], shipTile, coord[0], coord[1], false);
            } else {
                const shipTile = document.querySelector(`.board .board-tile[coordinate="${coord[0]} ${coord[1]}"]`);
                shipTile.classList.add('hit-ship-tile');
            }
        }
    }

    function announceWinner(winner) {
        const winnerHeader = document.querySelector('.winner-header');
        winnerHeader.innerHTML = `${winner} wins!`;
    }

    return { displayGameboard, registerMove, displayAttack, playerLastAttackedTile, computerLastAttackedTile, stylizeSunkShip, announceWinner }
})();

export default domController;