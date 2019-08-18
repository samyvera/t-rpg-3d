class Cursor {
    constructor(pos) {
        this.pos = pos;
        this.dir = new Vector3D(0, 0, 0);

        this.coolDown = 4;
        this.currentCoolDown = 0;
        this.pressedSelectLastFrame = false;
        this.pressedCancelLastFrame = false;

        this.hoveredTile = null;
        this.hoveredUnit = null;
        this.selectedUnit = null;
        this.pathToSelectedUnit = null;

        this.update = (grid, keys) => {
            this.hoveredTile = grid.tiles[Math.floor(this.pos.x)][Math.floor(this.pos.y)][Math.floor(this.pos.z)];

            if (this.hoveredUnit) this.hoveredUnit.isHovered = false;
            this.hoveredUnit = null;
            grid.units.forEach(unit => this.hoveredUnit = unit.pos.equals(this.pos.floor()) ? unit : this.hoveredUnit);
            if (this.hoveredUnit) this.hoveredUnit.isHovered = true;
            
            this.move(grid, keys);

            if (!this.pressedSelectLastFrame) {
                if (keys.get('select')) {
                    if (this.hoveredUnit !== null && this.selectedUnit === null) {
                        this.selectedUnit = this.hoveredUnit;
                        this.selectedUnit.isSelected = true;
                        grid.setMoveTiles(this.selectedUnit);
                    }
                    this.pressedSelectLastFrame = true;
                }
            }
            else if (!keys.get('select')) this.pressedSelectLastFrame = false;

            if (!this.pressedCancelLastFrame) {
                if (keys.get('cancel')) {
                    if (this.selectedUnit !== null) {
                        this.pos = new Vector3D(this.selectedUnit.pos.x, this.selectedUnit.pos.y, this.selectedUnit.pos.z);
                        this.currentCoolDown = 0;
                        this.selectedUnit.isSelected = false;
                        this.selectedUnit = null;
                        this.pathToSelectedUnit = null;

                        grid.tiles.forEach(line => line.forEach(row => row.forEach(tile => {
                            tile.isInMoveReach = false;
                            tile.parent = null;
                        })));
                    }
                    this.pressedCancelLastFrame = true;
                }
            }
            else if (!keys.get('cancel')) this.pressedCancelLastFrame = false;

            if (this.selectedUnit) {
                var pathFinder = new Pathfinding(grid.tiles, grid.tiles[this.selectedUnit.pos.x][this.selectedUnit.pos.y][this.selectedUnit.pos.z], this.hoveredTile);
                while (pathFinder.isSearching) pathFinder.search();
                if (pathFinder.isSolvable) {
                    this.pathToSelectedUnit = pathFinder.path;
                    if (pathFinder.path.length > 1) {
                        this.selectedUnit.dir = new Vector3D(
                            this.selectedUnit.pos.x - pathFinder.path[pathFinder.path.length-2].pos.x,
                            this.selectedUnit.pos.y - pathFinder.path[pathFinder.path.length-2].pos.y,
                            this.selectedUnit.pos.z - pathFinder.path[pathFinder.path.length-2].pos.z);
                    }
                    else this.selectedUnit.dir = new Vector3D(0, -1, 0);
                }
            }
            else this.pathToSelectedUnit = null;
        }

        this.move = (grid, keys) => {
            if (this.currentCoolDown === 0) {
                if (keys.get('left') && !keys.get('right') && this.pos.x > 0) this.dir.x = -1;
                else if (keys.get('right') && !keys.get('left') && this.pos.x + 1 < grid.size.x) this.dir.x = 1;
                else this.dir.x = 0;

                if (keys.get('down') && !keys.get('up') && this.pos.y > 0) this.dir.y = -1;
                else if (keys.get('up') && !keys.get('down') && this.pos.y + 1 < grid.size.y) this.dir.y = 1;
                else this.dir.y = 0;

                if (this.selectedUnit && grid.tiles[this.pos.x + this.dir.x] && grid.tiles[this.pos.x + this.dir.x][this.pos.y + this.dir.y] && grid.tiles[this.pos.x + this.dir.x][this.pos.y + this.dir.y][this.pos.z + this.dir.z] &&
                    !grid.tiles[this.pos.x + this.dir.x][this.pos.y + this.dir.y][this.pos.z + this.dir.z].isInMoveReach) {
                    if (this.dir.x !== 0 && this.dir.y !== 0 && this.dir.z !== 0 && grid.tiles[this.pos.x + this.dir.x] && grid.tiles[this.pos.x][this.pos.y + this.dir.y] && grid.tiles[this.pos.x + this.dir.x][this.pos.y + this.dir.y][this.pos.z + this.dir.z] &&
                        grid.tiles[this.pos.x + this.dir.x][this.pos.y][this.pos.z].isInMoveReach !== grid.tiles[this.pos.x][this.pos.y + this.dir.y][this.pos.z].isInMoveReach) {
                        if (grid.tiles[this.pos.x + this.dir.x][this.pos.y][this.pos.z].isInMoveReach) this.dir.y = 0;
                        else this.dir.x = 0;
                    }
                    else this.dir = new Vector3D(0, 0, 0);
                }
                this.currentCoolDown = this.coolDown;
            }
            if (this.currentCoolDown !== 0) this.currentCoolDown--;

            this.pos = this.pos.plus(new Vector3D(1 / this.coolDown * this.dir.x, 1 / this.coolDown * this.dir.y, 1 / this.coolDown * this.dir.z));
        }
    }
}