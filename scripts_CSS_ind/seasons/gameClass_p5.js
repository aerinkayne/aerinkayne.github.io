class Game{ 
	constructor() {  
		this.tileSize = 40; 		//tile size 
		this.player;  		//created in map setup
		this.playerSpawnP;  //defined in map setup
		this.gameScreen;	//created in map setup
		this.levelW;  		//defined in map setup
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
		let L = 2; 			//map code string length
		let numR = this.levelData[this.currentLevel].levelMap.length;
		//divide by 3 (2char string for map, plus space for legibility)
		let numC = this.levelData[this.currentLevel].levelMap[0].length/3;  
		//set level dimensions
		this.levelW = numC*S;
		this.levelH = numR*S;

		//set map object types and positions.		
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
				
				if(s==="00"){
					if (!this.player){
					this.player = new Player(x, y, 0.7*S, 0.7*S, this);
					} else{
						this.player.P = createVector(x,y);
					}
					this.playerSpawnP = createVector(x,y);
					this.player.updateCenterPosition();
					this.player.updateTranslation();
					this.gameScreen = new GameScreen(this); //need levelW, this.levelH, this.player);
					
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
					blocks.push(new Mover(x,y,3/2*S,S/3,"mover")); //
				}
				else if (s==="0C"){  //cloud middle
					blocks.push(new Block(x,y,S,S,imgClM));  
				}
				else if (s==="0c"){  //cloud left side
					blocks.push(new Block(x,y,S,S,imgClL));  
				}
				else if (s==="0d"){  //cloud left side w/H flip
					blocks.push(new Block(x,y,S,S,imgClR)); 
				}
				
				//collidables do not affect position but are used for other updates (health, dmg, inventory)  
				else if(s==="0^"){
					backTiles.push(new SpikeU(x+(S-S/1.75)/2.0, y-1.5*S, S/1.75, 2.5*S));
				}
				else if(s==="0v"){
					backTiles.push(new SpikeD(x+(S-S/1.75)/2.0, y, S/1.75, 2.5*S));
				}
				else if(s==="0L"){  
					backTiles.push(new Lava(x,y+S/5,S,S-S/5, "l"));
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
					decoImages.push(new Deco(x,y,S,S,imgFossil)); 
				}
				else if(s==="0g"){
					decoImages.push(new Glass(x,y,S,S, "glass", 1));
				}
				else if(s==="0w"){
					decoImages.push(new Water(x,y,S,S, "water", 3));
				}
				else if(s==="0e"){
					decoImages.push(new Deco(x,y,S,S, imgWood1, 0));
				}
				else if(s==="0E"){
					decoImages.push(new Deco(x,y,S,S, imgWood2, 0));
				}
				else if(s==="0B"){
					decoImages.push(new Deco(x,y,S,S, imgBrick, 0));
					decoImages.push(new Water(x,y,S,S, "water", 3));
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
				tile.updateEvenOffscreen();
				}
			return this.gameScreen.isOnScreen(tile);
		});
		this.collisionTiles = this.onScreenTiles.filter(tile => {
			tile.draw();
			return tile !== this.player && tile.collide &&
				   dist(this.player.C.x, this.player.C.y, tile.C.x, tile.C.y) < distMax;
		});
	}
	//methods for screen managment 
	screenLvSelect(){
		background(125,135,150);
		textSize(height/21);
		fill(230,255,255);
		textAlign(LEFT,CENTER);
		text("Select a level and press the start button to begin.",width/10,height/12);
		//TODO: get into class
		btnLevels.forEach(btn=> {
			btn.draw();
			});
		btnStart.draw();
	}
	screenInGame(){
		if (!this.gameScreen.setup){
			this.gameScreen.effectSetup(this);  //TODO - might need to move this block
		}

		if (!this.paused){
			this.gameScreen.shadeSky(this);
			this.gameScreen.drawHills(this);
			this.camera();
			this.gameScreen.updatePosition();
			this.gameScreen.drawArrObjects(this.gameScreen.bgObj);
			this.filterAndDraw();

			
			//player updates and collision checks are here.
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
	screenGameOver(){
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
			
		
		//TODO get another loop for end
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