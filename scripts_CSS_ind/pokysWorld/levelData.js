const scrW = 500; const scrH = 400;

const levelData = [

	{//0
	levelMap: [
		"00 00 00 00 00 00 00 00 00 00 00 00 CL CM CM CM CM CM CM CR 00 00 00 00 00 00 00 00 00 CL CM CM CM CM CM ",
		"00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"g1 00 00 00 00 00 00 00 00 d1 d1 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"d1 d1 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"d1 d1 d1 d1 00 00 d1 d1 00 00 00 00 00 00 00 00 00 00 00 00 00 CL CM CM CR 00 CL CR cm 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 00 d1 d1 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 00 00 00 00 00 00 Vt 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 00 00 00 00 d1 d1 V0 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 00 00 00 00 00 00 V0 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 00 00 00 00 00 00 V0 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 00 00 00 00 00 00 V0 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 00 00 00 00 00 00 V0 00 01 00 00 g1 0h 00 00 00 00 00 cl g1 g1 cl 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 00 00 00 00 00 00 V0 00 g1 g1 g1 d1 d1 d1 0H 0H 0H 0H d1 d1 d1 d1 d1 d1 d1 d1 d1 ",
		"00 00 00 00 00 00 00 00 00 00 00 00 00 d1 d1 d1 d1 d1 d1 d1 d1 d1 d1 d1 d1 d1 d1 d1 d1 d1 d1 d1 d1 d1 d1 ",
		"00 00 00 00 00 00 00 00 Vt 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 V0 d1 d1 d1 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 V0 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 V0 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 V0 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 V0 00 00 00 00 00 00 00 00 0m 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 d1 d1 d1 d1 d1 d1 d1 d1 d1 0W 0W 0W 0W 0W 0W 0W 0W 0W 0W i1 i1 0W 0W i1 i1 i1 i1 i1 ",
		"d1 0L 0L d1 d1 0L 0L d1 d1 d1 d1 d1 d1 d1 d1 d1 0w 0w 0w 0w 0w 0w 0w 0w 0w 0w i3 i3 0w 0w i3 i3 i3 i3 i3 "
		],
	//images assigned in preload.  properties refer to image, translation rate relative to player translation, and intitial P.y location of image.
	levelBackgroundImages: [{img:undefined, rate:1/20, Y: 175},  
							{img:undefined, rate:1/10,  Y: 0},
							{img:undefined, rate:1/4,  Y: 230}], 
	skyStart: [120,170,255],
	skyEnd: [250,95,40],
	levelMusic: undefined,  //assign in preload
	levelEffects: ["snow"], //"rain"],
	//make sure array indices of numBGeffects and levelEffect correlate.
	numBGEffects: [125], // 20],
	numFGEffects: [15]   //, 5]
	},
	
	//************************************************************************************************************

	{ //1
	levelMap: [
		"00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ",
		"00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 "
		],
	levelBackgroundImages: [{img:undefined, rate:1/20, Y: 175},  
							{img:undefined, rate:1/10,  Y: 0},
							{img:undefined, rate:1/4,  Y: 230}], 
	skyStart: [120,170,255],
	skyEnd: [250,95,40],
	levelMusic: undefined,  //assign in preload
	levelEffects: ["snow"], 
	numBGEffects: [125], 
	numFGEffects: [15]   
	}
]


//*******button configs **********
//let btnStart, btnPause, btnLevelSelect1, btnLevelSelect2, btnLevelSelect3;

let btnStart = {
	x: scrW/2 - scrW/8,
	y: scrH/2 - scrH/20,
	w: scrW/4,
	h: scrH/10,
	r: 3,
	txt: "Click to Start",
	txtSize: 16,
	txtColor: [0,0,0],
	btnColor: [0,200,200],
	onClick: ()=> {
		pokyGame.gameState = "inGame";
	}
}
let btnPause = {
	x: scrW/50,
	y: scrH-scrH/18,
	w: scrW/16,
	h: scrH/25,
	r: 2,
	txt: "❚❚",
	txtSize: 10,
	txtColor: [0,0,0],
	btnColor: [0,200,150],
	onClick: ()=> {
		(!pokyGame.paused) ? this.txt = "➤" : this.txt = "❚❚";
		(!pokyGame.paused) ? this.txtColor = [200,255,255] : this.txtColor = [0,0,0];
		(!pokyGame.paused) ? pokyGame.paused = true : pokyGame.paused = false;
	}
}
let btnGoToLevel = {
	x: scrW/50,
	y: scrH-scrH/18,
	w: scrW/16,
	h: scrH/25,
	r: 2,
 accessLevel: 1,
	txt: "❚❚",
	txtSize: 10,
	txtColor: [0,0,0],
	btnColor: [0,200,150],
	onClick: ()=> {
		if (this.accessLevel >=0 && this.accessLevel < pokyGame.numLevels){
			pokyGame.level = this.accessLevel;
			pokyGame.loadLevel(this.accessLevel);
		}
	}
}
