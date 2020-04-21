class Game{ 
	constructor() {  
		this.tileSize = 40; 		//tile size 
		this.player;  		//created in setupMap
		this.playerSpawnP;  //defined in setupMap
		this.gameScreen;	//created in setupMap
		this.levelW;  		//defined in setupMap
		this.levelH;
		this.mapTiles = [];
		this.onScreenTiles = [];
		this.collisionTiles = []; 
		this.currentLevel = 0;  //default if none selected
		this.numLevels = 4;  
		//this.btnLevels = [];   
		this.levelData = levelData;
		this.paused = false;
		this.gameState = "levelSelect"; 
		}

	camera(){     
		translate(-this.player.T.x, -this.player.T.y);
	}
	setupMap(){   
		let S = this.tileSize;  	
		let L = 2; 			//length of map string coding tiles
		let numR = this.levelData[this.currentLevel].levelMap.length;
		let numC = this.levelData[this.currentLevel].levelMap[0].length/3;  //divide by 3 (2 for map string, 1 for space)
		//update level dimensions
		this.levelW = numC*S;
		this.levelH = numR*S;

		//map object types and positions.		
		let s, x, y;
		let blocks = [];
		let decoImages = [];
		let backTiles = [];
		let frontTiles = [];

		for(let row = 0; row < numR; row++){ 		//#strings in lv map. (tiles P.y)
			for(let col = 0; col < numC; col++){ 	//length row's string (tiles P.x)
												
				s = this.levelData[this.currentLevel].levelMap[row].slice(col*3, col*3 + L); 
				x = col*S;
				y = row*S; 

				if (s==="  "){continue;}

				else if(s==="00"){
					if (!this.player){
					this.player = new Player(x, y, 0.7*S, 0.7*S, this);
					} else{
						this.player.P = createVector(x,y);
					}
					this.playerSpawnP = createVector(x,y);
					this.player.updateCenterPosition();
					this.player.updateTranslation();
					this.gameScreen = new GameScreen(this); 
					
				}
				//blocks array contains map tiles that affect player position
				else if(s==="01"){  //ice
					blocks.push(new Block(x,y,S,S,imgIce1)); 
				}
				else if(s==="02"){  //ice w snow
					blocks.push(new Block(x,y,S,S,imgS1)); 
				}
				else if(s==="03"){  //ROCKS
					blocks.push(new Block(x,y,S,S,imgR3)); 
				}
				else if(s==="04"){  //rocks w grass
					blocks.push(new Block(x,y,S,S,imgR1)); 
				}
				else if(s==="05"){  //DIRT 
					blocks.push(new Block(x,y,S,S,imgD1)); 
				}
				else if(s==="06"){  //dirt w grass
					blocks.push(new Block(x,y,S,S,imgG1)); 
				}
				else if(s==="10"){  //rocks2 
					blocks.push(new Block(x,y,S,S,imgR4)); 
				}
				else if(s==="11"){  //rocks w grass2
					blocks.push(new Block(x,y,S,S,imgR2)); 
				}
				else if(s==="12"){  //dirt w leaves1 
					blocks.push(new Block(x,y,S,S,imgL1)); 
				}
				else if(s==="13"){  //dirt w leaves2
					blocks.push(new Block(x,y,S,S,imgL2)); 
				}
				else if(s==="14"){  //dirt2
					blocks.push(new Block(x,y,S,S,imgD2)); 
				}
				else if(s==="0m"){  //moving platform
					blocks.push(new Mover(x,y,3/2*S,S/3)); 
				}
				else if (s==="0C"){  
					blocks.push(new Block(x,y,S,S,imgClM));  
				}
				else if (s==="0c"){  
					blocks.push(new Block(x,y,S,S,imgClL));  
				}
				else if (s==="0d"){  
					blocks.push(new Block(x,y,S,S,imgClR)); 
				}
				
				//spikes, lave, keys, doors 
				else if(s==="0^"){
					backTiles.push(new SpikeU(x + S/4, y - 1.25*S, S/2, 2.25*S));
				}
				else if(s==="0v"){
					backTiles.push(new SpikeD(x + S/4, y, S/2, 2.25*S));
				}
				else if(s==="0<"){
					backTiles.push(new SpikeL(x - 1.25*S, y + S/4, 2.25*S, S/2));
				}
				else if(s==="0>"){
					backTiles.push(new SpikeR(x, y + S/4, 2.25*S, S/2));
				}
				else if(s==="0L"){  
					backTiles.push(new Lava(x,y+S/5,S,S-S/5, [180,0,0]));
				}
				else if(s==="0h"){
					frontTiles.push(new Heart(x+S/4,y+S/4,S/2,S/2, imgHeart));
				}
				else if(s==="07"){
					frontTiles.push(new Portal(x, y, S, S, imgPortal));
				}
				else if(s==="09"){
					frontTiles.push(new Portkey (x, y, S, S, imgKey));
				}

				//decorative images.  
				else if(s==="0f"){
					decoImages.push(new Deco(x,y,S,S, imgFlower, 3));
				}
				else if(s==="0F"){
					decoImages.push(new Deco(x,y,S,S, imgFlower2, 3));
				}
				else if(s==="0p"){
					decoImages.push(new Deco(x,y,S,S, imgPumpk, 3));
				}
				else if(s==="dF"){  //dirt2 with fossil
					blocks.push(new Block(x,y,S,S,imgD2)); 
					decoImages.push(new Deco(x,y,S,S,imgFossil, 0)); 
				}
				else if(s==="0g"){
					decoImages.push(new Deco(x,y, S, S, imgWind, 1));
				}
				else if(s==="0w"){
					decoImages.push(new Water(x, y+S/5, S, S-S/5));
				}
				else if(s==="0e"){
					decoImages.push(new Deco(x,y,S,S, imgWood1, 0));
				}
				else if(s==="0E"){
					decoImages.push(new Deco(x,y,S,S, imgWood2, 0));
				}
				else if(s==="0b"){
					decoImages.push(new Deco(x,y,S,S, imgBrick, 0));
				}
				else if(s==="0B"){
					decoImages.push(new Deco(x,y,S,S, imgBrick, 0));
					decoImages.push(new Water(x, y+S/5, S, S-S/5));
				}
			}
		}
		//add player to decoImages array and sort by z_Index property to change draw order
		decoImages.push(this.player); 
		decoImages = decoImages.sort((img1, img2) => (img1.z_Index > img2.z_Index ? 1 : -1)); 
			
		//sort additional tiles and concat to maptiles
		this.mapTiles = [...backTiles, ...blocks, ...decoImages, ...frontTiles]; 

	}
	//updates tiles that need to be updated even offscreen, filters all other tiles to onscreen tiles, 
	//draws onscreen tiles, filters onscreen tiles to collision tiles.  TODO: tidy.
	filterAndDraw(){
		let distMax = 2 * this.tileSize;
		this.onScreenTiles = this.mapTiles.filter(tile => {
			if (tile.updateEvenOffscreen){  //updates moving platforms
				tile.updateEvenOffscreen(this.player);
				}
			return this.gameScreen.isOnScreen(tile);
		});
		this.collisionTiles = this.onScreenTiles.filter(tile => {
			tile.draw();
			return tile !== this.player && tile.collide &&
				   dist(this.player.C.x, this.player.C.y, tile.C.x, tile.C.y) < distMax;
		});
	}
	manageScenes(){
		if (this.gameState === "levelSelect"){
			this.sceneLvSelect();
		}
		else if(this.gameState === "inGame"){ 
			if (!this.mapTiles.length){this.loadMap();}
			//new gamescreen is created in each map load.
			this.sceneInGame(); 
		}
		else if(this.gameState === "gameOver"){ 
			this.levelData[this.currentLevel].music.stop();
			this.sceneGameOver();
		}
		else if(this.gameState === "win"){ //todo make an end scene 
			fill(0, 200, 0,1);
			noStroke();
			rect(0,0,width,height);
			fill(0, 0, 0);
			textAlign(CENTER,CENTER);
			textSize(50);
			text("You Win!",width/2,height/2);
		}
	}
	//methods for screen managment 
	sceneLvSelect(){
		background(125,135,150);
		textSize(height/21);
		fill(230,255,255);
		textAlign(LEFT,CENTER);
		text("Select a level and press the start button to begin.",width/10,height/12);
		//TODO: get into game or screen class
		btnLevels.forEach(btn=> {
			btn.draw();
			});
		btnStart.draw();
	}
	sceneInGame(){
		if (!this.paused){
			this.gameScreen.shadeSky(this);
			this.gameScreen.drawHills(this);
			this.camera();
			this.gameScreen.updatePosition();
			this.gameScreen.drawArrObjects(this.gameScreen.bgObj);
			this.filterAndDraw();
			
			//player updates and collision checks.
			this.player.manageUpdates(this.collisionTiles);  
			
			this.gameScreen.drawArrObjects(this.gameScreen.fgObj);

			if(this.player.toNextLevel){
				this.gameScreen.opacity = 0;
				this.gameScreen.color = [255, 255, 255];
				this.levelData[this.currentLevel].music.stop();
				this.currentLevel++; 
				this.loadMap(); 
				this.player.hasKey=false;
				this.player.toNextLevel=false;
			} 
	
			if(this.currentLevel===4){ //todo: credit, music.
				this.gameState="win";
			}
		
			//foreground and overlay effects
			resetMatrix();
			this.player.stats(); //health, info
			if (this.gameScreen.opacity){
				this.gameScreen.drawScreen();
			}
		}
		btnPause.draw();
	}

	sceneGameOver(){
		if (this.gameScreen.opacity){
			this.gameScreen.drawScreen();
		}
		noStroke();
		fill(200, 0, 0,1);
		rect(0,0,width,height);
		fill(255, 255, 255,175);
		textSize(width/12);
		textAlign(CENTER,CENTER);
		text("You have died!",width/2,1/3*height);
		btnRestart.draw();
		btnContinue.draw();
	}
	
	setLevel(n){
		this.currentLevel = n;
	}
	loadMap(){
		//remove existing tile objects if there are any
		this.removeArray(this.mapTiles);
		this.setupMap();  	
		
		//TODO get another music loop for end
		if (this.currentLevel < this.numLevels) {  
			this.levelData[this.currentLevel].music.loop();
		}	
		this.gameState = "inGame"; 
	}

	removeArray(arr){
		while(arr.length){arr.pop();}
	}
	
	clickToContinue(){  
		this.player.health = 3;
		this.player.P.x = this.playerSpawnP.x;
		this.player.P.y = this.playerSpawnP.y;
		this.player.updateCenterPosition();
		this.player.updateTranslation();
		this.gameScreen = new GameScreen(this);
		this.gameState = "inGame";  
		this.levelData[this.currentLevel].music.loop();
		this.gameScreen.opacity = 0;
		this.gameScreen.color = [255, 255, 255];
	}
	

}