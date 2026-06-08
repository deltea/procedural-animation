import "./style.css";
import p5 from "p5";

const WIDTH = 640 / 4;
const HEIGHT = 640 / 4

const sketch = (p: p5) => {
  p.setup = () => {
    const canvas = p.createCanvas(WIDTH, HEIGHT, p.WEBGL);
  }

  p.draw = () => {
    p.background(0);

    p.noSmooth();
    p.circle(0, 0, 16);
  }
}

new p5(sketch);
