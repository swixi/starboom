var ENEMY_SPAWN_LENGTH = 2000;

function Enemy(x, y, width, height, speed, spawnTime) {
	Entity.call(this, x, y, width, height);
	this.speed = speed;
	this.spawnTime = spawnTime;
	this.health = 20;
	this.loading = true;
	this.target = {x: 0, y: 0};
	this.freeze = false;
}

Enemy.prototype = new Entity();
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function(modifier){	
	if((Date.now() - this.spawnTime) < ENEMY_SPAWN_LENGTH){
		return;
	}
	
	this.loading = false;
	
	if (!this.freeze){
		var mobCoords = calculateCoords(this.x, this.y, this.target.x, this.target.y, this.speed, modifier);
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

Enemy.prototype.damage = function(damage){
	this.health -= damage;
}	

Enemy.prototype.getTarget = function(){
	return target;
}

Enemy.prototype.render = function(modifier){	
	//if the mob is still spawning, only draw a scaled version of the mob
	if((Date.now() - this.spawnTime) < ENEMY_SPAWN_LENGTH) {
		ratio = (Date.now() - this.spawnTime)/ENEMY_SPAWN_LENGTH;
		ctx.drawImage(this.image, 0, 0, ratio * this.width , this.height, this.x, this.y, ratio * this.width, this.height);
	}else{
		Entity.prototype.render.call(this, modifier);
	}
}	


	



