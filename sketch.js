let capture = null;
let tracker = null;
let positions = null;
let w = 0, h = 0;

/* Start my code */
const fullScreen = window.screen.height;
// console.log(eyeValue)
const firstpart = Math.floor(fullScreen / 3);  
const midrange = firstpart+ 50;


function doScroll(eyeValue){
  // scroll up
  
  console.log("Scrolling")
  if(eyeValue < firstpart){

    console.log(" up")
    window.scrollBy(0, -20);
    var x = -20;
    var y = 100;
    
    window.scrollBy({
        top: x,
        left: y,
        behavior : "smooth"
    })
    
  } else if(eyeValue > firstpart && eyeValue < midrange){
    //scroll lock
    (function() {
      var $window = $(window), previousScrollTop = 0, scrollLock = false;
      $window.scroll(function(event) {     
          if(scrollLock) {
              $window.scrollTop(previousScrollTop); 
          }
          previousScrollTop = $window.scrollTop();
      });
      $("#lock").click(function() {
          scrollLock = !scrollLock;
      });
  })();
  }
  // scroll down
  if(eyeValue > midrange){
    console.log(" down")
    var x = 20;
    var y = 100;
    
    window.scrollBy({
        top: x,
        left: y,
        behavior : "smooth"
    })  
  }
}
/* End my code */

function setup() {
  w = windowWidth;
  h = windowHeight;
  capture = createCapture(VIDEO);
  createCanvas(w, h);
  capture.size(w, h);
  capture.hide();

  frameRate(10);
  colorMode(HSB);
  background(0);

  tracker = new clm.tracker();
  tracker.init();
  tracker.start(capture.elt);
}

// draw();
function draw() {
  // Flip the canvas so that we get a mirror image
	// translate(w, 0);
  // scale(-1.0, 1.0);
  // Uncomment the line below to see the webcam image (and no trail)
  image(capture, 0, 0, w, h);
  positions = tracker.getCurrentPosition();
  if (positions.length > 0) {

    // Eye points from clmtrackr:
    // https://www.auduno.com/clmtrackr/docs/reference.html
    const eye1 = {
      outline: [23, 63, 24, 64, 25, 65, 26, 66].map(getPoint),
      center: getPoint(27),
      top: getPoint(24),
      bottom: getPoint(26)
    };
    const eye2 = {
      outline: [28, 67, 29, 68, 30, 69, 31, 70].map(getPoint),
      center: getPoint(32),
      top: getPoint(29),
      bottom: getPoint(31)
    }
    // console.log("Eye2" + eye2.center)
    // console.log(Math.floor(eye1.center.y));
    
    doScroll(Math.floor(eye1.center.y));  // Call fucntion for scroll screen
    doScroll(Math.floor(eye2.center.y));  // Call fucntion for scroll screen
    
    // const irisColor = color(random(360), 80, 80, 0.4);
    // drawEye(eye1, irisColor);
		// drawEye(eye2, irisColor);
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
//   console.log("First " + firstPoint)
  eye.outline.forEach((p, i) => {
    curveVertex(p.x, p.y);
    if (i === 0) {
      // Duplicate the initial point (see curveVertex documentation)
      curveVertex(firstPoint.x, firstPoint.y);
    }
    if (i === eye.outline.length - 1) {
      // Close the curve and duplicate the closing point
      curveVertex(firstPoint.x, firstPoint.y);
      curveVertex(firstPoint.x, firstPoint.y);
    }
  });
  endShape();
}

function keyPressed() {
  // Clear background
  background(0);
}

function mouseClicked() {
  const timestamp = timestampString();
  saveCanvas("eyeTrail-" + timestamp, "png");
}

function timestampString() {
  return year() + nf(month(), 2) + nf(day(), 2) + "-" + nf(hour(), 2) + nf(minute(), 2) + nf(second(), 2);
}

function windowResized() {
  w = windowWidth;
  h = windowHeight;
  resizeCanvas(w, h);
  background(0);
}