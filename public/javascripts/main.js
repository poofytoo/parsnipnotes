
// Toggles DEBUGGING in the console
var debug = true;

// Temporary GLOBAL Variable to ruin everything. Remove after test.
var searchQuery = "";

require.config({
  paths: {
    jquery: 'lib/jquery',
    underscore: 'lib/underscore',
    backbone: 'lib/backbone',
    arbor: 'lib/arbor',
    tinyMCE: 'lib/tiny_mce/tiny_mce',
    chunks: 'collections/chunks'
  },
  shim: {
    'backbone': {
        //These script dependencies should be loaded before loading
        //backbone.js
        deps: ['underscore', 'jquery'],
        //Once loaded, use the global 'Backbone' as the
        //module value.
        exports: 'Backbone'
    },
    'underscore': {
        exports: '_'
    },
    'tinyMCE': {
        deps: ['jquery'],
        exports: 'tinyMCE'
    }
  }
});

var libraries = [ "underscore", 
                  "backbone", 
                  "jquery", 
                  "arbor",
                  "tinyMCE",
                  "views/chunks", 
                  "views/packlist",
                  "views/searchlist",
                  "views/graph"];

require(libraries, function(_,b,$,arbor,tinyMCE,ChunksView,PacklistView,SearchlistView,GraphView) {
  if (debug) console.log('JavaScript Libraries Loaded');
  tinyMCE.init({
        mode : "textareas"
  });
  // Pack Router - allowing hash tags to change between pages
  var PackRouter = Backbone.Router.extend({
    routes: {
      ":query":               "search", 
    },
    initialize: function(c, p) {
      this.chunksView = c;
      this.packlistView = p;
    },
    search: function(query){
      console.log(displayMode);
      packName = query;
      this.chunksView.updateChunks();
      this.packlistView.render();
    },

  });

  // Appview - view generator for the entire app
  var AppView = Backbone.View.extend({
    initialize: function(){

      if (displayMode != 'graph'){
        this.chunksView = new ChunksView();
        this.packlistView = new PacklistView();
        this.searchlistView = new SearchlistView();
        this.packRouter = new PackRouter(this.chunksView, this.packlistView);
      } else {
        this.graphView = new GraphView();
      }

      Backbone.history.start();
    }
  });

appView = new AppView();

});