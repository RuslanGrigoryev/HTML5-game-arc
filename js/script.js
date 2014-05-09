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
    mainJet = new Jet(),
    enemies = [],
    spawnAmount = 1;

clearCanvasBtn.addEventListener('click', clearBg, false);
sprite.src = "i/sprite.png";
sprite.addEventListener('load', init, false);

// INITIALIZATION 
function init () {
	spawnEnemy(spawnAmount);
	drawBg();
	startLoop();
	document.addEventListener('keydown', checkKeyDown,false);
	document.addEventListener('keyup', checkKeyUp,false);
}

function spawnEnemy (num) {
	for (var i = 0; i < num; i++) {
		enemies[enemies.length] = new Enemy();
	}
}

function drawAllEnemies () {
	clearEnemy();
	for ( var i = 0 ; i < enemies.length; i++) {
		enemies[i].draw();
	}
}

function loop () {
	if (isPlaying) {
		mainJet.draw();
		drawAllEnemies();
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
	this.speed = 4;
	this.drawX = 120;
	this.drawY = 200;
	this.noseX = this.drawX + 40;
	this.noseY = this.drawY + 40;
	this.isUpKey = false;
	this.isDownKey = false;
	this.isLeftKey = false;
	this.isRightKey = false;
	this.isSpaceBar = false;
	this.isShooting = false;
	this.bullets = [];
	this.currentBullet = 0;
	for (var i = 0; i < 15; i++) {
		this.bullets[this.bullets.length] = new Bullet();
	}
}

Jet.prototype.draw = function  () {
	clearJet();
	this.checkDirection();
	this.noseX = this.drawX + 40;
	this.noseY = this.drawY + 40;
	this.checkShooting();
	this.drawAllBullets();
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

Jet.prototype.drawAllBullets = function () {
	for ( var i = 0; i < this.bullets.length; i++) {
		if ( this.bullets[i].drawX >= 0) {
			this.bullets[i].draw();
		}
		if (this.bullets[i].explosion.hasHit) {
			this.bullets[i].explosion.draw();
		}
	}
}

Jet.prototype.checkShooting = function () {
	if (this.isSpaceBar && !this.isShooting) {
		this.isShooting = true;
		this.bullets[this.currentBullet].fire(this.noseX, this.noseY);
		this.currentBullet++;
		if (this.currentBullet >= this.bullets.length) {
			this.currentBullet = 0;
		} else if (!this.isSpaceBar) {
			this.isShooting = false;
		}
	}
}

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
	this.drawX -= this.speed;
	ctxEnemy.drawImage(sprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
	this.checkEscaped();
};

Enemy.prototype.checkEscaped = function  () {
	if ( ( this.drawX + this.width )<= 0 ) {
		this.recycleEnemy();
	}
};

Enemy.prototype.recycleEnemy= function  () {
	this.drawX = Math.floor(Math.random() * 1000) + gameWidth;
	this.drawY = Math.floor(Math.random() * gameHeight);
};

function clearEnemy () {
	ctxEnemy.clearRect(0,0,gameWidth,gameHeight);
}

// bullet functions

function Bullet () {
	this.srcX = 120;
	this.srcY = 500;
	this.drawX = -20;
	this.drawY = 0;
	this.width = 7;
	this.height = 7;
	this.explosion = new Explosion();
}

Bullet.prototype.draw = function () {
	this.drawX += 3;
	ctxJet.drawImage(sprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
	this.checkHitEnemy();
	if ( this.drawX > gameWidth ) {
		this.drawX = -20;
	}
}

Bullet.prototype.fire = function (startX, startY) {
	this.drawX = startX;
	this.drawY = startY;
}

Bullet.prototype.recycle = function (startX, startY) {
	this.drawX = -20;
}

Bullet.prototype.checkHitEnemy = function (startX, startY) {
	for ( var i = 0 ; i < enemies.length; i++) {
		if (this.drawX >= enemies[i].drawX &&
		    this.drawX <= enemies[i].drawX + enemies[i].width &&
		    this.drawY >= enemies[i].drawY &&
		    this.drawY <= enemies[i].drawY + enemies[i].height ) 
		{
			this.explosion.drawX = enemies[i].drawX - (this.explosion.width / 2);
			this.explosion.drawY = enemies[i].drawY;
			this.explosion.hasHit = true;
			this.recycle();
			enemies[i].recycleEnemy();
		}
	}
}

// Explosion functions 

function Explosion () {
	this.srcX = 782;
	this.srcY = 502;
	this.drawX = 0;
	this.drawY = 0;
	this.width = 18;
	this.height = 14;
	this.currentFrame = 0;
	this.totalFrames = 10;
	this.hasHit = false;
}

Explosion.prototype.draw = function () {
	if ( this.currentFrame <= this.totalFrames ) {
       //draw explosion
       ctxJet.drawImage(sprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
        this.currentFrame++;
	} else {
		this.hasHit = false;
		this.currentFrame = 0;
	}
};

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
    if (keyId === 32) {
    	mainJet.isSpaceBar = true;
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
    if (keyId === 32) {
    	mainJet.isSpaceBar = true;
    	e.preventDefault();
    }
}
