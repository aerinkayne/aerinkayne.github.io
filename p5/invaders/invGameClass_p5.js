//game class

class Game{
	constructor(){
		this.timeRef = new Date();
		this.timeNow = 0;
		this.timer = 0;
		this.gameState = "gameStart"; //"testing"; //"gameStart";
		this.currentWave = 0;
		this.spawned = [false, false, false, false, false];
		this.waveMap = [
			[	//0
				"221122",  //game.waveMap[currentWave===0].length === 3
				"111111",	 //game.waveMap[currentWave===0][row].length === 8
				"121121"
			],
			
			[	//1
				"222222",
				"222222",
				"111111"
			],
			
			[	//2
				"122221",
				"312213",
				"221122"
			],
			
			[	//3
				"242242",
				"213312",
				"233332"
			],
			
			[	//4
				"324423",
				"443344",
				"232323"
			],
			
			[	//5
				"5"
			]
		];
		
	}
	manageScenes(){
		if (this.gameState === "gameStart"){
			//gameCamera(ship);
			background(2,0,10);
			stars.draw(); 
			stars.update(); 
			btnStart.draw(color(0,150,200));
		}
		else if (this.gameState === "inGame"){
			
			gameCamera(ship);
			background(2,0,10);
			stars.draw(); 
			stars.update(); 
			this.updateTimer();

			ship.update();
			ship.animate();  
			ship.draw();
		
			for (var i = bads.length-1; i >=0 ; i--){

				bads[i].update();
				
				if(onScreen(ship, bads[i])){
					bads[i].draw();
				}
				
				//do not remove enm from array until its possible shots are also removed.
				if (bads[i].health<=0 && bads[i].shots.length===0){bads.splice(i,1);} 
			}
			resetMatrix();
			btnPause.draw(color(0,175,150));
			ship.healthBar();	
		}

		else if (this.gameState === "gamePaused"){
			gameCamera(ship);
			background(2,0,10);
			stars.draw(); 
			stars.update();
			
			if (ship.shots.length>0){
					for (var s = ship.shots.length-1; s >= 0; s--){
						ship.shots[s].draw();
					}
			}
			ship.draw();

			for (var i = bads.length-1; i >=0 ; i--){
				if(onScreen(ship, bads[i])){
					bads[i].draw();
					bads[i].update();
				}	
			}
			
			resetMatrix();
			btnPause.draw(color(0,125,100));
			ship.healthBar();	
		}
		
		else if (this.gameState === "gameOver"){

			
			//gameCamera(ship); //update later
			background(2,0,10);
			stars.draw(); 
			stars.update(); 
			btnStart.draw(color(0,150,200));	
		}
		
		else if (this.gameState === "testing"){
			if(bads.length === 0){
				bads.push(new Enemy(0, 0, "ship3"));
				bads[0].w*=5;
				bads[0].h*=5;
				bads[0].P = createVector(width/2-bads[0].w/2, height/2-bads[0].h/2);
			}
			background(0,0,0);
			bads[0].draw();
			
		}
	}
	
	waveCheck(){
		if (!this.spawned[this.currentWave] && this.currentWave < this.waveMap.length && 
							this.timer > this.currentWave*30){
			this.spawnBads(this.currentWave); 
			this.spawned[this.currentWave] = true; 
			this.currentWave++;
			sEnmSpawn.play();
		}
	}
	
	updateTimer(){
		
		this.timeNow = new Date();
		if (this.timeNow - this.timeRef >= 1000){
			this.timer++;
			this.timeRef = new Date();
		}
		this.waveCheck();
	}
	
	
	spawnBads(wave){
		for(var row=0; row<this.waveMap[wave].length; row++){  //0-2
			for(var col=0; col<this.waveMap[wave][row].length; col++){  //0-7
				var s=this.waveMap[wave][row][col];  //character in game.waveMap array
			
			if(s==="1"){bads.push(new Enemy(50+60*col, 50+50*row, "ship1"));}
			else if(s==="2"){bads.push(new Enemy(50+60*col, 50+50*row, "ship2"));}
			else if(s==="3"){bads.push(new Enemy(50+60*col, 50+50*row, "ship3"));}
			else if(s==="4"){bads.push(new Enemy(50+60*col, 50+50*row, "ship4"));}
			else if(s==="5"){bads.push(new Enemy(50+60*col, 50+50*row, "ship5"));}
			else {console.log("unexpected char in game waveMap: " + s);}
			}
		}
	}
	
}