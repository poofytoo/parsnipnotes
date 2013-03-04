
exports.pages = function(req, res){
  res.render('norm/' + req.params.page);
}

exports.rawNodeQuery = function(req, res){
  db.nodes.find(req.body, function (err, nodes) {
    if( err || !nodes ) {
      res.json([]);
    } else {
      res.json(nodes);
    }
  });
};

exports.rawNodeAdd = function(req, res) {
  db.nodes.save(req.body, function(err, saved) {
    if( err || !saved ) console.log("Node not saved");
    else console.log("Node saved");
  });
}

// Yeah I should move this...
function parseSearch(searchString) {
  if (!searchString) {
    return false;
  }
  
  var tag = searchString.charAt(0);
  var text = searchString.substring(1);
  
  var ret = {$sort: {nodeLevel: -1}};
  
  switch (tag) {
    case "%":
      ret.timestamp = parseInt(text);
      break;
    case "#":
      ret.header = text;
      break;
    default:
      ret.content = {$regex: text};
  }
  
  return ret;
}

exports.packRequest = function(req, res) {
  var query = parseSearch(req.body.searchString);
  
  if (!query) {
    res.type('application/json');
    res.send('/javascripts/notfound.json');
  } else {
    db.nodes.find(query, function(err, nodes) {
      if (err || !nodes) {
        res.type('application/json');
        res.send('/javascripts/notfound.json');
      } else {
        var resArray = new Array();
        
        nodes.forEach(function (resArray, node) {
          //
        });
      }
    });
  }
}