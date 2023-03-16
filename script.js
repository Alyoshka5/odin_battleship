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
                if (!validateCoord(ships, row + i, col)) return;
                coords.push([row + i, col]);
            }
        } else {
            for (let i = 0; i < shipLength; i++) {
                if (!validateCoord(ships, row, col + i)) return;
                coords.push([row, col + i]);
            }
        }
        return coords;
    }

    function validateCoord(ships, row, col) {
        return ships.find(ship => {
            console.log(ship);
            return ship.coords.some(coord => {
                return coord[0] == row && coord[1] == col;
            });
        }) == undefined;
    }

    return { ships, placeShip }
}

export { Ship, Gameboard }
