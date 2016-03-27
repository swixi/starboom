var SPAWN_AMOUNT = 5;
var WAVES_PER_ROOM = 1;
var wave = WAVES_PER_ROOM;
var cleared = false;


addEventListener("keydown", function (e) {keysDown[e.keyCode] = true;}, false);
addEventListener("keyup", function (e) {keysDown[e.keyCode] = false;}, false);
addEventListener("mousedown", function (e) {
	mouseDown = true;
}, false);
addEventListener("mouseup", function (e) {mouseDown = false;}, false);
addEventListener("mousemove", function (e) {mouseX = e.clientX; mouseY = e.clientY;}, false);


function main() {
	var now = Date.now();
	var change = now - then;
	
	fpsTick += change;
	if (fpsTick >= 500){
		fps = 1000/change;
		fpsTick = 0;
	}
	
	if (music.currentTime >= music.duration-.7 ){
		music.currentTime = 0;
	}
	
	if (bossFight.currentTime >= bossFight.duration ){
		bossFight.currentTime = 0;
	}
	
	if (mobs.length == 0 && !wave){
		if (!cleared){
			roomCleared.play();
		}
		
		if (boss){
			bossSpawned = false;
			bossFight.pause();
			bossFight.currentTime = 0;
			music.play();
		}
		
		cleared = true;
		map[mi][mj] = 5;
	}else{
		cleared = false;
	}
		
	
	/*if (lost || won) {
		clearInterval(timer);
		if(keysDown[KEY_ENTER]) {
			lost = false;
			won = false;
			reset();
			then = now;
			return;
		}
	}	*/	
	
	//if(!(lost || won)) {
		update(change/1000);
		
		timeSinceLastSpawn += change;
		//spawn mobs if enough time has passed and there are still waves remaining
		if (timeSinceLastSpawn >= MOB_SPAWN_RATE && wave){
			if(boss) {
				spawnMobs(1);
			} else {
				spawnMobs(SPAWN_AMOUNT);
			}
			timeSinceLastSpawn = 0;
			wave--;
		}
		
		timeSinceLastAmmo += change;
		if (timeSinceLastAmmo >= AMMO_SPAWN_RATE && !cleared){
			entities.push(generateEntity("ammo"));
			timeSinceLastAmmo = 0;
		}
	//}
	
	render();
	then = now;
}

function update(modifier) {
				
	inputhandler.handle(keysDown, modifier);
	
	player.update(modifier);
			
	for (var i = 0; i < bloods.length; i++){
		bloods[i].update();
	}
	
	for (var i = 0; i < bloods.length; i++){
		if (bloods[i].remove){
			bloods.splice(i, 1);
			i--;
		}	
	}
			
	//loop through all mobs and update their coords
	for (var i = 0; i < mobs.length; i++){
		mobs[i].update(modifier);
	}
		
	//loop through all bullets on the map
	for(var i = 0; i < bullets.length; i++){
		bullets[i].update(modifier);
	}
	
	//check for near door
	if (cleared){
		if (mi+1 < 5 && map[mi+1][mj]){
			if (collide(player, new Entity(300, 600, 40, 40))){
				moveToRoom(mi+1, mj);
			}
		}
		if (mi-1 >= 0 && map[mi-1][mj]){
			if (collide(player, new Entity(300, 0, 40, 40))){
				moveToRoom(mi-1, mj);
			}
		}
		if (mj+1 < 5 && map[mi][mj+1]){
			if (collide(player, new Entity(600, 300, 40, 40))){
				moveToRoom(mi, mj+1);
			}
		}
		if (mj-1 >= 0 && map[mi][mj-1]){
			if (collide(player, new Entity(0, 300, 40, 40))){
				moveToRoom(mi, mj-1);
			}
		}
	}
}

