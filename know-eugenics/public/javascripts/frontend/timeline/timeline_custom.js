/**
 * This is a custom script to build a timeline object
 * Ben McMahen, RA for LAE, University of Alberta
 * Where code has been snagged, I've tried to add the source before function.
 * 
 *
 */

// bug -> When window is resized, the captions disappear. 
// TO DO: Create a namespace so I don't have global variables!

//global variables
var data;
var vis; // timeline visualizer variable
var startDate = 1820;
var endDate = 2055;
var visiblefirstdate = 1905;
var visiblelastdate = 1920;


var json = [{
  name: 'Gregor Mendel Publishes His Paper on Heredity',
  startDate: '1866-2-20',
  description: 'February 20, 1866. Gregor Mendel, an Augustinian monk, publishes his paper, “Versuche über Pflanzenhybriden” (“Experiments on Plant Hybridization”), containing his findings on heredity in the journal Proceedings of the Natural History Society of Brunn. These findings, which demonstrate that inheritance follows particular laws, emerged from years of observations breeding pea plants at the experimental garden of the Augustinian Abbey of St. Thomas in Brno. Mendel’s work show that certain traits are dominant or recessive and how the combination thereof produces observable variations to characteristics such as flower colour or the texture of a seed. His work went largely unremarked for 35 years following publication, until it was independently duplicated by Hugo de Vries and Carl Correns in the 1890s. Mendel’s laws are often reduced to the general statement “like begets like,” which became a frequent justification for eugenic practices.',
  type: 'text',
  category: ['science']
}, {
  name: 'Francis Galton Publishes "Hereditary Genius"',
  startDate: '1869',
  description: '1869. Francis Galton publishes his influential book Hereditary Genius. Within it, he attempts to understand the heritability of human intelligence from a social sciences perspective. This volume proved a cornerstone of the nascent eugenics movement. A second edition, with a new preface by Galton, was released in 1892.',
  type: 'image',
  category: ['science'],
  imageThumb: '/timeline/francisgalton_thumb.jpg',
  image: '/timeline/francisgalton.jpg',
  thumbWidth: 250,
  thumbHeight: 174
},{
  name: "Charles Darwin Publishes 'The Descent of Man'",
  startDate: '1871',
  description: '1871. Charles Darwin expands on evolutionary theory in his book The Descent of Man, and Selection in Relation to Sex to directly follow the concepts introduced in On the Origin of Species. In this volume, he applies his theories to human evolution and discusses concepts related to human “races,” sexual differentiation and the relation of his evolutionary theory to human society. Most significantly, he discusses medical advances that allow “the weak” to reproduce, and cautions that reason (ie. disallowing their reproduction) should not replace sympathy. This book has entered the public domain and is available as an e-book here. More information about Darwin and his works, including full copies his publications, is available at The Complete Work of Charles Darwin Online.',
  type: 'image',
  imageThumb: '/timeline/descentofman_thumb.jpg',
  thumbWidth: 150,
  thumbHeight: 254,
  image: '/timeline/descentofman_large.jpg',
  category: ['science']
}, {
  name: 'Samuel Butler Publishes His Novel Erewhon, or, Over the Range',
  startDate: '1872',
  description: '1872. Samuel Butler anonymously publishes Erewhon, or, Over the Range, a bitingly satiric novel criticizing social Darwinism and eugenic utopias.',
  type: 'text',
  category: ['art']
}, {
  name: 'Francis Galton Coins the Term "Eugenics"',
  startDate: '1883-5-16',
  description: 'May 16, 1883. Francis Galton coins the term “eugenics.” He details the concept in his book Inquiries into Human Faculty and its Development, and recommends that individuals from families that rank highly in his merit system be encouraged to marry early and given incentives to have children. He also condemned late marriages within this same group as “dysgenic,” or disadvantageous to the human species.',
  type: 'text',
  category: ['science']
},
{
  name: 'Indiana Passes Eugenics-based Compulsory Sterilization Law',
  startDate: '1907',
  endDate: '1921',
  description: 'Indiana passed the first eugenics-based compulsory sterilization law in the world, setting an example for the thirty U.S. states that would follow. The law was overturned by the Indiana Supreme Court in 1921.',
  type: 'text',
  category: ['legislation', 'politics']
},
{
  name: 'California Introduces sterilization laws',
  startDate: '1909',
  endDate: '1964',
  description: 'Between 1909 and 1964, more than 20,000 people were sterilized.',
  type: 'text',
  category: ['legislation', 'politics']
},
{
  name: 'Alberta Hospital Ponoka Opens.',
  startDate: '1911',
  description: 'Alberta Hospital Ponoka opens. This institutions will ultimately be responsible for approximately 60% of cases considered by the Alberta Eugenics board.',
  type: 'image',
  category: ['institutions', 'eugenics in canada'],
  imageThumb: '/timeline/alberta_hospital_thumb.jpg',
  thumbHeight: 100,
  thumbWidth: 150,
  image: '/timeline/alberta_hospital_large.jpg'
}, {
  name: "Helen MacMurchy is Appointed Ontario's 'Inspector of the Feeble-minded.'",
  startDate: '1915',
  description: "Helen MacMurchy is appointed as Ontario's Inspector of the Feeble-minded. In this role, MacMurchy guides the National Council of Women to endorse sterilization as a means of preventing mothers from filling the cradles with degenerate babies.",
  type: 'image',
  imageThumb: '/timeline/HelenMacMurchy_thumb.jpg',
  image: '/timeline/HelenMacMurchy.jpg',
  thumbWidth: 139,
  thumbHeight: 203,
  category: ['people', 'eugenics in canada']
}, {
  name: 'The Canadian National Committee for Mental Hygienne (CNCMH) is Established',
  startDate: '1918',
  description: 'The Canadian National Committee for Mental Hygiene (CNCMH) is founded by Dr. Clarence M. Hincks and Clifford W. Beers. Its objectives included providing adequate care for the "mentally deficient" and preventing mental disease and "deficiency." This organization later becomes the present-day Canadian Mental Health Association.',
  type: 'text',
  category: ['organizations', 'science', 'eugenics in canada']
}, {
name: 'The United Farmers of Alberta govern Alberta.',
startDate: '1921',
endDate: '1935-8-22',
description: 'The United Farmers of Alberta (UFA) hold power in the Alberta Legislature.',
type: 'text',
category: ['politics', 'organizations', 'eugenics in canada']
},
 {
  name: 'Sterilization laws introduced in Virginia after Buck v. Bell',
  startDate: '1927',
  endDate: '1974',
  description: 'Sterilization rates under eugenic laws in the United States climbed from 1927 until Skinner v. Oklahoma, 316 U.S. 535 (1942). While Skinner v. Oklahoma did not specifically overturn Buck v. Bell, it created enough of a legal quandary to discourage many sterilizations. By 1963, sterilization laws were almost wholly out of use, though some remained officially on the books for many years. Virginia"s state sterilization law was repealed in 1974.',
  type: 'text',
  category: ['politics', 'legislation']
},
{
  name: 'Nazi Germany introduces Law for Prevention of Hereditarily Diseased Offspring',
  startDate: '1933-07-14',
  endDate: '1939',
  description: 'A statue in Nazy Germany which allowed for the compulsory sterilisation of any citizen who in opinion of a "Genetic Health Court" suffered from a list of alleged genetic disorders, many of which were not, in fact, genetic. The law was largely suspended in 1939.',
  type: 'text',
  category: ['politics', 'legislation']
},
{
name: 'The Alberta Social Credit Party governs Alberta.',
startDate: '1935-8-23',
endDate: '1971-8-30',
description: 'The Alberta Social Credit Party governs Alberta',
type: 'text',
category: ['politics', 'organizations', 'eugenics in canada']
}, {
name: 'Progressive Conservatives govern Alberta',
startDate: '1971-8-31',
endDate: '2012',
description: 'Progressive Conservatives govern Alberta',
type: 'text',
category: ['politics', 'organizations', 'eugenics in canada']
},
{
  name: 'The United Farm Women of Alberta Campaigns for Eugenic Sterilization',
  startDate: '1924',
  description: 'The United Farm Women of Alberta, under President Ms. Margaret Gunn, launches a campaign for public support for the sterilization of "mental defectives."',
  type: 'text',
  category: ['organizations', 'politics', 'eugenics in canada']
}, {
  name: 'The Sexual Sterilization Act is Enacted in the Province of Alberta',
  startDate: '1928',
  endDate: '1972',
  description: 'The Sexual Sterilization Act of Alberta is enacted by the Legislative Assembly of Alberta. This bill was first introduced on March 5, 1927, but was pulled from the schedule. On February 23, 1928, the Hon. George Hoadley, Minister of Health, reintroduced it to the Legilsative Assembly. It passed into law despite the efforts of the People"s League to Act to contest its constitutionality. This law formed the Alberta Eugenics Board, headed by Dr. John MacEachran, to oversee the sterilizations.',
  type: 'text',
  category: ['politics', 'legislation', 'eugenics in canada']
}, {
  name: 'Dr. John MacEachran is Appointed Head of the Alberta Eugenics Board',
  startDate: '1928',
  description: "Dr. John MacEachran, head of the University of Alberta's Department of Psychology and Philosophy, is appointed chairman of the Alberta Eugenics Board (AEB). The AEB was formed under the sexual Sterilization Act of Alberta, which passed into Alberta law this day. Its purpose was to administer the provices' sexual sterilization program and determine whether sterilization was appropriate on a case-by-case basis.",
  type: 'text',
  category: ['people', 'organizations', 'eugenics in canada']
}, {
  name: 'The First Ammednment to the Sexual Sterilization Act of Alberta is Passed',
  startDate: '1937',
  description: 'The first Amendment to the Sexual Sterilization Act of Alberta passes in the Alberta Legislature. This amendment was proposed by Dr. W.W. Cross, Social Credit Minister of Health, to address criticism that the Act was too restrictive in its original form. To amend these concerns, a distinction was made between psychotic persons and mentally defective persons. The criterion for sterilization was extended to include the risk of mental injury to the patient or progeny, in addition to cases determined to derive from genetic defect, as grounds for sterilization. Furthermore, consent of the person to be sterilized, or of their spouse, parent, guardian, or the Minister, was only to be required the case of psychotic persons. The exception from civil action was also extended to include both persons taking part in surgical operations and persons in charge of mental institutions referring patients to the Alberta Eugenics Board.',
  type: 'text',
  category: ['legislation', 'politics', 'eugenics in canada']
}, 
{
  name: 'Sweden Introduces Sterilization Laws.',
  startDate: '1934',
  endDate: '1976',
  description: 'Between 1976 60,000 Swedish women were sterilized',
  type: 'text',
  category: ['politics', 'legislation']
},{
  name: 'Adolf Hitler Enacts Action T-4',
  startDate: '1939-9-1',
  description: 'September 1, 1939. Adolf Hitler authorizes a program of euthanasia, primarily aimed at mentally or physically “incurable” persons in state, private, or church-run institutions. This follows a mass-killing of children under three with mental “defects,” heritable diseases and deformities in May of 1939. Action T-4 targeted both children and adults, resulting in the extermination of approximately 275,000 people by methods including medications, starvation and gas chambers.',
  type: 'image',
  imageThumb: '/timeline/hitler_thumb.jpg',
  image: '/timeline/hitler_large.jpg',
  thumbWidth: 200,
  thumbHeight: 236, 
  category: ['politics']
},
{
  name: 'The Second Ammendment to the Sexual Sterilization Act of Alberta is Passed in the Alberta Legislation',
  startDate: '1942',
  description: 'The second amendment to the Sexual Sterilization Act of Alberta is passed in the Alberta Legislature to broaden the category of mental patients who could be recommended for sterilization. The criteria now included persons with neurosyphillis, epilepsy accompanied by psychosis, mental deterioration and Huntington’s disease. The consent of the patient was required for these persons, with the exception of patients with Huntington’s chorea who were also psychotic.',
  type: 'text',
  category: ['legislation', 'politics', 'eugenics in canada']
}, {
  name: 'Dr. John MacEachran Steps Down as <br> Head of the Alberta Eugenics Board',
  startDate: '1968',
  description: 'Dr. John MacEachran steps down from his role as Head of the Alberta Eugenics Board, a position he held continuously from 1928. He is succeeded by R. K. Thomson, who saw the Alberta Eugenics Board through to the repeal of the Sexual Sterilization Act in 1972.',
  type: 'text',
  category: ['people', 'organizations', 'eugenics in canada']
}, {
  name: 'The Sexual Sterilization Act of Alberta is Repealed',
  startDate: '1972',
  description: 'The newly elected Progressive Conservative government of Alberta, headed by Premier Peter Lougheed, repeals the Sexual Sterilization Act of Alberta. The bill for the repeal was introduced by David King, MLA Edmonton Highlands. The Act was attacked on legal and moral grounds.',
  type: 'text',
  category: ['legislation', 'politics', 'eugenics in canada']
}, {
  name: 'Several Hundred Legal Actions are Initiated Against the Province of Alberta',
  startDate: '1995',
  description: 'Several hundred legal actions are initiated against the Province of Alberta by individuals who had been institutionalized and sterilized under the Sexual Sterilization Act of Alberta. The law firms of Field, Perraton, and Perraton (Jon Faulds and Sandra Anderson) and Parley-McLaws (Allan Garber) provide legal representation in these cases.',
  type: 'text',
  category: ['law', 'eugenics in canada']
}, {
  name: "Leilani Muir Sues Her Majesty the Queen in Right of Alberta",
  startDate: '1995',
  description: 'June 12, 1995. Leilani Muir sues Her Majesty the Queen in Right of Alberta for stigmatization as a moron, wrongful confinement and wrongful sterilization. Ms. Muir is represented by Jon Faulds and Sandra Anderson of the firm Field, Perraton, and Perraton, now Field Law.  The Hon. Madame Justice J.B. Veit, presiding over the Court of Queen’s Bench in Edmonton, rules in favour of the plaintiff and awards Muir $740,780 CAD and an additional sum of $230,000 CAD for legal costs.',
  type: 'text',
  category: ['law', 'people', 'eugenics in canada']
}, {
  name: 'The Alberta Consortium on the History of Eugenics is Formed',
  startDate: '2005',
  description: 'September 1, 2005. The Alberta Consortium on the History of Eugenics (ACHE) is formed.',
  type: 'text',
  category: ['organizations', 'eugenics in canada']
}, {
  name: 'Dr. Rob Wilson Launches the Living Archives on Eugenics in Western Canada Project',
  startDate: '2010',
  description: 'September 1, 2010. Dr. Rob Wilson, of the University of Alberta’s Department of Philosophy, is awarded a CURA SSRHC grant. This grant permits the formation of the Living Archives on Eugenics in Western Canada Project.',
  type: 'text',
  category: ['organizations', 'university', 'eugenics in canada']
}, {
  name: '"Remebering the History of Eugenics in Alberta Day" Proclaimed in Edmonton',
  startDate: '2010',
  description: 'October 14, 2010. The Living Archives for Eugenics in Western Canada project receives an official proclamation from the City of Edmonton declaring October 23, 2010 to be “Remembering the History of Eugenics in Alberta Day” in Edmonton.',
  type: 'text',
  category: ['organizations', 'eugenics in canada']
}, {
  name: 'Alberta Eugenics Awareness Week',
  category: ['eugenics in canada', 'organizations'],
  startDate: '2011-10-1',
  type: 'video',
  m4v: '/timeline/AlbertaEugenicsAwarenessWeek2011.mp4',
  imageThumb: '/timeline/AlbertaEugenicsAwarenessWeekThumb.jpg',
  thumbWidth: 400,
  thumbHeight: 300
}]


