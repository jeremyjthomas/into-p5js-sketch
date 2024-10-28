// Global Variables
let emailOpened = false;
let comparisonStarted = false;
let leftTypingIndex = 0;
let leftReply =
  "Hello Alex,\n\nThank you for your interest in our rental. Yes, the dates from June 20-25 are available. We would be happy to host you!\n\nBest regards,\nHost";
let leftDisplayedText = "";
let rightInput = "Yes, it's free and parking is available on location.";
let rightGenerated = false;
let rightEmailSent = false;
let showCallout = false;
let scaleValue = 1;
let scaleTarget = 0.8;
let scaleProgress = 0;
let showCursor = true;
let cursorInterval;
let leftTypos = [{ position: 25, correction: "intersted" }];
let typoMade = false;
let percentage = 0;
let percentageTarget = 200;
let percentageProgress = 0;
let isHoveringButton = false;
let mobileLayout = false;
let fontRegular, fontBold;

// Preload Fonts
function preload() {
  fontRegular = loadFont('https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Sans-Serif.ttf');
  fontBold = loadFont('https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Sans-Serif-Bold.ttf');
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('p5-container');
  cnv.style('background', 'transparent');
  noLoop();
  textFont(fontRegular);
  frameRate(60);

  // Blinking cursor interval
  cursorInterval = setInterval(() => {
    showCursor = !showCursor;
    redraw();
  }, 500);
}

function draw() {
  clear();

  // Determine layout based on window width
  mobileLayout = windowWidth < 600;

  if (!emailOpened) {
    drawEmailIcon();
  } else if (!comparisonStarted) {
    drawGuestEmail();
  } else {
    drawComparisonScene();
  }

  if (showCallout) {
    drawCalloutMessage();
  }
}

// Easing Function for Smooth Transitions
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// Initial Email Icon
function drawEmailIcon() {
  push();
  translate(width / 2, height / 2 - 100);
  if (isHovering(mouseX, mouseY, width / 2 - 25, height / 2 - 115, 50, 30)) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }
  fill(255);
  stroke(0);
  strokeWeight(2);
  drawingContext.shadowOffsetY = 2;
  drawingContext.shadowBlur = 5;
  drawingContext.shadowColor = 'rgba(0,0,0,0.2)';
  rectMode(CENTER);
  rect(0, 0, 50, 30, 5); // Envelope rectangle
  fill(0);
  triangle(-20, -10, 0, 10, 20, -10); // Envelope flap
  pop();
}

function mousePressed() {
  // Start animation when email icon is clicked
  if (!emailOpened && isHovering(mouseX, mouseY, width / 2 - 25, height / 2 - 115, 50, 30)) {
    emailOpened = true;
    redraw();
  }
  // Handle button clicks
  handleButtonClicks();
}

function drawGuestEmail() {
  push();
  fill(255);
  stroke(0);
  strokeWeight(1);
  drawingContext.shadowOffsetY = 4;
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = 'rgba(0,0,0,0.1)';
  rectMode(CENTER);
  rect(width / 2, height / 2 - 100, 400, 200, 5); // Email background

  fill(0);
  noStroke();
  textSize(16);
  textAlign(LEFT, TOP);
  text(
    "Hi,\n\nI'm interested in booking your rental from June 20-25. Are these dates available?\n\nThanks,\nAlex",
    width / 2 - 180,
    height / 2 - 180,
    360,
    160
  );
  pop();

  // Transition after a delay
  setTimeout(() => {
    transitionToComparison();
  }, 2000);
}

function transitionToComparison() {
  comparisonStarted = true;
  redraw();
}

function drawComparisonScene() {
  // Update scale progress for smooth scaling
  if (scaleProgress < 1) {
    scaleProgress += 0.02;
    scaleValue = lerp(1, scaleTarget, easeInOutQuad(scaleProgress));
    redraw();
  }

  // Blur and scale down the guest email
  push();
  translate(width / 2, height / 2 - 200);
  scale(scaleValue);
  drawingContext.filter = 'blur(2px)';
  drawGuestEmailContent();
  pop();

  // Draw Left and Right Panels
  if (mobileLayout) {
    drawLeftSideMobile();
    drawRightSideMobile();
  } else {
    drawLeftSide();
    drawRightSide();
  }
}

