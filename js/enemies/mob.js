var MOB_SPEED_MAX = 80;  //pixels per second
var MOB_SPEED_MIN = 60;
var MOB_SPAWN_RATE = 2000;
var MOB_WIDTH = 30;
var MOB_HEIGHT = 32;

function Mob(x, y, width, height, speed, spawnTime) {
	Enemy.call(this, x, y, width, height, speed, spawnTime);
	this.health = 20;
	this.image = mobImage;
}
Mob.prototype = new Enemy();
Mob.prototype.constructor = Mob;
Mob.prototype.update = function(modifier){
	Enemy.prototype.update.call(this, modifier);
	
	this.target.x = player.x;
	this.target.y = player.y;
}