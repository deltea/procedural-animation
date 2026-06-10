import { clamp, lerp } from "./utils";

export class Wave {
  points: number[][];

  constructor(points: number[][]) {
    this.points = points;
    // order the points by the first element so its not messed up
    this.points = this.points.sort((a: number[], b: number[]) => a[0] - b[0]);
    if (this.points[this.points.length - 1][0] !== 1) {
      this.points.push([1, this.points[this.points.length - 1][1]]);
    }
    console.log(this.points);
  }

  // pos is a number between 0-1
  getPos(pos: number) {
    pos = clamp(pos, 0, 1);
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      const nextPoint = this.points[i + 1];
      if (pos >= point[0] && pos <= nextPoint[0]) {
        return lerp(point[1], nextPoint[1], (pos - point[0]) / (nextPoint[0] - point[0]));
      }
    }

    return 0;
  }
}
