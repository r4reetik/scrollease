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

async function vInit() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(videoConstraints);
        handleSuccess(stream);
    } catch (e) {
        errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
    }
}

function handleSuccess(stream) {
    window.stream = stream;
    video.srcObject = stream;
}

vInit();

let capture = null;
let tracker = null;
let positions = null;
let w = 0,
    h = 0;

function doScroll(eyeValue) {
    let rEye = eyeValue / 10;
    let dIframe = document.getElementById("divIframe");
    window.frames["docIframe"].contentDocument.getElementsByTagName("embed")[0];

    if (rEye < oPosition) {
        dIframe.scrollBy({
            top: -20,
            behavior: "smooth",
        });
    } else if (rEye > oPosition + oHeight * 2 + 5) {
        dIframe.scrollBy({
            top: 20,
            behavior: "smooth",
        });
    }
}

function setup() {
    w = 1777;
    h = 1000;
    capture = createCapture(VIDEO);
    createCanvas(w, h);
    capture.size(w, h);
    capture.hide();

    frameRate(30);
    colorMode(HSB);
    background(0);

    tracker = new clm.tracker();
    tracker.init();
    tracker.start(capture.elt);
}

function draw() {
    image(capture, 0, 0, w, h);
    positions = tracker.getCurrentPosition();
    if (positions.length > 0) {
        const eye1 = {
            outline: [23, 63, 24, 64, 25, 65, 26, 66].map(getPoint),
            center: getPoint(27),
            top: getPoint(24),
            bottom: getPoint(26),
        };
        const eye2 = {
            outline: [28, 67, 29, 68, 30, 69, 31, 70].map(getPoint),
            center: getPoint(32),
            top: getPoint(29),
            bottom: getPoint(31),
        };

        doScroll(Math.floor(eye1.center.y));
        doScroll(Math.floor(eye2.center.y));
    }
}

function getPoint(index) {
    return createVector(positions[index][0], positions[index][1]);
}

function drawEye(eye, irisColor) {
    // console.log(eye)
    noFill();
    stroke(255, 0.4);
    drawEyeOutline(eye);

    const irisRadius = min(eye.center.dist(eye.top), eye.center.dist(eye.bottom));
    const irisSize = irisRadius * 2;
    noStroke();
    fill(irisColor);
    ellipse(eye.center.x, eye.center.y, irisSize, irisSize);

    const pupilSize = irisSize / 3;
    fill(0, 0.6);
    ellipse(eye.center.x, eye.center.y, pupilSize, pupilSize);
}

function drawEyeOutline(eye) {
    beginShape();
    const firstPoint = eye.outline[0];
    eye.outline.forEach((p, i) => {
        curveVertex(p.x, p.y);
        if (i === 0) {
            curveVertex(firstPoint.x, firstPoint.y);
        }
        if (i === eye.outline.length - 1) {
            curveVertex(firstPoint.x, firstPoint.y);
            curveVertex(firstPoint.x, firstPoint.y);
        }
    });
    endShape();
}

let oHeight = 5;
let oPosition = 43;

document.getElementById("overlay-1").style.height = "43%";
document.getElementById("overlay-2").style.bottom = "90%";
document.getElementById("overlay-2").style.height = "43%";

document.getElementById("rangeHeight").addEventListener("input", (e) => {
    let cHeight = document.getElementById("rangeHeight").value - oHeight;
    oHeight = document.getElementById("rangeHeight").value;

    document.getElementById("overlay-1").style.height = oPosition - cHeight + "%";
    document.getElementById("overlay-2").style.height = 96 - oPosition - oHeight * 2 + "%";
    oPosition -= cHeight;
    document.getElementById("rangePosition").value = oPosition;
    document.getElementById("overlay-2").style.bottom = 100 - oHeight * 2 + "%";
});

document.getElementById("rangePosition").addEventListener("input", (e) => {
    oPosition = document.getElementById("rangePosition").value;

    document.getElementById("overlay-1").style.height = oPosition + "%";
    document.getElementById("overlay-2").style.height = 96 - oPosition - oHeight * 2 + "%";
});

document.getElementById("uploadButton").addEventListener("click", () => {
    let pdffile_url = URL.createObjectURL(document.getElementById("fileUpload").files[0]);
    document.getElementById("docIframe").setAttribute("src", pdffile_url);
});