function drawGuestEmailContent() {
  // Reuse the guest email drawing code without the shadow
  fill(255);
  stroke(0);
  rectMode(CENTER);
  rect(0, 0, 400, 200, 5);

  fill(0);
  noStroke();
  textSize(16);
  textAlign(LEFT, TOP);
  text(
    "Hi,\n\nI'm interested in booking your rental from June 20-25. Are these dates available?\n\nThanks,\nAlex",
    -180,
    -80,
    360,
    160
  );
}

function drawLeftSide() {
  // Left panel background
  push();
  let panelX = 50;
  let panelY = height / 2 - 100;
  fill(245);
  stroke(0);
  strokeWeight(1);
  drawingContext.shadowOffsetY = 4;
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = 'rgba(0,0,0,0.1)';
  rect(panelX, panelY, 300, 200, 5);
  pop();

  // Avatar
  drawAvatar(panelX + 10, panelY + 10, 'agent');

  // Typing simulation
  fill(0);
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);

  // Simulate typos and corrections
  if (leftTypingIndex < leftReply.length) {
    let currentChar = leftReply.charAt(leftTypingIndex);
    leftDisplayedText += currentChar;
    leftTypingIndex++;

    // Introduce a typo at specified position
    if (!typoMade && leftTypingIndex === leftTypos[0].position) {
      leftDisplayedText = leftDisplayedText.slice(0, -1) + leftTypos[0].correction;
      typoMade = true;
      // Simulate backspace after delay
      setTimeout(() => {
        leftDisplayedText = leftDisplayedText.slice(0, -leftTypos[0].correction.length);
        leftTypingIndex -= leftTypos[0].correction.length;
        typoMade = false;
        redraw();
      }, 500);
    }

    // Redraw after random delay
    setTimeout(() => {
      redraw();
    }, random(50, 200));
  }

  // Display typed text with cursor
  let cursorChar = showCursor ? '|' : '';
  text(
    leftDisplayedText + cursorChar,
    panelX + 50,
    panelY + 50,
    240,
    140
  );

  // Progress Bar
  let progress = map(leftTypingIndex, 0, leftReply.length, 0, 280);
  fill(0, 122, 255);
  rect(panelX + 10, panelY + 180, progress, 5, 5);
}

function drawRightSide() {
  // Right panel background
  push();
  let panelX = width - 350;
  let panelY = height / 2 - 100;
  fill(245);
  stroke(0);
  strokeWeight(1);
  drawingContext.shadowOffsetY = 4;
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = 'rgba(0,0,0,0.1)';
  rect(panelX, panelY, 300, 200, 5);
  pop();

  // Avatar
  drawAvatar(panelX + 10, panelY + 10, 'ai');

  if (!rightGenerated) {
    // Display short input with cursor
    fill(0);
    noStroke();
    textSize(14);
    textAlign(LEFT, TOP);
    text(rightInput + (showCursor ? '|' : ''), panelX + 50, panelY + 50, 240, 140);

    // 'Generate' Button
    drawButton(
      panelX + 100,
      panelY + 160,
      100,
      30,
      'Generate',
      () => {
        rightGenerated = true;
        redraw();
      }
    );
  } else if (!rightEmailSent) {
    // Display generated response
    let aiReply =
      "Hello Alex,\n\nWe're pleased to confirm that our rental is available from June 20-25. We'd be delighted to host you. Please let us know if you have any questions.\n\nBest regards,\nHost";

    fill(0);
    noStroke();
    textSize(14);
    textAlign(LEFT, TOP);
    text(aiReply, panelX + 50, panelY + 50, 240, 140);

    // 'Send' Button
    drawButton(
      panelX + 100,
      panelY + 160,
      100,
      30,
      'Send',
      () => {
        sendRightEmail();
      }
    );
  }
}

