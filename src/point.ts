import { Vector } from "./utils";

export class Point {
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
