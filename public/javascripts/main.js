

  // Toggles DEBUGGING in the console
  var debug = true;

  // model/CHUNK.JS
  require(["underscore", "backbone", "models/chunk"], function(util) {
    console.log('loaded!');


  // Collection of Chunks, or a pack - more commonly accessed form of content
  var Chunks = Backbone.Collection.extend({
    model: Chunk,
    url: function(){
      if (packName == "undefined"){
        packName = "teamparsnip";
      }
      return "/_gatekeeper/byID.json?packName="+packName;
    }
  });

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

  // Pack Router - allowing hash tags to change between pages
  var PackRouter = Backbone.Router.extend({
    routes: {
      ":query":               "search",  // #kiwis
    },
    initialize: function(chunksView) {
      this.chunksView = chunksView;
    },
    search: function(query){
      packName = query;
      this.chunksView.updateChunks();
    },

  });

  // Appview - view generator for the entire app
  var AppView = Backbone.View.extend({
    initialize: function(){

      var chunksView = new ChunksView();
      var packRouter = new PackRouter(chunksView);

      Backbone.history.start();
    }
  });

appView = new AppView();

  });