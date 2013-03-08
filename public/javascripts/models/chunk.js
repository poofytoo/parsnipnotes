define(["backbone"], function(Backbone){
// Model for a Chunk, the smallest unit of content

console.log("run once!");

  var Chunk = Backbone.Model.extend({
    initialize: function(){
    },
    
    urlRoot: '/_gatekeeper/chunk/byID.json'
  });

  return Chunk;
});