var hangman = 'Hangman Word Game. Test your vocabulary knowledge, how much do you know flags of countries? Try this Hangman Game.';
var to_do_lists = 'To-Do event list. Sign up to create groups and add events to it. Group could be Groceries, Buckelist. Depending on what you choose.';
var scientific_calculator = 'A fully functional responsive scientific calculator.';
var word_counter = 'Counts and gives you a breakdown of all characters and keywords in your text and how often they appear.';
var hangman = 'Hangman Word Game. Test your vocabulary knowledge, how much do you know flags of countries? Try this Hangman Game.';
var fitdpattern = 'A grid of 3x3 Tiles, move the tiles around the match the pattern randomly generated.';
var countries_api = 'Search and find countries based on languages, population, region etc.';
var find_the_penguins = 'Click on the Penguins as fast as you can before Yeti finds you. The speed at which the penguins pop out increases as you play.';
var todo = 'Organises your Todo tasks into groups, you can customise task groups to have unique colour themes and also adjust the priority. There\'s the option to set due dates to task items Search based on task items or groups. Look at the graphical summary of your task groups and many more';
var todoMobile = 'Organises your Todo tasks into groups, you can customise task groups to have unique colour themes and also adjust the priority. There\'s the option to set due dates to task items Search based on task items or groups. Look at the graphical summary of your task groups and many more. (Android App).';

const MIN_DISTANCE = 85; //required min distance traveled to be considered swipe
const MAX_SWIPE_DURATION = 1000; // maximum time allowed to travel that distance
var trayIcon,
        startX,
        startY,
        dist,
        elapsedTime,
        startTime;
var activeModal = '';

$(document).ready(function(){
	$(document).keyup(function(e) {
		 if (e.keyCode == 27 && activeModal != '') { // escape key maps to keycode `27`
			$(activeModal).find('.close')[0].click();
			activeModal = '';
			closeImagePopUp();
		} else if(e.keyCode == 37 && document.getElementById('fullImageWrapper').style.display != 'none') { // Left Arrow
			navigateImageLeftFull();
		} else if(e.keyCode == 39 && document.getElementById('fullImageWrapper').style.display != 'none') { // Right Arrow
			navigateImageRightFull();
		}
	});
	$('.image-nav').on('click', function(e) {
		var $target = $(e.currentTarget);
		if(!$target.hasClass('active-nav')) {
			slide($target.attr('data-image-index'));
			refreshTimer();
		}
	});
	$('.right-arrow').on('click', function(e) {
		$el = $(e.currentTarget);
		var imageEl = $el.siblings('img');
		var src = imageEl.attr('src');
		var imageNumber =  getImageNumber(src);
		if(!isNaN(imageNumber)) {
			var new_src;
			//get next
			var next = ++imageNumber;
			if(next > 3 || next < 1) {
				return;
			} else if(next == 3) {
				hideElement($el);
			} 
			var $leftArrow = $el.siblings('.left-arrow');
			showElement($leftArrow)
			new_src = src.substring(0, src.length - 5) + next + '.PNG';
			imageEl.fadeOut(function() {
				imageEl.attr('src', new_src);
				imageEl.fadeIn();
				
			});
		}
	});
	$('.left-arrow').on('click', function(e) {
		$el = $(e.currentTarget);
		var imageEl = $el.siblings('img');
		var src = imageEl.attr('src');
		var imageNumber = getImageNumber(src);
		if(!isNaN(imageNumber)) {
			var new_src;
			//get next
			var prev = --imageNumber;
			if(prev > 3 || prev < 1) {
				return;
			} else if(prev == 1) {
				hideElement($el);
			} 
			var $rightArrow = $el.siblings('.right-arrow');
			showElement($rightArrow);
			new_src = src.substring(0, src.length - 5) + prev + '.PNG';
			imageEl.fadeOut(function() {
				imageEl.attr('src', new_src);
				imageEl.fadeIn();
				
			});
		}
	});
	$('.modal').on('hidden.bs.modal', function() {
		activeModal = '';
		$('body').css('overflow', 'visible');
		clearInterval(slideTimer);
	});
	$('.modal').on('shown.bs.modal', function(el) {
		activeModal = el.currentTarget;
		$('body').css('overflow', 'hidden');
		$(activeModal).css('padding-left', '17px');
		
		startTimer();
		
	});
	$('.modal-close').on('click', function() {
	});
	$('#closeImage').on('click', function() {
		closeImagePopUp();
	});
	$('.full-left-arrow').on('click', function() {
		navigateImageLeftFull();
	});
	$('.full-right-arrow').on('click', function(){
		navigateImageRightFull();
	});
	$('.image-arrow').on('click', function(e){
		var $el = $(e.currentTarget);
		var index = Number($el.parent().find('.active-nav').attr('data-image-index'));
		if($el.hasClass('image-arrow-left')) {
			index-=1;
		} else {
			index+=1;
		}
		slide(index);
		refreshTimer();
	})
	
	/* Swipe event for sliding out the the images in full image mode */
	var fullImage = document.getElementById('fullImage');
	fullImage.addEventListener('touchstart', function(e){
		var touchobj = e.changedTouches[0];
		dist = 0;
		startX = touchobj.pageX;
		startY = touchobj.pageY;
		startTime = new Date().getTime(); // record time when finger first makes contact with surface
	}, false)

	/*fullImage.addEventListener('touchmove', function(e){
		e.preventDefault(); // prevent scrolling
	}, false);*/

	fullImage.addEventListener('touchend', function(e){
		var touchobj = e.changedTouches[0];
		dist = touchobj.pageX - startX; // get total dist traveled by finger while in contact with surface
		left_dist = startX - touchobj.pageX;
		elapsedTime = new Date().getTime() - startTime; // get time elapsed
		// check that elapsed time is within specified, horizontal dist traveled >= MIN_DISTANCE, and vertical dist traveled <= 100
		var swiperightBol = (elapsedTime <= MAX_SWIPE_DURATION && dist >= MIN_DISTANCE);// && Math.abs(touchobj.pageY - startY) <= 90);
		var swipeleftBol = (elapsedTime <= MAX_SWIPE_DURATION && left_dist >= MIN_DISTANCE);// && Math.abs(touchobj.pageY - startY) <= 60);
		if(swiperightBol) {
			navigateImageLeftFull();
		} else if(swipeleftBol) {
			navigateImageRightFull();
		}
	});
	
});

