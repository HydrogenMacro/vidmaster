import Layer from "../layer.js";
export default class PolygonLayer extends Layer {
	fill = "purple";
	_points = [
		[0, 0],
		[30, 30],
		[-30, 30]
	];
	_bounds = [];
	constructor(startTime, duration) {
		super(startTime, duration);
		this._calcBounds();
	}
	draw(ctx, relativeFrame) {
		ctx.fillStyle = this.fill;
		let [lastX, lastY] = this._points[this._points.length - 1];
		ctx.moveTo(lastX, lastY);
		for (let i = 0; i < this._points.length; i++) {
			let [x, y] = this._points[i];
			ctx.lineTo(x, y);
		}
		ctx.fill();
	}
	getBoundingBox() {
		const [rx, ry, w, h] = this._bounds;
		const [x, y] = this.translation;
		return [x + rx, y + ry, w, h];
	}
	setPoints(newPoints) {
		this._points = newPoints;
		this._calcBoundingBox();
	}
	_calcBounds() {
		let xmin = Infinity;
		let xmax = -Infinity;
		let ymin = Infinity;
		let ymax = -Infinity;
		for (const [x, y] of this._points) {
			if (x > xmax) xmax = x;
			if (x < xmin) xmin = x;
			if (y > ymax) ymax = y;
			if (y < ymin) ymin = y;
		}
		this._bounds = [xmin, ymin, xmax-xmin, ymax-ymin];
	}
}