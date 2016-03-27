function SuperMob(x, y, width, height, speed, spawnTime) {
	//call the function Mob, sending it "this" to modify
	Mob.call(this, x, y, width, height, speed, spawnTime);
}
SuperMob.prototype = new Mob();
SuperMob.prototype.constructor = SuperMob;

SuperMob.prototype.update = function(modifier){
	//This gets the function "update" from the Mob prototype (defined in mob.js) and then calls it, using the "this" located here as the "this" in the update function there
	Mob.prototype.update.call(this, modifier);
	
	//accelerate to the player's speed
	if(!(this.speed >= PLAYER_SPEED))
		this.speed += .6;
}