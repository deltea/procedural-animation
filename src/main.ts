import "./style.css";
import p5 from "p5";

import { Snake } from "./snake";
import { Wave } from "./wave";
import { Vector } from "./utils";
import { Apple } from "./apple";

const SCALE = 6;
const WIDTH = 640 / 4;
const HEIGHT = 640 / 4;

let snake: Snake;
let apples: Apple[] = [];

const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(WIDTH, HEIGHT, p.WEBGL);
    document.documentElement.style.setProperty("--scale-factor", `${SCALE * 100}%`);

    // create the snake
    const shape = new Wave([
      [0, 4.5],
      [0.1, 3],
      [1, 0.5]
    ]);
    snake = new Snake(20, shape, 25);

    // create a few apples
    apples.push(new Apple(15));
  }

  p.draw = () => {
    p.background(0);
    p.noSmooth();
    p.fill(0, 0);

    const dt = p.deltaTime / 1000;
    const mousePos = new Vector(p.mouseX / SCALE - WIDTH / 2, p.mouseY / SCALE - HEIGHT / 2);

    snake.update(dt, mousePos);
    snake.draw(p);

    // draw the apples
    for (const apple of apples) {
      apple.update(p, dt);
      apple.draw(p);
    }

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
