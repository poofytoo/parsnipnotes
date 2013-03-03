(function($){

  var Chunk = Backbone.Model.extend({

  });
  
  var ChunkView = Backbone.View.extend({
    el: $('body'),

    initialize: function(){
      _.bindAll(this, 'render');
      this.render();
    },

    render: function(){
      $(this.el).append("<ul> <li>hello world</li> </ul>");
    }
  });
  var chunkView = new ChunkView();
})(jQuery);

