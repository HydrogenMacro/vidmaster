import projectState from "../projectState.js";
import { resizeCallbacks } from "../panelSizes.js";
import TextComponent from "../components/text.js";
import PolygonComponent from "../components/geometry.js";
import OverlayOperation from "../components/operations/overlay.js";
import { quicksort } from "../utils.js";
import FrameTime from "../frameTime.js";
import { updateTrackComponentDisplayElems, updateTracks } from "./tracks.js";
import { createNewTrack } from "./trackArea.js";

const videoDisplay = document.querySelector("#video-display");
const videoDisplayContainer = document.querySelector("#video-display-container");
const videoDebugDisplay = document.querySelector("#video-debug-display");
let videoDisplayContainerRatio = videoDisplayContainer.clientWidth / videoDisplayContainer.clientHeight;
resizeCallbacks.push(() => {
	videoDisplayContainerRatio = videoDisplayContainer.clientWidth / videoDisplayContainer.clientHeight;
	updateVideoDisplayDimensions();
	updateVideoDebugDisplay();
	drawComponents();
});

function updateVideoDisplayDimensions() {
	const videoDisplayRatio = projectState.videoSize[0] / projectState.videoSize[1];
	if (videoDisplayContainerRatio > videoDisplayRatio) {
		// pillar box: ||
		videoDisplay.style.width = videoDebugDisplay.style.width =
			videoDisplayContainer.clientHeight * videoDisplayRatio + "px";
		videoDisplay.style.height = videoDebugDisplay.style.height =
			videoDisplayContainer.clientHeight + "px";
	} else {
		// letter box: =
		videoDisplay.style.width = videoDebugDisplay.style.width =
			videoDisplayContainer.clientWidth + "px";
		videoDisplay.style.height = videoDebugDisplay.style.height =
			videoDisplayContainer.clientWidth / videoDisplayRatio + "px";
	}
}
updateVideoDisplayDimensions();

export function addComponents(...componentsToAdd) {
	for (const component of componentsToAdd) {
		createNewTrack().push(component);
		videoDisplay.appendChild(component.canvas);
	}
	updateTracks();
}
export function deleteComponent(component) {
	for (const track of projectState.currentTracks) {
		let componentIndex = track.indexOf(component);
		if (componentIndex === -1) continue;
		track.splice(componentIndex, 1);
		if (component === projectState.selectedVideoComponent ) {
			projectState.selectedVideoComponent = null;
			updateVideoDebugDisplay();
		}
		component.canvas.remove();
		updateTrackComponentDisplayElems();
		updateTracks();
		drawComponents();
		return true;
	}
	return false;
}
const videoDebugDisplayCtx = videoDebugDisplay.getContext("2d");
export function updateVideoDebugDisplay() {
	if (projectState.selectedVideoComponent) {
		videoDebugDisplay.width = videoDisplay.clientWidth;
		videoDebugDisplay.height = videoDisplay.clientHeight;
		videoDebugDisplayCtx.strokeStyle = "green"
		const [x, y, w, h] = projectState.selectedVideoComponent.getBoundingBox();
		videoDebugDisplayCtx.strokeRect(x, y, w, h);
	}
}
export function drawComponents() {
	let sortedComponents = projectState.currentTracks.flat();
	quicksort(sortedComponents, c => c.zIndex);
	for (const component of sortedComponents) {
		component.clearCanvas();
		if (projectState.videoSeekPos.toSecs() < component.startTime.toSecs()) continue;
		let relativeFrameTime = FrameTime.subtract(projectState.videoSeekPos, component.startTime);
		if (relativeFrameTime.toSecs() > component.duration.toSecs()) continue;
		component.update();
		component.draw(relativeFrameTime);
	}
	updateVideoDebugDisplay();
}