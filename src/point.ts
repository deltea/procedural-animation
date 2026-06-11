import { Vector } from "./utils";

export class Point {
  pos: Vector;
  lastPos: Vector;
  distance: number;
  next: Point | null;
  prev: Point | null;
  isRoot: boolean;
  displacement: Vector;
  displacementWeight: number;

  constructor(distance: number, pos: Vector, next: Point | null) {
    this.distance = distance;
    this.next = next;
    this.pos = pos;
    this.lastPos = new Vector(pos.x, pos.y);
    this.isRoot = false;
    this.prev = null;
    this.displacement = new Vector(0, 0);
    this.displacementWeight = 0;
  }

  verletIntegrate() {
    // apply verlet integration
    const temp = this.pos;
    // dampen the velocity a bit
    const vel = this.pos.sub(this.lastPos);
    this.pos = this.pos.add(vel);
    this.lastPos = temp;
  }

  addDisplacement(offset: Vector) {
    this.displacement = this.displacement.add(offset);
    this.displacementWeight += 1;
  }

  applyDisplacement() {
    if (this.displacementWeight <= 0) return;
    this.displacement = this.displacement.div(this.displacementWeight);
    this.pos = this.pos.add(this.displacement);
    this.displacement = new Vector(0, 0);
    this.displacementWeight = 0;
  }
}
