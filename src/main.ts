import "./style.css";
import p5 from "p5";
import { Vector } from "./utils";

const WIDTH = 640 / 4;
const HEIGHT = 640 / 4;
const POINT_COUNT = 5;
const POINT_DISTANCE = 16;
const CIRCLE_RADIUS = 3;

let points: Point[] = [];

class Point {
  pos: Vector;
  distance: number;
  next: Point | null;

  constructor(distance: number, pos: Vector, next: Point | null) {
    this.distance = distance;
    this.next = next;
    this.pos = pos;
  }
}

const sketch = (p: p5) => {
  p.setup = () => {
    const canvas = p.createCanvas(WIDTH, HEIGHT, p.WEBGL);

    // create each point
    for (let i = 0; i < POINT_COUNT; i++) {
      const point = new Point(POINT_DISTANCE, new Vector(i * 16, 0), null);
      points.push(point);
    }

    // set point connections
    for (let i = 0; i < POINT_COUNT - 1; i++) {
      const nextPoint = points[i + 1];
      points[i].next = nextPoint;
    }
  }

  p.draw = () => {
    p.background(0);
    p.noSmooth();

    p.strokeWeight(1);
    p.stroke("#fff");
    p.fill(0);

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
  }
}

new p5(sketch);
