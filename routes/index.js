
/*
* GET home page.
*/

var gk = require('../gatekeeper');

exports.index = function(req, res){
  res.render('main', { title: 'Express', packName: req.params.packName });
};

exports.packByID = function(req, res) {
  gk.packNode(req.query.packName, function(obj) {
    res.json(obj);
  });
}
