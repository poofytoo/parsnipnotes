define(function(require){
  var Chunk = require("models/chunk");


  // This is the Packlist on the RightBar
  var Packlist = Backbone.Collection.extend({
    model: Chunk,
    url: function(){
      return "/_gatekeeper/byID.json?packName="+packName;
    }
    
  });

  return Packlist;
});