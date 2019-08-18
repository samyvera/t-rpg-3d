class Grid {
    constructor(overworld) {
        this.size = new Vector3D(overworld[0][0].length, overworld[0].length, overworld.length);

        this.cursor = new Cursor(new Vector3D(7, 0, 2));

        this.tiles = [];
        for (let x = 0; x < this.size.x; x++) {
            this.tiles.push(new Array());
            for (let y = 0; y < this.size.y; y++) {
                this.tiles[x].push(new Array());
                for (let z = 0; z < this.size.z; z++) {
                    this.tiles[x][y].push(null);
                }
            }
        }

        for (let x = 0; x < this.size.x; x++) {
            for (let y = 0; y < this.size.y; y++) {
                for (let z = 0; z < this.size.z; z++) {
                    var id = overworld[z][y][x];
                    var def = 0;
                    var avo = 0;
                    var isCrossable = false;

                    switch (overworld[z][y][x]) {
                        case '1':
                            isCrossable = true;
                            break;
                        case '4':
                            isCrossable = true;
                            break;
                        case '6':
                            isCrossable = true;
                            break;
                        case 'e':
                            isCrossable = true;
                            break;
                        case 'm':
                            isCrossable = true;
                            break;
                        case 'q':
                            avo = -30;
                            break;
                        default:
                            break;
                    }
                    this.tiles[x][y][z] = new Tile(id, new Vector3D(x, y, z), def, avo, isCrossable);
                }
            }
        }
        // this.tiles.forEach(line => line.forEach(row => row.forEach(tile => tile.setNeighbors(this.tiles))));

        // this.setMoveTiles = unit => {
        //     var unitTile = this.tiles[unit.pos.x][unit.pos.y];

        //     var possibleTiles = [];

        //     this.tiles.forEach(row => row.forEach(tile => {
        //         var pathFinder = new Pathfinding(this.tiles, unitTile, tile);
        //         while (pathFinder.isSearching) pathFinder.search();
        //         if (pathFinder.isSolvable && pathFinder.path.length - 1 <= unit.mov) possibleTiles.push(tile);
        //     }));

        //     possibleTiles.forEach(tile => tile.isInMoveReach = true);
        // }

        this.units = [
            new Unit('Harlson', 'Lord', false, new Vector3D(3, 3, 1), 1, 7, null),
            new Unit('Nui', 'Priest', true, new Vector3D(5, 4, 1), 0, 5, null),
        ];

        this.update = (level, keys) => {
            this.cursor.update(this, keys);
        }
    }
}