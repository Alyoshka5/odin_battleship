import { Ship, Gameboard, Player } from './factories';

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

describe('Player attack method records if player\'s shot hit a ship', () => {
    const player = Player(true);
    const enemyGameboard = Gameboard();
    
    test('records missed shot when no ships hit', () => {
        enemyGameboard.ships = [];
        player.missedShots = [];
        player.hitShots = [];
        player.attack([0, 0], enemyGameboard);
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
        player.attack([0, 0], enemyGameboard);
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
    const player = Player(false);  // Player parameter not important for these tests

    test('returns [0, 0] when [0, 0] is the only valid move', () => {
        player.missedShots = [];
        for (let r = 0; r < 10; r++) {
            for (let c = 0; c < 10; c++) {
                if (r == 0 && c == 0) continue;
                player.missedShots.push([r, c]);
            }
        }
        expect(player.getValidMove()).toEqual([0, 0]);
        expect(player.getValidMove()).toEqual([0, 0]);
        expect(player.getValidMove()).toEqual([0, 0]);
    });

    test('returns [2, 3] when [2, 3] is the only valid move', () => {
        player.missedShots = [];
        for (let r = 0; r < 10; r++) {
            for (let c = 0; c < 10; c++) {
                if (r == 2 && c == 3) continue;
                player.missedShots.push([r, c]);
            }
        }
        expect(player.getValidMove()).toEqual([2, 3]);
        expect(player.getValidMove()).toEqual([2, 3]);
        expect(player.getValidMove()).toEqual([2, 3]);
    });
});