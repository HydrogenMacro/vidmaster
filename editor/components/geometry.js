import Component from "./component.js";
import { rotateBoundingBox } from "../utils.js";
export default class PolygonComponent extends Component {
	name = "Polygon"
	fill = "purple";
	_points = [
		[0, 0],
		[0, 500],
		[500, 500],
	];
	_localBounds = [];
	static attributes = componentAttributes()
	constructor() {
		super();
		this._calcLocalBounds();
	}
	draw(relativeFrameTime) {
		this.ctx.fillStyle = this.fill;
		let [lastX, lastY] = this._points[this._points.length - 1];
		this.ctx.moveTo(lastX, lastY);
		for (let i = 0; i < this._points.length; i++) {
			let [x, y] = this._points[i];
			this.ctx.lineTo(x, y);
		}
		this.ctx.fill();
	}
	getBoundingBox() {
		const [rx, ry, w, h] = this._localBounds;
		const [x, y] = this.translation;
		return rotateBoundingBox([x + rx, y + ry, w, h], this.rotation);
	}
	setPoints(newPoints) {
		this._points = newPoints;
		this._calcBoundingBox();
	}
	_calcLocalBounds() {
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
		this._localBounds = [xmin, ymin, xmax - xmin, ymax - ymin];
	}
}
Component.registerComponentAttributes(PolygonComponent);
function componentAttributes() {
	return [
		{
			field: "fill",
			alias: "Fill Color",
			baseType: "Color",
			isArray: false,
			arrayLengthRange: [-Infinity, Infinity],
			valueRange: [-Infinity, Infinity],
			labels: [],
			tags: {},
		},
	];
}