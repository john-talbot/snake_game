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

// --- render loop state ---
let lastTimestamp = 0;
let accumulator = 0;
let rafId = 0;

function startLoop(): void {
	lastTimestamp = performance.now();
	accumulator = 0;
	rafId = requestAnimationFrame(gameLoop);
}

function stopLoop(): void {
	cancelAnimationFrame(rafId);
}

/** Pure game logic — no rendering, no scheduling. Returns true if the tick caused a game over. */
function gameTick(): boolean {
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

	return snake.checkCollision();
}

function gameLoop(timestamp: number): void {
	// Cap dt at 200 ms to prevent a "spiral of death" if the tab was hidden for a while.
	const dt = Math.min(timestamp - lastTimestamp, 200);
	lastTimestamp = timestamp;
	accumulator += dt;

	let gameOver = false;
	while (accumulator >= TICK_INTERVAL_MS) {
		gameOver = gameTick();
		accumulator -= TICK_INTERVAL_MS;
		if (gameOver) break;
	}

	// alpha: how far between the last tick and the next tick we currently are (0–1).
	// Passed to the renderer so it can interpolate segment positions.
	const alpha = gameOver ? 1 : accumulator / TICK_INTERVAL_MS;
	render(ctx, snake, food, alpha);

	if (gameOver) {
		gameOverEl.style.display = "flex";
		return; // don't reschedule — loop stops here
	}

	rafId = requestAnimationFrame(gameLoop);
}

function restart(): void {
	stopLoop();
	snake = new Snake();
	food = spawnFood(snake);
	score = 0;
	paused = false;
	scoreEl.textContent = "Score: 0";
	gameOverEl.style.display = "none";
	startLoop();
}

document.addEventListener("keydown", (event) => {
	if (event.key === " ") {
		event.preventDefault();
		paused = !paused;
		if (paused) {
			stopLoop();
		} else {
			startLoop();
		}
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

startLoop();
