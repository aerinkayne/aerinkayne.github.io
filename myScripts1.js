
//header nav functions for dropdowns
function dropList(dropID) {
	var x = document.getElementById(dropID);
	if (x.style.display === "none") {
		x.style.display = "flex";
		} else {
		x.style.display = "none";
		}
}
		


//slideshow functions
var NUM_SLIDESHOWS = 2;	
var slideIndex = [1,1]; // set initial slide shown for each slideshow to 1  

function loadSlideShows(NUM_SLIDESHOWS) {
	var SS = "SS";
	for (i = 0; i < NUM_SLIDESHOWS; i++) {
		SS = SS + i;	//get specific slideshow. concat by using "SS + a number" for each HTML slideshow id!
		displaySlide(SS, slideIndex[i]);
		SS = "SS"; // reset SS so it can be used again in this way
	}
}

function changeSlide(n, SS, index) {
	// all images associated with slides have 'mySlides' class, but each slideshow has a unique slideshow (SS) container  
	var slides = document.getElementById(SS).getElementsByClassName("mySlides");

	for (var i = 0; i < slides.length; i++){
		slides[i].style.display = "none";
	}
	//change slideIndex at the index associated with SS.  SS id in HTML should have a number affix to make this less confusing.
	if (slideIndex[index] + n < 1) {slideIndex[index] = slides.length}
		else if (slideIndex[index] + n > slides.length) {slideIndex[index] = 1}
		else {slideIndex[index] += n}

	displaySlide(SS, slideIndex[index]);	
}
function displaySlide(SS, n) {
	var slides = document.getElementById(SS).getElementsByClassName("mySlides");
	for (var i = 0; i < slides.length; i++){
		slides[i].style.display = "none";
	}
	slides[n-1].style.display = "block";	
}
