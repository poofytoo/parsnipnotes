(function($){

  var Chunk = Backbone.Model.extend();

  var Chunks = Backbone.Collection.extend({
    model: Chunk,
    url: "/javascripts/temp.json",
    initialize: function(){
      console.log("start chunks!");
    }
  });

  var ChunksView = Backbone.View.extend({
    el: $('body'),

    events: {
      'click button#update': 'updateChunks'
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
      $(this.el).append("<button id='update'>Go Content!</button>");

      console.log("render!");
      console.log(this.collection);
      console.log(this.collection.toJSON());
    },

    updateChunks: function(){
      console.log('button');
      this.collection.fetch();
    }

  });

  var chunksView = new ChunksView();

})(jQuery);

