import { scaleLinear, scaleSequential } from 'd3-scale';
import { rgb } from 'd3-color';
import { memoize } from 'lodash';
import { interpolateSpectral } from 'd3-scale-chromatic';

const createColorScale = memoize((maxIterations: number) => {
    const scale = scaleSequential(interpolateSpectral)
        .domain([0, maxIterations]);
    return memoize((num: number) => rgb(scale(num)));
});

const createXScale = memoize((width: number) =>
    memoize(scaleLinear()
        .domain([0, width])
        .range([-2.5, 1])));

const createYScale = memoize((height: number) =>
    memoize(scaleLinear()
        .domain([height, 0])
        .range([-1, 1])));

export const renderMandelbrot = (
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    magicThing: number,
    context: CanvasRenderingContext2D,
    imageData: ImageData,
    maxIterations: number) => {

    const colorScale = createColorScale(maxIterations);

    const xScale = createXScale(width);
    const yScale = createYScale(height);

    const actualData = imageData.data;

    for (let pixelX = 0; pixelX < width; pixelX++) {
        for (let pixelY = 0; pixelY < height; pixelY++) {
            const x0 = xScale(pixelX);
            const y0 = yScale(pixelY);

            let iteration = 0;

            let x = 0.0;
            let y = 0.0;

            while (x * x + y * y < 4 && iteration < maxIterations) {
                const xTemp = x * x - y * y + x0;
                y = magicThing * x * y + y0;
                x = xTemp;
                iteration++;
            }

            const color = colorScale(iteration);

            const pixelStart = pixelY * width * 4 + pixelX * 4;

            actualData[pixelStart] = color.r;
            actualData[pixelStart + 1] = color.g;
            actualData[pixelStart + 2] = color.b;
            actualData[pixelStart + 3] = 255;
        }
    }

    context.putImageData(imageData, 0, 0);
};
