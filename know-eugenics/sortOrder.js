var _ = require('underscore');

var applySortOrder = function(object){

  // The desired order of the fields
  var sortOrder = {
    title: 0,
    shortDescription: 1,
    fullDescription: 2,
    date : 3
  }

  // If I want to retain the keys, I need to first
  // merge it into the array. Then, I'll sort the array
  // using that merged key.
  var newArray = [];

  for (var key in object) {
    var o = _.extend({value : object[key]}, {label: key});
    newArray.push(o);
  };


  return _.sortBy(newArray, function(val, i){
    return sortOrder[val.label];
  });

};



module.exports = applySortOrder; 