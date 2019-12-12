let elGridDisplay = document.getElementsByClassName('gridDisplay');
elGridDisplay[0].style.display = "grid";

let elBurger = document.getElementById('burger');
let elNavLinks = document.getElementById('navLinks');
let themeOptions = document.getElementById('gridTheme'); 
let dropBtns = document.getElementsByClassName('dropdown'); //there's only 1


//IE why do you hate us?
function getTarget(e) {
	if (!e) {
		e = window.event;
	}
	return e.target || e.srcElement;
}

//first li within ul#navLinks
dropBtns[0].addEventListener('click', (e)=> {
	let target = getTarget(e);
	let children = target.childNodes; 
	let drop;  //need to change display property of this element
	for (let i = 0; i < children.length; i ++) {  
		if (children[i].className === "dropdownContent") {  //use a param later 
			drop = children[i];  //get correct element amidst whitespace nodes
		}
	}
	if (drop.style.display === "none") {  
		drop.style.display = "block";  //hope that the hover in CSS doesn't break the &world
		} else {
		drop.style.display = "none";
		}	
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

elBurger.addEventListener('click', ()=> {
	elBurger.classList.toggle('burgX');
	elNavLinks.classList.toggle('showNav');
})

