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
      var itemID = 0;
      var html = "<ul>";
      html += "<li class='list-head'>YOUR NOTES<div id='add-item'>+</div></li>";
      _.each(this.collection.models, function(item){
        selected = "";
        listClass = "list-item";
        // node level 12 is the user. do not display this.
        // node level 9 is the topic header

        if (item.level == 12){
          // root node
        } else if (item.level == 9){
          listClass="list-topic";
          if (itemID != 1){
            html += "<li class='list-newitem'>+ new notes</li>";
          }
        } else if (item.id == packName){
          selected = " list-item-selected";
        } 

        if (item.level != 12){
          html += "<li class='" + listClass + " " + selected + "'><a href='#" + item.id + "'>" + item.title + "</a></li>"
        }

        itemID ++;
      });
      
      html += "<li class='list-newitem'>+ new notes</li>";
      html += "</ul>";

      $(this.el).html(html);
    },
  });
  return PacklistView
});