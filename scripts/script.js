const videoConstraints = {
    video: {
        width: {
            min: 1280,
            ideal: 1920,
            max: 2560,
        },
        height: {
            min: 720,
            ideal: 1080,
            max: 1440,
        },
    },
};

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const errorMsgElement = document.querySelector("span#errorMsg");

// Access webcam
async function init() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(videoConstraints);
        handleSuccess(stream);
    } catch (e) {
        errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
    }
}

// Success
function handleSuccess(stream) {
    window.stream = stream;
    video.srcObject = stream;
}

// Load init
// init();
