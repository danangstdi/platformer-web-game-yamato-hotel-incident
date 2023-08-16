setGame("1200x600");
game.folder = "assets";

var setHomeMusic = false;
var setBackgroundMusic = false;
var setGameOverMusic = false;
var setFinalMusic = false;

var gambar = {
	title:"title.png",
	gameOver:"game-over.png",
	startBtn:"tombolStart.png",
	cover:"Terrain Combined.png",
	continueBtn:"continue.png",
	backBtn:"back-btn.png",
	maxBtn:"maxBtn.png",
	minBtn:"minBtn.png",
	idle:"Idle.png",
	run:"Run.png",
	jump:"Jump.png",
	fall:"Fall.png",
	hit:"Hit.png",
	tileset:"terrain.png",
	bg:"Terrain Combined.png",
	item1:"coin.png",
	item2:"hearth.png",
	musuh1Idle:"enemy-idle.png",
	musuh1Run:"enemy-run.png",
	musuh1Hit:"enemy-hit.png",
	bendera:"Flag.png",
	benderaIndo:"indonesia.png",
	nextLevel:"next.png",
	hearthIcon:"hearth-icon.png",
	coinIcon:"coin-icon.png",
	disclaimer:"disclaimer.jpg",
	control:"control.jpg",
	finishBackground:"hut-ri.png",
	finish:"finish.png",
}

var suara = {}

loading(gambar, suara, disclaimerScreen);

function disclaimerScreen(){
	hapusLayar("black");
	tampilkanGambar(dataGambar.disclaimer, 350, 250);
	tampilkanGambar(dataGambar.control, 800, 250);
	var continueBtn = tombol(dataGambar.continueBtn, 1000, 500);
	if (tekan(continueBtn)) {
		jalankan(startScreen);
	}	
}

function startScreen(){
	if (!setHomeMusic) {
    playSound('homeMusic', 0.5);
    setHomeMusic = true;
  }
	setFinalMusic = false;
	hapusLayar("#131313");
	tampilkanGambar(dataGambar.title, 600, 250);
	var startBtn = tombol(dataGambar.startBtn, 600, 500);
	if (tekan(startBtn) || game.enter){
		setAwal();
		jalankan(gameLoop);
	}
	resizeBtn(1150, 50);
}

function gameOverScreen(){
	stopSound(setBackgroundMusic, 'map_1_music');
	hapusLayar("#131313");
	tampilkanGambar(dataGambar.gameOver, 600, 250);
	var backBtn = tombol(dataGambar.backBtn, 600, 400);
	if (tekan(backBtn)){
		setHomeMusic = false;
 		setBackgroundMusic = false;
		setGameOverMusic = false;
		game.nyawa = 3;
		game.level = 1;
		game.roundScore = 0;
		game.score = 0;
		game.aktif = true;
		jalankan(startScreen);
	}
}

function finishPermainan() {
	setAwal();
	jalankan(finishScreen);
}

function finishScreen(){
	if (!setFinalMusic) {
		playSound('IndonesiaRaya', 0.05);
		setFinalMusic = true;
	}
	stopSound(setBackgroundMusic, 'map_1_music');
	hapusLayar("#131313");
	gambarFull(dataGambar.finishBackground);
	tampilkanGambar(dataGambar.finish, 430, 300);
	teks("Skor didapat: " + game.score, 900, 115);
	teks("Nyawa tersisa: " + game.nyawa, 900, 155);
	teks("Nilai: " + game.nilai, 900, 195);
	var backBtn = tombol(dataGambar.backBtn, 930, 540);
	if (tekan(backBtn)){
		stopSound(setFinalMusic, 'IndonesiaRaya');
		setHomeMusic = false;
 		setBackgroundMusic = false;
		setGameOverMusic = false;
		game.nyawa = 3;
		game.level = 1;
		game.roundScore = 0;
		game.score = 0;
		game.aktif = true;
		jalankan(startScreen);
	}
}

