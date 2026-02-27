import { GRID_SIZE } from "./constants.js";
import type { Point } from "./types.js";

const INITIAL_LENGTH = 3;

export class Snake {
	#body: Point[];
	#prevBody: Point[];
	#direction: Point;

	constructor() {
		this.#direction = { x: 1, y: 0 };
		this.#body = Array.from({ length: INITIAL_LENGTH }, (_, i) => ({
			x: 10 - i,
			y: 10,
		}));
		this.#prevBody = this.#body.map((p) => ({ ...p }));
	}

	get body(): readonly Point[] {
		return this.#body;
	}

	get prevBody(): readonly Point[] {
		return this.#prevBody;
	}

	get direction(): Point {
		return this.#direction;
	}

	setDirection(direction: Point): void {
		this.#direction = direction;
	}

	/** Advance the snake one step. Always removes the tail — call grow() afterward if food was eaten. */
	move(): void {
		this.#prevBody = this.#body.map((p) => ({ ...p }));
		const { x, y } = this.#body[0];
		this.#body.unshift({ x: x + this.#direction.x, y: y + this.#direction.y });
		this.#body.pop();
	}

	/** Extend the snake by one segment. Call after move() when food is eaten. */
	grow(): void {
		const tail = this.#body[this.#body.length - 1];
		this.#body.push({ ...tail });
	}

	checkCollision(): boolean {
		return this.#checkWallCollision() || this.#checkSelfCollision();
	}

	#checkWallCollision(): boolean {
		const { x, y } = this.#body[0];
		return x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE;
	}

	#checkSelfCollision(): boolean {
		const head = this.#body[0];
		return this.#body.slice(1).some(({ x, y }) => x === head.x && y === head.y);
	}
}
