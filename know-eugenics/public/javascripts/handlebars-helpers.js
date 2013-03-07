
// Format a Date String to a specified format.
Handlebars.registerHelper('dateFormat', function(context, block) {
  if (window.moment) {
    var f = block.hash.format || "MMM Do, YYYY";
    return moment(context).format(f);
  }else{
    return context;   //  moment plugin not available. return data as is.
  };
});