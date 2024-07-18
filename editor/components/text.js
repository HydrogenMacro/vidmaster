import Component from "./component.js";
import { rotateBoundingBox } from "../utils.js";
export default class TextComponent extends Component {
	name = "Text"
	text = "";
	font = "100px monospace";
	fill = "green";
	draw(relativeFrameTime) {
		this.ctx.font = this.font;
		this.ctx.fillStyle = this.fill;
		const textHeight = this.ctx.measureText(this.text).fontBoundingBoxAscent;
		this.ctx.fillText(this.text, 0, textHeight);
	}
	getBoundingBox() {
		const textMeasurement = this.ctx.measureText(this.text);
		return rotateBoundingBox(
			[
				this.translation[0],
				this.translation[1],
				textMeasurement.width,
				textMeasurement.fontBoundingBoxAscent,
			],
			this.rotation
		);
	}
}
Component.registerComponentAttributes(TextComponent);