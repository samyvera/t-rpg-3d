class Display {
    constructor(game) {
        this.frame = 0;
        this.game = game;

        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 2, 512);
        this.camera.position.z = 256;
        this.camera.yOffset = 128;
        this.camera.rotation.x = Math.PI / 4;

        var directionalLight = new THREE.DirectionalLight('#fff', 1);
        directionalLight.position.set(-100, -350, 256);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        this.pointLight = new THREE.PointLight('#fff', 2);
        this.pointLight.position.set(this.game.grid.cursor.pos.x, this.game.grid.cursor.pos.y, this.game.grid.cursor.pos.z);
        this.pointLight.castShadow = true;
        this.scene.add(this.pointLight); 

        var cube = new THREE.CubeGeometry(16, 16, 16);
        for (let x = 0; x < this.game.grid.tiles.length; x++) {
            for (let y = 0; y < this.game.grid.tiles[0].length; y++) {
                for (let z = 0; z < this.game.grid.tiles[0][0].length; z++) {
                    if (this.game.grid.tiles[x][y][z].id !== ' ') {
                        var loader = new THREE.TextureLoader().load("img/blocs/" + this.game.grid.tiles[x][y][z].id + ".png");
                        loader.magFilter = THREE.NearestFilter;
                        var material = new THREE.MeshLambertMaterial({
                            map: loader
                        });
                        var mesh = new THREE.Mesh(cube, material);
                        mesh.position.x = x * 16;
                        mesh.position.y = y * 16;
                        mesh.position.z = z * 16;
                        this.scene.add(mesh);
                    }
                }
            }
        }

        var loader2 = new THREE.TextureLoader().load("img/cursor/cursor.png");
        this.annie = new TextureAnimator( loader2, 4, 1, 3, 150 );
        loader2.magFilter = THREE.NearestFilter;
        var plane = new THREE.PlaneGeometry(32, 32);
        var cursorMaterial = new THREE.MeshBasicMaterial({
            map: loader2,
            transparent: true
        });
        this.cursorMesh = new THREE.Mesh(plane, cursorMaterial);
        this.cursorMesh.name = 'cursor';
        this.scene.add(this.cursorMesh);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;
        document.body.appendChild(this.renderer.domElement);

        this.resize = () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix()
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
        window.addEventListener('resize', this.resize);

        this.updateScene = () => {

            this.annie.update(1000 * this.clock.getDelta());

            this.pointLight.position.x = this.game.grid.cursor.pos.x * 16;
            this.pointLight.position.y = this.game.grid.cursor.pos.y * 16;
            this.pointLight.position.z = this.game.grid.cursor.pos.z * 16;
            
            this.cursorMesh.position.x = this.game.grid.cursor.pos.x * 16;
            this.cursorMesh.position.y = this.game.grid.cursor.pos.y * 16;
            this.cursorMesh.position.z = this.game.grid.cursor.pos.z * 16 + 9;
            this.renderer.render(this.scene, this.camera);
        }

        this.updateCamera = () => {
            this.camera.position.x = this.game.grid.cursor.pos.x * 16;
            this.camera.position.y = this.game.grid.cursor.pos.y * 16 - this.camera.yOffset;
        }

        this.update = () => {
            this.updateScene();
            this.updateCamera();
        }
    }
}

class TextureAnimator {
    constructor(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) {
        this.tilesHorizontal = tilesHoriz;
        this.tilesVertical = tilesVert;
        this.numberOfTiles = numTiles;
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1 / this.tilesHorizontal, 1 / this.tilesVertical);
        this.tileDisplayDuration = tileDispDuration;
        this.currentDisplayTime = 0;
        this.currentTile = 0;
        this.update = milliSec => {
            this.currentDisplayTime += milliSec;
            while (this.currentDisplayTime > this.tileDisplayDuration) {
                this.currentDisplayTime -= this.tileDisplayDuration;
                this.currentTile++;
                if (this.currentTile == this.numberOfTiles) this.currentTile = 0;
                var currentColumn = this.currentTile % this.tilesHorizontal;
                texture.offset.x = currentColumn / this.tilesHorizontal;
                var currentRow = Math.floor(this.currentTile / this.tilesHorizontal);
                texture.offset.y = currentRow / this.tilesVertical;
            }
        };
    }
}
