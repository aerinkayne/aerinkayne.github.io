class Game{
	constructor(){
	this.player = new Player(0,0);
	this.gameScreen = new GameScreen(this.player);
	this.mapCodeLength = 3;
	this.tileSize = 40;
	this.mapTiles = [];
	this.frontTiles = [];
	this.backTiles = [];
	this.onScreenTiles = [];
	this.collisionTiles = [];
	this.movingTiles = [];
	this.level = 0;
	this.levelData = levelData[this.level];
	this.numLevels = 2; //update later
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
	manageScenes(){
		if (this.gameState==="start"){
			background(150);
			this.btnStart.draw();
		}
		if (this.gameState==="inGame"){
			if(!this.setup){this.loadLevelMap(this.level);}	
			this.shadeSky();
			this.drawBackgrounds();
			this.gameCamera();
			this.gameScreen.updatePosition(); //needs to be immediately after cam to track properly
			this.player.managePlayer(this);
			if(!this.gameScreen.setup){ //needs to follow player updates since screen position is relative to player
				this.gameScreen.populateArrays(this);
			}
			this.gameScreen.drawBGObjects(this);
			this.filterTiles();
			this.updateMovingTiles();
			this.drawTiles();
			this.gameScreen.drawScreen();  //for possible effects using opacity changes
			this.gameScreen.drawFGObjects(this);
			
			resetMatrix();
			this.player.healthBar();
			this.player.manaBar();
			this.btnPause.draw();
		}
	}
	loadLevelMap(){
		if(this.mapTiles.length){this.removeMap();}
		this.levelData = levelData[this.level];
		let S = this.tileSize;
		let L = this.mapCodeLength;
		let numRows = this.levelData.levelMap.length;
		let numCols = this.levelData.levelMap[0].length;
		this.levelW = S*numCols/L;
		this.levelH = S*numRows;
		let t, x, y;
		
		for (let i = 0; i < numRows; i++){
			for (let j = 0; j < numCols; j++){
				t = this.levelData.levelMap[i].slice(L*j, L*(j+1));
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
					this.backTiles.push(new LavaTile(x,y+S/4,S,3/4*S));
				}
				else if(t==="0H "){
					this.frontTiles.push(new HealthSpringTile(x,y+S/4,S,3/4*S));
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
					this.frontTiles.push(new WaterTile(x,y,S,S,false));
				}
				else if(t==="0W "){
					this.frontTiles.push(new WaterTile(x,y+S/4,S,3/4*S, true));
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
					this.frontTiles.push(new GrassTile(x,y+3/4*S,S,S/4));
				}
				else if(t==="cl "){
					this.frontTiles.push(new CloverTile(x,y+S/2,S,S/2));
				}
			}
		}
		//   unshift|push     unshift|push           unshift|push
		//    [backtiles]      [maptiles] player     [frontTiles]
		//   concat all arrays to maptiles, allows 6 possible layers without sort.
		this.mapTiles.push(this.player);
		this.mapTiles = this.backTiles.concat(this.mapTiles.concat(this.frontTiles));
		while(this.frontTiles.length){this.frontTiles.pop();}
		while(this.backTiles.length){this.backTiles.pop();}
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
	shadeSky(){
		noStroke();
		let rectColor;
		let H = 4/5*height/40;
		let num = height/H;
		for (let i = 0; i<num; i++){
			rectColor = lerpColor(color(this.levelData.skyStart),color(this.levelData.skyEnd),i/num);
			fill(rectColor);
			rect(0,i*H,width,H);
		}
	}
	drawBackgrounds(){
		this.levelData.levelBackgroundImages.forEach(config => {
			let bg = config.img.get(config.rate*this.player.T.x, 0, width, ceil(min(height-config.Y+config.rate*this.player.T.y, config.img.height)));
			image(bg, 0, config.Y-config.rate*this.player.T.y, bg.width, bg.height);
			/*noFill();  //checks get values and img draw locations
			strokeWeight(2);
			stroke(255);
			rect(0, config.Y-config.rate*this.player.T.y, bg.width, bg.height);
			strokeWeight(1);
			noStroke();//*/
		});
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