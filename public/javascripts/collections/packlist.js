define(function(require){
  var Chunk = require("models/chunk");


  // This is the Packlist on the RightBar
  var Packlist = Backbone.Collection.extend({
    model: Chunk,
    url: function(){
      return "/_gatekeeper/packByID.json/"+packName+"?minLevel=6";
    }
    
  });

  return Packlist;
});