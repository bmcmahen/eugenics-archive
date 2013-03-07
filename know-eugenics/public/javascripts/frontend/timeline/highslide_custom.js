/* optionally override the settings at the top of the highslide.js file */
		hs.graphicsDir = '/highslide_graphics/';
		hs.outlineType = 'custom3';
		hs.wrapperClassName = 'draggable-header';
		hs.showCredits = false;
		hs.width = 300; 
		hs.headingEval = 'this.a.name'; 
		hs.minHeight = 150; 
		hs.zIndexCounter = 1300; 


// Manages proper focusing for use with screenreaders. 
hs.Expander.prototype.onAfterExpand = function() {

//if paragraph exists, focus on first paragraph. Else read unformatted text. 
if ($(this.content).find('.highslide-maincontent p').length > 0) {
	var firstparagraph = $(this.content).find('.highslide-maincontent p').get(0); 
	$(firstparagraph).attr('tabindex', -1).focus(); 
} else {
	$(this.content).find('.highslide-maincontent').attr('tabindex', -1).focus(); 
};

//if paragraph exists, focus on first paragraph. Else, read unformatted text.
if ($(this.wrapper).find('.highslide-caption p').length > 0) {
	var captionparagraph = $(this.wrapper).find('.highslide-caption p').get(0); 
	$(captionparagraph).attr('tabindex', -1).focus(); 
} else {
	$(this.wrapper).find('.highslide-caption').attr('tabindex', -1).focus(); 
};

};  

// Returns focus to proper element on close of highslide window. 
hs.Expander.prototype.onAfterClose = function () {
	$(this.a).focus(); 
};



// displays greeting
//window.onload = function () {
//var heading = document.getElementById("start-info"); 
//return hs.htmlExpand(heading, {maincontentId:'start-content', headingText: 'Living Archives on Eugenics - Timeline', width: '350'}); 
//}