define(function(require){  
  var Chunks = require("collections/chunks");
  var ChunksView = Backbone.View.extend({
    el: $('#note-panel'),

    events: {
      'click button#update' : 'updateChunks',
    },

    initialize: function(){
      _.bindAll(this, 'render');

      this.collection = new Chunks();
      this.collection.bind("reset", this.render, this);
      this.collection.bind("change", this.render, this);
      this.collection.fetch();
    },

    render: function(){
      var self = this;
      var html = "";

      _.each(this.collection.models, function(item){
          html += "<h1>"+item.title + "</h1><p>"+self.parseLinks(item.text)+" ("+item.level+")</p>"
      });

      $(this.el).html(html);
    },

    parseLinks: function(chunkText){
      output = chunkText.replace(/\[\[(.*?)\]\]/g,"<a class='linkBtn' href='#$1'>$1</a>");
      return output;
    },

    updateChunks: function(){
      if (debug) console.log('Updating Chunks - ' + packName);
      this.collection.fetch();
    },
  });
  return ChunksView
});