function Bouncer(x, y, width, height, speed, spawnTime) {
	Enemy.call(this, x, y, width, height, speed, spawnTime);
	this.speed = speed;
	this.spawnTime = spawnTime;
	
	this.bouncing = false;
	this.angle = 0;
	this.distance = 0;
	this.bounceAt = Date.now() + 1000;
	
	this.image = bouncerImage;
}
Bouncer.prototype = new Enemy();
Bouncer.prototype.constructor = Bouncer;

Bouncer.prototype.update = function(modifier){
	Enemy.prototype.update.call(this, modifier);
	
	if (this.bouncing){
		if (this.distance == 0){				
			this.angle = Math.random()*6.14;
		}
		
		this.target.x = this.x + 10*Math.cos(this.angle)*modifier;
		this.target.y = this.y + 10*Math.sin(this.angle)*modifier;
		this.distance += 50*modifier;
		
		if (this.distance > 50){
			this.bouncing = false;
			this.distance = 0;
			this.bounceAt = Date.now() + Math.random()*500+500;
			this.freeze = true;
		}
	}		
	
	if (Date.now() > this.bounceAt){
		this.bouncing = true;
		this.freeze = false;
	}	
}
