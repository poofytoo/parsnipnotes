
/*
* GET home page.
*/

var gk = require('../gatekeeper');

exports.index = function(req, res){
  res.render('main', { title: 'Express', packName: req.params.packName, userName: req.params.userName, displayMode: 'nb' });
};

exports.graph = function(req, res){
  res.render('main', { title: 'Express', packName: req.params.packName, userName: req.params.userName, displayMode: 'graph' });
};

exports.packByID = function(req, res) {
  if (req.query.minLevel) {
    gk.packNode(req.query.packName, parseInt(req.query.minLevel), function(obj) {
      res.json(obj);
    });
  } else {
    gk.packNode(req.query.packName, 0, function(obj) {
      res.json(obj);
    });
  }
  
}
