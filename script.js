function Ship(length) {
    function hit() {
        this.timesHit++;
    }

    function isSunk() {
        return this.timesHit >= this.length;
    }

    return { length, timesHit: 0, hit, isSunk }
}


export { Ship }