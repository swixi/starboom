function Entity(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.image = missingImage;
};

Entity.prototype.update = function(modifier){};
Entity.prototype.render = function(){
	ctx.drawImage(this.image, this.x, this.y)
}