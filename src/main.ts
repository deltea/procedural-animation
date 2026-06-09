import "./style.css";
import p5 from "p5";
import { Vector } from "./utils";

const SCALE = 6;
const WIDTH = 640 / 4;
const HEIGHT = 640 / 4;
const POINT_COUNT = 20;
const POINT_DISTANCE = 3;
const CIRCLE_RADIUS = 3;
const GRAVITY = 1000;

let points: Point[] = [];

class Point {
  pos: Vector;
  lastPos: Vector;
  distance: number;
  next: Point | null;
  isRoot: boolean;

  constructor(distance: number, pos: Vector, next: Point | null) {
    this.distance = distance;
    this.next = next;
    this.pos = pos;
    this.lastPos = new Vector(pos.x, pos.y);
    this.isRoot = false;
  }
}

const sketch = (p: p5) => {
  p.setup = () => {
    const canvas = p.createCanvas(WIDTH, HEIGHT, p.WEBGL);
    document.documentElement.style.setProperty("--scale-factor", `${SCALE * 100}%`)

    // create each point
    for (let i = 0; i < POINT_COUNT; i++) {
      const point = new Point(POINT_DISTANCE, new Vector(i * POINT_DISTANCE, 0), null);
      points.push(point);
    }

    // set point connections
    for (let i = 0; i < POINT_COUNT - 1; i++) {
      const nextPoint = points[i + 1];
      points[i].next = nextPoint;
    }

    points[points.length - 1].next = points[0];
    points[0].isRoot = true;
  }

  p.draw = () => {
    p.background(0);
    p.noSmooth();

    p.strokeWeight(1);
    p.stroke("#fff");
    p.fill(0);

    // apply gravity to the points
    for (const point of points) {
      if (point.isRoot) continue;

      const dt = p.deltaTime / 1000;
      const accel = new Vector(0, GRAVITY * dt * dt);
      // point.pos = point.pos.add(point.vel.mult(p.deltaTime));
      let temp = point.pos;
      point.pos = point.pos.mult(2).sub(point.lastPos).add(accel);
      point.lastPos = temp;
    }

    // update the point constraints
    for (const point of points) {
      if (point.next === null) continue;

      const delta = point.next.pos.sub(point.pos);
      const dist = delta.magnitude();
      const correction = delta.mult((dist - point.distance) / dist / 2);

      if (!point.next.isRoot) point.next.pos = point.next.pos.sub(correction);
      if (!point.isRoot) point.pos = point.pos.add(correction);
    }

    // draw each point and connections
    for (const point of points) {
      // draw the connection lines first
      if (point.next) {
        const next = point.next.pos;
        const pos = point.pos;
        p.line(pos.x, pos.y, next.x, next.y);
      }

      p.circle(point.pos.x, point.pos.y, CIRCLE_RADIUS);
    }

    // move the root point with the mouse
    const mousePos = new Vector(p.mouseX / SCALE - WIDTH / 2, p.mouseY / SCALE - HEIGHT / 2);
    for (const point of points.filter(p => p.isRoot)) {
      point.pos = mousePos;
    }
  }
}

new p5(sketch);
