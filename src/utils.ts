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

  div(v: Vector): Vector;
  div(n: number): Vector;
  div(arg: Vector | number) {
    if (arg instanceof Vector) {
      return new Vector(this.x / arg.x, this.y / arg.y);
    } else if (typeof arg === "number") {
      return new Vector(this.x / arg, this.y / arg);
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

  // rotate the vector by an angle in degrees
  rotate(angle: number) {
    const rad = degToRad(angle);
    const x = this.x * Math.cos(rad) - this.y * Math.sin(rad);
    const y = this.x * Math.sin(rad) + this.y * Math.cos(rad);
    return new Vector(x, y);
  }

  // get the vector as an angle in degrees
  angle() {
    return radToDeg(Math.atan2(this.y, this.x));
  }

  invert() {
    return new Vector(-this.x, -this.y);
  }

  // get the dot product
  dot(v: Vector) {
    return this.x * v.x + this.y * v.y;
  }
}

export const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

export const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;

export const degToRad = (angle: number) => angle * Math.PI / 180;

export const radToDeg = (angle: number) => angle / (Math.PI / 180);

export const rand = (min: number, max: number) => Math.random() * (max - min) + min;
