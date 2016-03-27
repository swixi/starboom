var DAMAGE = 10;
var BULLET_SPEED = 500;
var BULLET2_SPEED = 200;
var BULLET_DIAMETER = 6;
var BULLET2_DIAMETER = 12;
var BULLET_COOLDOWN = 300; //in ms

function Bullet(x, y, angle, speed, type) {
	if(type == 1) {
		Entity.call(this, x, y, BULLET_DIAMETER, BULLET_DIAMETER);
		this.image = bulletImage;
	} else if(type == 2) {
		Entity.call(this, x, y, BULLET2_DIAMETER, BULLET2_DIAMETER);
		this.image = bullet2Image;
	}	
	
	this.angle = angle;
	this.speed = speed;
	this.type = type;	
	this.bulletHit = false;
};

Bullet.prototype = new Entity();
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function(modifier){
	//if the bullet is off the screen, remove it
	if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
		this.remove();
	}	
	
	//if this bullet hits a player and is an enemy's bullet
	if (collide(this, player) && this.type == 2) {
		lost = true;
		playerDeath.play();
		this.remove();
		return;
	}
	
	for (var k = 0; k < entities.length; k++) {
		if (collide(this, entities[k]) && entities[k] instanceof Block) {
			this.remove();
			return;
		}
	}
	
	//check for bullets hitting mobs
	for (var j = 0; j < mobs.length; j++) {
		if (collide(this, mobs[j]) && this.type == 1 && mobs[j].loading == false) {
			mobs[j].damage(DAMAGE);
			
			if (mobs[j].health <= 0){
				bloods.push(new Blood(mobs[j].x, mobs[j].y));
				
				if(mobs[j] instanceof Splitter) {
					//if the splitter is in state 1, play the split sound, then create 2 new ones in state 2
					if(mobs[j].state == 1) {
						splitSound.currentTime = 0;
						splitSound.play();
						
						for(var k = 0; k < 2; k++) {
							mobs.push(new Splitter(mobs[j].x-(Math.random()*20), mobs[j].y+(Math.random()*20), SPLITTER_WIDTH, SPLITTER_HEIGHT, SPLITTER_SPEED, Date.now(), 2));
						}
					} else {
						mobDeath.currentTime = 0;
						mobDeath.play();
					}
				} else {
					mobDeath.currentTime = 0;
					mobDeath.play();
				}
				
				mobs.splice(j, 1);
				mobsKilled++;			
			}
			//set bullet to hit if AP is off, so that the bullet will be destroyed
			if (!armorPiercing)
				this.bulletHit = true;
				
			//break after hitting a mob, so that one bullet can't kill two mobs
			break;
		} 
	}
	
	//remove bullet if it hit mob
	if (this.bulletHit) {
		this.remove();
		this.bulletHit = false;
		return;
	}
	
	//update the bullet location
	this.x = this.x + Math.cos(this.angle) * this.speed * modifier;
	this.y = this.y + Math.sin(this.angle) * this.speed * modifier;
}

Bullet.prototype.remove = function(){
	for (var i = 0; i < bullets.length; i++){
		if (bullets[i] == this){
			bullets.splice(i, 1);
			return;
		}
	}
	throw "Bullet marked for deletion was not found in bullets array";
}