/* 
  Takes a JSON object and parses it into the correct JSON
  format used by timeline. 
*/
function parseJSON(json){

  var dataLength = json.length
    , processedDatas = [];

  for (var i= 0; i < dataLength; i++){

    var obj = {}
      , compiled, html;

    // compile html given type of document
    switch(json[i].type){
      case "text":
        compiled = _.template($('#timeline-text').html());
        html = compiled(json[i]);
        obj.className = 'text'
        break;
      case "image":
        compiled = _.template($('#timeline-image').html());
        html = compiled(json[i]);
        obj.className = 'image'
        break; 
      case "video":
        compiled = _.template($('#timeline-video').html());
        html = compiled(json[i]);
        obj.className = 'video'
        break; 
      default:
        compiled = _.template($('#timeline-text').html());
        html = compiled(json[i]);
        obj.className = 'text'
    }

    // if endDate is defined, add it.
    if (typeof json[i].endDate !== 'undefined') {
      obj.end = stringToDate(json[i].endDate);
    }

    obj.start = stringToDate(json[i].startDate);
    obj.content = html; 

    processedDatas.push(obj);
  }

  return processedDatas; 

}

/**
 * [filterData takes a string and filters the data collection if tag is present]
 * @param  {[string]} category [a string such as 'people']
 * @return {[array]}          [parsed array of new filtered data for insertion in timeline]
 */
