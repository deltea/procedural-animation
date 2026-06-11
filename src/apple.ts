import { Point } from "./point";
import p5 from "p5";
import { Vector } from "./utils";

const POINTS_DISTANCE = 5;
const FIRMNESS = 1.5;

export class Apple {
  radius: number;
  points: Point[];
  speed: number;
  numPoints: number;

  chordLength: number;
  circumference: number;
  desiredArea: number;

  constructor(radius: number, speed: number, numPoints: number) {
    this.radius = radius;
    this.speed = speed;
    this.numPoints = numPoints;
    this.points = this.generatePoints();
    this.circumference = this.radius * 2 * Math.PI;
    this.chordLength = this.circumference / this.numPoints;
    this.desiredArea = FIRMNESS * this.radius * this.radius * Math.PI;

    const dir = new Vector(1, 0).rotate(Math.random() * 360).mult(this.speed);
    for (const point of this.points) {
      point.lastPos = point.pos.sub(dir);
    }
  }

  generatePoints() {
    const arr: Point[] = [];

    // generate points based on shape and length of snake
    for (let i = 0; i < this.numPoints; i++) {
      // generate a point based on the shape
      const p = new Point(POINTS_DISTANCE, new Vector(this.radius, 0).rotate(i * 360 / this.numPoints), null);
      arr.push(p);
    }

    // set point connections
    for (let i = 1; i < this.numPoints - 1; i++) {
      arr[i].next = arr[i + 1];
      arr[i].prev = arr[i - 1];
    }
    arr[arr.length - 1].next = arr[0];
    arr[arr.length - 1].prev = arr[arr.length - 2];
    arr[0].prev = arr[arr.length - 1];
    arr[0].next = arr[1];

    return arr;
  }

  update(p: p5, dt: number) {
    for (const point of this.points) {
      if (point.isRoot) continue;
      point.verletIntegrate();
    }

    // repeat scaling a bunch of times per frame to make it adjust faster
    for (let i = 0; i < 10; i++) {
      // keep the points together
      for (const point of this.points) {
        if (!point.next) continue;
        const diff = point.next.pos.sub(point.pos);
        // if points are too far apart
        if (diff.magnitude() > this.chordLength) {
          const error = (diff.magnitude() - this.chordLength) / 2;
          const offset = diff.normalize().mult(error);
          const negOffset = offset.invert();
          point.addDisplacement(offset);
          point.next.addDisplacement(negOffset);
        }
      }

      const delta = this.desiredArea - this.calculateArea();
      const offset = delta / this.circumference;

      // push the points away to keep the shape
      for (const point of this.points) {
        if (!point.next || !point.prev) continue;
        // the secant line
        const diff = point.next.pos.sub(point.prev.pos);
        // const normal = new Vector(-diff.y, diff.x).normalize().mult(offset);
        const normal = diff.rotate(-90).normalize().mult(offset);
        point.addDisplacement(normal);
      }

      // apply all the displacements only at the end or else its all messed up
      for (const point of this.points) {
        point.applyDisplacement();
      }
    }

    for (const point of this.points) {
      const vel = point.pos.sub(point.lastPos);
      const normal = vel.normalize().mult(this.speed);
      point.lastPos = point.pos.sub(normal);
    }

    // collision detection and bounccyyy
    const restitution = 0;
    for (const point of this.points) {
      const vel = point.pos.sub(point.lastPos);

      if (point.pos.x >= 80) {
        point.pos.x = 160 - point.pos.x;
        point.lastPos.x = point.pos.x - vel.x * restitution;
      } else if (point.pos.x <= -80) {
        point.pos.x = -160 - point.pos.x;
        point.lastPos.x = point.pos.x - vel.x * restitution;
      }

      if (point.pos.y >= 80) {
        point.pos.y = 160 - point.pos.y;
        point.lastPos.y = point.pos.y - vel.y * restitution;
      } else if (point.pos.y <= -80) {
        point.pos.y = -160 - point.pos.y;
        point.lastPos.y = point.pos.y - vel.y * restitution;
      }

      if (point.pos) {

      }
    }
  }

  calculateArea() {
    // total area
    let a = 0;
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      const next = this.points[i].next;
      if (!next) continue;
      const w = point.pos.x - next.pos.x;
      const l = (point.pos.y + next.pos.y) / 2;
      a += w * l;
    }
    return a;
  }

  draw(p: p5, color: string) {
    p.strokeWeight(1);
    p.stroke(color);

    p.beginShape();
    for (const point of this.points) {
      // p.circle(point.pos.x, point.pos.y, 2);
      p.vertex(point.pos.x, point.pos.y);
    }
    p.endShape(p.CLOSE);
  }
}
