import { CELL_SIZE, COLORS } from "./constants.js";
import type { Snake } from "./snake.js";
import type { Point } from "./types.js";

function lerp(a: number, b: number, t: number): number {
	return a + (b - a) * t;
}

export function render(
	ctx: CanvasRenderingContext2D,
	snake: Snake,
	food: Point | undefined,
	alpha: number,
): void {
	const { width, height } = ctx.canvas;

	ctx.fillStyle = COLORS.BACKGROUND;
	ctx.fillRect(0, 0, width, height);

	ctx.fillStyle = COLORS.SNAKE;
	const { body, prevBody } = snake;
	for (let i = 0; i < body.length; i++) {
		const curr = body[i];
		const prev = prevBody[i] ?? curr;
		const rx = lerp(prev.x, curr.x, alpha) * CELL_SIZE;
		const ry = lerp(prev.y, curr.y, alpha) * CELL_SIZE;
		ctx.fillRect(rx, ry, CELL_SIZE, CELL_SIZE);
	}

	if (food) {
		ctx.fillStyle = COLORS.FOOD;
		ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
	}
}
