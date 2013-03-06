define(function(require){
  var Chunk = require("models/chunk");


  // Collection of Chunks, or a pack - more commonly accessed form of content
  var Chunks = Backbone.Collection.extend({
    model: Chunk,
    url: function(){
      return "/_gatekeeper/packByID.json/"+packName;
    }
    
  });

  return Chunks;
});