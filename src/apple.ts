import { Point } from "./point";
import p5 from "p5";
import { Vector } from "./utils";

const POINTS_NUM = 9;
const POINTS_DISTANCE = 5;

export class Apple {
  radius: number;
  points: Point[];
  vel: Vector;

  constructor(radius: number) {
    this.radius = radius;
    this.points = this.generatePoints();
    this.vel = new Vector(1, 1);
  }

  generatePoints() {
    const arr: Point[] = [];

    // generate points based on shape and length of snake
    for (let i = 0; i < POINTS_NUM; i++) {
      // generate a point based on the shape
      const p = new Point(POINTS_DISTANCE, new Vector(8, 0).rotate(i * 360 / POINTS_NUM), null);
      arr.push(p);
    }

    // set point connections
    for (let i = 1; i < POINTS_NUM - 1; i++) {
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
    // apply gravity to the points
    for (const point of this.points) {
      if (point.isRoot) continue;

      const accel = new Vector(0, 1 * dt);
      let temp = point.pos;
      point.pos = point.pos.mult(2).sub(point.lastPos).add(accel);
      point.lastPos = temp;
    }

    // update the point constraints
    for (const point of this.points) {
      if (point.next === null) continue;

      const delta = point.next.pos.sub(point.pos);
      const dist = delta.magnitude();
      const correction = delta.mult((dist - point.distance) / dist / 2);

      if (!point.next.isRoot) point.next.pos = point.next.pos.sub(correction);
      if (!point.isRoot) point.pos = point.pos.add(correction);
    }

    // apply scaling to each point to keep its shape
    const desiredArea = this.radius * this.radius * Math.PI;
    const delta = (this.calculateArea() < desiredArea * 2) ? desiredArea - this.calculateArea() : 0;
    const circumference = this.radius * 2 * Math.PI;
    const factor = delta / circumference;
    for (const point of this.points) {
      if (!point.next || !point.prev) continue;
      const diff = point.next.pos.sub(point.prev.pos);
      const normal = new Vector(-diff.y, diff.x).normalize();
      point.pos = point.pos.add(normal.mult(factor));
    }

    // collision detection
  }

  calculateArea() {
    // total area
    let a = 0;
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      const next = this.points[i].next;
      if (!next) continue;
      const w = next.pos.x - point.pos.x;
      const l = (point.pos.y + next.pos.y) / 2;
      a += Math.abs(w * l);
    }
    return a;
  }

  draw(p: p5) {
    p.strokeWeight(1);
    p.stroke("#f00");

    p.beginShape();
    for (const point of this.points) {
      p.circle(point.pos.x, point.pos.y, 2);
      p.vertex(point.pos.x, point.pos.y);
    }
    p.endShape(p.CLOSE);
  }
}
