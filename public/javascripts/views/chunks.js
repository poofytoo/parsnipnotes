define([
  // These are path alias that we configured in our bootstrap
  'jquery',     // lib/jquery
  'underscore', // lib/underscore
  'backbone',   // lib/backbone
  'chunks'
], function($, _, Backbone, Chunks){ 
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
      var itemNumber = 0;

      _.each(this.collection.models, function(item){
          if (item.level == 12 || itemNumber == 0){
            headerOpen = "<h1>";
            headerClose = "</h1>";
          } else {
            headerOpen = "<h2>";
            headerClose = "</h2>";
          }
          itemNumber ++;
          html += headerOpen +item.title + headerClose + "<p>"+self.parseLinks(item.text)+" ("+item.level+")</p>"
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