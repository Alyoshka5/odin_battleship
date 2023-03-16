import { Ship, Gameboard } from './script';

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
    
})