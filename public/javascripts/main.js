
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
                  "views/graph",
                  "views/createnotes"];

require(libraries, function(_,b,$,arbor,tinyMCE,ChunksView,PacklistView,SearchlistView,GraphView, CreatenotesView) {
  if (debug) console.log('JavaScript Libraries Loaded');

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
    el: $('#content'),

    events: {      
      'click div#add-item'    : 'newNote',
      'click li.list-newitem' : 'newNote',
    },
    newNote: function(e){

      this.createnotesView = new CreatenotesView({clicked: e.currentTarget.id, packlistView: this.packlistView});
      tinyMCE.init({
            mode : "specific_textareas",
            editor_selector : "editable",
            plugins : "latex, inlinepopups",
            theme_advanced_buttons1 : "bold,italic,underline,|,justifyleft,justifycenter,|,formatselect",
            theme_advanced_blockformats : "p,h1",
            theme_advanced_buttons2: "latex"
      });

    },
    initialize: function(){

      if (displayMode != 'graph'){
        this.chunksView = new ChunksView();
        this.packlistView = new PacklistView();
        this.searchlistView = new SearchlistView();

        // TODO (anyone) : THIS IS WRONG, lookat implementation of new CreatenotesView
        // FIX IT

        this.packRouter = new PackRouter(this.chunksView, this.packlistView);
      } else {
        this.graphView = new GraphView();
      }

      Backbone.history.start();
    }
  });

appView = new AppView();

});