define(["backbone"], function(Backbone){
// Model for a Chunk, the smallest unit of content

console.log("run once!");

  var Chunk = Backbone.Model.extend({
    initialize: function(){
      this.id = this.attributes['_id'];
      this.level = this.attributes['nodeLevel'];
      this.title = this.attributes['title'];
      this.text = this.attributes['content'];
    },
    
    urlRoot: '/_gatekeeper/chunk/byID.json'
  });

  return Chunk;
});
