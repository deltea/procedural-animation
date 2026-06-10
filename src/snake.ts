import p5 from "p5";

import { Point } from "./point";
import { Vector } from "./utils";
import { Wave } from "./wave";

const SEGMENT_DISTANCE = 3;
const SEGMENT_MIN_ANGLE = 120;

class Segment extends Point {
  radius: number;

  constructor(distance: number, pos: Vector, next: Point | null, radius: number) {
    super(distance, pos, next);
    this.radius = radius;
  }

  getDir() {
    if (this.next) {
      return this.pos.sub(this.next.pos).normalize();
    } else {
      return new Vector(0, 0);
    }
  }
}

export class Snake {
  segments: Segment[];
  length: number;
  shape: Wave;
  speed: number;

  constructor(length: number, shape: Wave, speed: number) {
    this.length = length;
    this.shape = shape;
    this.segments = this.generateSegments();
    this.speed = speed;
  }

  generateSegments() {
    const arr: Segment[] = [];

    // generate points based on shape and length of snake
    for (let i = 0; i < this.length; i++) {
      // generate a point based on the shape
      const s = new Segment(SEGMENT_DISTANCE, new Vector(i * SEGMENT_DISTANCE, 0), null, this.shape.getPos(i / this.length));
      arr.push(s);
    }

    // set point connections
    for (let i = 0; i < this.length - 1; i++) {
      const next = arr[i + 1];
      arr[i].next = next;
    }

    return arr;
  }

  getHead() {
    return this.segments[0];
  }

  getTail() {
    return this.segments[this.segments.length - 1];
  }

  update(dt: number, mousePos: Vector) {
    // update the snake segment positions
    for (const segment of this.segments) {
      if (segment.next === null) continue;

      // const delta = segment.next.pos.sub(segment.pos);
      // const dist = delta.magnitude();
      // const correction = delta.mult((dist - segment.distance) / dist / 2);

      // if (!segment.next.isRoot) segment.next.pos = segment.next.pos.sub(correction);
      // if (!segment.isRoot) segment.pos = segment.pos.add(correction);

      const normal = segment.next.pos.sub(segment.pos).normalize();
      segment.next.pos = segment.pos.add(normal.mult(segment.distance));
    }

    // enforce angle constraints
    for (let i = 1; i < this.segments.length - 1; i++) {
      const segBefore = this.segments[i - 1];
      const seg = this.segments[i];
      const segAfter = this.segments[i + 1];
      if (Math.abs(segBefore.pos.sub(seg.pos).angle() - segAfter.pos.sub(seg.pos).angle()) < SEGMENT_MIN_ANGLE) {
        segAfter.pos = segAfter.pos.rotate(SEGMENT_MIN_ANGLE - (segBefore.pos.sub(seg.pos).angle() - segAfter.pos.sub(seg.pos).angle()));
      }
    }

    // make the head follow the mouse if not close enough already
    const diff = mousePos.sub(this.getHead().pos);
    const dir = diff.normalize();
    this.getHead().pos = this.getHead().pos.add(dir.mult(this.speed * dt));
  }

  draw(p: p5) {
    const points: Vector[] = [];

    // add extra points for head
    const head = this.getHead();
    if (head.next) {
      points.push(head.pos.add(head.getDir().rotate(-45).mult(head.radius)));
      points.push(head.pos.add(head.getDir().rotate(-22).mult(head.radius)));
      points.push(head.pos.add(head.getDir().mult(head.radius)));
      points.push(head.pos.add(head.getDir().rotate(22).mult(head.radius)));
      points.push(head.pos.add(head.getDir().rotate(45).mult(head.radius)));
    }

    for (let i = 0; i < this.segments.length - 1; i++) {
      const segment = this.segments[i];
      if (!segment.next) continue;
      const dir = segment.pos.sub(segment.next.pos).normalize();
      points.push(segment.pos.add(dir.mult(segment.radius).rotate(90)));
    }

    const tail = this.getTail();
    // extra point for tail
    points.push(tail.pos.add(tail.pos.sub(this.segments[this.segments.length - 2].pos).normalize()));

    for (let i = this.segments.length - 1; i >= 0; i--) {
      const segment = this.segments[i];
      if (!segment.next) continue;
      const dir = segment.pos.sub(segment.next.pos).normalize();
      points.push(segment.pos.add(dir.mult(segment.radius).rotate(-90)));
    }

    p.beginShape();
    for (const point of points) {
      p.vertex(point.x, point.y);
    }

    p.endShape(p.CLOSE);

    // draw the eyes
    if (head.next) {
      const eyeLeft = head.pos.add(head.getDir().rotate(-45).mult(2));
      const eyeRight = head.pos.add(head.getDir().rotate(45).mult(2));
      p.circle(eyeLeft.x, eyeLeft.y, 0.5);
      p.circle(eyeRight.x, eyeRight.y, 0.5);
    }

    p.stroke("#f00");

    // for (const point of points) {
    //   p.circle(point.x, point.y, 1)
    // }
  }
}
