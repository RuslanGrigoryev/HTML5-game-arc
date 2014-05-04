var canvasBg = document.getElementById('canvas'),
	canvasJet = document.getElementById('canvasJet'),
	canvasEnemy = document.getElementById('canvasEnemy'),

    ctx      = canvasBg.getContext('2d'),
    ctxJet      = canvasJet.getContext('2d'),
    ctxEnemy      = canvasEnemy.getContext('2d'),

    clearCanvasBtn = document.getElementById('clearCanvasBtn'),
    sprite   = new Image(),
    gameWidth = canvasBg.width,
    gameHeight = canvasBg.height,

    isPlaying = false,
    requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame,
    mainJet,
    enemyJet;

clearCanvasBtn.addEventListener('click', clearBg, false);
sprite.src = "i/sprite.png";
sprite.addEventListener('load', init, false);

// INITIALIZATION 
function init () {
	mainJet = new Jet();
	enemyJet = new Enemy();
	drawBg();
	startLoop();

	document.addEventListener('keydown', checkKeyDown,false);
	document.addEventListener('keyup', checkKeyUp,false);
}

function loop () {
	if (isPlaying) {
		enemyJet.draw();
		mainJet.draw();
		requestAnimFrame(loop);
	}
}

function startLoop () {
	isPlaying = true;
	loop();
}

function stopLoop () {
	isPlaying = false;
}	

function clearBg () {
	ctx.clearRect(0,0,gameWidth,gameHeight);
}


function drawBg() {
	var srcX  = 0,
	    srcY  = 0,
	    drawX = 0,
	    drawY = 0;
	ctx.drawImage(sprite, srcX, srcY, gameWidth, gameHeight, drawX, drawY, gameWidth, gameHeight);
}

// JET

function Jet () {
	this.srcX  = 0;
	this.srcY  = 501;
	this.width = 120;
	this.height = 91;
	this.speed = 2;
	this.drawX = 120;
	this.drawY = 200;
	this.isUpKey = false;
	this.isDownKey = false;
	this.isLeftKey = false;
	this.isRightKey = false;
}

Jet.prototype.draw = function  () {
	clearJet();
	this.checkDirection();
	ctxJet.drawImage(sprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
};

Jet.prototype.checkDirection = function  () {
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

function clearJet () {
	ctxJet.clearRect(0,0,gameWidth,gameHeight);
}

//enemy functions

function Enemy () {
	this.srcX  = 0;
	this.srcY  = 594;
	this.width = 80;
	this.height = 52;
	this.speed = 2;
	this.drawX = Math.floor(Math.random() * 1000) + gameWidth;
	this.drawY = Math.floor(Math.random() * gameHeight);
	this.isUpKey = false;
	this.isDownKey = false;
	this.isLeftKey = false;
	this.isRightKey = false;
}

Enemy.prototype.draw = function  () {
	clearEnemy();
	this.drawX -= this.speed;
	ctxEnemy.drawImage(sprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
};

function clearEnemy () {
	ctxEnemy.clearRect(0,0,gameWidth,gameHeight);
}



// event 
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
