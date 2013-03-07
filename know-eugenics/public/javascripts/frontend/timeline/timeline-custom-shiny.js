var timeline = function(attrs){
  this.data = attrs.data;
  this.parsedData = []; 
  this.startDate = attrs.startDate;
  this.endDate = attrs.endDate; 
  this.visibleFirstDate = attrs.visibileFirstDate;
  this.visibleLastDate = attrs.visibleLastDate; 
};

timeline.prototype.parseJson = function(){
   var json = this.data
    , dataLength = json.length
    , processedDatas = [];

  for (var i= 0; i < dataLength; i++){

    var obj = {}
      , item = json[i]
      , compiled
      , html;

    // compile html given type of document
    switch(item.type){

      case "text":
        compiled = _.template($('#timeline-text').html());
        html = compiled(item);
        break;

      case "image":
        compiled = _.template($('#timeline-image').html());
        html = compiled(item);
        break; 

      default:
        compiled = _.template($('#timeline-text').html());
        html = compiled(item);
    }

    // if endDate defined, add it.
    if (typeof item.endDate !== 'undefined') {
      obj.end = stringToDate(item.endDate);
    }

    obj.start = stringToDate(item.startDate);
    obj.content = html; 

    processedDatas.push(obj);
  }

  this.parsedData = processedDatas; 
  return this; 
};

timeline.prototype.drawVisualization = function() { // Create and populate a data table.
  options = {
    'height': "200px",
    'width': "100%",
    'start': new Date(visiblefirstdate, 0),
    'end': new Date(visiblelastdate, 0),
    'min': new Date(1850, 0, 0),
    'max': new Date(2015, 0, 0),
    'invervalMin': 1000 * 60 * 60 * 24 * 31 * 3,
    'editable': false,
    'animate': true,
    'selectable': false,
    'style': "box",
    'showNavigation': true,
    'showCurrentTime': false
  };

  // Instantiate our timeline object.
  this.vis = new links.Timeline(document.getElementById('mytimeline'));

  // Attach event listeners
  links.events.addListener(this.vis, 'rangechange', onrangechange);

  // Draw our timeline with the created data and options 
  this.vis.draw(this.parsedData, options);

  //set the divs to the proper starting dates
  document.getElementById('startDate').value = this.dateToString(vis.start);
  document.getElementById('endDate').value = this.dateToString(vis.end);
};


timeline.prototype.setTime = function(startdate, enddate) {
  if (!this.vis) return;

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

  this.vis.setVisibleChartRange(newStartDate, newEndDate);
  this.onrangechange(sliderSet);
};


timeline.prototype.onRangeChange = function(sliderSet) {
  var range = vis.getVisibleChartRange()
    , totalStartDate = range.start
    , totalEndDate = range.end;

  document.getElementById('startDate').value = dateToString(range.start);
  document.getElementById('endDate').value = dateToString(range.end);

  if (sliderSet !== true) {
    $("#slider-range").dragslider("option", "values", [this.dateToString(range.start), this.dateToString(range.end)]);
  }
};

timeline.prototype.stringToDate = function(input,format) {

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
};


timeline.prototype.dateToString = function(date){
  return date.getFullYear();
};

timeline.prototype.moveTimeline = function(degree){
  this.vis.move(degree);
  this.onRangeChange(); 
};

timeline.prototype.addCaption = function() {
  $('a > img[style]').each(function() {
    $el = $(this);
    var style = $el.attr('style');
    $el.attr('style', '');
    $el.parent().attr('style', style);
  }); //Moves the inline styles
  $("img").each(function() {
    var title = $(this).attr('alt');
    $(this).after('<span class="caption">' + title + '</span>');
  }); //Adds the dynamic captions.
};

timeline.prototype.drawSliderBackground = function() {
  var wrapperWidth = $('#mytimelinewrapper').width();
  $('#slider-range').css('width', wrapperWidth);

  var numDivisions = 8
    , pixelBlockSize = wrapperWidth / numDivisions
    , yearBlockSize = ((endDate - startDate) / (numDivisions));

  if ($('.slider-date').length > 0) {
    $('.slider-date').remove();
  }

  for (var i = 1; i < numDivisions; i++) {
    var pixelTick = pixelBlockSize * i
      , yearTickDecimal = (yearBlockSize * i) + startDate
      , yearTick = yearTickDecimal.toPrecision(4)
      , element = document.createElement('div');

    element.className = "slider-date";

    element.style.position = "absolute";
    element.style.left = pixelTick + 'px';

    document.getElementById("slider").appendChild(element);
    element.innerHTML = yearTick;
  }
};

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

      if (event.target == this.range.get(0) && o.rangeDrag === true && o.range === true) {
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

    }
  });
})(jQuery);



