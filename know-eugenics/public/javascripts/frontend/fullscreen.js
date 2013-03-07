// toggle full screen mode for app. apps still might need individual
// settings tweaked to expand properly with the wrapper. 

$(document).ready(function() {
   $('#fullscreenmode').on('click', function(e){
        var $app = $('#app');
         if ($app.hasClass('fullscreen')) {
            $(e.currentTarget).text('(Full Screen)')
             $app.removeClass('fullscreen');
             $('#modalbackdrop').removeClass('open');
              timelineSize($app.width(), 600)
           } else {
            $(e.currentTarget).text('(Exit Full Screen)')
            $app.addClass('fullscreen');
            $('#modalbackdrop').addClass('open');
            timelineSize($app.width() - 40, $app.height() - 110)
         }
      })

   function timelineSize(width, height){
    $('#mytimelinewrapper').width(width).height(height)
    vis.setSize(width + 'px', height + 'px')
    addSlider(width);
   }
})
     
