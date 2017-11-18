import { scaleLinear, scaleSequential } from 'd3-scale';
import { rgb } from 'd3-color';
import { interpolateRdYlBu } from 'd3-scale-chromatic';

const maxIteration = 300;

export const renderMandelbrot = (canvas: HTMLCanvasElement, width: number, height: number) => {
    const xScale = scaleLinear()
        .domain([0, width])
        .range([-2.5, 1]);

    const yScale = scaleLinear()
        .domain([height, 0])
        .range([-1, 1]);

    const colorScale = scaleSequential(interpolateRdYlBu)
        .domain([0, maxIteration]);

    const context = canvas.getContext('2d')!;

    const imageData = context.createImageData(width, height);

    const actualData = imageData.data;

    for (let pixelX = 0; pixelX < width; pixelX++) {
        for (let pixelY = 0; pixelY < height; pixelY++) {
            const x0 = xScale(pixelX);
            const y0 = yScale(pixelY);

            let iteration = 0;

            let x = 0.0;
            let y = 0.0;

            while (x * x + y * y < 4 && iteration < maxIteration) {
                const xTemp = x * x - y * y + x0;
                y = 2 * x * y + y0;
                x = xTemp;
                iteration++;
            }

            const color = rgb(colorScale(iteration));

            const pixelStart = pixelY * width * 4 + pixelX * 4;

            actualData[pixelStart] = color.r;
            actualData[pixelStart + 1] = color.g;
            actualData[pixelStart + 2] = color.b;
            actualData[pixelStart + 3] = 255;
        }
    }

    context.putImageData(imageData, 0, 0);
};
