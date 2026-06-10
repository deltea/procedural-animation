import { Point } from "./point";
import p5 from "p5";
import { Vector } from "./utils";

const POINTS_NUM = 8;
const POINTS_DISTANCE = 5;

export class Apple {
  radius: number;
  points: Point[];

  constructor(radius: number) {
    this.radius = radius;
    this.points = this.generatePoints();
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
    for (let i = 0; i < POINTS_NUM - 1; i++) {
      const next = arr[i + 1];
      arr[i].next = next;
    }
    arr[arr.length - 1].next = arr[0];

    return arr;
  }

  update(p: p5) {
    for (const point of this.points) {
      if (point.next === null) continue;

      const delta = point.next.pos.sub(point.pos);
      const dist = delta.magnitude();
      const correction = delta.mult((dist - point.distance) / dist / 2);

      if (!point.next.isRoot) point.next.pos = point.next.pos.sub(correction);
      if (!point.isRoot) point.pos = point.pos.add(correction);
    }
  }

  draw(p: p5) {
    p.strokeWeight(1);
    p.stroke("#f00");

    p.beginShape();
    for (const point of this.points) {
      // p.circle(point.pos.x, point.pos.y, 2);
      p.vertex(point.pos.x, point.pos.y);
    }
    p.endShape(p.CLOSE);
  }
}