function setAwal(){
	stopSound(setHomeMusic, 'homeMusic');
	game.hero = setSprite(dataGambar.idle, 32, 32);
	game.hero.animDiam = dataGambar.idle;
	game.hero.animJalan = dataGambar.run;
	game.hero.animLompat = dataGambar.jump;
	game.hero.animJatuh = dataGambar.fall;
	game.hero.animMati = dataGambar.hit;
	game.skalaSprite = 2;
	setPlatform(this["map_" + game.level], dataGambar.tileset, 32, game.hero, 10);
	game.gameOver = ulangiPermainan;
	setPlatformItem(1, dataGambar.item1);
	setPlatformItem(2, dataGambar.item2);
	var musuh1 = {};
	musuh1.animDiam = dataGambar.musuh1Idle;
	musuh1.animJalan = dataGambar.musuh1Run;
	musuh1.animMati = dataGambar.musuh1Hit;
	setPlatformEnemy(1, musuh1);
	setPlatformTrigger(1, dataGambar.nextLevel);
	setPlatformTrigger(2, dataGambar.bendera);
  
	if (!setBackgroundMusic) {
		playSound('map_1_music', 0.5);
		setBackgroundMusic = true;
	}
}

function ulangiPermainan() {
	game.aktif = true;
	game.getNyawa = 0;
	setAwal();
	jalankan(gameLoop);
}

function gameLoop(){
	hapusLayar();
	if (game.kanan) {
		gerakLevel(game.hero, 3, 0);
	} else if (game.kiri) {
		gerakLevel(game.hero, -3, 0);
	}
	if (game.atas) {
		gerakLevel(game.hero, 0, -10);
	}

	latar(dataGambar.bg);
	buatLevel();
	cekItem();
	tampilkanGambar(dataGambar.coinIcon, 40, 50);
	teks(game.score, 65, 60);
	tampilkanGambar(dataGambar.hearthIcon, 40, 93);
	teks(game.nyawa, 65, 100) +
	teks('+ ' + game.getNyawa, 35, 140);

	if (game.nyawa == 0) {
		if (!setGameOverMusic) {
			playSound('dieSound', 0.05);
			setGameOverMusic = true;
		}
	  jalankan(gameOverScreen);
	}
}

function cekItem() {
	if (game.itemID == 1) {
		tambahScore(10);
		game.roundScore +=10;
		game.itemID = 0;
		playSound('itemSound', 0.05);
	} else if (game.itemID == 2) {
		game.getNyawa +=1;
		game.itemID = 0;
	}

	if(game.musuhID != 0) {
		tambahScore(20);
		game.roundScore += 20;
		game.musuhID = 0;
	}
	
	if (game.triggerID == 1) {
		game.triggerID = 0;
		game.aktif = false;
		game.level++;
		game.roundScore = 0;
		game.nyawa += game.getNyawa;
		setTimeout(ulangiPermainan, 0);
	}

	if (game.triggerID == 2) {
		game.triggerID = 0;
		game.aktif = false;
		game.level = 1;
		game.nyawa += game.getNyawa;
		game.finishScore = game.nyawa * 20 + game.score;
		game.percentage = (game.finishScore / game.totalScore) * 100;
		game.nilai = (game.percentage >= 100) ? "S" : (game.percentage >= 95) ? "A+" : (game.percentage >= 90) ? "A" 
		: (game.percentage >= 80) ? "B+" : (game.percentage >= 70) ? "B" : (game.percentage >= 60) ? "C+" 
		: (game.percentage >= 50) ? "C" : (game.percentage >= 40) ? "D+" : (game.percentage >= 25) ? "D" 
		: (game.percentage < 25) ? "E" : "Maaf terjadi kesalahan saat menghitung score";
		setPlatformTrigger(2,dataGambar.benderaIndo);
		stopSound(setBackgroundMusic, 'map_1_music');
		setTimeout(finishPermainan, 3000);
	}
}
