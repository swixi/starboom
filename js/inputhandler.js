var KEY_W = 87;
var KEY_S = 83;
var KEY_A = 65;
var KEY_D = 68;
var KEY_F = 70;
var KEY_T = 84;
var KEY_U = 89;
var KEY_M = 77;
var KEY_ENTER = 13;

function InputHandler(){
	
	this.handle = function(keysDown, modifier){	
		player.vx = 0;
		player.vy = 0;
	
		//move the player
		if(keysDown[KEY_W]) {
			player.vy = -player.speed * modifier;
		}
		if(keysDown[KEY_S]) {
			player.vy = player.speed * modifier;
		}
		if(keysDown[KEY_A]) {
			player.vx = -player.speed * modifier;
		}
		if(keysDown[KEY_D]) {
			player.vx = player.speed * modifier;
		}		
		
		//special options
		if(keysDown[KEY_T]){
			armorPiercing = true;
		}			
		if(keysDown[KEY_U]){
			armorPiercing = false;
		}
		if(keysDown[KEY_M]){
			music.muted = true;
		}						
		if(keysDown[KEY_F]) { 
			for(var i=0; i <mobs.length; i++){
				console.log(i, mobs[i].x, mobs[i].y, mobs[i].width, mobs[i].height);
			}
			for(var i=0; i <bullets.length; i++){
				console.log(i, bullets[i].x, bullets[i].y, mobs[i].width, mobs[i].height);
			}
		}		
		
		//fire if mouse down
		if(mouseDown){
			var weapon = inventory.getSelected();
			if (weapon != 'undefined'){
				inventory.getSelected().fire();				
			}		
		}
	}
}