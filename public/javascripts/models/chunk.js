define(function(require){
// Model for a Chunk, the smallest unit of content

  var Chunk = Backbone.Model.extend({
    initialize: function(){
      this.level = this.attributes['packLevel'];
      this.title = this.attributes['title'];
      this.text = this.attributes['content'];
    }
  });
  
  return Chunk;
});