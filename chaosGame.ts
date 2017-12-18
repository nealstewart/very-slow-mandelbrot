
type Point = [number, number];

export const createShape = (width: number, height: number, num: number): Point[] =>
    Array.from(Array(num).keys())
        .map(a => a)
        .map(a => {
            const amt = Math.PI * 2 * (a / num);
            return [Math.cos(amt), Math.sin(amt)];
        })
        .map(([x, y]) => [x * width / 2, y * height / 2])
        .map(([x, y]) => [x + width / 2, y + height / 2] as Point);

export const renderShape = (canvas: HTMLCanvasElement, width: number, height: number, points: Point[]) => {
    const context = canvas.getContext("2d")!;
    context.fillStyle = "black";

    const start = points[0];
    context.moveTo(start[0], start[1]);
    context.strokeStyle = "black";

    for (let i = 1; i < points.length; i++) {
        const [x, y] = points[i];
        context.lineTo(x, y);
    }

    context.fill();
};

export const createPoints = (width: number, height: number): Point[] =>
    [[0, 0], [0, height], [width, height], [width, 0]];

export const createTrianglePoints = (width: number, height: number): Point[] =>
    [[0, 0], [width, height / 2], [0, height]];

export const pickRandomCorner = (points: Point[], lastCorner: number) => {
    const options = Array.from(Array(points.length).keys()).filter(i => i !== lastCorner);
    return options[Math.floor(Math.random() * options.length)]
};

export const pickRandomCorner2 = (points: Point[], lastCorner: number, diff: number) => {
    const options = Array.from(Array(points.length).keys()).filter(i => {
        return i != (lastCorner + diff) % (points.length);
    });

    return options[Math.floor(Math.random() * options.length)]
};

export const pickRandomCornerPretty = (points: Point[], lastCorners: number[]) => {
    const options = Array.from(Array(points.length).keys()).filter(i => {
        const firstPoint = lastCorners[0];
        const secondPoint = lastCorners[1];
        const is1AwayFromFirst = typeof firstPoint == "number" &&
            i == (firstPoint - 1) % (points.length) ||
            i == (firstPoint + 1) % (points.length);

        const is3AwayFromSecond = typeof secondPoint == "number" &&
            i == (secondPoint - 3) % (points.length) ||
            i == (secondPoint + 3) % (points.length);

        return !is1AwayFromFirst && !is3AwayFromSecond;
    });

    console.log(options);

    return options[Math.floor(Math.random() * options.length)];
};

const getPointHalfwayBetween = (point: Point, otherPoint: Point): Point =>
    [(otherPoint[0] - point[0]) / 2 + point[0], (otherPoint[1] - point[1]) / 2 + point[1]]


export const renderStuff = (canvas: HTMLCanvasElement, points: Point[], width: number, height: number, diff: number, detail: number) => {
    const context = canvas.getContext("2d")!;
    context.fillStyle = "black";
    context.clearRect(0, 0, width, height);
    let lastPoint: Point = points[1];
    let lastCorner = 1;
    for (let i = 0; i < detail; i++) {
        const corner = pickRandomCorner2(points, lastCorner, diff);
        lastCorner = corner;
        const nextPoint = getPointHalfwayBetween(lastPoint, points[corner]);
        context.fillRect(nextPoint[0], nextPoint[1], 1, 1);
        lastPoint = nextPoint;
    }
};

export const renderOtherStuff = (canvas: HTMLCanvasElement, width: number, height: number) => {
    const points = createPoints(width, height);
    const context = canvas.getContext("2d")!;
    context.fillStyle = "black";
    const diff = Math.floor(Math.random() * points.length);
    context.clearRect(0, 0, width, height);
    let lastPoint: Point = points[1];
    let lastCorners = [1, 1];
    for (let i = 0; i < 10000; i++) {
        const corner = pickRandomCornerPretty(points, lastCorners);
        lastCorners.push(corner);
        lastCorners.shift();
        const nextPoint = getPointHalfwayBetween(lastPoint, points[corner]);
        if (Math.sin(nextPoint[0]) < 0.5)
            context.fillRect(nextPoint[0], nextPoint[1], 1, 1);
        lastPoint = nextPoint;
    }
};