function render() {
	ctx.drawImage(bgImage,0,0);
	
	for(var i = 0; i< bullets.length; i++){
		bullets[i].render();
	}	
	
	playerImage.style.opacity = .2;
	ctx.drawImage(playerImage, player.x, player.y);
	
	for (var i = 0; i < bloods.length; i++){
		bloods[i].render();
	}
		
	for(var i = 0; i < entities.length; i++) {
		entities[i].render();
	}
	
	for(var i = 0; i < mobs.length; i++){
		mobs[i].render();
	}
	
	ctx.fillStyle = "white";
	ctx.font = "16px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Killed: " + mobsKilled, 2, 2);
	ctx.fillText("Time: " + time, 2, 20);
	ctx.fillText("FPS: " + Math.floor(fps), 2, 38);
	ctx.fillText("Ammo: " + inventory.getSelected().getAmmo(), 2, 56);
	ctx.fillText("AP: " + armorPiercing, 2, 74);
	
	ctx.textAlign = "center";
	if(lost){
		ctx.fillText("You lost! Press enter to try again.", canvas.width/2,canvas.height/2);
	}
	if(won){
		ctx.fillText("You won in " + time + " seconds. Press enter to play again.", canvas.width/2,canvas.height/2);
	}
	
	ctx.fillText(mobs.length+" "+cleared+" "+wave, 300, 300);
		
	//render doors
	if (cleared){
		if (mi+1 < 5 && map[mi+1][mj]){
			ctx.fillStyle="#FF0000";
			ctx.drawImage(open1, 300, 600);
		}	
		if (mi-1 >= 0 && map[mi-1][mj]){
			ctx.fillStyle="#FF0000";
			ctx.drawImage(open1, 300, 0);		
		}	
		if (mj+1 < 5 && map[mi][mj+1]){	
			ctx.fillStyle="#FF0000";
			ctx.drawImage(open1, 600, 300);
		}	
		if (mj-1 >= 0 && map[mi][mj-1]){
			ctx.fillStyle="#FF0000";
			ctx.drawImage(open1, 0, 300);	
		}
	}
	
	//draw mini-map
	for (var i = 0; i < 5; i++){
		for (var j = 0; j < 5; j++){
			if (i == mi && j == mj){				
				ctx.fillStyle="#FFFF00";
			}else if (map[i][j] == 0){
				ctx.fillStyle="#FFFFFF";
			}else if (map[i][j] == 3){
				ctx.fillStyle="00FFFF";
			}else if (map[i][j] == 2){
				ctx.fillStyle="#00FF00";				
			}else{
				ctx.fillStyle="#FF00FF";
			}
			ctx.fillRect(500+j*20, 20+i*20, 20, 20);
		}
	}
}

function moveToRoom(i, j){
	mi = i;
	mj = j;
	player.x = canvas.width/2 - player.width/2;
	player.y = canvas.height/2 - player.height/2;
	
	//clear all blocks, then generate new ones
	removeEntity(Block);
	var numBlocks = 3 + Math.floor(Math.random() * 3);
	for(var k = 0; k < numBlocks; k++){
		entities.push(generateEntity("block"));
	}
	
	//if the room has already been cleared
	if (map[i][j] == 5){
		return;
	}
	
	wave = WAVES_PER_ROOM;
	boss = false;
	
	if (map[i][j] == 3){
		boss = true;
		music.pause();
		music.currentTime = 0;
		bossFight.play();
	}
	
	cleared = false;
}

function giveAmmo() {
	inventory.getSelected().giveAmmo(12);
}

//This will remove all instances of the given entity from entities
function removeEntity(entityType) {
	for(var i = 0; i < entities.length; i++){
		if(entities[i] instanceof entityType) {
			entities.splice(i,1);
			i--;
		}
	}
}

//you can put other lines in the function called in set interval and they will be updated every second
function resetTimer() {
	time = 0;
	timer = setInterval(function() {time++;}, 1000);	
}

function reset(){
	time = 0;
	mobs.splice(0);
	mobsKilled = 0;
	bullets.splice(0);
	ammo = AMMO_MAX;
	entities.splice(0);
	timeSinceLastSpawn = 0;
	timeSinceLastAmmo = 0;

	player.x = canvas.width/2 - player.width/2;
	player.y = canvas.height/2 - player.height/2;
	
	//find the start point
	for (var i = 0; i < 5; i++){
		for (var j = 0; j < 5; j++){
			if (map[i][j] == 2){
				moveToRoom(i, j);
			}
		}
	}
	
	inventory.equip(new Pistol());
	
	resetTimer(); //normally wouldn't be here if countdown existed
}

function generateBullet(type) {		
	return new Bullet(player.x, player.y, Math.atan2(mouseY - player.y, mouseX - player.x), BULLET_SPEED, type);
}

