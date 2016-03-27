var PLAYER_SPEED = 200;

function Player(){
	this.speed = PLAYER_SPEED; 
	this.x = 0;
	this.y = 0;
	this.vx = 0;	
	this.vy = 0;	
	this.width = 32;
	this.height = 32;
	
	this.update = function(modifier){		
		//move in x direction and check for collision
		this.x += this.vx;	
		for (var i = 0; i < entities.length; i++) {
			if (collide(this, entities[i])) {
				//can probably put break after both of these, but just to be safe, keep the loop running after hitting an ammo container
				if(entities[i] instanceof Block) {
					this.x -= this.vx;
					break;
				}
				else if(entities[i] instanceof Ammo) {
					entities.splice(i, 1);
					giveAmmo();
					i--;
				}
			}
		}
		
		//move in y direction and check for collision
		this.y += this.vy;
		for (var i = 0; i < entities.length; i++) {
			if (collide(this, entities[i])) {
				//can probably put break after both of these, but just to be safe, keep the loop running after hitting an ammo container
				if(entities[i] instanceof Block) {
					this.y -= this.vy;
					break;
				}
				else if(entities[i] instanceof Ammo) {
					entities.splice(i, 1);
					giveAmmo();
					i--;
				}
			}
		}
		
		//Adjust player if the player runs through a wall
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
};

Player.prototype.centerX = function() {
	return this.x + this.width/2;
}

Player.prototype.centerY = function() {
	return this.y + this.height/2;
}