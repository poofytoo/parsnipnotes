define(["collections/packlist"], function(Packlist){

  var PacklistView = Backbone.View.extend({
    el: $('#note-list'),

    events: {
    },

    initialize: function(){
      _.bindAll(this, 'render');
      
      console.log(Packlist);

      this.collection = new Packlist();
      this.collection.bind("reset", this.render, this);
      this.collection.fetch({data:{id:packName, minLevel:6}});
    },
    addElem: function(e){
        e = "#item-2a";
        // TODO (poofytoo) : add under appropriate list. This list will be updated as typed.
 
        $(e).append("<li id='nope' style='display:none'>nope, this does not go here</li>");
        $("#nope").slideDown("fast");

    },
    render: function(){
      if (debug) console.log("Generating Sidebar, selected: " + packName);

      var self = this;
      var itemID = 0;
      var currentItemID
      var html = "<ul>";
      html += "<li class='list-head'>YOUR NOTES<div id='add-item'>+</div></li>";
      _.each(this.collection.models, function(item){
        selected = "";
        listClass = "list-item";

        // node level 12 is the user. do not display this.
        // node level 9 is the topic header

        // item.id refers to the ID as given by the backend
        // itemID refers to our counting system. wheee.
        // currentItemID refers to the backend ID of the current subtree the node is in

        // TODO (poofytoo) : create divs to seperate each topic such that more can be appended

        if (item.get("nodeLevel") == 12){
          // root node. don't display it for now
        } else if (item.get("nodeLevel") == 9){
          listClass="list-topic";
          if (itemID != 1){
            html += "<li id='list-newitem-"+currentItemID+"' class='list-newitem'>+ new notes</li>";
          }
          currentItemID = item.get("id");
        } else if (item.get("id") == packName){
          selected = " list-item-selected";
        } 

        if (item.get("nodeLevel") != 12){
          html += "<li id='item-" + item.get("id") + "' class='" + listClass + " " + selected + "'><a href='#" + item.get("id") + "'>" + item.get("title") + "</a></li>"
        }

        itemID ++;
      });
      
      html += "<li id='item-' " + currentItemID + " class='list-newitem'>+ new notes</li>";
      html += "</ul>";

      $(this.el).html(html);
    },
  });
  return PacklistView
});