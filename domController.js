
const domController = (function() {
    
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
                if (isPlayerGameboard) stylizeTile(shipsCoords, tile, r, c);
                row.appendChild(tile);
            }
            boardDiv.appendChild(row);
        }
        boardContainer.appendChild(boardDiv);
    }

    function stylizeTile(shipsCoords, tile, row, col) {
        shipsCoords.forEach(shipCoords => {
            let rotation;
            if (shipCoords.length != 1) rotation = shipCoords[0][0] == shipCoords[1][0] ? 'horizontal' : 'vertical';
            
            for (let i = 0; i < shipCoords.length; i++) {
                if (shipCoords[i][0] == row && shipCoords[i][1] == col) {
                    tile.classList.add('ship-tile');
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

    return { displayGameboard, registerMove }
})();

export default domController;