var PISTOL_COOLDOWN = 100;

function Pistol(){
	this.ammo = 20;
	this.lastFire = Date.now()
	
	this.fire = function(){
		if (Date.now() - this.lastFire < PISTOL_COOLDOWN){
			return;
		}
		
		if (this.ammo == 0){
			return;
		}
		
		bullets.push(generateBullet(1));
		this.lastFire = Date.now();
		this.ammo--;
		bulletSound.currentTime = 0;
		bulletSound.play();
	}
	
	this.getAmmo = function(){
		return this.ammo;
	}
	
	this.giveAmmo = function(ammo){
		this.ammo += ammo;
	}
}