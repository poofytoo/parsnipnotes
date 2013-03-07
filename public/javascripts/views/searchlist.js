define(function(require){  
  var Searchlist = require("collections/searchlist");
  var SearchlistView = Backbone.View.extend({

    el: $('#main-panel'),
    searchEl: $("#search-results"),
    searching: false,
    events: {
      'click input#search' : 'beginSearch',
      'keyup input#search' : 'reloadSearch',
      'change input#search' : 'exitSearch',
    },

    initialize: function(){
      _.bindAll(this, 'render');

      this.collection = new Searchlist({searchQuery:"hey"});
      this.collection.bind("reset", this.render, this);
      this.collection.fetch();
    },

    render: function(){
      var self = this;
      var html = "<ul>";

      _.each(this.collection.models, function(item){
        html += "<li><a href='#" + item.id + "'>" + item.title + " <span class='search-item-desc'>&#149; " +  self.removeLinks(item.text) + "</span></a></li>";
      });

      html += "</ul>"
      $(this.searchEl).html(html);
    },

    antiRender: function(){
      // hold on, before writing an antiRender function, lets wake up tomorrow and see
      // if this is a good idea. Sounds like it could be hacky.
    },

    removeLinks: function(chunkText){
      output = chunkText.replace(/\[\[(.*?)\]\]/g,"$1");
      return output;
    },

    beginSearch: function(){
      searching = true;
      if (debug) console.log('Start Search - ' + searching);

    },

    reloadSearch: function(event){
      if (!searching) searching = true;
      if (debug) console.log('Reloading Search - ' + searching);

      // This is terrible. Will find better solution later.
      /*
      charAdded = "";
      if (event.keyCode > 32 && event.keyCode < 127){
        charAdded = String.fromCharCode(event.keyCode);
        searchQuery = event.currentTarget.value + charAdded + ".json"; 
      } else {
        str = event.currentTarget.value;
        searchString = str.substring(0, str.length - 1);;
        searchQuery = searchString + ".json";
      }
      */
      
      searchString = event.currentTarget.value;
      this.collection.fetch({data: {q: searchString}});
      
      /*
      //FUTURE CODE, THIS IS BEAUTIFUL
      //present the updated searchQuery and it will be appended to the end
      this.collection.fetch({data: searchQuery});
      */
    },

    exitSearch: function(){
      searching = false;
      if (debug) console.log('Exit Search - ' + searching);

    },

  });
  return SearchlistView
});