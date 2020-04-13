class Game{
	constructor(){
	this.player = new Player(0,0);
	this.gameScreen = new GameScreen(this.player);
	this.mapCodeLength = 3;
	this.tileSize = 40;
	this.mapTiles = [];
	this.onScreenTiles = [];
	this.collisionTiles = [];
	this.movingTiles = [];
 this.level = 0;
	this.numLevels = 2; //update later
 this.levelData = levelData;
 this.paused = false;
 this.setup = false;
 this.gameState = "start";
	this.btnStart = new Button(btnStart);
	this.btnPause = new Button(btnPause);
	}
	removeMap(){
		while(this.mapTiles.length){
			this.mapTiles.pop();
		}
		while(this.movingTiles.length){
			this.mapTiles.pop();
		}
	}
	gameCamera(){
		translate(-this.player.T.x, -this.player.T.y);
	}
 managePlayer(){
		if (!this.paused){
			this.player.move();
			this.player.manageSprites();
			this.player.updatePosition(this);
			this.player.updateTranslation(this);
			this.player.updateDamageTimer();
			this.player.bound(this);
		}
	}
	manageScenes(){
		if (this.gameState==="start"){
			background(150);
			this.btnStart.draw();
		}
		if (this.gameState==="inGame"){
			if(!this.setup){this.loadLevelMap(this.level);}	

			this.gameScreen.shadeSky(this);
			this.gameScreen.drawBackgrounds(this);

			this.gameCamera();
			this.gameScreen.updatePosition(); //needs to be after cam to track properly
			this.managePlayer(this);
			if(!this.gameScreen.setup){ 	  //needs to follow player updates 
				this.gameScreen.populateArrays(this);
			}
			this.gameScreen.drawBGObjects(this);
			this.filterTiles();
			this.updateMovingTiles();
			this.drawTiles();
			this.gameScreen.drawFGObjects(this);
			
			if (this.gameScreen.opacity){
				this.gameScreen.drawScreen();  //for effects using opacity changes
			}
			
			resetMatrix();
			this.player.healthBar();
			this.player.manaBar();
			this.btnPause.draw();
		}
	}
	loadLevelMap(){
		if(this.mapTiles.length){this.removeMap();}
		let S = this.tileSize;
		let L = this.mapCodeLength;
		let numRows = this.levelData[this.level].levelMap.length;
		let numCols = this.levelData[this.level].levelMap[0].length;
		this.levelW = S*numCols/L;
		this.levelH = S*numRows;
		let t, x, y;
		let frontTiles = [];
		let backTiles = [];
		
		for (let i = 0; i < numRows; i++){
			for (let j = 0; j < numCols; j++){
				t = this.levelData[this.level].levelMap[i].slice(L*j, L*(j+1));
				x = j*S;
				y = i*S;

				if(t==="00 "){continue;}
				else if(t==="01 "){
					this.player.P = createVector(x,y);
					this.player.updateTranslation(this);
				}
				else if(t==="d1 "){
					this.mapTiles.push(new DirtTile(x,y,S,S, sprDirt1));
				}
				else if(t==="CL "){
					this.mapTiles.push(new CloudTile(x,y,S,S, [sprCloudL1, sprCloudL2]));
				}
				else if(t==="CR "){
					this.mapTiles.push(new CloudTile(x,y,S,S, [sprCloudR1, sprCloudR2]));
				}
				else if(t==="CM "){
					this.mapTiles.push(new CloudTile(x,y,S,S, [sprCloudM1, sprCloudM2]));
				}
				else if(t==="i1 "){
					this.mapTiles.push(new IceTile(x,y,S,S, sprIceT1));
				}
				else if(t==="i2 "){
					this.mapTiles.push(new IceTile(x,y,S,S, sprIceT2));
				}
				else if(t==="i3 "){
					this.mapTiles.push(new IceTile(x,y,S,S, sprIce1));
				}
				else if(t==="i4 "){
					this.mapTiles.push(new IceTile(x,y,S,S, sprIce2));
				}
				else if(t==="0L "){
					backTiles.push(new LavaTile(x,y+S/4,S,3/4*S));
				}
				else if(t==="0H "){
					frontTiles.push(new HealthSpringTile(x,y+S/4,S,3/4*S));
				}
				else if(t==="0m "){
					let M = new IceMover(x, y+S, 4/3*S, S/2, 0.5,0);
					this.mapTiles.push(M);
					this.movingTiles.push(M);
				}
				else if(t==="cm "){
					let M = new CloudMover(x, y, 7/5*S, 4/5*S, 0, 0.5);
					this.mapTiles.push(M);
					this.movingTiles.push(M);
				}
				else if(t==="0w "){
					frontTiles.push(new WaterTile(x,y,S,S,false));
				}
				else if(t==="0W "){
					frontTiles.push(new WaterTile(x,y+S/4,S,3/4*S, true));
				}
				else if(t==="V0 "){
					this.mapTiles.unshift(new ClimbTile(x,y,S,S, sprVine1));
				}
				else if(t==="Vt "){
					this.mapTiles.unshift(new ClimbTile(x,y,S,S, sprVineT));
				}	
				else if(t==="0h "){
					this.mapTiles.push(new Heart(x+S/4,y+S/4,S/2,S/2));
				}
				else if(t==="g1 "){
					frontTiles.push(new GrassTile(x,y+3/4*S,S,S/4));
				}
				else if(t==="cl "){
					frontTiles.push(new CloverTile(x,y+S/2,S,S/2));
				}
			}
		}
  		//      1          2           3         4    plr       5            6 
		//   unshift      push      unshift     push          unshift       push
		//        [backtiles]           [maptiles] player        [frontTiles]
		//              6 additional layers without sorting.
		this.mapTiles.push(this.player);
		this.mapTiles = backTiles.concat(this.mapTiles.concat(frontTiles));
		this.setup = true;
	}
	filterTiles(){
		this.onScreenTiles = this.mapTiles.filter(tile =>{
			return this.gameScreen.isOnScreen(tile);
		});
		this.collisionTiles = this.onScreenTiles.filter(tile =>{
			return getDistance(tile, this.player) < 2*this.tileSize;
		});
	}
	updateMovingTiles(){
		if(!this.paused){
			this.movingTiles.forEach(tile => {tile.updatePosition();});
		}
	}
	drawTiles(){
		this.onScreenTiles.forEach(tile =>{tile.draw();});
	}
	
	mapCollision(XorY){
		switch(XorY){
			case "X":
				this.collisionTiles.forEach(tile => {
					//stroke(200,0,0);
					//strokeWeight(2); //visualizing distance call check
					//line(tile.P.x+tile.w/2, tile.P.y+tile.h/2, this.player.P.x+this.player.w/2, this.player.P.y+this.player.h/2);
					if(tile!==this.player && tile.collide(this.player)){
						tile.collideEffect(this.player, this.player.V.x, 0);
					}
				});
				//strokeWeight(1); noStroke(); 
				break;
			case "Y":	
				this.collisionTiles.forEach(tile => {
					if(tile!==this.player && tile.collide(this.player)){
						tile.collideEffect(this.player, 0, this.player.V.y);
					}
				});
				break
		}
	}
}	