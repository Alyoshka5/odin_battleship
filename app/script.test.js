import { Ship, Gameboard, Player } from './factories';
import domController from './domController';

describe('Ship factory function correctly initialized', () => {
    const ship = Ship(3, [[0, 1], [0, 2], [0, 3]]);

    test('properties set to correct values', () => {
        expect(ship.length).toBe(3);
        expect(ship.coords).toEqual([[0, 1], [0, 2], [0, 3]])
        expect(ship.timesHit).toBe(0);
    });
    test('hit method correctly applies damage', () => {
        ship.hit();
        expect(ship.timesHit).toBe(1);
    });
    test('isSunk method returns true when ship is sunk', () => {
        ship.timesHit = 0;
        for (let i = 0; i < 3; i++) ship.hit();
        expect(ship.isSunk()).toBe(true);
    });
    test('isSunk method returns false when ship is not sunk', () => {
        ship.timesHit = 0;
        for (let i = 0; i < 2; i++) ship.hit();
        expect(ship.isSunk()).toBe(false);
    });
});

describe('Gameboard placeShip method places ship when allowed', () => {
    const gameboard = Gameboard();

    test('creates ship vertically on gameboard', () => {
        gameboard.ships = [];
        gameboard.placeShip(3, 0, 9, 'vertical');
        expect(gameboard.ships[0].coords).toEqual([[0, 9], [1, 9], [2, 9]]);
    });
    test('creates ship horizontally on gameboard', () => {
        gameboard.ships = [];
        gameboard.placeShip(3, 0, 0, 'horizontal');
        expect(gameboard.ships[0].coords).toEqual([[0, 0], [0, 1], [0, 2]]);
    });
    test('does not create ship when coordinates out of bounds', () => {
        gameboard.ships = [];
        gameboard.placeShip(3, 0, 9, 'horizontal');
        expect(gameboard.ships.length).toBe(0);
    });
    test('does not create ship when ship already at coordinate', () => {
        gameboard.ships = [];
        gameboard.placeShip(3, 0, 0, 'horizontal');
        gameboard.placeShip(3, 0, 1, 'horizontal');
        expect(gameboard.ships.length).toBe(1);
    });
});

describe('Gameboard receiveAttack method records hit or miss', () => {
    const gameboard = Gameboard();
    const ship = { length: 3, coords: [[0, 0], [0, 1], [0, 2]], timesHit: 0, 
        hit: jest.fn(function() {
            this.timesHit++;
        })
    }
    
    test('records missed shot when no ship is hit at coordinate', () => {
        gameboard.ships = [];
        gameboard.receiveAttack([0, 0]);
        expect(gameboard.missedShots.some(shot => shot[0] == 0 && shot[1] == 0)).toBe(true);
    });
    test('calls hit method on ship when ship is hit', () => {
        gameboard.ships = [];
        gameboard.ships.push(ship);
        gameboard.receiveAttack([0, 0]);
        expect(ship.hit).toHaveBeenCalled();
    });
});

describe('Gameboard allShipsSunk method checks if all ships are sunk', () => {
    const gameboard = Gameboard();
    const ship = { length: 3, coords: [[0, 0], [0, 1], [0, 2]], timesHit: 0, 
        isSunk: function() {
            return this.timesHit >= this.length;;
        }
    }
    const ship2 = { length: 2, coords: [[1, 0], [1, 1]], timesHit: 0, 
        isSunk: function() {
            return this.timesHit >= this.length;;
        }
    }
    gameboard.ships.push(ship);
    gameboard.ships.push(ship2);
    
    test('returns false when no ships are sunk', () => {
        ship.timesHit = 1;
        ship2.timesHit = 0;
        expect(gameboard.allShipsSunk()).toBe(false);
    });
    test('returns false when one of two ships are sunk', () => {
        ship.timesHit = 3;
        ship2.timesHit = 0;
        expect(gameboard.allShipsSunk()).toBe(false);
    });
    test('returns true when all ships are sunk', () => {
        ship.timesHit = 3;
        ship2.timesHit = 2;
        expect(gameboard.allShipsSunk()).toBe(true);
    });
});

describe('Gameboard fillBoard method fills board with ships', () => {
    const gameboard = Gameboard();
    gameboard.fillBoard();
    
    test('places 7 ships on board', () => {
        expect(gameboard.ships.length).toBe(7);
    });
    test('correct amount of ships for each ship length', () => {
        expect(gameboard.ships.filter(ship => ship.length == 1).length).toBe(2);
        expect(gameboard.ships.filter(ship => ship.length == 2).length).toBe(2);
        expect(gameboard.ships.filter(ship => ship.length == 3).length).toBe(1);
        expect(gameboard.ships.filter(ship => ship.length == 4).length).toBe(1);
        expect(gameboard.ships.filter(ship => ship.length == 5).length).toBe(1);
    });
});