//0 = top, 1 = right, 2 = bottom, 3 = left
function generateMob(region) {
	var x, y;
	//top 1/4 of map
	if(region == 0) {
		x = Math.random() * (canvas.width - MOB_WIDTH);
		y = Math.random() * ((canvas.height/4) - (MOB_HEIGHT));
	}
	//right 1/4 of map
	else if(region == 1) {	
		x = (Math.random() * (canvas.width - MOB_WIDTH - (.75 * canvas.width))) + (.75 * canvas.width);
		y = Math.random() * (canvas.height - MOB_HEIGHT);
	}
	//bottom 1/4 of map
	else if(region == 2) {
		x = Math.random() * (canvas.width - MOB_WIDTH);
		y = (Math.random() * (canvas.height - MOB_HEIGHT - (.75 * canvas.height))) + (.75 * canvas.height);
	}
	//left 1/4 of map
	else if(region == 3) {
		x = Math.random() * ((canvas.width/4) - (MOB_WIDTH));
		y = Math.random() * (canvas.height - MOB_HEIGHT);
	}
	
	for(var i = 0; i < entities.length; i++){
		if(collideCoords(x, y, MOB_WIDTH, MOB_HEIGHT, entities[i])){
			return generateMob(region);
		}
	}
	
	if (boss && !bossSpawned){
		bossSpawnedSound.play();
		bossSpawned = true;
		bossNumber = Math.random() * 2;
		if (bossNumber > 1) {
			return new Boss(x, y, MOB_WIDTH*2, MOB_HEIGHT*2, (Math.random() * (MOB_SPEED_MAX - MOB_SPEED_MIN)) + MOB_SPEED_MIN+20, Date.now());
		} else {
			return new BeamBoss(x, y, BEAM_BOSS_WIDTH, BEAM_BOSS_HEIGHT, 40, Date.now());
		}
	}else{
		var rand = Math.random()*5;
		if (rand > 4){
			return new Bouncer(x, y, 50, 57, (Math.random() * (MOB_SPEED_MAX - MOB_SPEED_MIN)) + 200, Date.now());
		}else if (rand > 3){
			return new Mob(x, y, MOB_WIDTH, MOB_HEIGHT, (Math.random() * (MOB_SPEED_MAX - MOB_SPEED_MIN)) + MOB_SPEED_MIN, Date.now());		
		} else if (rand > 2){
			return new SuperMob(x, y, MOB_WIDTH, MOB_HEIGHT, (Math.random() * (MOB_SPEED_MAX - MOB_SPEED_MIN)) + MOB_SPEED_MIN, Date.now());
		}else if (rand > 1){
			return new Splitter(x, y, SPLITTER_WIDTH, SPLITTER_HEIGHT, SPLITTER_SPEED, Date.now(), 1);
		}else{
			return new Turret(x, y, MOB_WIDTH, MOB_HEIGHT, (Math.random() * (MOB_SPEED_MAX - MOB_SPEED_MIN)) + MOB_SPEED_MIN, Date.now());				
		}
		
	}
}

function generateEntity(name) {
	var x, y, width, height;
	if(name == "block") {
		width = BLOCK_WIDTH;
		height = BLOCK_HEIGHT;
	}
	if(name == "ammo") {
		width = AMMO_WIDTH;
		height = AMMO_HEIGHT;
	}
	
	//the 64 and 32 are to prevent the object from spawning inside the outer walls
	x = Math.floor(Math.random() * (canvas.width - width - 64) + 32);
	y = Math.floor(Math.random() * (canvas.width - height - 64) + 32);
	
	for(var i = 0; i < entities.length; i++){
		if(collideCoords(x, y, width, height, entities[i]) || collideCoords(x, y, width, height, player)){
			return generateEntity(name);
		}
	}
	
	if(name == "block") {
		return new Block(x,y, width, height);
	}
	if(name == "ammo") {
		return new Ammo(x,y, width, height);
	}	
}

function spawnMobs(number) {
	var randomRegion = Math.floor(Math.random() * 4);
	for(var i=0; i < number; i++){
		mobs.push(generateMob(randomRegion));
	}
}

function collide(ent1, ent2) {
	return ent1.x <= (ent2.x + ent2.width) && ent1.y <= (ent2.y + ent2.height) && (ent1.x + ent1.width) >= ent2.x && (ent1.y + ent1.height) >= ent2.y;
}

//checks collision of parameters with entity
function collideCoords(x, y, width, height, ent) {
	return x <= (ent.x + ent.width) && y <= (ent.y + ent.height) && (x + width) >= ent.x && (y + height) >= ent.y;
}

function calculateCoords(initX, initY, endX, endY, speed, modifier) {	
	var angle = Math.atan2(endY - initY, endX - initX);
	var newCoords = new Array();
	newCoords.push(initX + speed * Math.cos(angle) * modifier);
	newCoords.push(initY + speed * Math.sin(angle) * modifier);	
	return newCoords;
}

function init() {
	reset();
	then = Date.now();
	//this sets how often main is called. right now it is called every 1000/60 milliseconds, i.e., 60 times per second
	setInterval(main, 1000/60);
	music.volume = .6;
	bossFight.volume = .7;
	flyingSound.volume = .8;
	music.play();
}

//this is the first function called
function load() {
	music.oncanplaythrough = increaseLoad();
	bulletSound.oncanplaythrough = increaseLoad();
	bgImage.onload = increaseLoad();
	playerImage.onload = increaseLoad();
	mobImage.onload = increaseLoad();
	bulletImage.onload = increaseLoad();
	blockImage.onload = increaseLoad();
	ammoImage.onload = increaseLoad();
	bossFight.oncanplaythrough = increaseLoad();
	bouncerImage.onload = increaseLoad();
	bloodSprite.onload = increaseLoad();
	beamBossImage.onload = increaseLoad();
}

function increaseLoad() {
	loaded++;
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.fillStyle = "red";
	ctx.font = "22px Helvetica";
	ctx.textAlign = "center";
	ctx.fillText("Loading " + loaded + "/" + toLoad, canvas.width/2, canvas.height/2);
	
	if(loaded >= toLoad){
		init();
	}
}

var loaded = 0;
var toLoad = 12;

load();


