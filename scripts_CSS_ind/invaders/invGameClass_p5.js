class Game{
	constructor(){
		this.gridW = 70;
		this.gridH = 50;
		this.waveTimer = 30000;  	//milliseconds  
		this.dateRefMillisecs = 0;  //update in start
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
				"212",  
				"111",  
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
				" 5 5 5 ",
				"7 5 5 7"
			]
		];
	}
	//main loop
	manageScenes(ship, gameScreen){
		if (this.gameState === "gameStart"){
			gameScreen.backgroundImg(starBG);
			gameScreen.drawStars(); 
			gameScreen.updateStars();
			btnStart.draw([0,150,200]);
		}
		else if (this.gameState === "inGame"){
			
			if (!this.paused){
				this.checkTime(this.timeUnpaused, this.timePaused);
			}
			gameCamera(ship);
			gameScreen.updatePosition(ship);
			gameScreen.backgroundImg(starBG);
			gameScreen.drawStars(); 
			gameScreen.updateStars(); 
			this.checkSynchronizedEnemies();
			

			for (let i = bads.length-1; i >=0 ; i--){
				bads[i].drawShots(ship); 
				if (!this.paused){bads[i].update(ship);}
				if(collide(bads[i], gameScreen)){  
					bads[i].draw();
				}
				//do not remove enemy until its possible shots are also removed.
				if (bads[i].health<=0 && bads[i].shots.length===0){
					bads.splice(i,1);
				} 
			}

			if (!this.paused){ship.update();} 
			
			ship.shots.forEach(shot=> {shot.draw(ship);});
			ship.draw();
			
			//update powerups and also remove them if they go offscreen(Y).
			if (pups.length){
				for (let i = pups.length-1; i >=0 ; i--){
					pups[i].draw();
					if (!this.paused){pups[i].update();}
					//splice pup out if it goes offscreen(Y) or if it's picked up
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
			ship.shieldBar();	
		}
	}


	startGame(){
		invShip = new Ship(width/2-35,height-35);
		this.dateRefMillisecs = new Date().getTime();
		this.gameState = "inGame";
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

	checkSynchronizedEnemies(){
		if (moveTogether.length){
			//remove defeated from tracking array.
			moveTogether = moveTogether.filter(enemy=> {
				return enemy.health > 0;
			});
			//reverse movement if any of them are outside of range
			if (moveTogether.some(enemy=> {
				return enemy.P.x + enemy.w > levelW || enemy.P.x < 0;
			})){
				moveTogether.forEach(enemy=> {
					enemy.V.x *= -1;
				});
			}
		}
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
			let i = floor(random(min,max));  //random num from newly added
			if(!bads[i].drop){
				bads[i].drop = item;
				}  else {
					//recast if randomly selected already has a drop item.
					this.setPup(item);
					}
		}
	}
	spawnBads(wave){
		let w = this.gridW; 
		let h = this.gridH;
		let numRows = this.waveMap[wave].length;
		let numCols = this.waveMap[wave][0].length;
		for(let row=0; row < numRows; row++){  
			for(let col=0; col < numCols; col++){  
				let s=this.waveMap[wave][row][col];  
				let X = 50;  //some mobs are wider than grid size. indents X position to account for centering 
				if (s===" "){continue;}
				else if(s==="1"){bads.push(new RedShip(X + w*col, h*row, w, h));}  
				else if(s==="2"){bads.push(new BlueShip(X + w*col, h*row, w, h));}
				else if(s==="3"){bads.push(new GreenShip(X + w*col, h*row, w, h));}
				else if(s==="4"){bads.push(new OrangeShip(X + w*col, h*row, w, h));}
				else if(s==="5"){
					let B = new Eye(X + w*col, h*row, w, h);
					bads.push(B);
					moveTogether.push(B);
				}  
				else if(s==="6"){bads.push(new CrimsonShip(X + w*col, h*row, w, h));}
				else if(s==="7"){
					let B = new EnmBase(X + w*col, h*row, w, h);
					bads.push(B);
					moveTogether.push(B);
				}
				else {console.log("unexpected char in game waveMap: " + s);}
			}
		}
	}
}