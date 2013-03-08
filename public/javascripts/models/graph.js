define(["backbone"], function(Backbone){
// Model for a Chunk, the smallest unit of content

  var Graph = Backbone.Model.extend({
    initialize: function(){
    },
    
    urlRoot: '/_gatekeeper/graph/byID.json'
  });

  return Graph;
});