timeline.prototype.addSlider = function(){
  var self = this; 
  this.drawSliderBackground();
  $("#slider-range").dragslider({
    range: true,
    min: self.startDate,
    max: self.endDate,
    animate: true,
    rangeDrag: true,
    values: [self.visibleFirstDate, self.visibleLastDate],
    slide: function(event, ui) {
      var startingDate = ui.values[0]
        , endingDate = ui.values[1];
      self.setTime(startingDate, endingDate);
    }
  });
};




var json = [{
  name: "Gregor Mendel Publishes His Paper on Heredity",
  startDate: "1866-2-20",
  description: 'Gregor Mendel, an Augustinian monk, publishes his paper, "Versuche über Pflanzenhybriden" ("Experiments on Plant Hybridization"), containing his findings on heredity in the journal Proceedings of the Natural History Society of Brunn. These findings, which demonstrate that inheritance follows particular laws, emerged from years of observations breeding pea plants at the experimental garden of the Augustinian Abbey of St. Thomas in Brno.',
  type: 'text'
},{
  name: "Francis Galton Publishes <em>Hereditary Genius.</em>",
  startDate: "1869",
  description: 'Francis Galton publishes his influential book Hereditary Genius. Within it, he attempts to understand the heritability of human intelligence from a social sciences perspective. This volume proved a cornerstone of the nascent eugenics movement.',
  type: 'text'
},
{
  name: "Gregor Mendel Publishes His Paper on Heredity",
  startDate: "1866-2-20",
  description: 'Gregor Mendel, an Augustinian monk, publishes his paper, "Versuche über Pflanzenhybriden" ("Experiments on Plant Hybridization"), containing his findings on heredity in the journal Proceedings of the Natural History Society of Brunn. These findings, which demonstrate that inheritance follows particular laws, emerged from years of observations breeding pea plants at the experimental garden of the Augustinian Abbey of St. Thomas in Brno.',
  type: 'text'
},
{
  name: "Gregor Mendel Publishes His Paper on Heredity",
  startDate: "1866-2-20",
  endDate: "1934",
  description: 'Gregor Mendel, an Augustinian monk, publishes his paper, "Versuche über Pflanzenhybriden" ("Experiments on Plant Hybridization"), containing his findings on heredity in the journal Proceedings of the Natural History Society of Brunn. These findings, which demonstrate that inheritance follows particular laws, emerged from years of observations breeding pea plants at the experimental garden of the Augustinian Abbey of St. Thomas in Brno.',
  type: 'text'
},
 {
  name: "Charles Darwin Publishes <em> The Descent of Man </em>",
  type: 'image',
  startDate: "1871",
  image: "images/descentofman_large.jpg",
  imageThumb: "images/descentofman_thumb.jpg",
  description: 'Charles Darwin expands on evolutionary theory in his book The Descent of Man, and Selection in Relation to Sex to directly follow the concepts introduced in On the Origin of Species. In this volume, he applies his theories to human evolution and discusses concepts related to human "races," sexual differentiation and the relation of his evolutionary theory to human society. Most significantly, he discusses medical advances that allow "the weak" to reproduce, and cautions that reason (ie. disallowing their reproduction) should not replace sympathy.'
},{
  name: "Test Video",
  type: 'video',
  startDate: '1900',
  m4v: "http://www.jplayer.org/video/m4v/Big_Buck_Bunny_Trailer.m4v",
  webm: "http://www.jplayer.org/video/webm/Big_Buck_Bunny_Trailer.webm",
  imageThumb: "images/test_video_thumb.png"
}];

var mySuperTimeline = new timeline({
  data: json,
  startDate: 1850,
  endDate: 2015,
  visibleFirstDate: 1860,
  visibleLastDate: 1880
});

$(window).ready(function(){
  mySuperTimeline.drawVisualization(); 
  mySuperTimeline.addSlider();
});