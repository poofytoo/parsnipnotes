var gk = require('../gatekeeper');
var sk = require('../seeker');

exports.packByID = function(req, res) {
  // Note that if nothing is found, no response will ever be sent.
  if (req.query.minLevel) {
    sk.packNode(req.query.id, parseInt(req.query.minLevel), function(obj) {
      res.json(obj);
    });
  } else {
    sk.packNode(req.query.id, 0, function(obj) {
      res.json(obj);
    });
  }
  
}

exports.updateByID = function(req, res) {
  gk.upsertNode(req.params.id, {title: req.body.title, content: req.body.content, nodeLevel: req.body.nodeLevel});
  // Should really have error handling, but y'know...
  res.json({});
}

exports.graphByID_shim = function(req, res) {
  gk.graphNode_shim(req.params.id, function(obj) {
    res.json(obj);
  });
}

exports.searchFor = function(req, res) {
    if (req.query.q) {
        sk.makeSearch(req.query.q, function(obj) {
            res.json(obj);
        });
    }
}

