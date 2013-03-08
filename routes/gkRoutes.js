var gk = require('../gatekeeper');

exports.packByID = function(req, res) {
  // Note that if nothing is found, no response will ever be sent.
  if (req.query.minLevel) {
    gk.packNode(req.params.id, parseInt(req.query.minLevel), function(obj) {
      res.json(obj);
    });
  } else {
    gk.packNode(req.params.id, 0, function(obj) {
      res.json(obj);
    });
  }
  
}

exports.updateByID = function(req, res) {
  gk.upsertNode(req.params.id, {title: req.body.title, content: req.body.content, nodeLevel: req.body.nodeLevel});
  // Should really have error handling, but y'know...
  res.json({});
}

exports.searchFor = function(req, res) {
    if (req.query.q) {
        gk.makeSearch(req.query.q, function(obj) {
            res.json(obj);
        });
    }
}

