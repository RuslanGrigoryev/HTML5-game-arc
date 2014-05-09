var canvasBg = document.getElementById('canvas'),
	canvasJet = document.getElementById('canvasJet'),
	canvasEnemy = document.getElementById('canvasEnemy'),

    ctxBg      = canvasBg.getContext('2d'),
    ctxJet      = canvasJet.getContext('2d'),
    ctxEnemy      = canvasEnemy.getContext('2d'),

    clearCanvasBtn = document.getElementById('clearCanvasBtn'),
    imgSprite   = new Image(),
    gameWidth = canvasBg.width,
    gameHeight = canvasBg.height,

    isPlaying = false,
    requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame,
    jet1 = new Jet(),
    btnPlay = new Button(325, 500, 225, 280);
    enemies = [],
    spawnAmount = 1,
    mouseX = 0,
    mouseY = 0;
imgSprite.src = "i/sprite.png";
imgSprite.addEventListener('load', init, false);

// main functions

function init() {
    spawnEnemy(5);
    drawMenu();
    document.addEventListener('click', mouseClicked, false);
}

function playGame () {
    drawBg();
    startLoop();
    document.addEventListener('keydown', checkKeyDown, false);
    document.addEventListener('keyup', checkKeyUp, false);
}

function spawnEnemy(number) {
    for (var i = 0; i < number; i++) {
        enemies[enemies.length] = new Enemy();
    }
}

function drawAllEnemies() {
    clearCtxEnemy();
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].draw();
    }
}

function loop() {
    if (isPlaying) {
        jet1.draw();
        drawAllEnemies();
        requestAnimFrame(loop);
    }
}

function startLoop() {
    isPlaying = true;
    loop();
}

function stopLoop() {
    isPlaying = false;
}

function drawBg() {
    ctxBg.drawImage(imgSprite, 0, 0, gameWidth, gameHeight,0, 0, gameWidth, gameHeight);
}

function drawMenu() {
    ctxBg.drawImage(imgSprite, 0, 700, gameWidth, gameHeight,0, 0, gameWidth, gameHeight);
}

function clearCtxBg() {
    ctxBg.clearRect(0, 0, gameWidth, gameHeight);
}

function mouseClicked (e) {
	mouseX = e.pageX - canvasBg.offsetLeft;
	mouseY = e.pageY - canvasBg.offsetTop;
	if ( btnPlay.checkClicked()) {
		playGame();
	}
}

// end of main functions






/*Button functions start*/

function Button (xL, xR, yT, yB) {
	this.xLeft = xL; // левая граница кнопки
	this.xRight = xR; // правая граница кнопки
	this.yTop = yT; // верхняя граница кнопки
	this.yBottom = yB; // нижняя граница кнопки
}

Button.prototype.checkClicked = function () {

	if (this.xLeft <= mouseX && mouseX <= this.xRight && this.yTop <= mouseY &&  mouseY <= this.yBottom) {
		return true;
	}
};
/*Button functions end*/











// jet functions

