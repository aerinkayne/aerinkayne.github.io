
//header nav function for dropdowns
function dropList1() {
	var x = document.getElementById("drop1");
	if (x.style.display === "none") {
		x.style.display = "flex";
		} else {
		x.style.display = "none";
		}
}
		
function dropList2() {
	var x = document.getElementById("drop2");
	if (x.style.display === "none") {
		x.style.display = "flex";
		} else {
		x.style.display = "none";
		}
}

function dropList3() {
	var x = document.getElementById("drop3");
	if (x.style.display === "none") {
		x.style.display = "flex";
		} else {
		x.style.display = "none";
		}
}


//slideshow scrolling
function changeSlide(n) {
	for (var i = 0; i < slides.length; i++){
		slides[i].style.display = "none";
	}
	if (slideIndex + n < 1) {slideIndex = slides.length}
		else if (slideIndex + n > slides.length) {slideIndex = 1}
		else {slideIndex += n}
	showSlide(slideIndex);	
}
function showSlide(n) {
	for (var i = 0; i < slides.length; i++){
		slides[i].style.display = "none";
	}
	slides[slideIndex-1].style.display = "block";	
}
