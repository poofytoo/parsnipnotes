define(function(require){
  var Chunk = require("models/chunk");


  // Collection of Chunks, or a pack - more commonly accessed form of content
  var Graph = Backbone.Collection.extend({
    model: Chunk,
    url: function(){
      return "";
    }
    
  });

  return Graph;
});