class Tile {
    constructor(id, pos, def, avo, isCrossable) {
        this.id = id;
        this.pos = pos;

        this.isCrossable = isCrossable;

        this.def = def;
        this.avo = avo;
        this.mov = 1;

        this.isInMoveReach = false;
        this.isInAttackReach = false;

        this.setNeighbors = tiles => {
            if (this.pos.x < tiles.length-1) this.neighbors.push(tiles[this.pos.x + 1][this.pos.y][this.pos.z]);
            if (this.pos.y < tiles[0].length-1) this.neighbors.push(tiles[this.pos.x][this.pos.y + 1][this.pos.z]);
            if (this.pos.x > 0) this.neighbors.push(tiles[this.pos.x - 1][this.pos.y][this.pos.z]);
            if (this.pos.y > 0) this.neighbors.push(tiles[this.pos.x][this.pos.y - 1][this.pos.z]);
        }

        this.f = 0;
        this.g = 0;
        this.h = 0;

        this.parent = null;
        this.neighbors = [];
    }
}