function filterData(category) {

  if (category === false) return parseJSON(json)

  var filtered =_.filter(json, function(entry, index){
    if (_.contains(entry.category, category)) return true
  })

  return parseJSON(filtered)
}


function drawVisualization() { // Create and populate a data table.
	data =  parseJSON(json); 
	options = {
		'height': "600px",
		'width': "100%",
		'start': new Date(visiblefirstdate, 0),
		'end': new Date(visiblelastdate, 0),
		'min': new Date(1820, 0, 0),
		'max': new Date(2050, 0, 0),
		'invervalMin': 1000 * 60 * 60 * 24 * 31 * 3,
		'editable': false,
		'animate': true,
		'selectable': false,
		'style': "box",
		'showNavigation': true,
		'showCurrentTime': false
	};

	// Instantiate our timeline object.
	vis = new links.Timeline(document.getElementById('mytimeline'));

	// Attach event listeners
	links.events.addListener(vis, 'rangechange', onrangechange);

	// Draw our timeline with the created data and options 
	vis.draw(filterData('eugenics in canada'), options);

	//set the divs to the proper starting dates
	document.getElementById('startDate').value = dateToString(vis.start);
	document.getElementById('endDate').value = dateToString(vis.end);
}

//event listeners

// when the dom has loaded, build the timeline and add slider
$(window).ready(function(){
	drawVisualization(); 
	addSlider(); 
});

