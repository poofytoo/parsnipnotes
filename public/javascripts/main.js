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
      if (packName == "undefined"){
        packName = "teamparsnip";
      }
      return "/javascripts/"+packName+".json";
    }
  });

  var ChunksView = Backbone.View.extend({
    el: $('#note-panel'),

    events: {
      'click button#update' : 'updateChunks',
      'click a.linkBtn'     : 'reloadChunk'
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
      output = chunkText.replace(/\[\[(.*?)\]\]/g,"<a class='linkBtn' title='$1'>$1</a>");
      return output;
    },

    updateChunks: function(){
      console.log('button');
      this.collection.fetch();
    },

    reloadChunk: function(events){
      packName = events.currentTarget.title;
      this.collection.fetch();
    }

  });

  var chunksView = new ChunksView();

})(jQuery);

