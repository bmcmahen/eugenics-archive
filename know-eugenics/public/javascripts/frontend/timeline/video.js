
// Custom thumbnail to video player swapper, created by Ben McMahen - March, 2012. 
// requires jQuery. 

$(window).load(function() {

$('.vidwrapper').on('click', playVideo); 

function playVideo() {

    $(this).off('click');

    console.log($(this))

    //get video attributes and placeholder
    var wrapper = $(this);
    var placeholder = $(wrapper).html();
    var m4v = $(wrapper).attr('m4v');
    console.log(m4v)

    var imgheight = $(wrapper).find('img').height();
    var imgwidth = $(wrapper).find('img').width();

    //replace image with video
    $(wrapper).find('img').replaceWith("<video autoplay='autoplay' controls> Doh! Your browser does not support the <code>video</code> element.</video>");

    //create objects
    var video = $(wrapper).find('video').get(0);
    var playbutton = $(wrapper).find('.vidplay').get(0);

    //video settings
    video.controls = false;
    video.src = m4v;
    video.width = imgwidth;
    video.height = imgheight;

    //add event listeners
    video.addEventListener('ended', videoEnd, false);
    video.addEventListener('pause', videoEnd, false);
    video.addEventListener('play', videoPlay, false);

    function videoPlay() {
        $(playbutton).css("background-image","url(/timeline/stop.png)");   
        $(wrapper).find('.caption').hide();                             
    }
    
     //set video to stop when button clicked
    $(playbutton).on('click', function() {
            video.pause();
        });
    
 
    function videoEnd() {
        $(wrapper).html(placeholder);
        $(wrapper).on('click', playVideo);
        video.src = '';
        video.load();
    }
};

}); 