describe('Player attack method records and returns if player\'s shot hit a ship', () => {
    const player = Player(true);
    const enemyGameboard = Gameboard();
    
    test('returns false and records missed shot when no ships hit', () => {
        enemyGameboard.ships = [];
        player.missedShots = [];
        player.hitShots = [];
        expect(player.attack([0, 0], enemyGameboard)).toBe(false);
        expect(player.missedShots).toEqual([[0, 0]]);
        expect(player.hitShots.length).toBe(0);
    });
    test('records hit shot when ship is hit at coordinate', () => {
        enemyGameboard.ships = [];
        enemyGameboard.ships = [];
        player.missedShots = [];
        const ship = { length: 3, coords: [[0, 0], [0, 1], [0, 2]], timesHit: 0, 
            hit: jest.fn(function() {
                this.timesHit++;
            })
        }
        enemyGameboard.ships.push(ship);
        expect(player.attack([0, 0], enemyGameboard)).toBe(true);
        expect(player.hitShots).toEqual([[0, 0]]);
        expect(player.missedShots.length).toBe(0);
        
    });
});

describe('Player validateMove method returns true if attack coordinate hasn\'t been attacked yet, false otherwise', () => {
    const player = Player(true);
    player.missedShots = [[0, 0], [1, 4]];
    player.hitShots = [[4, 3], [2, 3]];
    
    test('returns true when move is valid', () => {
        expect(player.validateMove([1, 2])).toBe(true);
    });
    test('returns false when move is already in player\'s missedShots', () => {
        expect(player.validateMove([1, 4])).toBe(false);
    });
    test('returns false when move is already in player\'s hitShots', () => {
        expect(player.validateMove([4, 3])).toBe(false);
    });
});

describe('Player getValidMove method returns coordinate for a valid move', () => {
    // tests do not completely ensure validity of method since method uses Math.random()
    const player = Player(false);
    const player2 = Player(true);

    test('returns [0, 0] when [0, 0] is the only valid move and player is computer', async () => {
        player.missedShots = [];
        for (let r = 0; r < 10; r++) {
            for (let c = 0; c < 10; c++) {
                if (r == 0 && c == 0) continue;
                player.missedShots.push([r, c]);
            }
        }
        expect(await player.getValidMove()).toEqual([0, 0]);
        expect(await player.getValidMove()).toEqual([0, 0]);
        expect(await player.getValidMove()).toEqual([0, 0]);
    });
    test('returns [2, 3] when [2, 3] is the only valid move player is computer', async () => {
        player.missedShots = [];
        for (let r = 0; r < 10; r++) {
            for (let c = 0; c < 10; c++) {
                if (r == 2 && c == 3) continue;
                player.missedShots.push([r, c]);
            }
        }
        expect(await player.getValidMove()).toEqual([2, 3]);
        expect(await player.getValidMove()).toEqual([2, 3]);
        expect(await player.getValidMove()).toEqual([2, 3]);
    });
    test('calls domController registerMove method when player is not computer', () => {
        domController.registerMove = jest.fn(() =>'0 0');
        player2.getValidMove();
        expect(domController.registerMove).toHaveBeenCalled();
    });
});

describe('Gameboard setUpGameboard method calls displayGameboard with an array of every ship\'s coordinates', () => {
    const boardContainer = document.createElement('div');
    boardContainer.classList.add('board-container');
    document.body.appendChild(boardContainer);
    const gameboard = Gameboard();
    const ship = Ship(3, [[2, 3], [3, 3], [4, 4]]);
    const ship2 = Ship(2, [[6, 4], [7, 4]]);
    gameboard.ships.push(ship);
    gameboard.ships.push(ship2);
    jest.spyOn(domController, 'displayGameboard');
    gameboard.setUpGameboard();
    document.body.removeChild(boardContainer);

    test('calls displayGameboard with correct coordinates', () => {
        expect(domController.displayGameboard).toHaveBeenCalledWith(true, [[[2, 3], [3, 3], [4, 4]], [[6, 4], [7, 4]]]);
    });
    test('calls displayGameboard without coordinates to set up enemy board', () => {
        expect(domController.displayGameboard).toHaveBeenCalledWith(false);
    });
});

