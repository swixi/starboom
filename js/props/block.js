var BLOCK_WIDTH = 32;
var BLOCK_HEIGHT = 32;

function Block(x, y, width, height) {
	Entity.call(this, x, y, width, height);
	this.image = blockImage;
};

Block.prototype = new Entity();
Block.prototype.constructor = Block;