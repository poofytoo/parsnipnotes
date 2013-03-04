(function($){

  var Chunk = Backbone.Model.extend({

    initialize: function(){
      this.level = this.attributes['level'];
      this.title = this.attributes['title'];
      this.text = this.attributes['chunkText'];
    }
  });

  var Chunks = Backbone.Collection.extend({
    model: Chunk,
    url: function(){
      return "/javascripts/temp.json";
    },
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
          html += "<h1>"+item.title + "</h1><p>"+self.parseLinks(item.text)+" ("+item.level+")</p>"
      });

      $(this.el).html(html);
    },

    parseLinks: function(chunkText){
      output = chunkText.replace(/\[\[(.*?)\]\]/g,"<a href='#'>$1</a>");
      return output;
    },

    updateChunks: function(){
      console.log('button');
      this.collection.fetch();
    }

  });

  var chunksView = new ChunksView();

})(jQuery);