function drawLeftSideMobile() {
  // Left panel for mobile layout
  let panelX = width / 2 - 150;
  let panelY = height / 2 - 100;
  // Reuse drawLeftSide code with adjusted positions
  drawLeftSide();
}

function drawRightSideMobile() {
  // Right panel for mobile layout
  let panelX = width / 2 - 150;
  let panelY = height / 2 + 120;
  // Reuse drawRightSide code with adjusted positions
  drawRightSide();
}

function drawAvatar(x, y, type) {
  // Draw avatars based on type ('agent' or 'ai')
  push();
  noStroke();
  fill(type === 'agent' ? 'rgb(0,122,255)' : 'rgb(255,45,85)');
  ellipse(x + 20, y + 20, 40, 40);
  fill(255);
  textSize(20);
  textAlign(CENTER, CENTER);
  text(type === 'agent' ? 'A' : 'AI', x + 20, y + 20);
  pop();
}

function drawButton(x, y, w, h, label, onClick) {
  let isHovering = isHoveringButton = isHovering(mouseX, mouseY, x, y, w, h);
  push();
  fill(isHovering ? 'rgba(0,122,255,0.8)' : 'rgba(0,122,255,1)');
  noStroke();
  rect(x, y, w, h, 5);
  fill(255);
  textSize(14);
  textAlign(CENTER, CENTER);
  text(label, x + w / 2, y + h / 2);
  pop();
}

function isHovering(px, py, x, y, w, h) {
  return px > x && px < x + w && py > y && py < y + h;
}

function handleButtonClicks() {
  if (comparisonStarted && !showCallout) {
    // Left Side Buttons (None in this case)

    // Right Side Buttons
    let panelX = mobileLayout ? width / 2 - 150 : width - 350;
    let panelY = mobileLayout ? height / 2 + 120 : height / 2 - 100;

    if (!rightGenerated) {
      if (isHoveringButton && isHovering(mouseX, mouseY, panelX + 100, panelY + 160, 100, 30)) {
        rightGenerated = true;
        redraw();
      }
    } else if (!rightEmailSent) {
      if (isHoveringButton && isHovering(mouseX, mouseY, panelX + 100, panelY + 160, 100, 30)) {
        sendRightEmail();
      }
    }
  }

  // 'Repeat Animation' Button
  if (showCallout) {
    if (isHoveringButton && isHovering(mouseX, mouseY, width / 2 - 75, height / 2 + 230, 150, 30)) {
      resetAnimation();
    }
  }
}

function sendRightEmail() {
  rightEmailSent = true;
  redraw();

  // Show call-out after sending
  setTimeout(() => {
    showCallout = true;
    redraw();
  }, 1000);
}

function drawCalloutMessage() {
  // Animate percentage increase
  if (percentageProgress < 1) {
    percentageProgress += 0.02;
    percentage = lerp(0, percentageTarget, easeInOutQuad(percentageProgress));
    redraw();
  } else {
    percentage = percentageTarget;
  }

  push();
  fill(255, 255, 0);
  stroke(0);
  strokeWeight(1);
  drawingContext.shadowOffsetY = 2;
  drawingContext.shadowBlur = 5;
  drawingContext.shadowColor = 'rgba(0,0,0,0.1)';
  rectMode(CENTER);
  rect(width / 2, height / 2 + 200, 400, 50, 5);

  fill(0);
  noStroke();
  textSize(18);
  textAlign(CENTER, CENTER);
  text(
    `Agents are ${Math.floor(percentage)}% faster with INTO's AI`,
    width / 2,
    height / 2 + 200
  );
  pop();

  // 'Repeat Animation' Button
  drawButton(
    width / 2 - 75,
    height / 2 + 230,
    150,
    30,
    'Repeat Animation',
    () => {
      resetAnimation();
    }
  );
}

function resetAnimation() {
  emailOpened = false;
  comparisonStarted = false;
  leftTypingIndex = 0;
  leftDisplayedText = "";
  rightGenerated = false;
  rightEmailSent = false;
  showCallout = false;
  scaleValue = 1;
  scaleProgress = 0;
  percentage = 0;
  percentageProgress = 0;
  redraw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}
