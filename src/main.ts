import {
	KEY_TO_DIRECTION,
	OPPOSITE_DIRECTION,
	TICK_INTERVAL_MS,
} from "./constants.js";
import { spawnFood } from "./food.js";
import { render } from "./renderer.js";
import { Snake } from "./snake.js";
import type { Point } from "./types.js";

function getElement<T extends Element>(selector: string): T {
	const el = document.querySelector<T>(selector);
	if (el === null) throw new Error(`Required element not found: ${selector}`);
	return el;
}

function get2DContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
	const ctx = canvas.getContext("2d");
	if (ctx === null) throw new Error("Failed to get 2D canvas context");
	return ctx;
}

const canvas = getElement<HTMLCanvasElement>("#game");
const ctx = get2DContext(canvas);
const scoreEl = getElement<HTMLElement>("#score");
const gameOverEl = getElement<HTMLElement>("#game-over");

let snake = new Snake();
let food: Point | undefined = spawnFood(snake);
let pendingDirection: Point | null = null;
let score = 0;
let paused = false;

function scheduleTick(): void {
	setTimeout(tick, TICK_INTERVAL_MS);
}

function tick(): void {
	if (paused) return;

	if (pendingDirection) {
		snake.setDirection(pendingDirection);
		pendingDirection = null;
	}

	snake.move();

	const head = snake.body[0];
	const ateFood = food !== undefined && head.x === food.x && head.y === food.y;
	if (ateFood) {
		snake.grow();
		food = spawnFood(snake);
		score += 10;
		scoreEl.textContent = `Score: ${score}`;
	}

	render(ctx, snake, food);

	if (snake.checkCollision()) {
		gameOverEl.style.display = "flex";
		return;
	}

	scheduleTick();
}

function restart(): void {
	snake = new Snake();
	food = spawnFood(snake);
	score = 0;
	paused = false;
	scoreEl.textContent = "Score: 0";
	gameOverEl.style.display = "none";
	scheduleTick();
}

document.addEventListener("keydown", (event) => {
	if (event.key === " ") {
		event.preventDefault();
		paused = !paused;
		if (!paused) scheduleTick();
		return;
	}

	const newDirection = KEY_TO_DIRECTION[event.key];
	if (!newDirection) return;

	event.preventDefault();
	const opposite = OPPOSITE_DIRECTION[event.key];
	if (snake.direction.x !== opposite.x || snake.direction.y !== opposite.y) {
		pendingDirection = newDirection;
	}
});

getElement<HTMLButtonElement>("#restart").addEventListener("click", restart);

scheduleTick();
