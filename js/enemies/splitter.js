var MIN_DIST_FROM_PLAYER = 150;
var SPLITTER_SPEED = 100;
var SPLITTER_COOLDOWN_1 = 2000;
var SPLITTER_COOLDOWN_2 = 4000;
var SPLITTER_WIDTH = 60;
var SPLITTER_HEIGHT = 45;

function Splitter(x, y, width, height, speed, spawnTime, state) {
	Enemy.call(this, x, y, width, height, speed, spawnTime);
	this.state = state; //1 = first stage, 2 = split stage
	this.movingTowardPlayer = false;
	this.angle = 0;
	this.distanceFromPlayer = 0;
	this.running = false;
	this.direction = 0; //0 = no direction, 1 = x, 2 = y
	this.image = splitterImage;
	
	if(this.state == 1) {
		this.health = 30;
		this.cooldown = SPLITTER_COOLDOWN_1;
	} else {
		this.health = 10;
		this.cooldown = SPLITTER_COOLDOWN_2;
		this.width = this.width/2;
		this.height = this.height/2;
	}
	
	this.shootAt = Date.now() + this.cooldown;
};

Splitter.prototype = new Enemy();
Splitter.prototype.constructor = Splitter;

Splitter.prototype.render = function(modifier) {
	if(this.state == 1) {
		Enemy.prototype.render.call(this, modifier);
	} else {
		//if state == 2, then width and height have been halved
		ctx.drawImage(splitterImage, this.x, this.y, this.width, this.height);
	}
}

Splitter.prototype.update = function(modifier){	
	Enemy.prototype.update.call(this, modifier);	
			
	if(Date.now() > this.shootAt) {
		bullets.push(new Bullet(this.x, this.y, Math.atan2(player.y - this.y, player.x - this.x), BULLET2_SPEED, 2));
		bulletSound2.currentTime = 0;
		bulletSound2.play();
		this.shootAt = Date.now() + this.cooldown;
	}
	
	//is creating a new var here inefficient?
	var distX = player.x - this.x;
	var distY = player.y - this.y;
	this.angle = Math.atan2(distY, distX);
	this.distanceFromPlayer = Math.sqrt((distX*distX) + (distY*distY));
	
	//if the player gets close
	if(this.distanceFromPlayer <= MIN_DIST_FROM_PLAYER) {
		running = true;
		this.direction = 0;
	} else {
		running = false;
	}
	
	//if the player gets close enough, move away at the angle of the player relative to splitter
	if(running) {
		this.x -= this.speed * Math.cos(this.angle) * modifier;
		this.y -= this.speed * Math.sin(this.angle) * modifier;
	} else {
		//set a new direction randomly
		if(this.direction == 0) {
			if(Math.random() * 2 > 1) {
				this.direction = 1;
			} else {
				this.direction = 2;
			}
		}		
		//without the distX > 1 condition, the splitter gets very jittery
		if(this.direction == 1 && Math.abs(distX) > 1) {
			this.x += this.speed * modifier * (distX/Math.abs(distX));
		}
		if(this.direction == 2 && Math.abs(distY) > 1) {
			this.y += this.speed * modifier * (distY/Math.abs(distY));
		}
	}
}
