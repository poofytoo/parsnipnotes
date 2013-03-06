
// Toggles DEBUGGING in the console
var debug = true;

require(["underscore", "backbone", "views/chunks"], function(u,b,ChunksView) {
  if (debug) console.log('JavaScript Libraries Loaded');
  
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