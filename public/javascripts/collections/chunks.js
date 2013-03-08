define(["models/chunk", "backbone"], function(Chunk, Backbone){

  // Collection of Chunks, or a pack - more commonly accessed form of content
  var Chunks = Backbone.Collection.extend({
    model: Chunk,
    url: function(){
      return "/_gatekeeper/pack/byID.json";
    }
    
  });

  return Chunks;
});