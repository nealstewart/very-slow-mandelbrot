import { renderMandelbrot } from './mandelbrot';

const canvas = document.createElement('canvas');

const width = 1000;
const height = 1000;

canvas.width = width;
canvas.height = height;

document.body.appendChild(canvas);

renderMandelbrot(canvas, width, height);
