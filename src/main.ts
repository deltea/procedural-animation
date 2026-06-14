import "./style.css";
import p5 from "p5";

import { Snake } from "./snake";
import { Wave } from "./wave";
import { rand, Vector } from "./utils";
import { Apple } from "./apple";
import { Food } from "./food";

const SCALE = 6;
const WIDTH = 640 / 4;
const HEIGHT = 640 / 4;

let snake: Snake;
let apples: Apple[] = [];
let food: Food[] = [];
let color = "#f00";
let ended = false;
let score = 0;

let font: p5.Font;

const sketch = (p: p5) => {
  p.setup = async () => {
    font = await p.loadFont("/goodbyeDespair.ttf");

    p.createCanvas(WIDTH, HEIGHT, p.WEBGL);
    document.documentElement.style.setProperty("--scale-factor", `${SCALE * 100}%`);
    p.angleMode("degrees");
    p.noSmooth();

    // create the snake
    const shape = new Wave([
      [0, 4.5],
      [0.02, 4.3],
      [0.1, 3],
      [0.8, 2],
      [1, 0.5]
    ]);
    snake = new Snake(400, shape, 25);

    // create a few apples
    for (let i = 0; i < 20; i++) {
      const size = rand(2, 8);
      const pos = new Vector(rand(-WIDTH / 2, WIDTH / 2), rand(-HEIGHT / 2, HEIGHT / 2));
      apples.push(new Apple(pos, size, (10 - size) / 20, Math.floor(size * 2 + 5)));
    }

    spawnFood(p);
  }

  p.draw = () => {
    p.background(0);
    p.fill(0, 0);

    color = `hsl(${Math.floor(p.millis() / 50) % 360}, 100, 60)`;

    const dt = p.deltaTime / 1000;
    const mousePos = new Vector(p.mouseX / SCALE - WIDTH / 2, p.mouseY / SCALE - HEIGHT / 2);

    if (!ended) {
      snake.update(dt, mousePos);
    }
    snake.draw(p);

    // update and draw the apples
    for (const apple of apples) {
      if (!ended) {
        apple.update(p, dt, snake.segments, apples);
      }
      apple.draw(p, color);
    }

    // food updating
    for (const f of food) {
      // check for food collisions
      for (let i = 0; i < food.length; i++) {
        if (snake.getHead().checkPointCollision(food[i].pos)) {
          food.splice(i, 1);
          score++;
          // snake.addSegment();
          if (food.length === 0) spawnFood(p);
        }
      }

      f.draw(p);
    }

    // draw the cursor
    p.strokeWeight(1);
    p.stroke("#fff");
    const angle = snake.getHead().pos.sub(mousePos).angle();
    const left = mousePos.add(new Vector(0, 2).rotate(angle - 45));
    const right = mousePos.add(new Vector(0, -2).rotate(angle + 45));
    p.line(mousePos.x, mousePos.y, left.x, left.y);
    p.line(mousePos.x, mousePos.y, right.x, right.y);

    // draw the score
    p.stroke(0, 0);
    p.fill(255);
    p.textSize(8);
    p.textFont(font);
    p.textAlign(p.LEFT, p.TOP);
    p.text(score, -WIDTH / 2 + 3, -HEIGHT / 2 + 2);
  }
}

const spawnFood = (p: p5) => {
  for (let i = 0; i < Math.floor(rand(2, 5)); i++) {
    const pos = new Vector(rand(-WIDTH / 2, WIDTH / 2), rand(-HEIGHT / 2, HEIGHT / 2));
    food.push(new Food(pos, p.millis()));
  }
}

new p5(sketch);
