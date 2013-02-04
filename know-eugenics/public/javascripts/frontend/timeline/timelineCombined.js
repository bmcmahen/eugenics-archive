// TO DO:
// 
// - hook up event listener for filtering data
// - implement tag field for category, url, etc., in the database
// 
(function(){

//
//
// Timeline Wrapper
// 
// 
var TimelineWrapper = function(){

  this.dom = {};
  this.dom.startNumber = document.getElementById('startDate');
  this.dom.endNumber = document.getElementById('endDate');

  this.visiblefirstdate = 1905;
  this.visiblelastdate = 2055;
  this.startDate = 1820;
  this.endDate = 2055; 

  this.options = {
    'height': "600px",
    'width': "100%",
    'start': new Date(this.visiblefirstdate, 0),
    'end': new Date(this.visiblelastdate, 0),
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

  var vis = this.vis = new links.Timeline(document.getElementById('mytimeline'));
  links.events.addListener(vis, 'rangechange', _.bind(this.onrangechange, this));
  this.bindEvents();
};

_.extend(TimelineWrapper.prototype, {

  // retrieve the timeline data from the server
  fetch: function(cb){
    var self = this;
    $.when( $.get('/api/documents/timeline') ).then( function(json){
      self.json = json;
      cb(json); 
    });
    return this; 
  },

  // bind dom events to functions
  bindEvents: function(){
    var self = this;
    $('.rightarrow').on('click', function(e){
      e.preventDefault();
      self.moveTimeline(0.2);
    });

    $('.leftarrow').on('click', function(e){
      e.preventDefault();
      self.moveTimeline(-0.2);
    });

    $('#setStartDate').on('click', function(e){
      e.preventDefault();
      self.setTime();
    });
  },

  // basic drawing logic. must call fetch first, and
  // optionally filter
  draw : function(){
    this.vis.draw(this.data, this.options);
    this.onrangechange();
  },

  // parses json from the database into correct format.
  parseJSON: function(json){
    json = json || this.json; 
    var dataLength = json.length
    , processedDatas = [];

    // Ensure that we have the necessary fields. If we don't
    // then simply don't append them to the timeline. 
    function valid(entry){
      if (entry.startDate
        || entry.date
        && entry.shortDescription
        && entry.fullDescription) {
        return true;
      } else {
        return false; 
      }
    }

    for (var i= 0; i < dataLength; i++){

      var obj = {}
        , compiled, html;

      if (valid(json[i])) {

        console.log(json[i]);
        
        // if an image is present, use image template
        if (json[i].image) {
          compiled = _.template($('#timeline-text').html());
          html = compiled(json[i]);
          obj.className = 'text'

        // if video is present, use video template
        } else if (json[i].video) {
          compiled = _.template($('#timeline-video').html());
          html = compiled(json[i]);
          obj.className = 'video' 

        // otherwise, consider it a regular text entry     
        } else {
          compiled = _.template($('#timeline-text').html());
          html = compiled(json[i]);
          obj.className = 'text'
        }

        // if endDate is defined, add it.
        if (json[i].endDate) {
          obj.end = new Date(json[i].endDate);
        }

        // if we only have a date field, then consider
        // it the start date. If we 
        if (json[i].date && !json[i].startDate)
          obj.start = new Date(json[i].date);
        else if (json[i].date && json[i].startDate)
          obj.start = new Date(json[i].startDate);
        else
          obj.start = new Date(json[i].startDate);

        obj.content = html; 

        console.log(obj);

        processedDatas.push(obj);
      }
    }

    this.data = processedDatas;
    return this; 
  },

  // filters the data given a set category String
  filterData : function(category) {
    if (category === false)
      this.data = this.parseJSON(this.json);

    var filtered =_.filter(json, function(entry, index){
      if (_.contains(entry.category, category)) return true
    });

    this.data = this.parseJSON(filtered);
  },

  // update timeline & slider given start and
  // end date. 
  setTime: function(startdate, enddate){
    var newStartDate, newEndDate, sliderSet; 

    if (!this.vis)
      return

    if (!startdate) {
      newStartDate = new Date(this.stringToDate(document.getElementById('startDate').value));
      newEndDate = new Date(this.stringToDate(document.getElementById('endDate').value));
      sliderSet = false;
    } else {
      newStartDate = new Date(startdate, 0); //0 = working with years. should change this is parse
      newEndDate = new Date(enddate, 0);
      sliderSet = true;
    }

    this.vis.setVisibleChartRange(newStartDate, newEndDate);
    this.onrangechange(true);

  },

  // Whenever the date range of timeline changes, run this.
  onrangechange: function(sliderSet) {
    var range = this.vis.getVisibleChartRange();

    this.dom.startNumber.value = Utilities.dateToString(range.start);
    this.dom.endNumber.value = Utilities.dateToString(range.end);

    if (sliderSet)
      this.slider.updatePosition(range);
  },

  // Converts a string to date. This isn't very robust. 
  // Consider using Moment? Or just built-in Javascript?
  stringToDate: function(input, format){
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
  },

  // Moves timeline either left or right by degree
  moveTimeline: function(degree){
    this.vis.move(degree);
    this.onrangechange(); 
  }

});

//
//
// Utilities
// 
// 
var Utilities = {
  dateToString: function(date){
    return date.getFullYear();
  }
}
  
// 
// 
// Slider Class 
// 
// 
var Slider = function(timeline){  
  this.el = $('#slider-range');
  this.timeline = timeline; 
}

_.extend(Slider.prototype, {

  addDragToSlider: function(){

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
      }
    });

    },

    drawSliderBackground: function(width){
      var t = this.timeline; 
      var wrapperWidth = width || $('#mytimelinewrapper').width();
      $('#slider-range').css('width', wrapperWidth);

      var numDivisions = 8;

      var pixelBlockSize = wrapperWidth / numDivisions;
      var yearBlockSize = ((t.endDate - t.startDate) / (numDivisions));
      if ($('.slider-date').length > 0) {
        $('.slider-date').remove();
      }
      var i;
      for (i = 1; i < numDivisions; i++) {
        var pixelTick = pixelBlockSize * i;
        var yearTickDecimal = (yearBlockSize * i) + t.startDate;
        var yearTick = yearTickDecimal.toPrecision(4);

        var element = document.createElement('div');
        element.className = "slider-date";

        element.style.position = "absolute";
        element.style.left = pixelTick + 'px';

        document.getElementById("slider").appendChild(element);
        element.innerHTML = yearTick;
      }
    },

    addSlider: function(width){
      width = width || null; 
      this.drawSliderBackground(width);
      this.el.dragslider({
        range: true,
        min: this.timeline.startDate,
        max: this.timeline.endDate,
        animate: true,
        rangeDrag: true,
        values: [this.timeline.visiblefirstdate, this.timeline.visiblelastdate],
        slide: function(event, ui) {
          var startingDate = ui.values[0];
          var endingDate = ui.values[1];
          setTime(startingDate, endingDate);
        }
      });
    },

    updatePosition: function(range){
      this.el.dragslider("option", "values", [Utilities.dateToString(range.start), Utilities.dateToString(range.end)]);
    }

});


// In which I actually instantiate everything

$(function(){
  // draw visualization
  var timeline = new TimelineWrapper();
  timeline.fetch(function(data){
    timeline.parseJSON().draw();
  });
  
  // add the slider
  var slider = new Slider(timeline);
  timeline.slider = slider; 
  slider.addDragToSlider();
  slider.addSlider(); 
});

})();