// function setImageDimensions(){
//   $('img.timeline-image').each(function(index){
//     var height = $(this).height()
//     var width = $(this).width()
//     $(this).css('width', width)
//     $(this).css('height', height)
//   })
// }

//when window loaded (including pictures) add caption
$(window).on("load", function() {

  // setImageDimensions(); 

  // get selected category, and filter the data, and redraw the timeline
      $('#timeline-filter').on('change', function(e){
        var txt =  $('#timeline-filter :selected').val().toLowerCase()
        var query = txt === 'all categories' ? false : txt
        var filteredData = filterData(query)

        // get chart range to draw it in same position
        var range = vis.getVisibleChartRange();
        var newOptions = _.extend(options, {
          start: range.start,
          end: range.end
        })

        vis.setData(filteredData)
        // vis.draw(filteredData, newOptions)
        return false
    })
});




// sets the visible date-range on the timeline
function setTime(startdate, enddate) {
	if (!vis) return;

	var newStartDate, newEndDate, sliderSet; 


	if (!startdate) {
		newStartDate = new Date(stringToDate(document.getElementById('startDate').value));
		newEndDate = new Date(stringToDate(document.getElementById('endDate').value));
		sliderSet = false;
	} else {
		newStartDate = new Date(startdate, 0); //0 = working with years. should change this is parse
		newEndDate = new Date(enddate, 0);
		sliderSet = true;
	}


	vis.setVisibleChartRange(newStartDate, newEndDate);
	onrangechange(sliderSet);
}

