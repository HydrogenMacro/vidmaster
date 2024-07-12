import projectState from "../projectState.js";
import { resizeCallbacks } from "../panelSizes.js";
import TextComponent from "../components/text.js";
import PolygonComponent from "../components/geometry.js";
import OverlayOperation from "../components/operations/overlay.js";
import { quicksort } from "../utils.js";
import FrameTime from "../frameTime.js";
import { updateTracks } from "./tracks.js";
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
		videoDisplay.style.width = videoDisplayContainer.clientHeight * videoDisplayRatio + "px";
		videoDisplay.style.height = videoDisplayContainer.clientHeight + "px";
	} else {
		// letter box: =
		videoDisplay.style.width = videoDisplayContainer.clientWidth + "px";
		videoDisplay.style.height = videoDisplayContainer.clientWidth / videoDisplayRatio + "px";
	}
}
updateVideoDisplayDimensions();

export function addComponents(...componentsToAdd) {
	for (const component of componentsToAdd) {
		createNewTrack().push(component);
	}

	updateTracks();
}

const videoDebugDisplayCtx = videoDebugDisplay.getContext("2d");
function updateVideoDebugDisplay() {
	if (projectState.selectedVideoComponent) {
		videoDebugDisplay.width = videoDisplay.clientWidth;
		videoDebugDisplay.height = videoDisplay.clientHeight;
		videoDebugDisplayCtx.strokeStyle = "green"
		const [x, y, w, h] = projectState.selectedVideoComponent.getBoundingBox();
		videoDebugDisplayCtx.strokeRect(x, y, w, h);
	}
}
function drawComponents() {
	let sortedComponents = projectState.currentTracks.flat();
	quicksort(sortedComponents, c => c.zIndex);
	for (const component of sortedComponents) {
		component.update();
		component.draw();
	}
}
const t1 = new TextComponent();
t1.text = "AAAA"
t1.translation = [69, 42];
const t2 = new TextComponent();
t2.text = "BBBB"
t2.translation = [69, 42];
const o1 = new OverlayOperation();
o1.args = [t1, t2];
o1.startTime = FrameTime.fromSecs(2);
o1.duration = FrameTime.fromSecs(3);
/*
setInterval(() => {
	polyComponent.rotation += .1;
	polyComponent.display();
	updateVideoDebugDisplay()
}, 100); 
*/
addComponents(o1)
drawComponents();
//projectState.selectedVideoComponent = polyComponent;
updateVideoDebugDisplay()
