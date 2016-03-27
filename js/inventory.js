var NUM_SLOTS = 2;

function Inventory(){
	this.selected = 0;
	this.slots = new Array();
	
	this.getSelected = function(){
		return this.slots[this.selected];
	}
	
	this.select = function(select){
		this.selected = select;
	}
	
	this.equip = function(weapon){
		var equipped = false;
		for (var i = 0; i < NUM_SLOTS; i++){
			if (this.slots[i] == this.getSelected()){
				this.drop(this.getSelected());
				this.slots[i] = weapon;
			}
		}
	}
	
	this.drop = function(weapon){	
		for (var i = 0; i < NUM_SLOTS; i++){
			if (this.slots[i] == weapon){
				this.slots[i] = 'undefined';
				//add the weapon to the world
				
				break;
			}
		}
	}
	
	this.render = function(){
		for (var i = 0; i < NUM_SLOTS; i++){
			if (this.slots[i] == 'undefined'){
				ctx.fillStyle="#FFFFFF";
			}else if (this.slots[i] == 1){
				ctx.fillStyle="#FF00FF";
			}else{
				ctx.fillStyle="#000000";
			}
			
			ctx.fillRect(300+i*20, 20, 50, 50);
		}
	}
}