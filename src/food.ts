import { GRID_SIZE } from "./constants.js";
import type { Snake } from "./snake.js";
import type { Point } from "./types.js";

export function spawnFood(snake: Snake): Point | undefined {
	const occupied = new Set(snake.body.map(({ x, y }) => `${x},${y}`));

	const available: Point[] = [];
	for (let x = 0; x < GRID_SIZE; x++) {
		for (let y = 0; y < GRID_SIZE; y++) {
			if (!occupied.has(`${x},${y}`)) available.push({ x, y });
		}
	}

	return available[Math.floor(Math.random() * available.length)];
}
