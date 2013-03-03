(function($){

  var Chunk = Backbone.Model.extend();

  var Chunks = Backbone.Collection.extend({
    model: Chunk,
    url: "/javascripts/temp.json",
    initialize: function(){
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
      var html = "";

      //html += "<button id='update'>Go Content!</button>";

      _.each(this.collection.models, function(item){
          title = item.attributes['title'];
          text = item.attributes['chunkText'];
          html += "<h1>"+title+"</h1><p>"+text+"</p>"
      });

      $(this.el).html(html);
    },

    updateChunks: function(){
      console.log('button');
      this.collection.fetch();
    }

  });

  var chunksView = new ChunksView();

})(jQuery);

