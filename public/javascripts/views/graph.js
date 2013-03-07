define(function(require){

  var Graph = require("collections/graph");  
  var GraphView = Backbone.View.extend({
    el: $('#content'),

    initialize: function(){
      _.bindAll(this, 'render');
      this.render();
      //this.collection = new Searchlist({searchQuery:"hey"});
      //this.collection.bind("reset", this.render, this);
      //this.collection.fetch();
    },
    render: function(){
      
      $(this.el).html("hey");
    }
  });

  return GraphView;

});