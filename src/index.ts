import { renderMandelbrot } from './mandelbrot';
import './index.css';

const canvas = document.createElement('canvas');

let width = Math.min(window.innerWidth, 500);
let height = Math.min(window.innerHeight, 500);

canvas.width = width;
canvas.height = height;

document.body.appendChild(canvas);

let magicThing = 1.5;
const context = canvas.getContext('2d')!;

let direction: 'left' | 'right' = 'right';

const draw = () => {
  const imageData = context.createImageData(width, height);
  renderMandelbrot(canvas, width, height, magicThing, context, imageData, 100);

  if (direction === 'left' && magicThing < 1.5) {
    direction = 'right';
  } else if (direction === 'right' && magicThing > 3) {
    direction = 'left';
  }

  magicThing = direction === 'right' ? magicThing + 0.02 : magicThing - 0.02;
  requestAnimationFrame(draw);
};

draw();

window.addEventListener('resize', () => {
  width = Math.min(window.innerWidth, 500);
  height = Math.min(window.innerHeight, 500);

  canvas.width = width;
  canvas.height = height;
});