function refreshTimer() {
	clearInterval(slideTimer);
	startTimer();
}

function startTimer() {
	slideTimer = setInterval(function(){
	var index = Number($(activeModal).find('.active-nav').attr('data-image-index'))+1;
	return slide(index);
	}, 5500);
}

var slideTimer = 0;
function slide(next){
	if(!activeModal) {
		return;
	}
	//get the image in the modal
	var imageEl = $(activeModal).find('.project-details-image');
	var src = imageEl.attr('src');
	if(next < 1 || next > 3) {
		next = 1;
	} 
	if(next == 1) {
		$(activeModal).find('.image-arrow-left').css('display', 'none');
		$(activeModal).find('.image-arrow-right').css('display', 'block');
	}
	if(next == 2) {
		$(activeModal).find('.image-arrow-left').css('display', 'block');
		$(activeModal).find('.image-arrow-right').css('display', 'block');
	}
	if(next == 3) {
		$(activeModal).find('.image-arrow-right').css('display', 'none');
		$(activeModal).find('.image-arrow-left').css('display', 'block');
	}
	var new_src = src.substring(0, src.length - 5) + next + '.PNG';
	imageEl.fadeOut(700, 'linear', function() {
		imageEl.attr('src', new_src);
		imageEl.fadeIn(300, 'linear');
	});
	$(activeModal).find('.active-nav').removeClass('active-nav');
	$(activeModal).find(`[data-image-index='${next}']`).addClass('active-nav');
}

function navigateImageLeftFull () {
	var imageEl = $('#fullImageWrapper').find('img');
	var src = imageEl.attr('src');
	var imageNum = getImageNumber(src);
	var prev = --imageNum
	if(prev > 3 || prev < 1) {
		return;
	} else if(prev == 1) {
		hideElement($('.full-left-arrow'));
	}
	showElement($('.full-right-arrow'));
	var new_src = src.substring(0, src.length - 5) + prev + '.PNG';
	imageEl.fadeOut(function() {
		imageEl.attr('src', new_src);
		imageEl.fadeIn();
	});
}

function navigateImageRightFull () {
	var imageEl = $('#fullImageWrapper').find('img');
	var src = imageEl.attr('src');
	var imageNum = getImageNumber(src);
	var next = ++imageNum
	if(next > 3 || next < 1) {
		return;
	} else if(next == 3) {
		hideElement($('.full-right-arrow'));
	}
	showElement($('.full-left-arrow'));
	var new_src = src.substring(0, src.length - 5) + next + '.PNG';
	imageEl.fadeOut(function() {
		imageEl.attr('src', new_src);
		imageEl.fadeIn();
	});
}

function getImageNumber(src) {
	//This function assumes the image is .png 
	return imageNumber = src.substr(src.length - 5, 1);
}

function hideElement($el) {
	$el.fadeOut();
}
function showElement($el) {
	$el.fadeIn();
}
function closeImagePopUp () {
	$('#fullImage').find('img').attr('src', '');
	$('.header_area').css('position', 'fixed');
	$('body').css('overflow', 'visible');
	$('#fullImageWrapper').fadeOut();
}