// on range change, update range fields and, possibly, slider range values	
function onrangechange(sliderSet) {
	var range = vis.getVisibleChartRange();

	var totalStartDate = range.start;
	var totalEndDate = range.end;

	document.getElementById('startDate').value = dateToString(range.start);
	document.getElementById('endDate').value = dateToString(range.end);

	if (sliderSet != true) {
		$("#slider-range").dragslider("option", "values", [dateToString(range.start), dateToString(range.end)]);
	}
}

// Formats date string (either YYYY, or YYYY-MM-DD) to date Object
// Should make this more sophisticated to deal with multiple inputs. 
function stringToDate(input, format) {

	var stringparts = input.split('-');
	if (stringparts.length == 1) {
		return new Date(input, 0);
	} else {
		format = format || 'yyyy-mm-dd'; // default format
		var parts = input.match(/(\d+)/g),
			i = 0,
			fmt = {};
		// extract date-part indexes from the format
		format.replace(/(yyyy|dd|mm)/g, function(part) {
			fmt[part] = i++;
		});
		return new Date(parts[fmt['yyyy']], parts[fmt['mm']] - 1, parts[fmt['dd']]);
	}
}

// Formats a date-object as a year string
function dateToString(date) {
	datetime = date.getFullYear();
	return datetime;
}

// moves the timeline either left or right
function moveTimeline(degree) {
	vis.move(degree);
	onrangechange();
}


