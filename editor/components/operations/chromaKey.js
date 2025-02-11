import Operation from "./operation.js";

export default class ChromaKeyOperation extends Operation {
	color = [12, 34, 56];
	tolerance = 10;
	backgroundComponent = null;
	foregroundComponent = null;
	draw(relativeFrame) {
		this.foregroundComponent.draw(relativeFrame);
		this.backgroundComponent.draw(relativeFrame);
		const foregroundImgData = this.foregroundComponent.ctx.getImageData(
			0,
			0,
			this.foregroundComponent.canvas.width,
			this.foregroundComponent.canvas.height
		);
		const backgroundImgData = this.foregroundComponent.ctx.getImageData(
			0,
			0,
			this.foregroundComponent.canvas.width,
			this.foregroundComponent.canvas.height
		);
		const [tr, tg, tb] = this.color;
		for (
			let i = 0;
			i < foregroundImgData.width * foregroundImgData.height * 4;
			i += 4
		) {
			const r = foregroundImgData.data[i];
			const g = foregroundImgData.data[i + 1];
			const b = foregroundImgData.data[i + 2];
			const a = foregroundImgData.data[i + 3];
			if (a === 0) {
				// continue if invisible
				continue;
			}
			if (
				Math.abs(tr - r) + Math.abs(tg - g) + Math.abs(tb - b) >
				this.tolerance
			) {
				foregroundImgData.data[i] = backgroundImgData.data[i];
				foregroundImgData.data[i + 1] = backgroundImgData.data[i + 1];
				foregroundImgData.data[i + 2] = backgroundImgData.data[i + 2];
				foregroundImgData.data[i + 3] = backgroundImgData.data[i + 3];
			}
		}
		ctx.putImageData(foregroundImgData, 0, 0);
	}
}
Component.registerComponent(ChromaKeyOperation);