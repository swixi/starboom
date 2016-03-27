var AMMO_WIDTH = 32;
var AMMO_HEIGHT = 32;
var AMMO_SPAWN_RATE = 5000;
var AMMO_MAX = 20;

function Ammo(x, y, width, height) {
	Entity.call(this, x, y, width, height);
	this.image = ammoImage;
};

Ammo.prototype = new Entity();
Ammo.prototype.constructor = Ammo;