describe('domController displayGameboard method creates and appends elements to DOM', () => {
    const boardContainer = document.createElement('div');
    boardContainer.classList.add('board-container');
    document.body.appendChild(boardContainer);
    jest.spyOn(boardContainer, 'appendChild');
    domController.displayGameboard(true, [[[6, 4], [7, 4]]]);
    
    test('calls appendChild on document body', () => {
        expect(boardContainer.appendChild).toHaveBeenCalled();
    });
    test('boardDiv\'s class set to "board" when isPlayerGameboard is true', () => {
        expect(boardContainer.querySelector('.board')).not.toBe(null);
    });
    test('boardDiv\'s class set to "enemy-board" when isPlayerGameboard is false', () => {
        const boardContainer = document.createElement('div');
        boardContainer.classList.add('board-container');
        document.body.appendChild(boardContainer);
        domController.displayGameboard(false);
        expect(boardContainer.querySelector('.board')).toBe(null);
        expect(boardContainer.querySelector('.enemy-board')).not.toBe(null);
    });
    
    document.body.removeChild(boardContainer);
});

describe('domController displayPlayerAttack method adds appropriate classes to attacked tile', () => {
    const enemyBoard = document.createElement('div');
    enemyBoard.classList.add('enemy-board');
    document.body.appendChild(enemyBoard);
    const attackedTile = document.createElement('div');
    attackedTile.classList.add('board-tile');
    attackedTile.setAttribute('coordinate', '0 0');
    enemyBoard.appendChild(attackedTile);

    test('adds ship hit symbol div to tile when ship is hit', () => {
        domController.displayAttack([0, 0], true, true);
        expect(attackedTile.firstChild.classList.contains('hit-symbol')).toBe(true);
    });
    test('adds miss symbol div and miss-ship-tile class to tile when ship is not hit', () => {
        domController.displayAttack([0, 0], false, true);
        expect(attackedTile.firstChild.classList.contains('miss-symbol')).toBe(true);
        expect(attackedTile.classList.contains('miss-ship-tile')).toBe(true);
    });
    test('playerLastAttackedTile property set to attackedTile', () => {
        domController.displayAttack([0, 0], true, true);
        expect(domController.playerLastAttackedTile).toEqual(attackedTile);
    });
});

describe('Player manageShipAttack method handles ship attacks and returns if all ships are sunk', () => {
    const player = Player(true);
    player.makeMove = jest.fn().mockResolvedValue(false);
    // create attackedTile and add it to enemy board
    const enemyBoard = document.createElement('div');
    enemyBoard.classList.add('enemy-board');
    document.body.appendChild(enemyBoard);
    for (let coord of ['0 0', '0 1', '0 2']) {
        const attackedTile = document.createElement('div');
        attackedTile.classList.add('board-tile');
        attackedTile.setAttribute('coordinate', coord);
        enemyBoard.appendChild(attackedTile);
    }
    // create enemy gameboard and ship
    const enemyGameboard = Gameboard();
    const ship = Ship(2, [[0, 0], [0, 1]]);
    enemyGameboard.ships.push(ship);
    const ship2 = Ship(1, [[0, 4]]);
    enemyGameboard.ships.push(ship2);

    test('returns false if ship is not hit', async () => {
        expect(await player.manageShipAttack(enemyGameboard, [0, 2], false, true)).toBe(false);
    });
    test('calls makeMove and returns false if ship is hit but not sunk', async () => {
        expect(await player.manageShipAttack(enemyGameboard, [0, 0], true, true)).toBe(false);
        expect(player.makeMove).toHaveBeenCalled();
    });
    test('calls makeMove and enemyGameboard.allShipsSunk() if ship is hit and sunk', async () => {
        jest.spyOn(enemyGameboard, 'allShipsSunk');
        ship.timesHit = 0;
        player.hitShots = [];
        player.attack([0, 0], enemyGameboard);
        player.attack([0, 1], enemyGameboard);
        await player.manageShipAttack(enemyGameboard, [0, 1], true, true)
        expect(enemyGameboard.allShipsSunk).toHaveBeenCalled();
        expect(player.makeMove).toHaveBeenCalled();
    });
    test('returns false if ship is sunk but not all ships are sunk', async () => {
        ship.timesHit = 0;
        player.hitShots = [];
        player.attack([0, 0], enemyGameboard);
        expect(await player.manageShipAttack(enemyGameboard, [0, 0], true, true)).toBe(false);
        player.attack([0, 1], enemyGameboard);
        expect(await player.manageShipAttack(enemyGameboard, [0, 1], true, true)).toBe(false);
    });
    test('returns true if all ships are sunk', async () => {
        ship.timesHit = 0;
        player.hitShots = [];
        player.attack([0, 0], enemyGameboard);
        player.attack([0, 1], enemyGameboard);
        player.attack([0, 4], enemyGameboard);
        expect(await player.manageShipAttack(enemyGameboard, [0, 4], true, true)).toBe(true);
    }); 
});