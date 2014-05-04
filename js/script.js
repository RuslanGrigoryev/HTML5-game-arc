var canvasBg = document.getElementById('canvas'),
	canvasJet = document.getElementById('canvasJet'),

    ctx      = canvasBg.getContext('2d'),
    ctxJet      = canvasJet.getContext('2d'),

    clearCanvasBtn = document.getElementById('clearCanvasBtn'),
    sprite   = new Image(),
    gameWidth = canvasBg.width,
    gameHeight = canvasBg.height,

    fps = 10,
    drawInterval = null,
    jet1;

clearCanvasBtn.addEventListener('click', clearBg, false);
sprite.src = "i/sprite.png";
sprite.addEventListener('load', init, false);

function init () {
	drawBg();
	startDrawing();
	jet1 = new Jet();
}

function clearBg () {
	ctx.clearRect(0,0,gameWidth,gameHeight);
}

function clearJet () {
	ctxJet.clearRect(0,0,gameWidth,gameHeight);
}

function draw () {
	jet1.draw();
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

function Jet () {
	this.srcX  = 0;
	this.srcY  = 501;
	this.drawX = 200;
	this.drawY = 200;
	this.width = 120;
	this.height = 91;
}

Jet.prototype.draw = function  () {
	clearJet();
	ctxJet.drawImage(sprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
};