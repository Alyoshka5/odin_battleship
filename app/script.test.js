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

describe('Gameboard factory function correctly initialized', () => {
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