// Adds dragging feature to the jQuery UI Slider.
(function($, undefined) {

	$.widget("ui.dragslider", $.ui.slider, {

		options: $.extend({}, $.ui.slider.prototype.options, {
			rangeDrag: false
		}),

		_create: function() {
			$.ui.slider.prototype._create.apply(this, arguments);
			this._rangeCapture = false;
		},

		_mouseCapture: function(event) {
			var o = this.options;

			if (o.disabled) return false;

			if (event.target == this.range.get(0) && o.rangeDrag == true && o.range == true) {
				this._rangeCapture = true;
				this._rangeStart = null;
			} else {
				this._rangeCapture = false;
			}

			$.ui.slider.prototype._mouseCapture.apply(this, arguments);

			if (this._rangeCapture == true) {
				this.handles.removeClass("ui-state-active").blur();
			}

			return true;
		},

		_mouseStop: function(event) {
			this._rangeStart = null;
			return $.ui.slider.prototype._mouseStop.apply(this, arguments);
		},

		_slide: function(event, index, newVal) {
			if (!this._rangeCapture) {
				return $.ui.slider.prototype._slide.apply(this, arguments);
			}

			if (this._rangeStart == null) {
				this._rangeStart = newVal;
			}

			var oldValLeft = this.options.values[0],
				oldValRight = this.options.values[1],
				slideDist = newVal - this._rangeStart,
				newValueLeft = oldValLeft + slideDist,
				newValueRight = oldValRight + slideDist,
				allowed;

			if (this.options.values && this.options.values.length) {
				if (newValueRight > this._valueMax() && slideDist > 0) {
					slideDist -= (newValueRight - this._valueMax());
					newValueLeft = oldValLeft + slideDist;
					newValueRight = oldValRight + slideDist;
				}

				if (newValueLeft < this._valueMin()) {
					slideDist += (this._valueMin() - newValueLeft);
					newValueLeft = oldValLeft + slideDist;
					newValueRight = oldValRight + slideDist;
				}

				if (slideDist != 0) {
					newValues = this.values();
					newValues[0] = newValueLeft;
					newValues[1] = newValueRight;

					// A slide can be canceled by returning false from the slide callback
					allowed = this._trigger("slide", event, {
						handle: this.handles[index],
						value: slideDist,
						values: newValues
					});

					if (allowed !== false) {
						this.values(0, newValueLeft, true);
						this.values(1, newValueRight, true);
					}
					this._rangeStart = newVal;
				}
			}

		},
	});
})(jQuery);

// does some math to draw the slider background
function drawSliderBackground(width) {
	var wrapperWidth = width || $('#mytimelinewrapper').width();
	$('#slider-range').css('width', wrapperWidth);

	var numDivisions = 8;

	var pixelBlockSize = wrapperWidth / numDivisions;
	var yearBlockSize = ((endDate - startDate) / (numDivisions));
	if ($('.slider-date').length > 0) {
		$('.slider-date').remove();
	}
	var i;
	for (i = 1; i < numDivisions; i++) {
		var pixelTick = pixelBlockSize * i;
		var yearTickDecimal = (yearBlockSize * i) + startDate;
		var yearTick = yearTickDecimal.toPrecision(4);

		var element = document.createElement('div');
		element.className = "slider-date";

		element.style.position = "absolute";
		element.style.left = pixelTick + 'px';

		document.getElementById("slider").appendChild(element);
		element.innerHTML = yearTick;
	}
};

// Initializes the dragslider for #slider-range div on html page. 
function addSlider(width) {
      width = width || null; 
	drawSliderBackground(width);
	$("#slider-range").dragslider({
		range: true,
		min: startDate,
		max: endDate,
		animate: true,
		rangeDrag: true,
		values: [visiblefirstdate, visiblelastdate],
		slide: function(event, ui) {
			var startingDate = ui.values[0];
			var endingDate = ui.values[1];
			setTime(startingDate, endingDate);
		}
	});
};

// for keyboard support

$(window).keydown(function(e){
  // command/control key 
  if (e.metaKey) {

    // left arrow
    if (e.keyCode == 37) {
      var current = vis.getSelection();
      console.log('current', current)
      var index = current.length > 0 ? current[0].row -1 : 0;
      vis.selectItem(index)
      return false
    }
    // right arrow
    if (e.keyCode == 39) {
      var current = vis.getSelection();
      console.log('current', current)
      var index = current.length > 0 ? current[0].row + 1 : 0;
      console.log('nextindex', index)
      vis.selectItem(index)
      return false
    }
  }
})
