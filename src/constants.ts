import type { Point } from "./types.js";

export const GRID_SIZE = 20;
export const CELL_SIZE = 20;
export const TICK_INTERVAL_MS = 150;

export const COLORS = {
	BACKGROUND: "#0f3460",
	SNAKE: "#4ecca3",
	FOOD: "#e94560",
} as const;

export const KEY_TO_DIRECTION: Record<string, Point> = {
	ArrowUp: { x: 0, y: -1 },
	ArrowDown: { x: 0, y: 1 },
	ArrowLeft: { x: -1, y: 0 },
	ArrowRight: { x: 1, y: 0 },
};

export const OPPOSITE_DIRECTION: Record<string, Point> = {
	ArrowUp: { x: 0, y: 1 },
	ArrowDown: { x: 0, y: -1 },
	ArrowLeft: { x: 1, y: 0 },
	ArrowRight: { x: -1, y: 0 },
};
