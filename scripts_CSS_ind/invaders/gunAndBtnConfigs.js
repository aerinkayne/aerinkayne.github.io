//canvas size for button configs
const scrWidth = 450;  const scrHeight = 350;

//** guns **//.  
//note: weaponSound property and value added in preload

const startLaser = {
    name: "startLaser",
    w: 6,
    h: 10,
    speed: 10,
    weaponColor: [0,150,175],
    pushNumber: 1,
    hits: 1,  
    rechargeTime: 16,
    damage: 15,
    targeted: false,
    trackTime: 0,
    //weaponSound: 
};
const redLaser = {
    name: "redLaser",
    w: 4,
    h: 12,
    speed: 7.5,
    weaponColor: [200,0,0],
    pushNumber: 1,
    hits: 1,
    rechargeTime: 8,
    damage: 15,
    targeted: false,
    trackTime: 0,
    //weaponSound: sEnmAtt
};
const blueLaser = {
    name: "blueLaser",
    w: 10,
    h: 20,
    speed: 6,
    weaponColor: [100,50,220],
    pushNumber: 1,
    hits: 2,
    rechargeTime: 35,
    damage: 30,
    targeted: false,
    trackTime: 0,
    //weaponSound: sPhaserB
};
const greenPulse = {
    name: "greenPulse",
    w: 16,
    h: 9,
    speed: 5,
    weaponColor: [0,175,155],
    pushNumber: 1,
    hits: 2,
    rechargeTime: 25,
    damage: 35,
    targeted: true, 
    trackTime: 10,
    //weaponSound:sPhaserG
};
const orangeLaser = {
    name: "orangeLaser",
    w: 6,
    h: 55,
    speed: 3,
    weaponColor: [200,150,0],
    pushNumber: 1,
    hits: 3,
    rechargeTime: 45,
    damage: 75,
    targeted: false,
    trackTime: 0,
    //weaponSound:sPhaserY
};
const homingMissile = {
    name: "homingMissile",
    w: 9,
    h: 9,
    speed: 2,
    weaponColor: [230,0,85],
    pushNumber: 1,
    hits: 1,
    rechargeTime: 40,
    damage: 70,
    targeted: true,
    trackTime: 250,
    //weaponSound: sEnmAtt
};
const spreader = {
    name: "spreader",
    w: 7,
    h: 5,
    speed: 5,
    weaponColor: [200,0,100],
    pushNumber: 4,
    hits: 1,
    spreadAngle: 20,
    rechargeTime: 30,
    damage: 18,
    targeted: false,
    trackTime: 0,
    //weaponSound: sEnmCrimAtt
};




/** buttons **/ 

const btnStart1 = {
	x: scrWidth/2-scrWidth/9.6, 
	y: scrHeight/2-scrHeight/20,
	w: scrWidth/4.8,
    h: scrHeight/10,
    r: 5,
	txt: " S t a r t   ➤",
	txtSize: 16,
	txtColor: [25,175,225],
    btnColor: [25,40,100],
    borderColor: [50,100,160],
	onClick: ()=> {
		btnRedGun = new GunBtn(btnGun, sprBadR1, redLaser);
		btnBlueGun = new GunBtn(btnGun, sprBadB1, blueLaser);
		btnGreenGun = new GunBtn(btnGun, sprBadG1, greenPulse);
		btnOrangeGun = new GunBtn(btnGun, sprBadBr1, orangeLaser);
		btnSpreadGun = new GunBtn(btnGun, sprCrim1, spreader);
		invGame.startGame();
    },
    onHover() {
        this.txtColor = [100,200,255];
    },
    offHover() {
        this.txtColor = [50,150,200];
    }
}

const btnGun = {
    x: 0,
    y: 0,
    w: scrWidth/18,
    h: scrHeight/19,
    r: 3,
    overlayAlpha: 120,
	onClick(){
		if (this.powerLevel > -1){
			invShip.gunType = this.gunType;
			invShip.powerLevel = this.powerLevel;
		}
		invShip.gunz.forEach(gun => {gun.selected = false;});
		this.selected = true;
	}
}

const btnPause1 = {
    x: 5, 
	y: scrHeight-25,
	w: 35,
    h: 20,
    r: 2,
    txtColor: [0,0,0],
    txtSize: 9,
    btnColor: [10,125,135],
    txt: "❚❚",
    borderColor: [100,200,200],
    onClick(){
		if (!invGame.paused){
			this.txtColor = [100,255,225];
			this.txt = "➤";
			invGame.paused = true;
			invGame.timePaused = new Date().getTime();
		} else{
			this.txtColor = [0,0,0];
			this.txt = "❚❚";
			invGame.paused = false;
			invGame.timeUnpaused = new Date().getTime();
		}
    }
}    
