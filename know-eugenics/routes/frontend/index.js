/**
 * Public Routes
 *
 * Displays the primary pages for the know-eugenics
 * web page, including Timeline, Heroes&Villains, etc.
 *
 * Views are in ./views/frontend/... 
 * 
 */

var init = function(app) {

  /**
   * Main
   */
  
  app.get('/', function(req, res){ 
    res.render('frontend/index')
  });

  /**
   * Prods
   */
  
  var prodRoot = 'frontend/prods/';

  app.get('/discover', function(req, res){ 
    res.render(prodRoot)
  });

  app.get('/discover/heroes', function(req, res){ 
    res.render(prodRoot + 'heroes')
  });

  app.get('/discover/whatis', function(req, res){ 
    res.render(prodRoot + 'whatis')
  });

  app.get('/discover/history', function(req, res){ 
    res.render(prodRoot + 'history')
  });

  app.get('/discover/timeline', function(req, res){ 
    res.render(prodRoot + 'timeline')
  });

  app.get('/discover/institutions', function(req, res){ 
    res.render(prodRoot + 'institutions')
  });


  /**
   * Tools
   */
  
  var toolRoot = 'frontend/audio-video/';

  app.get('/tools', function(req, res){ 
    res.render(toolRoot)
  });

  app.get('/tools/people', function(req, res){ 
    res.render(toolRoot + 'people')
  }); 

}


module.exports = init; 