class Vector3D {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.plus = other => new Vector3D(this.x + other.x, this.y + other.y, this.z + other.z);
        this.times = factor => new Vector3D(this.x * factor, this.y * factor, this.z * factor);
        this.equals = other => this.x === other.x && this.y === other.y && this.z === other.z;
        this.floor = () => new Vector3D(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
    }
}