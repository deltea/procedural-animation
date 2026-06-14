import p5 from "p5";

import { Point } from "./point";
import { Vector } from "./utils";
import { Wave } from "./wave";

const SEGMENT_DISTANCE = 0.5;
// const SEGMENT_MIN_ANGLE = 120;
const FOLLOW_MIN_DIST = 10;

// how often the tongue flicks in seconds
const TONGUE_DELAY = 5;
// how long the tongue stays out;
const TONGUE_TIME = 0.35;
const TONGUE_SIZE = 4;

export class Segment extends Point {
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

  checkPointCollision(pos: Vector) {
    const dist = this.pos.sub(pos).magnitude();
    return dist < this.radius;
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
    this.segments = [];
    this.speed = speed;

    this.generateSegments()
  }

  generateSegments() {
    // generate points based on shape and length of snake
    for (let i = 0; i < this.length; i++) {
      // generate a point based on the shape
      const s = new Segment(SEGMENT_DISTANCE, new Vector(i * SEGMENT_DISTANCE, 0), null, 0);
      this.segments.push(s);
    }

    // calculate the radius for each segment
    this.calculateSegments();

    // set point connections
    for (let i = 0; i < this.length - 1; i++) {
      const next = this.segments[i + 1];
      this.segments[i].next = next;
    }
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

      const normal = segment.next.pos.sub(segment.pos).normalize();
      segment.next.pos = segment.pos.add(normal.mult(segment.distance));
    }

    // enforce angle constraints
    // for (let i = 1; i < this.segments.length - 1; i++) {
    //   const segBefore = this.segments[i - 1];
    //   const seg = this.segments[i];
    //   const segAfter = this.segments[i + 1];

    //   const dirBefore = segBefore.pos.sub(seg.pos).normalize();
    //   const dirAfter = segAfter.pos.sub(seg.pos).normalize();

    //   // dot product gives cos of angle between the two arms
    //   const dot = dirBefore.x * dirAfter.x + dirBefore.y * dirAfter.y;
    //   const clampedDot = Math.max(-1, Math.min(1, dot));
    //   const angleBetween = radToDeg(Math.acos(clampedDot));

    //   if (angleBetween < SEGMENT_MIN_ANGLE) {
    //     const correction = SEGMENT_MIN_ANGLE - angleBetween;
    //     // determine rotation direction via cross product
    //     const cross = dirBefore.x * dirAfter.y - dirBefore.y * dirAfter.x;
    //     const sign = cross >= 0 ? 1 : -1;
    //     segAfter.pos = seg.pos.add(segAfter.pos.sub(seg.pos).rotate(sign * correction));
    //   }
    // }

    // make the head follow the mouse if not close enough already
    const diff = mousePos.sub(this.getHead().pos);
    const dist = diff.magnitude();
    if (dist > FOLLOW_MIN_DIST) {
      const dir = diff.normalize();
      this.getHead().pos = this.getHead().pos.add(dir.mult(this.speed * dt));
    }
  }

  draw(p: p5) {
    p.strokeWeight(1);
    p.stroke("#fff");

    const points: Vector[] = [];

    // add extra points for head
    const head = this.getHead();
    if (head.next) {
      const num = 5;
      const range = 180;
      for (let i = -num; i < num; i++) {
        points.push(head.pos.add(head.getDir().rotate(i * (range / (num * 2))).mult(head.radius)));
      }
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

    p.endShape("close");

    // draw the eyes and tongue
    if (head.next) {
      const eyeLeft = head.pos.add(head.getDir().rotate(-75).mult(2));
      const eyeRight = head.pos.add(head.getDir().rotate(75).mult(2));
      p.circle(eyeLeft.x, eyeLeft.y, 0.5);
      p.circle(eyeRight.x, eyeRight.y, 0.5);

      if (Math.floor(p.millis() / 1000) % TONGUE_DELAY === 0) {
        if ((p.millis() / 1000) % 1 <= TONGUE_TIME) {
          // tiny helper method
          const vertex = (v: Vector) => p.vertex(v.x, v.y);
          const alt = Math.floor(p.millis() / 100) % 2 === 0 ? 1 : -1;
          console.log(p.millis(), alt);
          p.beginShape();
          vertex(head.pos.add(head.getDir().rotate(TONGUE_SIZE * alt).mult(head.radius)));
          vertex(head.pos.add(head.getDir().rotate(-TONGUE_SIZE * alt).mult(head.radius + 1.5)));
          vertex(head.pos.add(head.getDir().rotate(TONGUE_SIZE * alt).mult(head.radius + 3)));
          vertex(head.pos.add(head.getDir().rotate(-TONGUE_SIZE * alt).mult(head.radius + 4.5)));
          vertex(head.pos.add(head.getDir().rotate(TONGUE_SIZE * alt).mult(head.radius + 3)));
          vertex(head.pos.add(head.getDir().rotate(TONGUE_SIZE * alt).mult(head.radius + 4.5)));
          p.endShape();
        }
      }
    }

    // p.stroke("#00f");

    // for (const point of points) {
    //   p.circle(point.x, point.y, 1)
    // }
  }

  calculateSegments() {
    for (let i = 0; i < this.segments.length; i++) {
      this.segments[i].radius = this.shape.getPos(i / this.length);
    }
  }

  addSegment() {
    this.length += 1;
    const s = new Segment(SEGMENT_DISTANCE, this.getTail().pos, null, 0);
    s.next = this.getTail();
    this.segments.push(s);
    this.calculateSegments();
  }
}
