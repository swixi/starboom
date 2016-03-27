FLIER_WIDTH = 32;
FLIER_HEIGHT = 72;
ARC_TIME = 2; //total time to travel a full circle


function Flier(x, y, width, height, speed, spawnTime, radius, angle, orientation) {
	Enemy.call(this, x, y, width, height, speed, spawnTime);
	this.radius = radius;
	this.angle = angle;
	this.orientation = orientation; //1 or -1, determines which direction the flier flies
	this.health = 20;

	//the arc center is the midpoint between the initial coords and the target
	this.arcCenterX = x + radius * Math.cos(this.angle);
	this.arcCenterY = y + radius * Math.sin(this.angle);
	this.timeScaled = Math.PI;
	this.timeElapsed = 0;
	this.image = flierImage;
}
Flier.prototype = new Enemy();
Flier.prototype.constructor = Flier;

Flier.prototype.update = function(modifier) {
	this.loading = false;
	
	this.timeElapsed = Date.now() - this.spawnTime;
	
	//after a second, modifier will have contributed a total of 1
	//dividing by this.speed will make it move around the arc in speed amount of seconds
	this.timeScaled += 2 * Math.PI * modifier / this.speed;
	//if the flier has traveled half of a circle, from PI to 2PI, kill it off
	if(this.timeScaled >= 2*Math.PI) {
		for (var i = 0; i < mobs.length; i++){
			if (mobs[i] == this){
				mobs.splice(i, 1);
				flyingSound.pause();
				return;
			}
		}
		throw "mob marked for deletion was not found in mobs array";
	}	
	
	//if the player touches a mob
	if (collide(this, player)) {
		lost = true;
		playerDeath.play();
	}
	
	//Adjust monster if the monster runs through a wall
	if(this.x <= 38){
		this.x = 38;
	}
	if(this.y <= 38){
		this.y = 38;
	}
	if(this.x >= (canvas.width - this.width - 38)){
		this.x = canvas.width - this.width - 38;
	}
	if(this.y >= (canvas.height - this.height - 38)){
		this.y = canvas.height - this.height - 38;	
	}
	
	//parametrize the flier around a circle centered at the arc center with the given radius
	this.x = this.radius*Math.cos(this.orientation * this.timeScaled);
	this.y = this.radius*Math.sin(this.orientation * this.timeScaled);
}

Flier.prototype.render = function(modifier) {
	ctx.save();
	ctx.translate(this.arcCenterX, this.arcCenterY);
	ctx.rotate(this.angle);
	ctx.drawImage(this.image, this.x, this.y);
	ctx.restore();
}