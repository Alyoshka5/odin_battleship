import { Ship } from './script';

describe('Ship factory function correctly initialized', () => {
    const ship = Ship(3);
    test('properties set to correct values', () => {
        expect(ship.length).toBe(3);
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