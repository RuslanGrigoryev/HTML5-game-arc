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
    mainJet;

clearCanvasBtn.addEventListener('click', clearBg, false);
sprite.src = "i/sprite.png";
sprite.addEventListener('load', init, false);

function init () {
	drawBg();
	startDrawing();
	mainJet = new Jet();

	document.addEventListener('keydown', checkKeyDown,false);
	document.addEventListener('keyup', checkKeyUp,false);
}

function clearBg () {
	ctx.clearRect(0,0,gameWidth,gameHeight);
}

function clearJet () {
	ctxJet.clearRect(0,0,gameWidth,gameHeight);
}

function draw () {
	mainJet.draw();
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
	this.speed = 2;
	this.isUpKey = false;
	this.isDownKey = false;
	this.isLeftKey = false;
	this.isRightKey = false;
}

Jet.prototype.draw = function  () {
	clearJet();
	this.checkKeys();
	ctxJet.drawImage(sprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
};

Jet.prototype.checkKeys = function  () {
	if (this.isUpKey) {
		this.drawY -= this.speed;
	}
	if (this.isRightKey) {
		this.drawX += this.speed;
	}
	if (this.isDownKey) {
		this.drawY += this.speed;
	}
	if (this.isLeftKey) {
		this.drawX -= this.speed;
	}
};

function checkKeyDown (e) {
	var keyId = (e.keyCode) ? e.keyCode : e.which;
	if (keyId === 37) {
		mainJet.isLeftKey = true;
    	e.preventDefault();
	}
    if (keyId === 38) {
    	mainJet.isUpKey = true;
    	e.preventDefault();
    }
    if (keyId === 39) {
    	mainJet.isRightKey = true;
    	e.preventDefault();
    }
    if (keyId === 40) {
    	mainJet.isDownKey = true;
    	e.preventDefault();
    }
}

function checkKeyUp (e) {
	var keyId = (e.keyCode) ? e.keyCode : e.which;
	if (keyId === 37) {
		mainJet.isLeftKey = false;
    	e.preventDefault();
	}
    if (keyId === 38) {
    	mainJet.isUpKey = false;
    	e.preventDefault();
    }
    if (keyId === 39) {
    	mainJet.isRightKey = false;
    	e.preventDefault();
    }
    if (keyId === 40) {
    	mainJet.isDownKey = false;
    	e.preventDefault();
    }
}