let width = 500; let height = 400;

let levelData = [

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
	//images assigned in preload callback.  img, translation rate (relative to player translation), initial P.y location of image.
	levelBackgroundImages: [{img:undefined, rate:1/20, Y: 175},  
							{img:undefined, rate:1/10,  Y: 0},
							{img:undefined, rate:1/4,  Y: 230}],
	skyStart: [125,175,230],
	skyEnd: [200,100,35],
	levelMusic: [0],
	levelEffects: ["snow", "rain"],
	//make sure array indices correlate.
	numBGEffects: [100, 20],
	numFGEffects: [10, 5]
	},
	
	//************************************************************************************************************

	{//1
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
	levelBackgroundImages: [],
	levelMusic: [],
	levelEffect: 'snow'
	}
]


//*******button data**********
//let btnStart, btnPause, btnLevelSelect1, btnLevelSelect2, btnLevelSelect3;

let btnStart = {
	x: width/2 - width/8,
	y: height/2 - height/20,
	w: width/4,
	h: height/10,
	r: 3,
	txt: "Click to Start",
	txtSize: 16,
	txtColor: [0,0,0],
	btnColor: [0,200,200],
	onClick: function(){
		pokyGame.gameState = "inGame";
	}
}
let btnPause = {
	x: width/50,
	y: height-height/18,
	w: width/16,
	h: height/25,
	r: 2,
	txt: "❚❚",
	txtSize: 10,
	txtColor: [0,0,0],
	btnColor: [0,200,150],
	onClick: function(){
		(!pokyGame.paused) ? this.txt = "➤" : this.txt = "❚❚";
		(!pokyGame.paused) ? this.txtColor = [200,255,255] : this.txtColor = [0,0,0];
		(!pokyGame.paused) ? pokyGame.paused = true : pokyGame.paused = false;
	}
}
let btnGoToLevel = {
	x: width/50,
	y: height-height/18,
	w: width/16,
	h: height/25,
	r: 2,
	txt: "❚❚",
	txtSize: 10,
	txtColor: [0,0,0],
	btnColor: [0,200,150],
	onClick: function(){
		if (this.accessLevel >=0 && this.accessLevel < pokyGame.numLevels){
			pokyGame.level = this.accessLevel;
			pokyGame.loadLevel(this.accessLevel);
		}
	}
}
