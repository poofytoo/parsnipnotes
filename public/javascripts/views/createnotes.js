define([
  // These are path alias that we configured in our bootstrap
  'jquery',     // lib/jquery
  'underscore', // lib/underscore
  'backbone'
], function($, _, Backbone, Chunks){ 
  var CreatenotesView = Backbone.View.extend({
    el: $('#note-panel'),
    events: {
      'keyup input#new-notes-title' : 'updateSidebarTitle'
    },

    initialize: function(options){
      
      this.parseParentID(options.clicked);
      this.packlistView = options.packlistView;
      this.packlistView.addElem(this.parseParentID(options.clicked));

      // TODO (poofytoo) : listview should not be updated with json request, too slow. 
      // only update listview when user is done typing and off focus title

      _.bindAll(this, 'render');
      this.render();
    },

    updateSidebarTitle: function(e){
      n = e.currentTarget.value;
      link = "<a href='#"+n+"'>"+n+"</a>";
      $("#A").html(link);
    },

    parseParentID: function(s){
      n = s.split("-");
      return n[n.length-1];
    },

    render: function(){
      var self = this;
      var html = "";

      if (debug) console.log("Rendering Create Notes");

      // TODO (poofytoo) : saving feature, save periodically so that server doesn't cry

      html += "<form action='' method=''>\
              <input id='new-notes-title' type='text' placeholder='note title' />\
              <textarea id='new-notes-body' class='editable'>\
              things i need to add to this page: a preview button, a save button, style the page, some hats\
              </textarea>\
              </form>";
      $(this.el).html(html);
      $("#new-notes-title").focus();
    },

  });
  return CreatenotesView
});