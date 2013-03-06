define(function(require){  

  var Packlist = require("collections/packlist");
  var PacklistView = Backbone.View.extend({
    el: $('#note-list'),

    events: {
    },

    initialize: function(){
      _.bindAll(this, 'render');

      this.collection = new Packlist();
      this.collection.bind("reset", this.render, this);
      this.collection.fetch();
    },

    render: function(){
      if (debug) console.log("Generating Sidebar, selected: " + packName);

      var self = this;
      var html = "<ul>";
      html += "<li class='list-head'>YOUR NOTES<div id='add-item'>+</div></li>";
      html += "<li class='list-topic'>Norman Test</li>";
      _.each(this.collection.models, function(item){
        selected = "";
        if (item.id == packName){
          selected = " list-item-selected";
        }
        html += "<li class='list-item" + selected + "'><a href='#" + item.id + "'>" + item.title + "</a></li>"
      });
      html += "</ul>";

      $(this.el).html(html);
    },
  });
  return PacklistView
});