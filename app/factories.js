import domController from "./domController.js";

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

    function fillBoard() {
        const shipLengths = [1, 1, 2, 2, 3, 4, 5];
        for (let length of shipLengths) {
            let row, col, rotation, validity;
            do {
                row = Math.floor(Math.random() * 10);
                col = Math.floor(Math.random() * 10);
                rotation = ['vertical', 'horizontal'][Math.floor(Math.random() * 2)];
                validity = !((rotation == 'vertical' && row + length > 10) || (rotation == 'horizontal' && col + length > 10));
            } while (!(validity && generateShipCoords(this.ships, length, row, col, rotation)));
            placeShip.call(this, length, row, col, rotation);
        }
    }

    function setUpGameboard() {
        const shipsCoords = this.ships.map(ship => ship.coords);
        domController.displayGameboard(true, shipsCoords);
        domController.displayGameboard(false);
    }

    return { ships, missedShots, placeShip, getShip, receiveAttack, allShipsSunk, fillBoard, setUpGameboard }
}

function Player(isRealPlayer) {
    const missedShots = [];
    const hitShots = [];

    function attack(coord, enemyGameboard) {
        if (enemyGameboard.receiveAttack(coord)) {
            this.hitShots.push(coord);
            return true;
        } else {
            this.missedShots.push(coord);
            return false;
        }
    }

    function validateMove(coord) {
        const madeMoves = this.missedShots.concat(this.hitShots);
        return !madeMoves.some(move => {
            return move[0] == coord[0] && move[1] == coord[1];
        });
    }

    async function getValidMove() {
        let coord;
        do {
            if (this.isRealPlayer) {
                coord = await domController.registerMove();
                coord = coord.split(' ').map(c => parseInt(c));
            } else {
                let row = Math.floor(Math.random() * 10);
                let col = Math.floor(Math.random() * 10);
                coord = [row, col];
            }
        } while (!validateMove.call(this, coord));
        return coord;
    }
    
    async function manageShipAttack(enemyGameboard, move, shipIsHit, isRealPlayer) {
        domController.displayAttack(move, shipIsHit, isRealPlayer);
        if (shipIsHit) {
            const enemyShip = enemyGameboard.getShip(enemyGameboard.ships, move[0], move[1]);
            if (enemyShip.isSunk()) {
                domController.stylizeSunkShip(enemyShip, isRealPlayer);
                if (enemyGameboard.allShipsSunk()) {
                    return true;
                }
            }
            return await this.makeMove.call(this, enemyGameboard);
        }
        return false;
    }

    return { isRealPlayer, missedShots, hitShots, attack, validateMove, getValidMove, makeMove, manageShipAttack }
}

export { Ship, Gameboard, Player }
