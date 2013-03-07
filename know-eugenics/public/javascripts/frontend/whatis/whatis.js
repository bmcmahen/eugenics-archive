jQuery(document).ready(function() {

// jmpress slideshow

function displayShow(){

  $('#jmpress').jmpress({
     
      viewPort: {
        height: 1000,
        width: 1000,
        maxScale: 1
      },

      setActive: function(slide) {
        var id = $(slide).attr('id');
        if (id.indexOf('-') != -1) {
          id = id.substr(0, id.indexOf('-'));
        }
        $('#nav a').removeClass('ui-state-active');
        $('#nav a[href=#' + id + ']').addClass('ui-state-active');
      },

      afterStepLoaded: function(step, eventData) {
          $(step).find('code').each(function(){
            $(this).text($(this).html()).html();
          });
        },

      containerClass: 'ui-widget-content',
      fullscreen: false,
      areaClass: '',
      canvasClass: '',
      hash:  { use: false }
      });

}
  
displayShow();

// click event listeners
$('#tester').on('click', function(e){
  $('#jmpress').jmpress('goTo', '#step-4')
  return false
})

});
