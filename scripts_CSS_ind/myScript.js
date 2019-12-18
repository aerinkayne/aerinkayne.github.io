let elBurger = document.getElementById('burger');
let elNavLinks = document.getElementById('navLinks');
let waterItems;

let elGridDisplay = document.getElementsByClassName('gridDisplay');
if (elGridDisplay[0]){
	elGridDisplay[0].style.display = "grid";
	
	waterItems = document.getElementById('sandWater').getElementsByClassName('gridItem');
		for (let i=0; i< waterItems.length; i++){
			waterItems[i].addEventListener('click', ()=> {
				waterItems[i].style.transform = (waterItems[i].style.transform === 'rotateY(180deg)') ? 'rotateY(0deg)' : 'rotateY(180deg)';
			})
	}
}


let elDropBtn1 = document.getElementById('dropBtn1');
let elDrop1Content = document.getElementById('drop1Content');

elDropBtn1.addEventListener('click', ()=> {
	if (elDrop1Content.style.display === "none") {  
		elDrop1Content.style.display = "block";  
	} else {
		elDrop1Content.style.display = "none";
	}	
})


let themeOptions = document.getElementById('gridTheme'); 
//uses radio to change the class of element with the #gridDisplay id.  
if(themeOptions){
	themeOptions.addEventListener('change',()=> {
		let theme;
		for (let i = 0; i < themeOptions.length; i++){
			for (let j = 0; j< elGridDisplay.length; j++){
				//if radio btn checked and grid id is equal to btn's value, set display to grid
				if (themeOptions[i].checked && elGridDisplay[j].id === themeOptions[i].value){ 
					elGridDisplay[j].style.display = "grid";
				}
				else if (themeOptions[i].checked && elGridDisplay[j].id !== themeOptions[i].value){
					elGridDisplay[j].style.display = "none";
				}
			}
		}
	})	
}


elBurger.addEventListener('click', ()=> {
	elBurger.classList.toggle('burgX');
	elNavLinks.classList.toggle('showNav');
})

