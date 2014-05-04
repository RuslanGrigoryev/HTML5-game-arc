var canvasBg = document.getElementById('canvas'),
	canvasJet = document.getElementById('canvasJet'),

    ctx      = canvasBg.getContext('2d'),
    ctxJet      = canvasJet.getContext('2d'),

    clearCanvasBtn = document.getElementById('clearCanvasBtn'),
    sprite   = new Image(),
    gameWidth = canvasBg.width,
    gameHeight = canvasBg.height,

    fps = 10,
    drawInterval = null;

clearCanvasBtn.addEventListener('click', clearBg, false);
sprite.src = "i/sprite.png";
sprite.addEventListener('load', init, false);

function init () {
	drawBg();
	startDrawing()
}

function clearBg () {
	ctx.clearRect(0,0,gameWidth,gameHeight);
}

function clearJet () {
	ctxJet.clearRect(0,0,gameWidth,gameHeight);
}

function draw () {
	drawJet();
}

function drawJet () {
	clearJet();
	var srcX  = 0,
	    srcY  = 501,
	    drawX = 200,
	    drawY = 200,
	    width = 120;
	    height = 91;
	ctxJet	.drawImage(sprite, srcX, srcY, gameWidth, gameHeight, drawX, drawY, gameWidth, gameHeight);
}

function drawBg() {
	var srcX  = 0,
	    srcY  = 0,
	    drawX = 0,
	    drawY = 0;
	ctx.drawImage(sprite, srcX, srcY, gameWidth, gameHeight, drawX, drawY, gameWidth, gameHeight);
}

function startDrawing() {
	stopDrawing();
	drawInterval = setInterval(draw, fps);
}

function stopDrawing () {
	clearInterval(drawInterval);
}

