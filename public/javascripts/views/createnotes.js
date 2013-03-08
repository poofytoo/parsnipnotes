define([
  // These are path alias that we configured in our bootstrap
  'jquery',     // lib/jquery
  'underscore', // lib/underscore
  'backbone'
], function($, _, Backbone, Chunks){ 
  var CreatenotesView = Backbone.View.extend({
    el: $('#note-panel'),

    initialize: function(){
      _.bindAll(this, 'render');
      this.render();
    },

    render: function(){
      var self = this;
      var html = "";

      if (debug) console.log("Rendering Create Notes");

      html += "<form action='' method=''>\
              <input id='new-notes-title' type='text' placeholder='title' />\
              <textarea id='new-notes-body' class='editable'>\
              </textarea>\
              </form>";
      $(this.el).html(html);
    },

  });
  return CreatenotesView
});