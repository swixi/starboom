var TURRET_COOLDOWN_1 = 2000;

function Turret(x, y, width, height, speed, spawnTime) {
	Enemy.call(this, x, y, width, height, speed, spawnTime);
	this.health = 20;
	this.image = turretImage;
	this.freeze = true;
	
	this.cooldown = TURRET_COOLDOWN_1;
	this.shootAt = Date.now() + this.cooldown;
}
Turret.prototype = new Enemy();
Turret.prototype.constructor = Turret;

Turret.prototype.render = function(){
	var angle = Math.atan2(player.y - this.y, player.x - this.x);
	
	ctx.save();
	ctx.translate( this.x, this.y );
	ctx.rotate( angle - 1.57 );
	ctx.translate( -18, -18 );
	ctx.drawImage( turretImage, 0, 0 );
	ctx.restore();
}

Turret.prototype.update = function(modifier){
	Enemy.prototype.update.call(this, modifier);
		
	if(Date.now() > this.shootAt) {
		bullets.push(new Bullet(this.x, this.y, Math.atan2(player.y - this.y, player.x - this.x), BULLET2_SPEED, 2));
		bulletSound2.currentTime = 0;
		bulletSound2.play();
		this.shootAt = Date.now() + this.cooldown + Math.random()*1000;
	}
	
}