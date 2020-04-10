import { sortArrByProp, collide, gameCamera } from './invFunctionsExports.js';
import { Button, StartBtn, PauseBtn, GunBtn } from './invFunctionsExports.js';
import { GameScreen, WeaponShot, PowerUp, ShieldDrop, Gun, Shield } from './invFunctionsExports.js';
import { startLaser,  redLaser, blueLaser, greenPulse, orangeLaser, homingMissile, spreader } from './gunExports.js';
import { Game } from './invGameClassExport.js';

//main	
invGame.manageScenes(invShip, gameScreen);