function Jet () {
    this.srcX  = 0;
    this.srcY  = 501;
    this.width = 120;
    this.height = 91;
    this.speed = 4;
    this.drawX = 110;
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

Jet.prototype.draw = function() {
    clearCtxJet();
    this.checkDirection();
    this.noseX = this.drawX + 40;
    this.noseY = this.drawY + 40;
    this.checkShooting();
    this.drawAllBullets();
    ctxJet.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
};

Jet.prototype.checkDirection = function() {
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

Jet.prototype.drawAllBullets = function() {
    for (var i = 0; i < this.bullets.length; i++) {
        if (this.bullets[i].drawX >= 0) this.bullets[i].draw();
        if (this.bullets[i].explosion.hasHit) this.bullets[i].explosion.draw();
    }
};

Jet.prototype.checkShooting = function() {
    if (this.isSpacebar && !this.isShooting) {
        this.isShooting = true;
        this.bullets[this.currentBullet].fire(this.noseX, this.noseY);
        this.currentBullet++;
        if (this.currentBullet >= this.bullets.length) this.currentBullet = 0;
    } else if (!this.isSpacebar) {
        this.isShooting = false;
    }
};

function clearCtxJet() {
    ctxJet.clearRect(0, 0, gameWidth, gameHeight);
}

// end of jet functions















// bullet functions

function Bullet() {
    this.srcX = 120;
    this.srcY = 500;
    this.drawX = -20;
    this.drawY = 0;
    this.width = 13;
    this.height = 8;
    this.explosion = new Explosion();
}

Bullet.prototype.draw = function() {
    this.drawX += 3;
    ctxJet.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
    this.checkHitEnemy();
    if (this.drawX > gameWidth) this.recycle();
};

Bullet.prototype.fire = function(startX, startY) {
    this.drawX = startX;
    this.drawY = startY;
};

Bullet.prototype.checkHitEnemy = function() {
    for (var i = 0; i < enemies.length; i++) {
        if (this.drawX >= enemies[i].drawX &&
            this.drawX <= enemies[i].drawX + enemies[i].width &&
            this.drawY >= enemies[i].drawY &&
            this.drawY <= enemies[i].drawY + enemies[i].height) {
                this.explosion.drawX = enemies[i].drawX - (this.explosion.width / 2);
                this.explosion.drawY = enemies[i].drawY;
                this.explosion.hasHit = true;
                this.recycle();
                enemies[i].recycleEnemy();
        }
    }
};

Bullet.prototype.recycle = function() {
    this.drawX = -20;
};


// end of bullet functions



// explosion functions

function Explosion() {
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

Explosion.prototype.draw = function() {
    if (this.currentFrame <= this.totalFrames) {
        ctxJet.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
        this.currentFrame++;
    } else {
        this.hasHit = false;
        this.currentFrame = 0;
    }
};


// end of explosion functions












// enemy functions

function Enemy() {
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

Enemy.prototype.draw = function() {
    this.drawX -= this.speed;
    ctxEnemy.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
    this.checkEscaped();
};

Enemy.prototype.checkEscaped = function() {
    if (this.drawX + this.width <= 0) {
        this.recycleEnemy();
    }
};

Enemy.prototype.recycleEnemy = function() {
    this.drawX = Math.floor(Math.random() * 1000) + gameWidth;
    this.drawY = Math.floor(Math.random() * 360);
};

function clearCtxEnemy() {
    ctxEnemy.clearRect(0, 0, gameWidth, gameHeight);
}

// end enemy functions















// event functions

function checkKeyDown(e) {
    var keyID = e.keyCode || e.which;
    if (keyID === 38 || keyID === 87) { //up arrow or W key
        jet1.isUpKey = true;
        e.preventDefault();
    }
    if (keyID === 39 || keyID === 68) { //right arrow or D key
        jet1.isRightKey = true;
        e.preventDefault();
    }
    if (keyID === 40 || keyID === 83) { //down arrow or S key
        jet1.isDownKey = true;
        e.preventDefault();
    }
    if (keyID === 37 || keyID === 65) { //left arrow or A key
        jet1.isLeftKey = true;
        e.preventDefault();
    }
    if (keyID === 32) { //spacebar
        jet1.isSpacebar = true;
        e.preventDefault();
    }
}

function checkKeyUp(e) {
    var keyID = e.keyCode || e.which;
    if (keyID === 38 || keyID === 87) { //up arrow or W key
        jet1.isUpKey = false;
        e.preventDefault();
    }
    if (keyID === 39 || keyID === 68) { //right arrow or D key
        jet1.isRightKey = false;
        e.preventDefault();
    }
    if (keyID === 40 || keyID === 83) { //down arrow or S key
        jet1.isDownKey = false;
        e.preventDefault();
    }
    if (keyID === 37 || keyID === 65) { //left arrow or A key
        jet1.isLeftKey = false;
        e.preventDefault();
    }
    if (keyID === 32) { //spacebar
        jet1.isSpacebar = false;
        e.preventDefault();
    }
}

// end of event functions