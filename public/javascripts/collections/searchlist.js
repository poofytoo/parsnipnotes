define(function(require){
  var Chunk = require("models/chunk");


  // This is the Packlist on the RightBar
  var Searchlist = Backbone.Collection.extend({
    model: Chunk,
    initialize: function(init){
    },
    url: function(init){
    	console.log(searchQuery);
      return "/_seeker/search.json";
    }
    
  });

  return Searchlist;
});
