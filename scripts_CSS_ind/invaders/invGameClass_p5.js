class Game{
	constructor(){
		this.levelW = 850;
		this.levelH = 350;
		this.waveTimer = 25000;  //milliseconds
		this.dateRefMillisecs = 0; //update in start
		this.timePaused = 0;
		this.timeUnpaused = 0;
		this.currentTime = 0;
		this.gameState = "gameStart"; 
		this.currentWave = 0;
		this.numBadsOld = 0;
		this.numBadsNew = 0;
		this.spawned = [false, false, false, false, false, false];
		this.waveMap = [
			[	//0
				"212",  //game.waveMap[currentWave===0].length === 3
				"111",  //game.waveMap[currentWave===0][row].length === 8
				"121"
			],
			
			[	//1
				"222",
				"121",
				"212"
			],
			
			[	//2
				"1221",
				"2222",
				"1331"
			],
			
			[	//3
				"3333",
				"6666",
				"3333"
			],
			
			[	//4
				"31213",
				"66266",
				"23632"
			],
			
			[	//5
				"34243",
				"63236",
				"16661"
			],
			
			[	//6
				"124421",
				"436634",
				"632236"
			],
			
			[	//7
				"134431",
				"446644",
				"334433"
			],
			
			[	//8
				"642246",
				"213312",
				"343343"
			],
			
			[	//9
				"324423",
				"643246",
				"434343"
			],
			
			[	//10
				"0505050",
				"7050507"
			]
		];
	}
	manageScenes(){
		if (this.gameState === "gameStart"){
			background(2,0,10);
			bg_stars.draw(); 
			bg_stars.update();
			btnStart.draw([0,150,200]);
		}
		else if (this.gameState === "inGame"){
			
			if (!this.paused){
				this.checkTime(invGame.timeUnpaused, invGame.timePaused);
			}
			gameCamera(ship);
			background(2,0,10);
			bg_stars.draw(); 
			bg_stars.update(); 
			
			for (let i = bads.length-1; i >=0 ; i--){
				bads[i].drawShots(); 
				if (!this.paused){bads[i].update();}
				if(onScreen(bads[i], ship)){
					bads[i].draw();
				}
				//do not remove enemy from array until its possible shots are also removed.
				if (bads[i].health<=0 && bads[i].shots.length===0){
					bads.splice(i,1);
				} 
			}
			if (!this.paused){ship.update();} 
			ship.shots.forEach(shot=> {shot.draw(this);});
			ship.draw();
			
			//update powerups and also remove them if they go offscreen(Y).
			if (pups.length > 0){
				for (let i = pups.length-1; i >=0 ; i--){
					pups[i].draw();
					if (!this.paused){pups[i].update();}
					//splice pup out if it goes offscreen or if it's picked up
					if (collide(pups[i], ship)){
						pups[i].modShip(ship);
						pups.splice(i,1);
						continue;
					}
					if (pups[i].P.y > height){
						pups.splice(i,1);
					}
				}
			}
			resetMatrix();
			btnPause.draw(color(0,175,150));
			ship.gunz.forEach(gun => {gun.draw()});
			ship.healthBar();	
		}
		else if (this.gameState === "gameOver"){
			invGame = new Game();
		}
	}
	startGame(){
		this.dateRefMillisecs = new Date().getTime();
	}
	checkTime(timeUnpaused, timePaused){
		this.currentTime = new Date().getTime();
		if (this.currentWave === 0) {
			this.waveCheck();
		}
		//add duration of pause to refdate in case game has been paused
		this.dateRefMillisecs+=(timeUnpaused-timePaused)
		if (this.currentTime  - this.dateRefMillisecs > this.waveTimer) {
			this.dateRefMillisecs = new Date().getTime();
			this.waveCheck();
		}
		//clear pause duration
		this.timePaused = 0;
		this.timeUnpaused = 0;
	}
	waveCheck(){
		if (!this.spawned[this.currentWave] && this.currentWave < this.waveMap.length ){
			this.numBadsOld = bads.length;			
			this.spawnBads(this.currentWave); 
			this.numBadsNew = bads.length - this.numBadsOld;
			
			this.setPup("gun");
			this.setPup("shield");
			this.spawned[this.currentWave] = true; 
			this.currentWave++;
			sEnmSpawn.play();
		}
}
	setPup(item){
		if (this.currentWave!==this.waveMap.length-1){ //if it's not the final wave
			let max = bads.length;
			let min = bads.length-this.numBadsNew;
			//console.log(min, max);
			let i = floor(random(min,max));  //rand from newly added, eg old=2, new=12, newlen=14, possible rand vals 2-13.999, floor to index 2-13
			if(!bads[i].drop){
				bads[i].drop = item;
				}  else {
					//console.log(bads[i] + " already has " + bads[i].drop + ". Attempting to reassign shield.");
					this.setPup(item);
					}
		}
	}
	spawnBads(wave){
		let numRows = this.waveMap[wave].length;
		let numCols = this.waveMap[wave][0].length;
		for(let row=0; row < numRows; row++){  //0-2
			for(let col=0; col < numCols; col++){  //0-5
				let s=this.waveMap[wave][row][col];  //character in game.waveMap array
					if(s==="0"){continue;}
					else if(s==="1"){bads.push(new RedShip(50+70*col, 50*row));}  
					else if(s==="2"){bads.push(new BlueShip(50+70*col, 50*row));}
					else if(s==="3"){bads.push(new GreenShip(50+70*col, 50*row));}
					else if(s==="4"){bads.push(new OrangeShip(50+70*col, 50*row));}
					else if(s==="5"){bads.push(new Eye(50+70*col, 50+50*row, numCols - col));}  
					else if(s==="6"){bads.push(new CrimsonShip(50+70*col, 50*row));}
					else if(s==="7"){bads.unshift(new EnmBase(30+70*col, -15+50*row, numCols - col));}
					else {console.log("unexpected char in game waveMap: " + s);}
					}
		}
	}
}