import { CELL_SIZE, COLORS } from "./constants.js";
import type { Snake } from "./snake.js";
import type { Point } from "./types.js";

export function render(
	ctx: CanvasRenderingContext2D,
	snake: Snake,
	food: Point | undefined,
): void {
	const { width, height } = ctx.canvas;

	ctx.fillStyle = COLORS.BACKGROUND;
	ctx.fillRect(0, 0, width, height);

	ctx.fillStyle = COLORS.SNAKE;
	for (const { x, y } of snake.body) {
		ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
	}

	if (food) {
		ctx.fillStyle = COLORS.FOOD;
		ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
	}
}
