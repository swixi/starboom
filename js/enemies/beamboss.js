var BEAM_COOLDOWN = 5000;
var CHARGING_DURATION = 500;
var BEAM_BOSS_WIDTH = 70;
var BEAM_BOSS_HEIGHT = 122;

function BeamBoss(x, y, width, height, speed, spawnTime) {
	Enemy.call(this, x, y, width, height, speed, spawnTime);
	this.health = 500;
	this.image = beamBossImage;
	
	this.charging = false;
	this.firing = false;
	this.chargeAt = Date.now() + BEAM_COOLDOWN;
	this.fired = false;
	this.beamAngle = 0;
	this.ready = true; //ready to charge
	this.centerX, this.centerY;
	this.right = this.left = false;
};

BeamBoss.prototype = new Enemy();
BeamBoss.prototype.constructor = BeamBoss;

BeamBoss.prototype.update = function(modifier){
	if((Date.now() - this.spawnTime) < ENEMY_SPAWN_LENGTH){
		return;
	}
	
	this.loading = false;
	
	if ((Date.now() > this.chargeAt) && this.ready) {
		this.charging = true;
		this.chargeUntil = Date.now() + CHARGING_DURATION;
		this.ready = false;
		this.centerX = this.x+this.width/2;
		this.centerY = this.y+this.height/2;
		this.distX = player.centerX()-this.centerX;
		this.distY = player.centerY() - this.centerY;
		
		this.beamAngle = Math.atan2(this.distY, this.distX);
		
		for(var i = 0; i < 2; i++) {
			//create a flier starting at the center of beam boss that heads toward the player's current location
			mobs.push(new Flier(this.centerX, this.centerY, FLIER_WIDTH, FLIER_HEIGHT, ARC_TIME, Date.now(), Math.sqrt((this.distX*this.distX) + (this.distY*this.distY))/2, this.beamAngle, -1 + 2*i));
			console.log(this.distX, this.distY, Math.sqrt((this.distX*this.distX) + (this.distY*this.distY))/2);
		}
		flyingSound.currentTime = 0;
		flyingSound.play();
	}
	
	if (this.charging){	
		//simulate "shaking" of beam boss as he charges
		if (this.left) {
			this.x += 6;
			this.y += 6;
			this.left = false;
			this.right = true;
		} else if (this.right) {
			this.x -= 6;
			this.y -= 6;
			this.right = false;
			this.left = true;
		} else {
			this.x -= 3;
			this.y -= 3;
			this.left = true;
		}
		
	
		//if the charging period is over
		if (Date.now() > this.chargeUntil){
			this.charging = false;
			this.firing = true;
			//fire the beam for beam_duration ms, then start moving again
			this.fireUntil = Date.now() + BEAM_DURATION;	
			this.fired = false;
		}
	} 
	//this is not done as an if, else if, else since the fire code should be called immediately after firing is set to true
	if (this.firing) {
		if (!this.fired) {
			bullets.push(new Beam(this.x+this.width/2, this.y+this.height/2, canvas.width, 50, this.beamAngle));
			beamSound.currentTime = 0;
			beamSound.play();
			this.fired = true;
		}
		
		
		if (Date.now() > this.fireUntil) {
			//after firing is over, reset everything, set a new charge date
			this.firing = false;
			this.fireDuration = 0;
			this.chargeAt = Date.now() + BEAM_COOLDOWN;
			this.ready = true;
			this.right = this.left = false;
		}
	} 

	if (!(this.firing || this.charging)) {
		var mobCoords = calculateCoords(this.x, this.y, player.x, player.y, this.speed, modifier);
		this.x = mobCoords[0];
		this.y = mobCoords[1];	
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
}
