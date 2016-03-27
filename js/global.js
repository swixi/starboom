//We need to work at getting rid of most, if not all, of these globals; canvas and ctx are exceptions I think.

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 640;
document.body.appendChild(canvas);

var time = 0;
var lost = false;
var won = false;
var bullets = new Array();
var mobs = new Array();
var entities = new Array();
var mobsKilled = 0;
var mouseX = 0;
var mouseY= 0;
var fps = 0;
var armorPiercing = false;
var ammo = AMMO_MAX;
var timer;	
var then;
var fpsTick = 0;
var timeSinceLastSpawn = 0;
var timeSinceLastAmmo = 0;
var boss = false;
var bossSpawned = false;
var bossNumber = 0;

var map = [[0, 0, 0, 1, 1], [0, 0, 2, 1, 0], [0, 1, 3, 1, 0], [3, 1, 0, 0, 0], [0, 1, 0, 0, 0]];
var mi = 0;
var mj = 0;

var keysDown = new Array();
var mouseDown = false;
var mouseDownTime = 0;
var firstBulletFired = false;

var player = new Player();

var inventory = new Inventory();

var inputhandler = new InputHandler();

var bloods = new Array();

