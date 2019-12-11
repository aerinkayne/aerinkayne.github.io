let elBurger = document.getElementById('burger');
let elNavLinks = document.getElementById('navLinks');
let themeOptions = document.getElementById('gridTheme'); 
let elGridDisplay = document.getElementsByClassName('gridDisplay');
elGridDisplay[0].style.display = "grid";

elBurger.addEventListener('click', ()=> {
	elBurger.classList.toggle('burgX');
	elNavLinks.classList.toggle('showNav');
})

//uses radio to change the class of element with the #gridDisplay id.  
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


