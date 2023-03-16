function Ship(length, coords) {
    function hit() {
        this.timesHit++;
    }

    function isSunk() {
        return this.timesHit >= this.length;
    }

    return { length, coords, timesHit: 0, hit, isSunk }
}

function Gameboard() {
    const ships = [];
    const missedShots = [];

    function placeShip(shipLength, row, col, rotation) {
        if ((rotation == 'vertical' && row + shipLength > 10) || (rotation == 'horizontal' && col + shipLength > 10)) return;
        const coords = generateShipCoords(this.ships, shipLength, row, col, rotation);
        if (coords === undefined) return;
        const ship = Ship(shipLength, coords);
        this.ships.push(ship);
    }

    function generateShipCoords(ships, shipLength, row, col, rotation) {
        let coords = [];
        if (rotation == 'vertical') {
            for (let i = 0; i < shipLength; i++) {
                if (getShip(ships, row + i, col) != undefined) return;
                coords.push([row + i, col]);
            }
        } else {
            for (let i = 0; i < shipLength; i++) {
                if (getShip(ships, row, col + i) != undefined) return;
                coords.push([row, col + i]);
            }
        }
        return coords;
    }

    // returns ship object if there is a ship at coordinate and undefined otherwise
    function getShip(ships, row, col) {
        return ships.find(ship => {
            return ship.coords.some(coord => {
                return coord[0] == row && coord[1] == col;
            });
        });
    }

    function receiveAttack(coord) {
        const ship = getShip(this.ships, coord[0], coord[1]);
        if (ship != undefined) {
            ship.hit();
            return true;
        } else {
            this.missedShots.push(coord);
            return false;
        }
    }

    function allShipsSunk() {
        return this.ships.every(ship => ship.isSunk());
    }

    return { ships, missedShots, placeShip, receiveAttack, allShipsSunk }
}

function Player(isRealPlayer) {
    const missedShots = [];
    const hitShots = [];

    function attack(coord, enemyGameboard) {
        if (enemyGameboard.receiveAttack(coord)) {
            this.hitShots.push(coord);
        } else {
            this.missedShots.push(coord);
        }
    }

    function validateMove(coord) {
        const madeMoves = this.missedShots.concat(this.hitShots);
        return !madeMoves.some(move => {
            return move[0] == coord[0] && move[1] == coord[1];
        });
    }

    return { isRealPlayer, missedShots, hitShots, attack, validateMove }
}

export { Ship, Gameboard, Player }
