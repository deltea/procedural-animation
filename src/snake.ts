import p5 from "p5";

import { Point } from "./point";
import { Vector } from "./utils";
import { Wave } from "./wave";

const SEGMENT_DISTANCE = 8;

class Segment extends Point {
  radius: number;

  constructor(distance: number, pos: Vector, next: Point | null, radius: number) {
    super(distance, pos, next);
    this.radius = radius;
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
    return this.segments[this.segments.length - 1];
  }

  update(dt: number, mousePos: Vector) {
    // update the snake segment positions
    for (const segment of this.segments) {
      if (segment.next === null) continue;

      const delta = segment.next.pos.sub(segment.pos);
      const dist = delta.magnitude();
      const correction = delta.mult((dist - segment.distance) / dist / 2);

      if (!segment.next.isRoot) segment.next.pos = segment.next.pos.sub(correction);
      if (!segment.isRoot) segment.pos = segment.pos.add(correction);
    }

    // make the head follow the mouse
    const dir = mousePos.sub(this.getHead().pos).normalize();
    this.getHead().pos = this.getHead().pos.add(dir.mult(this.speed * dt));
  }

  draw(p: p5) {
    // draw each point and connections
    for (const segment of this.segments) {
      p.circle(segment.pos.x, segment.pos.y, segment.radius);
    }
  }
}
