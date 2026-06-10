import "./style.css";
import p5 from "p5";

import { Snake } from "./snake";
import { Wave } from "./wave";
import { Vector } from "./utils";

const SCALE = 6;
const WIDTH = 640 / 4;
const HEIGHT = 640 / 4;

let snake: Snake;

const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(WIDTH, HEIGHT, p.WEBGL);
    document.documentElement.style.setProperty("--scale-factor", `${SCALE * 100}%`);

    const shape = new Wave([
      [0, 4.5],
      [0.1, 3],
      [1, 0.5]
    ]);
    snake = new Snake(20, shape, 25);
  }

  p.draw = () => {
    p.background(0);
    p.noSmooth();

    const dt = p.deltaTime / 1000;
    const mousePos = new Vector(p.mouseX / SCALE - WIDTH / 2, p.mouseY / SCALE - HEIGHT / 2);

    p.strokeWeight(1);
    p.stroke("#fff");
    p.fill(0, 0);

    p.strokeWeight(1);

    snake.update(dt, mousePos);
    snake.draw(p);

    // draw the cursor
    p.strokeWeight(1);
    p.stroke("#fff");
    const angle = snake.getHead().pos.sub(mousePos).angle();
    const left = mousePos.add(new Vector(0, 2).rotate(angle - 45));
    const right = mousePos.add(new Vector(0, -2).rotate(angle + 45));
    p.line(mousePos.x, mousePos.y, left.x, left.y);
    p.line(mousePos.x, mousePos.y, right.x, right.y);
  }
}

new p5(sketch);
