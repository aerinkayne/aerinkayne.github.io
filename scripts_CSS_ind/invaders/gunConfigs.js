
//gun configs.  
//weaponSound: property and value added in preload

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
    //weaponSound: loadSound("scripts_CSS_ind/invaders/assets/sounds/phasers/phaserPulse.mp3", getData)
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
    //weaponSound: loadSound("scripts_CSS_ind/invaders/assets/sounds/phasers/phaserPulse.mp3", getData)
};
const blueLaser = {
    name: "blueLaser",
    w: 9,
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
    w: 5,
    h: 55,
    speed: 4,
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
    weaponColor: [230,0,100],
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
    damage: 15,
    targeted: false,
    trackTime: 0,
    //weaponSound: sEnmCrimAtt
};