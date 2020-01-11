class Game{
	constructor(){
		this.levelW = 850;
		this.levelH = 375;
		this.waveTimer = 30000;  //milliseconds
		this.dateRefMillisecs = 0; //update in start
		this.currentTime = 0;
		this.gameState = "gameStart"; 
		this.currentWave = 0;
		this.spawned = [false, false, false, false, false, false];
		this.waveMap = [
			[	//0
				"221122",  //game.waveMap[currentWave===0].length === 3
				"111111",  //game.waveMap[currentWave===0][row].length === 8
				"111111"
			],
			
			[	//1
				"232232",
				"212221",
				"121212"
			],
			
			[	//2
				"312213",
				"112211",
				"233332"
			],
			
			[	//3
				"242242",
				"213312",
				"343343"
			],
			
			[	//4
				"324423",
				"343243",
				"434343"
			],
			
			[	//5
				"5 5 5",
				" 5 5 "
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
			this.checkTime();  //updates time if not paused
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
					if (pups[i].P.y > height){
						pups.splice(i,1);
					}
					else if (collide(pups[i], ship)){
						pups[i].modShip(ship);
						sPup.play();
						pups.splice(i,1);
					}
				}
			}
			resetMatrix();
			btnPause.draw(color(0,175,150));
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
					bads[i].update();
				}	
			}
			resetMatrix();
			btnPause.draw([0,100,75]);
			ship.healthBar();	
		}
		else if (this.gameState === "gameOver"){
			background(2,0,10);
			bg_stars.draw(); 
			bg_stars.update(); 
			btnStart.draw(color(0,150,200));	
		}
		else if (this.gameState === "testing"){
			//test drawings
			background(2,0,10);
			
			ship.update(); 
			ship.draw();
			
			if(bads.length === 0){
				bads.push(new Eye(0, 0, 50, 50));
				bads[0].w*=3.5;
				bads[0].h*=3.5;
					
				bads[0].P = createVector(width/2-bads[0].w/2, height/2-bads[0].h/2);
			}
			bads[0].draw();
		}
	}
	startGame(){
		this.dateRefMillisecs = new Date().getTime();
	}
	checkTime(){
		this.currentTime = new Date().getTime();
		if (this.currentWave === 0) {
			this.waveCheck()
		}
		if (this.currentTime - this.dateRefMillisecs > this.waveTimer) {
			this.dateRefMillisecs = new Date().getTime();
			this.waveCheck();
		}
	}
	waveCheck(){
		if (!this.spawned[this.currentWave] && this.currentWave < this.waveMap.length ){  
			this.spawnBads(this.currentWave); 
			this.spawned[this.currentWave] = true; 
			this.currentWave++;
			sEnmSpawn.play();
		}
}
	spawnBads(wave){
		for(let row=0; row<this.waveMap[wave].length; row++){  //0-2
			for(let col=0; col<this.waveMap[wave][row].length; col++){  //0-5
				let s=this.waveMap[wave][row][col];  //character in game.waveMap array
			if(s===" "){continue;}
			else if(s==="1"){bads.push(new RedShip(50+70*col, 50+50*row, 55, 45));}
			else if(s==="2"){bads.push(new BlueShip(50+70*col, 50+50*row, 35, 35));}
			else if(s==="3"){bads.push(new GreenShip(50+70*col, 50+50*row, 45, 40));}
			else if(s==="4"){bads.push(new OrangeShip(50+70*col, 50+50*row, 35, 70));}
			else if(s==="5"){bads.push(new Eye(50+70*col, 50+50*row, 75, 50));}
			else {console.log("unexpected char in game waveMap: " + s);}
			}
		}
		if (wave!==this.waveMap.length-1){ //if it's not the final wave
			let L = this.waveMap[wave][0].length;  //#bads per row, eg 6
			let r = ceil(random(0,L));  //random int based on bads per row, eg 1-6
			bads[bads.length-r].drop = true;  //sets drop property of random first row bad to true
		}
	}
}