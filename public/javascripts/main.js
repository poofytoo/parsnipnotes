
// Toggles DEBUGGING in the console
var debug = true;

// Temporary GLOBAL Variable to ruin everything. Remove after test.
var searchQuery = "";

require(["underscore", "backbone", "views/chunks", "views/packlist","views/searchlist"], function(u,b,ChunksView,PacklistView,SearchlistView) {
  if (debug) console.log('JavaScript Libraries Loaded');
  
  // Pack Router - allowing hash tags to change between pages
  var PackRouter = Backbone.Router.extend({
    routes: {
      ":query":               "search",  // #kiwis
    },
    initialize: function(c, p) {
      this.chunksView = c;
      this.packlistView = p;
    },
    search: function(query){
      packName = query;
      this.chunksView.updateChunks();
      this.packlistView.render();
    },

  });

  // Appview - view generator for the entire app
  var AppView = Backbone.View.extend({
    initialize: function(){

      this.chunksView = new ChunksView();
      this.packlistView = new PacklistView();
      this.searchlistView = new SearchlistView();
      this.packRouter = new PackRouter(this.chunksView, this.packlistView);

      Backbone.history.start();
    }
  });

appView = new AppView();

});