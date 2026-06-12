import p5 from "p5";
import { Vector } from "./utils";

const RADIUS = 1;

// how long the spawn animation lasts in milliseconds
const ANIMATION_TIME = 500;

export class Food {
  pos: Vector;
  startTime: number;

  constructor(pos: Vector, startTime: number) {
    this.pos = pos;
    this.startTime = startTime;
  }

  draw(p: p5) {
    p.strokeWeight(1);
    p.stroke("#fff");
    p.fill("#fff");

    const lifetime = p.millis() - this.startTime;
    const scale = lifetime < ANIMATION_TIME ? lifetime / ANIMATION_TIME : 1;
    p.circle(this.pos.x, this.pos.y, RADIUS * 2 * scale);

    p.fill(0, 0);
  }
}
