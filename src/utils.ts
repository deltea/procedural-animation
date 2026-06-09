export class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  // basic operations
  add(v: Vector) {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  sub(v: Vector) {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  mult(v: Vector): Vector;
  mult(n: number): Vector;
  mult(arg: Vector | number) {
    if (arg instanceof Vector) {
      return new Vector(this.x * arg.x, this.y * arg.y);
    } else if (typeof arg === "number") {
      return new Vector(this.x * arg, this.y * arg);
    }
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const m = this.magnitude();
    if (m === 0) {
      return new Vector(0, 0);
    }
    return new Vector(this.x / m, this.y / m);
  }
}
