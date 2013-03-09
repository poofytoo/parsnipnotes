define(function(require){  
  var Searchlist = require("collections/searchlist");
  var SearchlistView = Backbone.View.extend({
    
    searchString: "",

    el: $('#main-panel'),
    searchEl: $("#search-results"),
    searching: false,
    events: {
      'click input#search'    : 'reloadSearch',
      'click'                 : 'closeSearch',
      'keyup input#search'    : 'reloadSearch',
      'change input#search'   : 'exitSearch',
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
        html += "<li><a href='#" + item.get("node_id") + "'>" + item.get("title") + " <span class='search-item-desc'>&#149; " +  self.removeLinks(item.get("content")) + "</span></a></li>";
      });

      html += "</ul>"
      $(this.searchEl).html(html);
    },

    closeSearch: function(){
      $(this.searchEl).html("");
      // hold on, before writing an antiRender function, lets wake up tomorrow and see
      // if this is a good idea. Sounds like it could be hacky.
    },

    removeLinks: function(chunkText){
      output = chunkText.replace(/\[\[(.*?)\]\]/g,"$1");
      return output;
    },

    reloadSearch: function(event){

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
      
      if (this.searchString != event.currentTarget.value) {
        this.searchString = event.currentTarget.value;
        if (this.searchString == '') {
            $(this.searchEl).html(""); // Clear search bar
        } else {
            this.collection.fetch({data: {q: this.searchString}});
        }
      }
      
      
      /*
      //FUTURE CODE, THIS IS BEAUTIFUL
      //present the updated searchQuery and it will be appended to the end
      this.collection.fetch({data: searchQuery});
      whatever.json?data=something
      */
    },

    exitSearch: function(){
    },

  });
  return SearchlistView
});
