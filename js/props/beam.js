var BEAM_DURATION = 1000;

function Beam(x, y, width, height, angle) {
	Entity.call(this, x, y, width, height);
	this.angle = angle;	
	this.dieAt = Date.now() + BEAM_DURATION;
};

Beam.prototype = new Entity();
Beam.prototype.constructor = Beam;

Beam.prototype.update = function(modifier){	
	/*if (collide(this, player)) {
		lost = true;
		playerDeath.play();
	}*/
	
	if (Date.now() > this.dieAt) {
		this.remove();
	}
}

Beam.prototype.render = function(modifier) {
	var midX = canvas.width / 2;
	var midY = canvas.height / 2;

	//this may not be very efficient
	ctx.save();
	ctx.translate(this.x, this.y);
	ctx.rotate(this.angle);
	ctx.fillStyle = "red";
	//center the rectangle
	ctx.fillRect(0, -this.height/2, this.width, this.height);
	ctx.fillStyle = "white";
	ctx.fillRect(0, -this.height/10, this.width, this.height/5);
	ctx.restore();
}

Beam.prototype.remove = function(){
	for (var i = 0; i < bullets.length; i++){
		if (bullets[i] == this){
			bullets.splice(i, 1);
			return;
		}
	}
	throw "Bullet marked for deletion was not found in bullets array";
}