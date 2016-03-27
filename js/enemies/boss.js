var CHARGE_SPEED = 250;

function Boss(x, y, width, height, speed, spawnTime) {
	Enemy.call(this, x, y, width, height, speed, spawnTime);
	this.health = 300;
	this.image = mobImage;
	
	this.charging = false;
	this.chargeAngle = 0;
	this.chargeDistance = 0;
	this.chargeAt = Date.now() + 5000;
};

Boss.prototype = new Enemy();
Boss.prototype.constructor = Boss;

Boss.prototype.update = function(modifier){
	if((Date.now() - this.spawnTime) < ENEMY_SPAWN_LENGTH){
		return;
	}
	
	this.loading = false;
	
	if (this.charging){
		if (this.chargeDistance == 0){				
			this.chargeAngle = Math.atan2(player.y-this.y, player.x-this.x);
			bossSpawnedSound.currentTime = 0;
			bossSpawnedSound.play();
			spawnMobs(3);
		}
		
		this.x += CHARGE_SPEED*Math.cos(this.chargeAngle)*modifier;
		this.y += CHARGE_SPEED*Math.sin(this.chargeAngle)*modifier;
		this.chargeDistance += CHARGE_SPEED*modifier;
		
		if (this.chargeDistance > 200){
			this.charging = false;
			this.chargeDistance = 0;
			this.chargeAt = Date.now() + 2500;
		}
	}else{
		var mobCoords = calculateCoords(this.x, this.y, player.x, player.y, this.speed, modifier);
		this.x = mobCoords[0];
		this.y = mobCoords[1];	
	}
		
	//if the player touches a mob
	if (collide(this, player)) {
		lost = true;
	}	
	
	if (Date.now() > this.chargeAt){
		this.charging = true;
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

Boss.prototype.render = function(modifier){
	//if the mob is still spawning, only draw a scaled version of the mob
	if((Date.now() - this.spawnTime) < ENEMY_SPAWN_LENGTH) {
		ratio = (Date.now() - this.spawnTime)/ENEMY_SPAWN_LENGTH;
		ctx.drawImage(mobImage, 0, 0, MOB_WIDTH * ratio, MOB_HEIGHT, this.x, this.y, ratio * this.width, this.height);
	}else{
		ctx.drawImage(mobImage, this.x, this.y, this.width, this.height);
	}
}





