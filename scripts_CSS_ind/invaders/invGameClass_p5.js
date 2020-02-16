class Game{
	constructor(){
		this.levelW = 850;
		this.levelH = 375;
		this.waveTimer = 25000;  //milliseconds
		this.dateRefMillisecs = 0; //update in start
		this.timePaused = 0;
		this.timeUnpaused = 0;
		this.currentTime = 0;
		this.gameState = "gameStart"; 
		this.currentWave = 0;
		this.spawned = [false, false, false, false, false, false];
		this.waveMap = [
			[	//0
				"2112",  //game.waveMap[currentWave===0].length === 3
				"1111",  //game.waveMap[currentWave===0][row].length === 8
				"1221"
			],
			
			[	//1
				"2222",
				"1111",
				"2112"
			],
			
			[	//2
				"3223",
				"6226",
				"1331"
			],
			
			[	//3
				"3333",
				"6666",
				"2222"
			],
			
			[	//4
				"31213",
				"66266",
				"23632"
			],
			
			[	//5
				"34243",
				"66266",
				"66666"
			],
			
			[	//6
				"334433",
				"136631",
				"632236"
			],
			
			[	//7
				"242242",
				"213312",
				"343343"
			],
			
			[	//8
				"324423",
				"343243",
				"434343"
			],
			
			[	//9
				"50505",
				"05050"
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
			this.checkTime(invGame.timeUnpaused, invGame.timePaused);  
			gameCamera(ship);
			background(2,0,10);
			bg_stars.draw(); 
			bg_stars.update(); 
			ship.update(); 
			ship.draw();
		
			for (let i = bads.length-1; i >=0 ; i--){
				bads[i].update();
				if(onScreen(bads[i], ship)){
					bads[i].draw();
				}
				//do not remove enemy from array until its possible shots are also removed.
				if (bads[i].health<=0 && bads[i].shots.length===0){
					bads.splice(i,1);
				} 
			}
			
			//update powerups and also remove them if they go offscreen(Y).
			if (pups.length > 0){
				for (let i = pups.length-1; i >=0 ; i--){
					pups[i].draw();
					pups[i].update();
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
		else if (this.gameState === "gamePaused"){
			gameCamera(ship);
			background(2,0,10);
			bg_stars.draw(); 
			
			if (pups.length>0){
				for (let i = pups.length-1; i >=0 ; i--){
					pups[i].draw();
				}
			}	
			
			if (ship.shots.length>0){
				for (let s = ship.shots.length-1; s >= 0; s--){
					ship.shots[s].draw(ship);
				}
			}
			ship.draw();

			for (let i = bads.length-1; i >=0 ; i--){
				if(onScreen(bads[i], ship)){
					bads[i].draw();
				}	
			}
			resetMatrix();
			btnPause.draw([0,100,75]);
			ship.gunz.forEach(gun => {gun.draw()});
			ship.healthBar();	
		}
		else if (this.gameState === "gameOver"){
			background(2,0,10);
			bg_stars.draw(); 
			bg_stars.update(); 
			btnStart.draw(color(0,150,200));	
		}

	}
	startGame(){
		this.dateRefMillisecs = new Date().getTime();
	}
	checkTime(timeUnpaused, timePaused){
		this.currentTime = new Date().getTime();
		if (this.currentWave === 0) {
			this.waveCheck()
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
			this.spawnBads(this.currentWave); 
			this.spawned[this.currentWave] = true; 
			this.currentWave++;
			sEnmSpawn.play();
		}
}
	setPup(wave, item){
		if (wave!==this.waveMap.length-1){ //if it's not the final wave
			let max = bads.length-1;
			let min = ceil(max/2);
			let i = ceil(random(min,max));   //random bad in last half of array
			bads[i].drop = item;  
		}
	}
	spawnBads(wave){
		let numRows = this.waveMap[wave].length;
		let numCols = this.waveMap[wave][0].length;
		for(let row=0; row < numRows; row++){  //0-2
			for(let col=0; col < numCols; col++){  //0-5
				let s=this.waveMap[wave][row][col];  //character in game.waveMap array
					if(s==="0"){continue;}
					else if(s==="1"){bads.push(new RedShip(50+70*col, 50+50*row, 55, 45));}  //55 45
					else if(s==="2"){bads.push(new BlueShip(50+70*col, 50+50*row, 35, 35));}
					else if(s==="3"){bads.push(new GreenShip(50+70*col, 50+50*row, 45, 40));}
					else if(s==="4"){bads.push(new OrangeShip(50+70*col, 50+50*row, 35, 70));}
					else if(s==="5"){bads.push(new Eye(50+70*col, 50+50*row, numCols - col));}  //, 75, 50
					else if(s==="6"){bads.push(new CrimsonShip(50+70*col, 50+50*row, 50, 45));}
					else {console.log("unexpected char in game waveMap: " + s);}
					}
		}
		this.setPup(wave, "gun");
		this.setPup(wave, "shield");

	}
}