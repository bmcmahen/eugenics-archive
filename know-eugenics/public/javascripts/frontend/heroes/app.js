/**
 * CUSTOM HIGHSLIDE
 */

hs.graphicsDir = '/highslide_graphics/';
hs.outlineType = 'custom3';
hs.wrapperClassName = 'draggable-header';
hs.showCredits = false;
hs.width = 400;
hs.headingEval = 'this.a.name';
hs.minHeight = 400;
hs.zIndexCounter = 1300;

// Extends highslide to focus on the proper content, for screen-readers.
hs.Expander.prototype.onAfterExpand = function() {
  //if paragraph exists, focus on first paragraph. Else read unformatted text.
  if ($(this.content).find('.highslide-maincontent p').length > 0) {
    var firstparagraph = $(this.content)
      .find('.highslide-maincontent p')
      .get(0);
    $(firstparagraph).attr('tabindex', -1).focus();
  } else {
    $(this.content).find('.highslide-maincontent').attr('tabindex', -1).focus();
  }

  //if paragraph exists, focus on first paragraph. Else, read unformatted text.
  if ($(this.wrapper).find('.highslide-caption p').length > 0) {
    var captionparagraph = $(this.wrapper).find('.highslide-caption p').get(0);
    $(captionparagraph).attr('tabindex', -1).focus();
  } else {
    $(this.wrapper).find('.highslide-caption').attr('tabindex', -1).focus();
  }
};

// Returns focus to proper element on close of highslide window.
hs.Expander.prototype.onAfterClose = function () {
  $(this.a).focus();
};


/**
 * Custom FlipCard
 */
jQuery(document).ready(function() {

$.when( $.get('/api/documents/heroes') ).then( function(data){

  // When clicking on a card, run 'showDetail'.
  FlipCard.CardView.prototype.events = {
    'click' : 'showDetail'
  };

  // Instantiate our FlipCard view.
  var flipcard = new FlipCard.AppView(data, {
    wrapper: "#flipcard-wrapper",
    toolbar: "#flipcard-toolbar",
    detailView: "#flipcard-detail",
    searchField: "#flipcard-search",
    toolbarTemplate: _.template($('#toolbar-template').html()),
    cardViewTemplate: Handlebars.compile($('#card-view-template').html()),
    detailViewTemplate: _.template($('#detail-view-template').html()),
    boxHeight: 300,
    boxWidth: 200,
    paddingWidth: 35,
    paddingHeight: 10,
    justified: true
  });

  // Handle flipping
  $('.front').on('click', function(){
    $(this).parent().addClass('flip');
  });

  $('.back').on('click', function() {
    $(this).parent().removeClass('flip');
  });


  // Enable popups
  $('.tooltip-trigger').tooltip({
    trigger: 'click'
  });

  $('.tooltip-trigger').on('click', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();
  });

  /**
   * Flip a random card to show the viewer that it's possible
   */
  var randomFlip = function() {
    var previousIndex,
        totalCards = $('.card').length;

   this.flip = function(){
     if (previousIndex) {
      $('.card').get(previousIndex).classList.remove('flip');
    }

    var randomIndex = function(){
      var newIndex = Math.floor(Math.random() * totalCards);
      if (newIndex === previousIndex) {
        randomIndex();
        return false;
      } else {
        previousIndex = newIndex;
        return newIndex;
      }
    };

    var random = randomIndex();
    if (random)  $('.card').get(random).classList.add('flip');
   };

    return this;
  }();

  setInterval(function(){
    randomFlip.flip();
  }, 10000);


  /**
   * Enter full screen mode
   */

  $('#fullscreenmode').on('click', function(e){
    var $app = $('#app');
    if ($app.hasClass('fullscreen')) {
      $(e.currentTarget).text('(Full Screen)');
      $app.removeClass('fullscreen');
      $('#modalbackdrop').removeClass('open');
      $('#flipcard-wrapper').width($('#app').width());
      flipcard.redraw();
    } else {
      $(e.currentTarget).text('(Exit Full Screen)');
      $app.addClass('fullscreen');
      $('#modalbackdrop').addClass('open');
      $('#flipcard-wrapper').width($('#app').width() - 50);
      flipcard.redraw();
    }
});

});

});
