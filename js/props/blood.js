var BLOOD_WIDTH = 26;
var BLOOD_HEIGHT = 28;
var SIZE = 9;
var RATE = 70;

function Blood(x, y){
	
	this.x = x;
	this.y = y;
	this.start = Date.now();
	this.remove = false;
	
	this.update = function(){
		if (Math.floor((Date.now()-this.start)/RATE) > SIZE){
			this.remove = true;
		}
	}
	
	this.render = function(){
		var t = Math.floor((Date.now()-this.start)/RATE);
		ctx.drawImage(bloodSprite, BLOOD_WIDTH*t, 0, BLOOD_WIDTH, BLOOD_HEIGHT, this.x, this.y, BLOOD_WIDTH, BLOOD_HEIGHT);
	}
}